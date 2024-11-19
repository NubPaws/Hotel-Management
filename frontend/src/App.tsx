import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginScreen } from './Authentication/LoginScreen';
import { ChangePasswordScreen } from './Authentication/PasswordChangeScreen';
import { useState } from "react";
import { HomeScreen } from './HomeScreen/HomeScreen';
import { RoomTypeScreen } from './Rooms/RoomTypeScreen';
import { RoomUpdateScreen } from './Rooms/RoomUpdateScreen';
import Modal from './UIElements/Modal';
import QueryRoomScreen from './Rooms/QueryRoomScreen';
import { CreateGuestScreen } from './Guests/CreateGuestsScreen';
import { UpdateGuestScreen } from './Guests/UpdateGuestsScreen';
import { AddReservationScreen } from './Guests/AddReservationScreen';
import { SearchGuestScreen } from './Guests/SearchGuestScreen';
import { CreateTaskScreen } from './Tasks/CreateTask';
import { UpdateTaskScreen } from './Tasks/UpdateTask';
import { RemoveTaskScreen } from './Tasks/RemoveTask';
import { SearchTaskByDepartmentScreen, SearchTaskByIdScreen } from './Tasks/SearchTask';
import CreateReservationScreen from './Reservations/CreateReservationScreen';
import CancelReservationScreen from './Reservations/CancelReservationScreen';
import AddNightsScreen from './Reservations/AddNightsScreen';
import RemoveNightScreen from './Reservations/RemoveNightsScreen';
import AddExtraScreen from './Reservations/AddExtraScreen';
import RemoveExtraScreen from './Reservations/RemoveExtraScreen';
import UserCreationScreen from './Authentication/UserCreationScreen';
import { UserCredentials } from './APIRequests/ServerData';
import UpdateExtraScreen from './Extras/UpdateExtraScreen';
import SearchReservationScreen from './Reservations/SearchReservationScreen';
import UpdateReservationScreen from './Reservations/UpdateReservationScreen';
import EndOfDayScreen from './BackOffice/EndOfDayScreen';
import RoomsManagementScreen from './Rooms/RoomsManagementScreen';
import CreateRoomScreen from './Rooms/CreateRoomScreen';
import RemoveRoomScreen from './Rooms/RemoveRoomScreen';

function App() {
    const [userCredentials, setUserCredentials] = useState<UserCredentials>({
        token: "",
        username: "",
        role: "",
        department: ""
    });
    const [showConnectionErrorMessage, setShowConnectionErrorMessage] = useState(false);


    return (
        <div className="app-container">
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
                    <Route path='/home'
                        element={<HomeScreen
                            userCredentials={userCredentials}
                            setUserCredentials={setUserCredentials}
                            setShowConnectionErrorMessage={setShowConnectionErrorMessage}/>} />
                    
                    <Route path='/rooms-management/type'
                        element={<RoomTypeScreen
                            userCredentials={userCredentials}
                            setShowConnectionErrorMessage={setShowConnectionErrorMessage} />}>
                    </Route>
                    <Route path="/rooms-management"
                        element={
                            <RoomsManagementScreen
                                userCredentials={userCredentials}
                                setUserCredentials={setUserCredentials}
                                setShowConnectionErrorMessage={setShowConnectionErrorMessage}
                            />
                        }
                    />
                    <Route path="/rooms-management/add"
                        element={
                            <CreateRoomScreen
                                userCredentials={userCredentials}
                                setUserCredentials={setUserCredentials}
                                setShowConnectionErrorMessage={setShowConnectionErrorMessage}
                            />
                        }
                    />
                    <Route path="/rooms-management/remove"
                        element={
                            <RemoveRoomScreen
                                userCredentials={userCredentials}
                                setUserCredentials={setUserCredentials}
                                setShowConnectionErrorMessage={setShowConnectionErrorMessage}
                            />
                        }
                    />
                    <Route path='/rooms-management/update'
                        element={<RoomUpdateScreen
                            userCredentials={userCredentials}
                            setShowConnectionErrorMessage={setShowConnectionErrorMessage} />}>
                    </Route>
                    <Route path='/rooms-management/information'
                        element={<QueryRoomScreen
                            userCredentials={userCredentials}
                            setShowConnectionErrorMessage={setShowConnectionErrorMessage} />}>
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
                    <Route path='/remove-nights'
                        element={<RemoveNightScreen
                            userCredentials={userCredentials}
                            setShowConnectionErrorMessage={setShowConnectionErrorMessage}
                        />}>
                    </Route>
                    <Route path='/add-extra'
                        element={<AddExtraScreen
                            userCredentials={userCredentials}
                            setShowConnectionErrorMessage={setShowConnectionErrorMessage}
                        />}>
                    </Route>
                    <Route path='/remove-extra'
                        element={<RemoveExtraScreen
                            userCredentials={userCredentials}
                            setShowConnectionErrorMessage={setShowConnectionErrorMessage}
                        />}>
                    </Route>
                    <Route path='/update-extra'
                        element={<UpdateExtraScreen
                            userCredentials={userCredentials}
                            setShowConnectionErrorMessage={setShowConnectionErrorMessage}
                        />}>
                    </Route>
                    <Route path='/search-reservation'
                        element={<SearchReservationScreen
                            userCredentials={userCredentials}
                            setShowConnectionErrorMessage={setShowConnectionErrorMessage}
                        />}>
                    </Route>
                    <Route path='/update-reservation'
                        element={<UpdateReservationScreen
                            userCredentials={userCredentials}
                            setShowConnectionErrorMessage={setShowConnectionErrorMessage}
                        />}>
                    </Route>
                    <Route path='/end-of-day'
                        element={<EndOfDayScreen
                            userCredentials={userCredentials}
                            setShowConnectionErrorMessage={setShowConnectionErrorMessage}
                        />}>
                    </Route>
                </Routes>
            </BrowserRouter>
            {showConnectionErrorMessage && (
                <Modal title="Failed to connect to server" onClose={() => { setShowConnectionErrorMessage(false) }}>
                    Unfortunately, we failed to reach our server.
                </Modal>
            )}
        </div>
    )
}

export default App;
