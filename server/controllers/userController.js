import User from '../models/userModel.js';
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import Chat from '../models/chatModel.js'


const generateToken=(id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn:'30d'})
}

export const registerUser=async(req,res)=>{
    const {name,email,password}=req.body
   
    try {
        const existingUser=await User.findOne({email})
        if(existingUser){
            return res.status(400).json({ success:false, message:"User already exists"})
        }
        const user=await User.create({name,email,password})
        const token=generateToken(user._id)
        res.status(201).json({ success:true, message:"User created successfully",  token });
    } catch (error) {
        res.status(500).json({ success:false, message:error.message})
    }
}

export const loginUser=async(req,res)=>{
    const {email,password}=req.body
    try {
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({ success:false, message:"Invalid email or password"})
        }
        const isMatch=await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({ success:false, message:"Invalid email or password"})
        }
        const token=generateToken(user._id)
        res.status(200).json({ success:true, message:"Login successful",  token }); 
    } catch (error) {
        res.status(500).json({ success:false, message:error.message})
    }
}

export const getUser=async(req,res)=>{
    try {
        const user=req.user
        res.status(200).json({ success:true, user })
    } catch (error) {
        res.status(500).json({ success:false, message:error.message})
    }   
}

export const getPublishedImages = async (req, res) => {
  try {
    const publishedImageMessages = await Chat.aggregate([
      { $unwind: "$messages" },

      {
        $match: {
          "messages.isImage": true,
          "messages.isPublished": true,
           "messages.role": "assistant"
        },
      },

      {
        $sort: { "messages.createdAt": -1 }, // 🔥 latest first
      },

      {
        $project: {
          _id: 0,
          imageUrl: "$messages.content",
          username: "$username", // ⚠️ check this field
        },
      },
    ]);

    res.status(200).json({
      success: true,
      images: publishedImageMessages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};