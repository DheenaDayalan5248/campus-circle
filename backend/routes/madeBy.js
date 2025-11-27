const express = require('express');
const MadeBy = require('../models/MadeBy');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get developer info
router.get('/', auth, async (req, res) => {
  try {
    // Get the first (and should be only) document
    const madeBy = await MadeBy.findOne();

    if (!madeBy) {
      return res.status(404).json({ error: 'Developer information not found' });
    }

    res.json(madeBy);
  } catch (error) {
    console.error('Get made by error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;



