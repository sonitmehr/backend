import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNo: { type: String, required: true, unique: true },
  totalSpendings: { type: Number, default: 0 },
  visits: { type: Number, default: 0 },
  datesVisited: { type: [Date], default: [] },
});

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;
