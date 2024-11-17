import express from 'express';
import AudienceSegment from '../models/AudienceSegment.js';
import Customer from '../models/Customer.js';

const router = express.Router();

router.post('/calculate', async (req, res) => {
  const { conditions } = req.body;

  try {
    if (!conditions || !Array.isArray(conditions)) {
      return res.status(400).json({ error: 'Invalid conditions format' });
    }

    let query = {};
    // Check for valid conditions before running the query
    for (let { field, operator, value } of conditions) {  // Use 'let' here instead of 'const'
      if (field === 'totalSpendings' || field === 'visits') {
        value = Number(value);
        if (isNaN(value)) {
          return res.status(400).json({ error: `Invalid value for ${field}` });
        }
      }

      // Add condition to query
      if (operator === '>') query[field] = { $gt: value };
      else if (operator === '<') query[field] = { $lt: value };
      else if (operator === '>=') query[field] = { $gte: value };
      else if (operator === '<=') query[field] = { $lte: value };
      else if (operator === '==') query[field] = value;
      else {
        return res.status(400).json({ error: `Invalid operator: ${operator}` });
      }
    }

    // Now find matching customers
    const customers = await Customer.find(query);

    // Respond with audience size after processing the customers
    return res.status(200).json({ audienceSize: customers.length });

  } catch (error) {
    console.error('Error calculating audience size:', error.message);
    return res.status(500).json({ error: error.message });
  }
});




router.post('/', async (req, res) => {
  let { name, conditions } = req.body;

  try {
    let query = {};
    conditions.forEach(({ field, operator, value }) => {
      if (field === 'totalSpendings' || field === 'visits') {
        value = Number(value);
        if (isNaN(value)) {
          return res.status(400).json({ error: `Invalid value for ${field}` });
        }
      }

      if (operator === '>') query[field] = { $gt: value };
      else if (operator === '<') query[field] = { $lt: value };
      else if (operator === '>=') query[field] = { $gte: value };
      else if (operator === '<=') query[field] = { $lte: value };
      else if (operator === '==') query[field] = value;
      else {
        return res.status(400).json({ error: `Invalid operator: ${operator}` });
      }
    });

    const customers = await Customer.find(query);
    const audienceSize = customers.length;

    const audienceSegment = new AudienceSegment({
      name,
      conditions,
      audienceSize,
      customers: customers.map(customer => customer._id) // Store only customer IDs or full data if needed
    });

    await audienceSegment.save();

    res.status(201).json(audienceSegment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/", async (req, res) => {
  try {
    // Fetch audience segments and populate customer details
    const audienceSegments = await AudienceSegment.find().populate({
      path: "customers", // Reference to the 'customers' array
      select: "name email", // Only fetch the `name` and `email` fields
    });

    // Format response to include customer names
    const formattedSegments = audienceSegments.map((segment) => ({
      ...segment._doc, // Include all fields of the segment
      customerNames: segment.customers.map((customer) => customer.name), // Extract customer names
    }));

    res.status(200).json(formattedSegments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// router.get('/', async (req, res) => {
//   try {
//     const audienceSegments = await AudienceSegment.find().populate('customers');
//     res.status(200).json(audienceSegments);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

export default router;
