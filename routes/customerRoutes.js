import express from 'express';
import Customer from '../models/Customer.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
      const customer = new Customer(req.body);
      await customer.save();
      res.status(201).json(customer);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  router.get('/', async (req, res) => {
    try {
      const customers = await Customer.find();
      res.status(200).json(customers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  router.get('/:id', async (req, res) => {
    try {
      const customer = await Customer.findById(req.params.id);
      if (!customer) return res.status(404).json({ error: 'Customer not found' });
      res.status(200).json(customer);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  router.put('/:id', async (req, res) => {
    try {
      const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!customer) return res.status(404).json({ error: 'Customer not found' });
      res.status(200).json(customer);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  router.delete('/:id', async (req, res) => {
    try {
      const customer = await Customer.findByIdAndDelete(req.params.id);
      if (!customer) return res.status(404).json({ error: 'Customer not found' });
      res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

export default router;
