const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  icon: { type: String },
  title: { type: String, required: true },  // e.g., Groceries, Rent, Utilities
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("Expense", ExpenseSchema);
