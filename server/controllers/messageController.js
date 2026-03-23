import Chat from "../models/chatModel.js";
import { model } from "../configs/gemini.js";
import User from "../models/userModel.js";
import imagekit from "../configs/imagekit.js";
import axios from 'axios';



export const textMessage = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.credits < 1) {
      return res.status(400).json({
        success: false,
        message: "Not enough credits",
      });
    }

    const { chatId, prompt } = req.body;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    chat.messages = chat.messages || [];

    // user message
    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    // 🔥 GEMINI CALL
    const result = await model.generateContent(prompt);

    const reply = {
      role: "assistant",
      content: result.response.text(),
      timestamp: Date.now(),
      isImage: false,
    };

    chat.messages.push(reply);

    await chat.save();

    await User.updateOne(
      { _id: userId },
      { $inc: { credits: -1 } }
    );

    res.status(200).json({
      success: true,
      reply,
    });

  } catch (error) {
    console.log("🔥 ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const imageMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.credits < 2) {
      return res.status(400).json({
        success: false,
        message: "Not enough credits",
      });
    }

    const { chatId, prompt ,isPublished} = req.body;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    chat.messages = chat.messages || [];

    // 🧑 user message
    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: true,
      
    });

    // 🔥 IMAGE GENERATION (ImageKit URL trick)
    const encodedPrompt = encodeURIComponent(prompt);

    const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/quickgpt/${Date.now()}.jpg?tr=w-800,h-800`;

    // 🔽 fetch image
    const aiImageResponse = await axios.get(generatedImageUrl, {
      responseType: "arraybuffer",
    });

    // 🔁 convert to base64
    const base64Image = `data:image/jpeg;base64,${Buffer.from(
      aiImageResponse.data,
      "binary"
    ).toString("base64")}`;

    // ☁️ upload to imagekit
    const uploadResponse = await imagekit.upload({
      file: base64Image,
      fileName: `${Date.now()}.jpg`,
      folder: "/quickgpt",
    });

    // 🤖 assistant reply
    const reply = {
      role: "assistant",
      content: uploadResponse.url,
      timestamp: Date.now(),
      isImage: true,
      isPublished,
    };

    chat.messages.push(reply);

    await chat.save();

    await User.updateOne(
      { _id: userId },
      { $inc: { credits: -2 } }
    );

    res.status(200).json({
      success: true,
      reply,
    });

  } catch (error) {
    console.log("🔥 IMAGE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
        