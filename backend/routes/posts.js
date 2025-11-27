const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all posts (feed)
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate({
        path: 'userId',
        populate: {
          path: 'studentId',
          select: 'name rollNumber department batch profileImage'
        }
      })
      .populate({
        path: 'comments.userId',
        populate: {
          path: 'studentId',
          select: 'name rollNumber profileImage'
        }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single post
router.get('/:postId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate({
        path: 'userId',
        populate: {
          path: 'studentId',
          select: 'name rollNumber department batch profileImage'
        }
      })
      .populate({
        path: 'comments.userId',
        populate: {
          path: 'studentId',
          select: 'name rollNumber profileImage'
        }
      });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create post
router.post('/', auth, async (req, res) => {
  try {
    const { content, imageUrl } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const post = new Post({
      userId: req.userId,
      content: content.trim(),
      imageUrl: imageUrl || '',
      likes: [],
      comments: []
    });

    await post.save();

    // Populate post before returning
    await post.populate({
      path: 'userId',
      populate: {
        path: 'studentId',
        select: 'name rollNumber department batch profileImage'
      }
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update post
router.put('/:postId', auth, async (req, res) => {
  try {
    const { content, imageUrl } = req.body;
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if user owns the post
    if (post.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (content) post.content = content.trim();
    if (imageUrl !== undefined) post.imageUrl = imageUrl;

    await post.save();

    await post.populate({
      path: 'userId',
      populate: {
        path: 'studentId',
        select: 'name rollNumber department batch profileImage'
      }
    });

    res.json(post);
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete post
router.delete('/:postId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if user owns the post
    if (post.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await Post.findByIdAndDelete(req.params.postId);

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Like/Unlike post
router.post('/:postId/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const likeIndex = post.likes.indexOf(req.userId);

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(req.userId);
    }

    await post.save();

    res.json({ 
      likes: post.likes.length,
      isLiked: likeIndex === -1 
    });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add comment
router.post('/:postId/comment', auth, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.comments.push({
      userId: req.userId,
      content: content.trim()
    });

    await post.save();

    await post.populate({
      path: 'comments.userId',
      populate: {
        path: 'studentId',
        select: 'name rollNumber profileImage'
      }
    });

    res.status(201).json(post.comments[post.comments.length - 1]);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete comment
router.delete('/:postId/comment/:commentId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comment = post.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Check if user owns the comment or the post
    if (comment.userId.toString() !== req.userId.toString() && 
        post.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    comment.deleteOne();
    await post.save();

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get posts by user
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.userId })
      .populate({
        path: 'userId',
        populate: {
          path: 'studentId',
          select: 'name rollNumber department batch profileImage'
        }
      })
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;



