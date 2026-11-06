import mongoose from "mongoose";
import type { Document } from "mongodb";
import { DATABASE_URL } from "../db/mongo";
import Order from "../order/order.model";

const ORDER_COUNTER_ID = "orderId";
const MAX_ORDER_NUMBER = 9999;

type OrderMigrationDocument = Document & { _id: string };
type CounterDocument = Document & { _id: string; seq?: number };

const migrateOrderIds = async (): Promise<void> => {
  await mongoose.connect(DATABASE_URL);
  const database = mongoose.connection.db;
  if (!database) {
    throw new Error("No se pudo abrir la base de datos de órdenes.");
  }

  const orderCollectionName = Order.collection.name;
  const counterCollectionName = mongoose.model("OrderCounter").collection.name;
  const ordersCollectionExists = await database
    .listCollections({ name: orderCollectionName })
    .hasNext();
  const orders = ordersCollectionExists
    ? await database
        .collection<OrderMigrationDocument>(orderCollectionName)
        .find({})
        .sort({ createdAt: 1, _id: 1 })
        .toArray()
    : [];

  if (orders.length > MAX_ORDER_NUMBER) {
    throw new Error(
      `Hay ${orders.length} órdenes; el máximo permitido con 4 cifras es ${MAX_ORDER_NUMBER}. No se modificó la colección.`,
    );
  }

  const counterCollection = database.collection<CounterDocument>(counterCollectionName);
  const existingCounter = await counterCollection.findOne({ _id: ORDER_COUNTER_ID });
  const currentSequence =
    typeof existingCounter?.seq === "number" ? existingCounter.seq : 0;
  const alreadyMigrated = orders.every((order) => /^\d{4}$/.test(String(order._id)));

  if (alreadyMigrated) {
    const largestOrderNumber = orders.reduce(
      (largest, order) => Math.max(largest, Number(order._id)),
      0,
    );
    const sequence = Math.max(currentSequence, largestOrderNumber);
    await counterCollection.updateOne(
      { _id: ORDER_COUNTER_ID },
      { $set: { seq: sequence } },
      { upsert: true },
    );
    console.log(
      `Las ${orders.length} órdenes ya tienen identificadores de 4 cifras. Contador actualizado a ${sequence}.`,
    );
    return;
  }

  const suffix = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  const temporaryCollectionName = `${orderCollectionName}_migration_${suffix}`;
  const backupCollectionName = `${orderCollectionName}_backup_${suffix}`;

  await database.createCollection(temporaryCollectionName);
  if (orders.length > 0) {
    await database.collection<OrderMigrationDocument>(temporaryCollectionName).insertMany(
      orders.map((order, index) => ({
        ...order,
        _id: (index + 1).toString().padStart(4, "0"),
      })),
    );
  }

  const migratedCount = await database
    .collection<OrderMigrationDocument>(temporaryCollectionName)
    .countDocuments();
  if (migratedCount !== orders.length) {
    throw new Error(
      `La copia temporal contiene ${migratedCount} órdenes; se esperaban ${orders.length}. La colección original no se modificó.`,
    );
  }

  let originalRenamed = false;
  let replacementRenamed = false;

  try {
    if (ordersCollectionExists) {
      await database
        .collection<OrderMigrationDocument>(orderCollectionName)
        .rename(backupCollectionName);
      originalRenamed = true;
    }

    await database
      .collection<OrderMigrationDocument>(temporaryCollectionName)
      .rename(orderCollectionName);
    replacementRenamed = true;

    await counterCollection.updateOne(
      { _id: ORDER_COUNTER_ID },
      { $set: { seq: orders.length } },
      { upsert: true },
    );
  } catch (error) {
    try {
      if (replacementRenamed) {
        await database
          .collection<OrderMigrationDocument>(orderCollectionName)
          .rename(temporaryCollectionName);
      }
      if (originalRenamed) {
        await database
          .collection<OrderMigrationDocument>(backupCollectionName)
          .rename(orderCollectionName);
      }
      if (existingCounter) {
        await counterCollection.replaceOne(
          { _id: ORDER_COUNTER_ID },
          existingCounter,
          { upsert: true },
        );
      } else {
        await counterCollection.deleteOne({ _id: ORDER_COUNTER_ID });
      }
    } catch (rollbackError) {
      console.error("No se pudo completar la reversión de la migración:", rollbackError);
    }
    throw error;
  }

  const lastOrderId = orders.length.toString().padStart(4, "0");
  console.log(
    orders.length > 0
      ? `Migración completada: ${orders.length} órdenes numeradas del 0001 al ${lastOrderId}.`
      : "Migración completada: no había órdenes para numerar.",
  );
  if (originalRenamed) {
    console.log(`Respaldo conservado en la colección "${backupCollectionName}".`);
  }
};

migrateOrderIds()
  .catch((error: unknown) => {
    console.error("No se pudo migrar la numeración de órdenes:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
