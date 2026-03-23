import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import { Route, Routes, useLocation } from 'react-router-dom';
import Chatbox from './components/Chatbox';
import Community from './pages/Community';
import Credits from './pages/Credits';
import { assets } from './assets/assets.js';
import './assets/prism.css';
import Loading from './pages/Loading.jsx';
import Login from './pages/Login.jsx';
import { useAppContext } from './context/AppContext.jsx';
import { Toaster } from 'react-hot-toast';

function App() {
  const { user, loadingUser } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // ✅ Better loading condition
  if (loadingUser) return <Loading />;

  return (
    <div className="relative">
      <Toaster />

      {/* ✅ Mobile Menu Button */}
      {!isMenuOpen && user && (
        <img
          src={assets.menu_icon}
          alt="Menu"
          className="absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden z-50 not-dark:invert"
          onClick={() => setIsMenuOpen(true)}
        />
      )}

      {user ? (
        <div className="dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white">
          <div className="flex h-screen w-screen overflow-hidden">
            
            {/* ✅ Sidebar */}
            <Sidebar
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
            />

            {/* ✅ Routes */}
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Chatbox />} />
                <Route path="/community" element={<Community />} />
                <Route path="/credits" element={<Credits />} />
                <Route path="/loading" element={<Loading/>}/>
              </Routes>
            </div>

          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-b from-[#242124] to-[#000000] flex items-center justify-center h-screen w-screen">
          <Login />
        </div>
      )}
    </div>
  );
}

export default App;