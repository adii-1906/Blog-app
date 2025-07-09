import fs from 'fs'
import imagekit from '../configs/imageKit.js';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import main from '../configs/gemini.js';

// API for Adding Blogs
export const addBlog = async (req,res) => {
    try {
        console.log("BODY:", req.body);
        console.log("FILE:", req.file);
        const { title, subTitle, description, category, isPublished} = JSON.parse(req.body.blog); 
        const imageFile = req.file;

        // Check if all fields are present
        if (!title || !description || !category || !imageFile ) {
            return res.json({success: false, message: "Missing required fields"})
        }

        // Upload Image to ImageKit
        const fileBuffer = fs.readFileSync(imageFile.path);
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/blogs'
        });

        // Optimization through imagekit URL transformation
        const optimizedImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                {quality: 'auto'},
                {format: 'webp'},
                {width: '1280'}
            ]
        });

        const image = optimizedImageUrl;

        await Blog.create({title, subTitle, description, category, image, isPublished});

        res.json({success: true, message: "Blog added successfully"});


    } catch (error) {
        res.json({success: false, message: error.message});
    }
};

// Api to get all blogs list
export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({isPublished: true});
        res.json({success: true, blogs});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
};

// Api to get individual blog
export const getBlogById = async (req, res) => {
    try {
        const { blogId } = req.params;
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.json({success: false, message: "Blog not found"});
        }
        res.json({success: true, blog});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
};

// Api to get delete any blog
export const deleteBlogById = async (req, res) => {
    try {
        const { id } = req.body;
        await Blog.findByIdAndDelete(id);


        // Delete all omments associated with the blog
        await Comment.deleteMany({blog: id});

        res.json({success: true, message: "Blog deleted successfully"});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
};

// Api to publish and unpublish the blog
export const togglePublish = async (req, res) => {
    try {
        const { id } = req.body;
        const blog = await Blog.findById(id);
        blog.isPublished = !blog.isPublished;
        await blog.save();
        res.json({success: true, message: "Blog status updated"});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
};

// Api to add comment
export const addComment = async (req, res) => {
    try {
        const { blog, name, content } = req.body;
        await  Comment.create({blog, name, content});
        res.json({success: true, message: "Comment added for review"});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
};

// Comment data for individual blog
export const getBlogComments = async (req, res) => {
    try {
        const { blogId } = req.body;
        const comments = await Comment.find({blog: blogId, isApproved: true}).sort({createdAt: -1});
        res.json({success: true, comments});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
};

// Generate content
export const generateContent = async (req, res) => {
    try {
        const { prompt } = req.body;
        const content = await main(prompt + ' Generate a blog content for this topic in simple text format');
        res.json({success: true, content});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
};