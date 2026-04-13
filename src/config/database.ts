import dotenv from "dotenv"
dotenv.config();
import mongoose from "mongoose"
import seedData from "../seed"
import Node from "../models/Node"

const connectDB = async (): Promise<void> => {
    const maxRetries = 10;
    const retryDelay = 3000;

    const mongoUri = process.env.MONGO_URI;
    if(!mongoUri) {
        throw new Error("MongoUri is not defined in evironment variables");
    }

    for (let i = 0 ; i< maxRetries ; i++) {
        try {
            await mongoose.connect(mongoUri, {
                serverSelectionTimeoutMS: 5000,
            });
            console.log("MongoDB connection established");

            const count = await Node.countDocuments();
            if (count == 0) {
                console.log("Database is empty,seeding..");
                await seedData();
            } else {
                console.log("Database already has data, skipping seed");
            }

            return;
        } catch (err) {
            console.log("Connection attempt failed. Retrying..");

        if (i == maxRetries - 1) {
            console.error("All connection attempts failed:",err);
            process.exit(1);
        }

        await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }
};

export default connectDB;