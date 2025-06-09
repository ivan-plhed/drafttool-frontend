import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../api/apiClient';
import drafttool from "../assets/drafttool.png"

function Navbar({loggedIn, setLoggedIn, teamsSelected}) {
    const navigate = useNavigate();
    const [currentUsername, setCurrentUsername] = useState(null);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setCurrentUsername(storedUsername);
            setLoggedIn(true);
        }
    }, [loggedIn]);

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleLogoutClick = () => {
        logout();
        setCurrentUsername(null);
    };

    const handleTeamsSelected = () => {
        teamsSelected(false);
    }

    return (
        <nav className="bg-gray-800 shadow-md min-h-[10vh] flex items-center justify-between">
            <div className="container mx-auto flex items-center px-4 justify-between">
                <div className="flex-1">
                </div>

                <div className="flex h-full">
                    <Link to="/" className="w-fit h-full" onClick={handleTeamsSelected}>
                        <img src={drafttool} className="h-8"  alt="Logo"/>
                    </Link>
                </div>

                <div className="flex-1 flex justify-end">
                    {currentUsername ? (
                        <>
                            <span className="text-white text-lg mr-4 flex items-center">{currentUsername}</span>
                            <button
                                onClick={handleLogoutClick}
                                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded font-semibold hover:from-purple-600 hover:to-pink-600 transition-colors duration-200"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleLoginClick}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded font-semibold hover:from-purple-600 hover:to-pink-600 transition-colors duration-200"
                        >
                            Login
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;


