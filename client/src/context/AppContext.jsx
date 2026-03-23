import React from "react";
import { useContext,createContext, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";
import { dummyUserData, dummyChats } from "../assets/assets.js";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

const AppContext = createContext();

export const AppContextProvider = ({children}) => {
    const navigate=useNavigate()
    const[user,setUser]=useState(null)
    const[chats,setChats]=useState([])
    const[selectedChat,setSelectedChat]=useState(null)
    const[theme,setTheme]=useState(localStorage.getItem('theme') || 'light')
    const [token,setToken]=useState(localStorage.getItem('token') || null)
    const [loadingUser,setLoadingUser]=useState(true)

    const fetchUser=async()=>{
        try {
            const {data}=await axios.get('/api/users/data', {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            if(data.success){
                setUser(data.user)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }finally{
            setLoadingUser(false)
        }
    }

    const createnewChat = async () => {
    try {
        if (!user) {
            toast.error("Please login to create a new chat");
            return;
        }

        await axios.post(
            '/api/chats/create',
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        await fetchUserChats();

    } catch (error) {
        console.log("ERROR 👉", error);
        toast.error(
            error.response?.data?.message || error.message
        );
    }
};

    const fetchUserChats=async()=>{
        try {
            const {data}=await axios.get('/api/chats/get', {
                headers:{
                    Authorization: `Bearer ${token}`
                }            })
            if(data.success){
                setChats(data.chats)
                if(data.chats.length===0){
                    await createnewChat();
                    return fetchUserChats()
                }
                else{
                    setSelectedChat(data.chats[0])
                }
            }
                else{
                    toast.error(data.message)
                }
        } catch (error) {
            toast.error(error.message)
        }
    }
   

    useEffect(()=>{
        if(token){
            fetchUser()
        }else{
            setLoadingUser(false)
            setUser(null)
        }
    },[token])

    useEffect(()=>{
        if(theme === 'dark'){
            document.documentElement.classList.add('dark')
        }else{
            document.documentElement.classList.remove('dark')
        }
        localStorage.setItem("theme", theme);
    }, [theme]  )

    useEffect(()=>{
        if(user){
            fetchUserChats()

        }else{
            setChats([])
            setSelectedChat(null)
        }
    }, [user])

    useEffect(()=>{
        fetchUser()
        
    },[])

    const value={
        user,
        setUser,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        theme,setTheme,token,setToken,fetchUserChats,loadingUser,createnewChat,axios,fetchUser,navigate
        
    }
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}


export const useAppContext = () => useContext(AppContext)
