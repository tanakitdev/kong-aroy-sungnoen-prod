const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: String,
    required: true,
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
  },
  image: {
    type: String,
  },
},
  {
    timestamps: true,
  });

menuSchema.index({ name: 1, shop: 1 });

// module.exports = mongoose.model("Menu", menuSchema);

module.exports = mongoose.models.Menu || mongoose.model("Menu", menuSchema);
