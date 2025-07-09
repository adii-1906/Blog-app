import jwt from 'jsonwebtoken';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';

export const adminLogin = async (req, res) => {
    try {
        console.log("BODY:", req.body);
        const { email, password } = req.body;

        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.json({ success: false, message: "Invalid Credentials" });
        }

        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.json({ success: true, token });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Blog list for admin
export const getAllBlogsAdmin = async (req,res) => {
    try {
        const blogs = await Blog.find({}).sort({createdAt: -1});
        res.json({ success: true, blogs });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Admin can see all comments
export const getAllComments = async (req,res) => {
    try {
        const comments = await Comment.find({}).populate("blog").sort({createdAt: -1});
        res.json({ success: true, comments });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Admin can get dashboard data - Complete blogs , comments, drafts, recent blogs
export const getDashboard = async (req,res) => {
    try {
        const recentBlogs = await Blog.find({}).sort({createdAt: -1}).limit(5);
        const blogs = await Blog.countDocuments();
        const comments = await Comment.countDocuments();
        const drafts = await Blog.countDocuments({isPublished: false});

        const dashboardData = {
            blogs, comments, drafts, recentBlogs
        }
        res.json({ success: true, dashboardData });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Admin can delete or aprrove the comment
export const deleteCommentById = async (req,res) => {
    try {
        const { id } = req.body;
        await Comment.findByIdAndDelete(id);
        res.json({ success: true, message: "Comment deleted successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const approveCommentById = async (req,res) => {
    try {
        const { id } = req.body;
        await Comment.findByIdAndUpdate(id, { isApproved: true});
        res.json({ success: true, message: "Comment approved successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};