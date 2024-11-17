
import mongoose from 'mongoose';

// const audienceSegmentSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   conditions: [{ field: String, operator: String, value: String, logic: String }],
//   audienceSize: { type: Number, required: true },
//   customers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }], // Reference to customers
// });

const audienceSegmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  conditions: [
    { field: String, operator: String, value: String, logic: String },
  ],
  audienceSize: { type: Number, required: true },
  customers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Customer" }], // Reference to customers
  customerNames: [{ type: String }], // List of customer names
});
const AudienceSegment = mongoose.model('AudienceSegment', audienceSegmentSchema);

export default AudienceSegment;
