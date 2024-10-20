const express = require('express');
const {createBlog, getBlogs, getBlog, updateBlog, deleteBlog} = require('../controllers/blogs');

const router = express.Router();

// Create Route
router.post('/create', createBlog);
// Fetch Blogs
router.get('/get', getBlogs);
// Fetch Blog
router.get('/get/:id', getBlog);
// Update Blog
router.patch('/update/:id', updateBlog);
// Delete Blog
router.delete('/delete/:id', deleteBlog);

module.exports = router;
