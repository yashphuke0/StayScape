const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const dbUrl =
  "mongodb+srv://phukeyash0:cRZhen3obaHb6Va8@cluster0.uguum.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

main()

  .then(() => {
    console.log("Connected to the database");
    return initDB(); // Ensure `initDB` is called after the connection is established
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
  });

async function main() {
  if (!dbUrl) {
    throw new Error(
      "Database URL not provided. Set the ATLASDB_URL environment variable."
    );
  }
  await mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    console.log("Existing data deleted");

    initData.data = initData.data.map((obj) => ({
      ...obj,
      owner: "66cdaa4d81da74346f6bd3e7",
    }));

    await Listing.insertMany(initData.data);
    console.log("Data stored successfully");
  } catch (err) {
    console.error("Error initializing the database:", err);
  }
};
