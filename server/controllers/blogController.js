import fs from 'fs'
import imagekit from '../configs/imageKit.js';
import Blog from '../models/Blog.js';

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
}

