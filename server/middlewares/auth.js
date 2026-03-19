import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

export const protect = async (req,res,next)=>{
    const token=req.headers.authorization
    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        const userId=decoded.id;
        const user=await User.findById(userId)
        if(!user){
            return res.status(401).json({ success:false, message:"Unauthorized"})
        }   
        req.user=user
        next()

    }
    catch (error) {
        res.status(401).json({ success:false, message:"Unauthorized"})
    }
}