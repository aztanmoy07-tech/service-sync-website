const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const auth = require('../middleware/auth'); // Ensure you have this middleware

// @route   GET /api/services
// @desc    Get all services (with case-insensitive Category filtering)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};

    // THE FIX: Case-Insensitive Filtering
    // If category is provided and is NOT "All", filter by it.
    if (category && category !== 'All') {
      // "i" means ignore case (so 'Food' matches 'food')
      // "^...$" means it must match the whole word
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    const services = await Service.find(query).sort({ date: -1 }); // Newest first
    res.json(services);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/services
// @desc    Add a new service
// @access  Private (Requires Login)
router.post('/', auth, async (req, res) => {
  const { name, category, price, description, contact, location, image } = req.body;

  try {
    const newService = new Service({
      user: req.user.id, // Comes from the 'auth' middleware
      name,
      category, // We save it exactly as typed
      price,
      description,
      contact,
      location,
      image
    });

    const service = await newService.save();
    res.json(service);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/services/:id
// @desc    Delete a service
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ msg: 'Service not found' });
    }

    // Check user (Make sure only the owner can delete)
    if (service.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await service.deleteOne();
    res.json({ msg: 'Service removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Service not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;