const express = require('express');
const Student = require('../models/Student');
const User = require('../models/User');
const Post = require('../models/Post');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all students
router.get('/students', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const students = await Student.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Student.countDocuments();

    res.json({
      students,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalStudents: total
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add single student
router.post('/students', adminAuth, async (req, res) => {
  try {
    const { rollNumber, dob, name, department, batch, profileImage } = req.body;

    if (!rollNumber || !dob || !name || !department || !batch) {
      return res.status(400).json({ 
        error: 'Roll number, DOB, name, department, and batch are required' 
      });
    }

    // Check if student already exists
    const existingStudent = await Student.findOne({ 
      rollNumber: rollNumber.toUpperCase() 
    });

    if (existingStudent) {
      return res.status(400).json({ error: 'Student with this roll number already exists' });
    }

    const student = new Student({
      rollNumber: rollNumber.toUpperCase(),
      dob,
      name,
      department,
      batch,
      profileImage: profileImage || ''
    });

    await student.save();

    res.status(201).json(student);
  } catch (error) {
    console.error('Add student error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Bulk upload students
router.post('/students/bulk', adminAuth, async (req, res) => {
  try {
    const { students } = req.body;

    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ error: 'Students array is required' });
    }

    const results = {
      success: [],
      errors: []
    };

    for (let i = 0; i < students.length; i++) {
      const studentData = students[i];
      
      try {
        if (!studentData.rollNumber || !studentData.dob || !studentData.name || 
            !studentData.department || !studentData.batch) {
          results.errors.push({
            index: i,
            data: studentData,
            error: 'Missing required fields'
          });
          continue;
        }

        // Check if student already exists
        const existingStudent = await Student.findOne({ 
          rollNumber: studentData.rollNumber.toUpperCase() 
        });

        if (existingStudent) {
          results.errors.push({
            index: i,
            data: studentData,
            error: 'Student already exists'
          });
          continue;
        }

        const student = new Student({
          rollNumber: studentData.rollNumber.toUpperCase(),
          dob: studentData.dob,
          name: studentData.name,
          department: studentData.department,
          batch: studentData.batch,
          profileImage: studentData.profileImage || ''
        });

        await student.save();
        results.success.push(student);
      } catch (error) {
        results.errors.push({
          index: i,
          data: studentData,
          error: error.message
        });
      }
    }

    res.json({
      message: `${results.success.length} students added successfully`,
      successCount: results.success.length,
      errorCount: results.errors.length,
      results
    });
  } catch (error) {
    console.error('Bulk upload error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update student
router.put('/students/:studentId', adminAuth, async (req, res) => {
  try {
    const { name, department, batch, profileImage, dob } = req.body;
    
    const student = await Student.findById(req.params.studentId);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    if (name) student.name = name;
    if (department) student.department = department;
    if (batch) student.batch = batch;
    if (profileImage !== undefined) student.profileImage = profileImage;
    if (dob) student.dob = dob;

    await student.save();

    res.json(student);
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete student
router.delete('/students/:studentId', adminAuth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Also delete associated user and posts if they exist
    const user = await User.findOne({ studentId: student._id });
    
    if (user) {
      await Post.deleteMany({ userId: user._id });
      await User.findByIdAndDelete(user._id);
    }

    await Student.findByIdAndDelete(req.params.studentId);

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().populate('studentId').sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all posts (admin view)
router.get('/posts', adminAuth, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate({
        path: 'userId',
        populate: {
          path: 'studentId'
        }
      })
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete any post (admin)
router.delete('/posts/:postId', adminAuth, async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get dashboard stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const studentsLoggedIn = await Student.countDocuments({ hasLoggedIn: true });

    res.json({
      totalStudents,
      totalUsers,
      totalPosts,
      studentsLoggedIn,
      studentsNotLoggedIn: totalStudents - studentsLoggedIn
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;



