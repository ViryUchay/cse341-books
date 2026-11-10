import { MongoClient } from 'mongodb';

let database;
let client;

const connectToDb = async () => {
  const connectionString = process.env.MONGODB_URI;

  if (!connectionString) {
    throw new Error('MONGODB_URI is required.');
  }

  client = new MongoClient(connectionString);
  await client.connect();

  const databaseName =
    process.env.MONGODB_DB_NAME || 'cse341-books-db';

  database = client.db(databaseName);

  console.log(`Connected to MongoDB: ${databaseName}`);

  return database;
};

const getDb = () => {
  if (!database) {
    throw new Error(
      'Database not initialized. Call connectToDb first.'
    );
  }

  return database;
};

export { connectToDb, getDb };
