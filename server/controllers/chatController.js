
import Chat from "../models/chatModel.js";

export const createChat = async (req,res) =>{
    try {
        const userId=req.user._id
        console.log("USER 👉", req.user);
        const chatData={
            userId,
            messages:[],
            name:'new chat',
            username:req.user.name
        }
        const chat=await Chat.create(chatData)
        res.status(201).json({ success:true, message:"Chat created successfully"})
    }
    catch (error) {
        res.status(500).json({ success:false, message:error.message})
    }
}


export const getChats = async (req,res) =>{
    try {
        const userId=req.user._id
        const chats=await Chat.find({userId}).sort({updatedAt:-1})
        res.status(200).json({ success:true, message:"Chats retrieved successfully", chats })
    }
    catch (error) {
        res.status(500).json({ success:false, message:error.message})
    }
}



export const deleteChats = async (req,res) =>{
    try {
        const userId=req.user._id
        const {chatId}=req.body
        await Chat.findByIdAndDelete(chatId)
        res.status(200).json({ success:true, message:"Chat deleted successfully"})
    }
    catch (error) {
        res.status(500).json({ success:false, message:error.message})
    }
}