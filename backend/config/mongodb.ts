import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please add MONGODB_URI in .env file");
}

const client = new MongoClient(uri);

const clientPromise = client.connect();

export default clientPromise;