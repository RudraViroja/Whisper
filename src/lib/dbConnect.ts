
import mongoose from "mongoose";

// Defines the structure of the connection object.
// "?" means isConnected is an optional property.
// It can store a number representing the database connection state.
type ConnectionObject = {
    isConnected?: number
}

// Creates an empty connection object.
// Initially, isConnected is undefined.
// Later, it will store the connection's readyState value.
const connection: ConnectionObject = {}

// Defines an asynchronous function to connect to MongoDB.
// Promise<void> means the function returns a Promise but no meaningful value.
async function dbConnect(): Promise<void>{

    // Checks whether a connection state has already been recorded.
    // If isConnected is truthy, the function skips creating another connection.
    if(connection.isConnected){

        // Prints a message indicating that a connection is already recorded.
        console.log("Already connected to database");

        // Exits the function without executing the remaining code.
        return
    }

    // Attempts to connect to MongoDB.
    // If an error occurs inside this block, execution moves to catch.
    try {

        // Reads the MongoDB connection string from the environment variable
        // MONGODB_URI. If it is missing or empty, uses an empty string.
        // await waits for mongoose.connect() to complete.
        // The returned Mongoose instance is stored in db.
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {})

        // Accesses the first connection and reads its readyState.
        // Stores that numeric state in our connection object.
        // readyState: 0 = disconnected, 1 = connected,
        // 2 = connecting, 3 = disconnecting.
        connection.isConnected = db.connections[0].readyState

        // Prints a success message after the connection succeeds.
        console.log("DB connected successfully")

    } catch (error) {

        // Prints a message if the connection attempt fails.
            console.error(
                "DB connection failed:",
                error instanceof Error ? error.message : "Unknown error"
            )
            throw error
    }
}

// Exports dbConnect as the default export so other files can import and use it.
export default dbConnect;
