const mongoose = require("mongoose");
const initdata = require("./data.js"); // should export { data: [...] }
const Listing = require("../models/listing.js"); 

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main()
  .then(() => console.log("✅ Connected to DB"))
  .catch(err => console.log("❌ Connection error:", err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});
     initdata.data=initdata.data.map((obj)=>({...obj,owner:'68dd955c9b79c634969a596c'}));
    await Listing.insertMany(initdata.data);
    console.log(" Data initialized successfully");
  } catch (err) {
    console.error(" Error initializing data:", err);
  } finally {
    mongoose.connection.close(); // close connection after seeding
  }
};

initDB();
