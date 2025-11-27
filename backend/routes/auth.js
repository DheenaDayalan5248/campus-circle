const express = require('express');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  try {
    const { rollNumber, dob } = req.body;

    if (!rollNumber || !dob) {
      return res.status(400).json({ error: 'Roll number and date of birth are required' });
    }

    // Find student with matching credentials
    const student = await Student.findOne({ 
      rollNumber: rollNumber.toUpperCase(), 
      dob 
    });

    if (!student) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user profile exists, create if first login
    let user = await User.findOne({ studentId: student._id });

    if (!user) {
      // First time login - create user profile
      user = new User({
        studentId: student._id,
        username: rollNumber.toUpperCase(),
        bio: ''
      });
      await user.save();

      // Update student hasLoggedIn flag
      student.hasLoggedIn = true;
      await student.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, studentId: student._id },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        bio: user.bio,
        student: {
          name: student.name,
          rollNumber: student.rollNumber,
          department: student.department,
          batch: student.batch,
          profileImage: student.profileImage
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('studentId');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user._id,
      username: user.username,
      bio: user.bio,
      student: {
        name: user.studentId.name,
        rollNumber: user.studentId.rollNumber,
        department: user.studentId.department,
        batch: user.studentId.batch,
        profileImage: user.studentId.profileImage
      },
      followersCount: user.followers.length,
      followingCount: user.following.length
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Verify token
router.get('/verify', auth, (req, res) => {
  res.json({ valid: true });
});

module.exports = router;



