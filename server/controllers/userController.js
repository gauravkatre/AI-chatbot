import User from '../models/userModel.js'


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
        res.status(500).json({ success:false, message:"Server error"})
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
        res.status(500).json({ success:false, message:"Server error"})
    }
}

export const getUser=async(req,res)=>{
    try {
        const user=req.user
        res.status(200).json({ success:true, user })
    } catch (error) {
        res.status(500).json({ success:false, message:"Server error"})
    }   
}

export const getPublishedImages=async(req,res)=>{
    try {
        publishedImageMessages=await Chat.aggregate([
            {$unwind:'$messages'},
            {$match:{'messages.isImage':true, 'messages.isPublished':true}},
            {$project:{_id:0, imageUrl:'$messages.content', username:'$username'}}
        ])
        res.status(200).json({ success:true, images:publishedImageMessages.reverse() })
    }
    catch (error) {
        res.status(500).json({ success:false, message:"Server error"})
     };
}