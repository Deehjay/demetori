const Event = require("./models/Event");
const Members = require("./models/Members");
require("dotenv").config();

// const defaultGear = { original: "", shortened: "", lastUpdated: "" };
// const defaultWishlist = [];

const mongoose = require("mongoose");
const mongoURI = process.env.MONGO_URI;

mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Members.updateMany(
//   { gear: { $exists: true } }, // Only update if "gear" field doesn't exist
//   {
//     $set: {
//       gear: defaultGear,
//       wishlist: defaultWishlist,
//     },
//   }
// )
//   .then((result) => {
//     console.log(`${result}`);
//   })
//   .catch((error) => console.error("Error updating documents:", error));
