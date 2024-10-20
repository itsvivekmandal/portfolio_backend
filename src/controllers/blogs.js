// Create Blog
const createBlog = async(request, response) => {
  response.json({"message": "Blog created!"});
}

// Read Blogs
const getBlogs = async(request, response) => {
  response.json({"message": "Blogs fetched!"});
}

// Read Blogs by id
const getBlog = async(request, response) => {
  response.json({"message": "Blog fetched by id!"});
}

// Update Blog
const updateBlog = async(request, response) => {
  response.json({"message": "Blog updated!"});
}

// Delete Blog
const deleteBlog = async(request, response) => {
  response.json({"message": "Blog deleted!"});
}

module.exports = {createBlog, getBlogs, getBlog, updateBlog, deleteBlog};

