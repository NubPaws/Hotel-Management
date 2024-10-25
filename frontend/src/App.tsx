import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginScreen } from './Authentication/LoginScreen'
import { ChangePasswordScreen } from './Authentication/PasswordChangeScreen'
import { UserCreationScreen } from './Authentication/UserCreationScreen'
import { useState } from "react";
import { HomeScreen } from './HomeScreen/HomeScreen';
import { RoomTypeScreen } from './Rooms/RoomTypeScreen';

function App() {
    const [userCredentials, setUserCredentials] = useState<UserCredentials>({
        token: "",
        username: "",
        role: "",
        department: ""
    });


    return (
        <div className="appContainer">
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<LoginScreen userCredentials={userCredentials} setUserCredentials={setUserCredentials} />}></Route>
                    <Route path='/login' element={<LoginScreen userCredentials={userCredentials} setUserCredentials={setUserCredentials} />}></Route>
                    <Route path='/user-creation' element={<UserCreationScreen userCredentials={userCredentials} setUserCredentials={setUserCredentials} />}></Route>
                    <Route path='/change-password' element={<ChangePasswordScreen userCredentials={userCredentials} setUserCredentials={setUserCredentials} />}></Route>
                    <Route path='/home' element={<HomeScreen userCredentials={userCredentials} setUserCredentials={setUserCredentials} />}></Route>
                    <Route path='/room-type' element={<RoomTypeScreen userCredentials={userCredentials} />}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App
