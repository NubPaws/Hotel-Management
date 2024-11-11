import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginScreen } from './Authentication/LoginScreen'
import { ChangePasswordScreen } from './Authentication/PasswordChangeScreen'
import { UserCreationScreen } from './Authentication/UserCreationScreen'
import { useState } from "react";
import { HomeScreen } from './HomeScreen/HomeScreen';
import { RoomTypeScreen } from './Rooms/RoomTypeScreen';
import { RoomScreen } from './Rooms/RoomScreen';
import { RoomUpdateScreen } from './Rooms/RoomUpdateScreen';
import { Modal } from './UIElements/Modal';
import { RoomInformationScreen } from './Rooms/RoomInformationScreen';
import { CreateGuestScreen } from './Guests/CreateGuestsScreen';
import { UpdateGuestScreen } from './Guests/UpdateGuestsScreen';
import { AddReservationScreen } from './Guests/AddReservationScreen';
import { SearchGuestScreen } from './Guests/SearchGuestScreen';
import { CreateTaskScreen } from './Tasks/CreateTask';
import { UpdateTaskScreen } from './Tasks/UpdateTask';
import { RemoveTaskScreen } from './Tasks/RemoveTask';
import { SearchTaskByDepartmentScreen, SearchTaskByIdScreen } from './Tasks/SearchTask';
import { CreateReservationScreen } from './Reservations/CreateReservation';
import { CancelReservationScreen } from './Reservations/CancelReservation';
import { AddNightsScreen } from './Reservations/AddNights';

function App() {
    const [userCredentials, setUserCredentials] = useState<UserCredentials>({
        token: "",
        username: "",
        role: "",
        department: ""
    });
    const [showConnectionErrorMessage, setShowConnectionErrorMessage] = useState(false);


    return (
        <div className="appContainer">
            <BrowserRouter>
                <Routes>
                    <Route path='/'
                        element={<LoginScreen
                            userCredentials={userCredentials}
                            setUserCredentials={setUserCredentials}
                            setShowConnectionErrorMessage={setShowConnectionErrorMessage} />}>
                    </Route>
                    <Route path='/login'
                        element={<LoginScreen
                            userCredentials={userCredentials}
                            setUserCredentials={setUserCredentials}
                            setShowConnectionErrorMessage={setShowConnectionErrorMessage} />}>
                    </Route>
                    <Route path='/user-creation'
                        element={<UserCreationScreen
                            userCredentials={userCredentials}
                            setUserCredentials={setUserCredentials}
                            setShowConnectionErrorMessage={setShowConnectionErrorMessage} />}>
                    </Route>
                    <Route path='/change-password'
                        element={<ChangePasswordScreen
                            userCredentials={userCredentials}
                            setUserCredentials={setUserCredentials}
                            setShowConnectionErrorMessage={setShowConnectionErrorMessage} />}>
                    </Route>
                    <Route path='/home' element={<HomeScreen userCredentials={userCredentials} setUserCredentials={setUserCredentials} />}></Route>
                    <Route path='/room-type'
                        element={<RoomTypeScreen
                            userCredentials={userCredentials}
                            setShowConnectionErrorMessage={setShowConnectionErrorMessage} />}>
                    </Route>
                    <Route path='/rooms'
                        element={<RoomScreen
                            userCredentials={userCredentials}
                            setShowConnectionErrorMessage={setShowConnectionErrorMessage} />}>

                    </Route>
                    <Route path='/room-update'
                        element={<RoomUpdateScreen
                            userCredentials={userCredentials}
                            setShowConnectionErrorMessage={setShowConnectionErrorMessage} />}>
                    </Route>
                    <Route path='/room-information'
                        element={<RoomInformationScreen
                            userCredentials={userCredentials} />}>
                    </Route>
                    <Route path='/create-guest'
                        element={<CreateGuestScreen
                            userCredentials={userCredentials}
                            setShowConnectionErrorMessage={setShowConnectionErrorMessage}
                        />}>
                    </Route>
                    <Route path='/update-guest'
                        element={<UpdateGuestScreen
                            userCredentials={userCredentials}
                            setShowConnectionErrorMessage={setShowConnectionErrorMessage}
                        />}>
                    </Route>
                    <Route path='/add-reservation'
                        element={<AddReservationScreen
                            userCredentials={userCredentials}
                            setShowConnectionErrorMessage={setShowConnectionErrorMessage}
                        />}>
                    </Route>
                    <Route path='/search-guest'
                        element={<SearchGuestScreen
                            userCredentials={userCredentials}
                            setShowConnectionErrorMessage={setShowConnectionErrorMessage}
                        />}>
                    </Route>
                    <Route path='/create-task'
                        element={<CreateTaskScreen
                            userCredentials={userCredentials}
                            setShowConnectionErrorMessage={setShowConnectionErrorMessage}
                        />}>
                    </Route>
                    <Route path='/update-task'
                        element={<UpdateTaskScreen
                            userCredentials={userCredentials}
                            setShowConnectionErrorMessage={setShowConnectionErrorMessage}
                        />}>
                    </Route>
                    <Route path='/remove-task'
                        element={<RemoveTaskScreen
                            userCredentials={userCredentials}
                            setShowConnectionErrorMessage={setShowConnectionErrorMessage}
                        />}>
                    </Route>
                    <Route path='/search-task-by-id'
                        element={<SearchTaskByIdScreen
                            userCredentials={userCredentials}
                            setShowConnectionErrorMessage={setShowConnectionErrorMessage}
                        />}>
                    </Route>
                    <Route path='/search-task-by-department'
                        element={<SearchTaskByDepartmentScreen
                            userCredentials={userCredentials}
                            setShowConnectionErrorMessage={setShowConnectionErrorMessage}
                        />}>
                    </Route>
                    <Route path='/create-reservation'
                        element={<CreateReservationScreen
                            userCredentials={userCredentials}
                            setShowConnectionErrorMessage={setShowConnectionErrorMessage}
                        />}>
                    </Route>
                    <Route path='/cancel-reservation'
                        element={<CancelReservationScreen
                            userCredentials={userCredentials}
                            setShowConnectionErrorMessage={setShowConnectionErrorMessage}
                        />}>
                    </Route>
                    <Route path='/add-nights'
                        element={<AddNightsScreen
                            userCredentials={userCredentials}
                            setShowConnectionErrorMessage={setShowConnectionErrorMessage}
                        />}>
                    </Route>
                </Routes>
            </BrowserRouter>
            <Modal title="Failed to connect to server" show={showConnectionErrorMessage} onClose={() => { setShowConnectionErrorMessage(false) }}>
                <h5>Unfortunately, we failed to reach our server.</h5>
            </Modal>
        </div>
    )
}

export default App
