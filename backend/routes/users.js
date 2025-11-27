const express = require('express');
const User = require('../models/User');
const Student = require('../models/Student');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Search users
router.get('/search', auth, async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim().length === 0) {
      return res.json([]);
    }

    const searchRegex = new RegExp(query, 'i');

    // Search in Student collection
    const students = await Student.find({
      $or: [
        { name: searchRegex },
        { rollNumber: searchRegex }
      ]
    }).limit(20);

    const studentIds = students.map(s => s._id);

    const users = await User.find({ studentId: { $in: studentIds } })
      .populate('studentId');

    res.json(users.map(user => ({
      id: user._id,
      username: user.username,
      bio: user.bio,
      student: {
        name: user.studentId.name,
        rollNumber: user.studentId.rollNumber,
        department: user.studentId.department,
        batch: user.studentId.batch,
        profileImage: user.studentId.profileImage
      }
    })));
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user profile
router.get('/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('studentId');

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
      followingCount: user.following.length,
      isFollowing: user.followers.includes(req.userId)
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { bio, profileImage } = req.body;
    
    const user = await User.findById(req.userId);
    const student = await Student.findById(req.studentId);

    if (bio !== undefined) {
      user.bio = bio.trim();
    }

    if (profileImage !== undefined) {
      student.profileImage = profileImage;
    }

    await user.save();
    await student.save();

    await user.populate('studentId');

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
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Follow/Unfollow user
router.post('/:userId/follow', auth, async (req, res) => {
  try {
    if (req.params.userId === req.userId.toString()) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    const userToFollow = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.userId);

    if (!userToFollow) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isFollowing = currentUser.following.includes(userToFollow._id);

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(
        id => id.toString() !== userToFollow._id.toString()
      );
      userToFollow.followers = userToFollow.followers.filter(
        id => id.toString() !== currentUser._id.toString()
      );
    } else {
      // Follow
      currentUser.following.push(userToFollow._id);
      userToFollow.followers.push(currentUser._id);
    }

    await currentUser.save();
    await userToFollow.save();

    res.json({ 
      isFollowing: !isFollowing,
      followersCount: userToFollow.followers.length 
    });
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;



