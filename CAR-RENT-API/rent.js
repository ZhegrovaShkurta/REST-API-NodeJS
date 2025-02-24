const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";
const dbName = "carRental";
let mongodb;

// Function to connect to MongoDB
async function connectToMongoDB() {
  try {
    const client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    console.log("Connected successfully to MongoDB");
    mongodb = client.db(dbName);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Call the connection function
connectToMongoDB();

// Export the database connection
module.exports = { getDb: () => mongodb };
