import Chat from "../models/chatModel.js";
import openai from "../configs/openai.js";
import User from "../models/userModel.js";
import imagekit from "../configs/imagekit.js";
import axios from 'axios';

export const textMessage = async (req,res) =>{
    try {
        const userId=req.user.userId
        if(req.user.credits<1){
            return res.status(400).json({ success:false, message:"Not enough credits"})
        }
        const {chatId,prompt}=req.body
        const chat=await Chat.findById(chatId)

        Chat.messages.push({role:'user', content:prompt, timestamp:Date.now(), isImage:false})
        const {choices} = await openai.chat.completions.create(
        model="gemini-3-flash-preview",
        messages=[
        
        {
            "role": "user",
            "content": prompt
        }
    ]
)

 const reply ={ ...choices[0].message,timestamp:Date.now(), isImage:false}
 Chat.messages.push(reply)
 res.status(200).json({ success:true, message:"Message sent successfully", reply })
    await chat.save()
    await User.updateOne({_id:userId}, {$inc:{credits: -1}})
    
    }
    catch (error) {
        res.status(500).json({ success:false, message:"Server error"})
    };
}


export const imageMessageController = async (req,res) =>{
    try {
        const userId=req.user.userId
        if(req.user.credits<2){
            return res.status(400).json({ success:false, message:"Not enough credits"})
        }
        const {chatId,prompt,isPublished}=req.body
        const chat=await Chat.findOne({_id:chatId, userId})
        chat.messages.push({role:'user', content:prompt, timestamp:Date.now(), isImage:false})

        const encodedPrompt=encodeURIComponent(prompt)
        const generatedImageUrl=`${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/quickgpt/${Date.now()}.jpg?tr=w-800,h-800`;
        const aiImageResponse=await axios.get(generatedImageUrl, {responseType:'arraybuffer'});
        const base64Image=`data:image/png;base64,${Buffer.from(aiImageResponse.data, 'binary').toString('base64')}`;
        const uploadResponse=await imagekit.upload({
            file:base64Image,
            fileName:`${Date.now()}.jpg`,
            folder:'/quickgpt'
        })
         const reply ={ role:'assistant', content:uploadResponse.url, timestamp:Date.now(), isImage:true, isPublished:isPublished

         }
         res.status(200).json({ success:true, message:"Image generated successfully", reply })
         chat.messages.push(reply)
            await chat.save()
             await User.updateOne({_id:userId}, {$inc:{credits: -2}})

    }
    catch (error) {
        res.status(500).json({ success:false, message:"Server error"})
    };
}

        