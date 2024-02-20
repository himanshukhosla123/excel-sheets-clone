const {MongoClient, ServerApiVersion} = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@fileclustor.l3prhse.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
async function connectToCluster() {
  let mongoClient;
  console.log(uri);
  try {
    mongoClient = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: false,
        deprecationErrors: true,
      },
    });
    console.log("Connecting to MongoDB Atlas cluster...");
    await mongoClient.connect();
    console.log("Successfully connected to MongoDB Atlas!");

    return mongoClient;
  } catch (error) {
    console.error("Connection to MongoDB Atlas failed!", error);
    process.exit();
  }
}

async function pingTest() {
  let client;
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client = await connectToCluster();
    // Send a ping to confirm a successful connection
    await client.db("hk").command({ping: 1});
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

module.exports = {
  connectToCluster,
  pingTest,
};
