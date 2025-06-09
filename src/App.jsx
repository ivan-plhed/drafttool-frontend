import './App.css'
import LoginPage from "@/component/LoginPage.jsx";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import MainPage from "@/component/MainPage.jsx";
import RegisterPage from "@/component/RegisterPage.jsx";
import Navbar from "@/component/Navbar.jsx";
import {useState} from "react";
import RegisterNewTeam from "@/component/RegisterNewTeam.jsx";

function App() {

    const [loggedIn, setLoggedIn] = useState(false);
    const [resetTeams, setResetTeams] = useState(function (){});

    return (
        <BrowserRouter>
            <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} teamsSelected={resetTeams} />
            <Routes>
                <Route path="/" element={<MainPage loggedIn={loggedIn} resetTeams={setResetTeams} />}/>
                <Route path="/login" element={<LoginPage setLoggedIn={setLoggedIn} />}/>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/new-team" element={<RegisterNewTeam/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App;
