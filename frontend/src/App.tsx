import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginScreen } from './Authentication/LoginScreen';
import { ChangePasswordScreen } from './Authentication/PasswordChangeScreen';
import { useState } from "react";
import { HomeScreen } from './HomeScreen/HomeScreen';
import { RoomTypeScreen } from './Rooms/RoomTypeScreen';
import { RoomUpdateScreen } from './Rooms/RoomUpdateScreen';
import Modal from './UIElements/Modal';
import RoomInformationScreen from './Rooms/RoomInformationScreen';
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
import { NavigationBar } from './UIElements/NavigationBar';

function App() {
    const [userCredentials, setUserCredentials] = useState<UserCredentials>({
        token: "",
        username: "",
        role: "",
        department: ""
    });
    const [showConnectionErrorMessage, setShowConnectionErrorMessage] = useState(false);

    const userRoutes = [
        { path: "/", element: LoginScreen },
        { path: "/login", element: LoginScreen },
        { path: "/user-creation", element: UserCreationScreen },
        { path: "/change-password", element: ChangePasswordScreen },

        { path: "/home", element: HomeScreen },

        { path: "/rooms-management/type", element: RoomTypeScreen },
        { path: "/rooms-management", element: RoomsManagementScreen },
        { path: "/rooms-management/add", element: RoomsManagementScreen },
        { path: "/rooms-management/remove", element: RoomsManagementScreen },
        { path: "/rooms-management/update", element: RoomUpdateScreen },
        { path: "/rooms-management/information", element: RoomInformationScreen },

        { path: "/create-guest", element: CreateGuestScreen },
        { path: "/update-guest", element: UpdateGuestScreen },
        { path: "/add-reservation", element: AddReservationScreen },
        { path: "/search-guest", element: SearchGuestScreen },

        { path: "/create-task", element: CreateTaskScreen },
        { path: "/update-task", element: UpdateTaskScreen },
        { path: "/remove-task", element: RemoveTaskScreen },
        { path: "/search-task-by-id", element: SearchTaskByIdScreen },
        { path: "/search-task-by-department", element: SearchTaskByDepartmentScreen },

        { path: "/create-reservation", element: CreateReservationScreen },
        { path: "/cancel-reservation", element: CancelReservationScreen },
        { path: "/add-nights", element: AddNightsScreen },
        { path: "/remove-nights", element: RemoveNightScreen },
        { path: "/add-extra", element: AddExtraScreen },
        { path: "/remove-extra", element: RemoveExtraScreen },
        { path: "/update-extra", element: UpdateExtraScreen },
        { path: "/search-reservation", element: SearchReservationScreen },
        { path: "/update-reservation", element: UpdateReservationScreen },

        { path: "/end-of-day", element: EndOfDayScreen },
    ];

    const routeComponents = [];
    for (const route of userRoutes) {
        routeComponents.push(
            <Route path={route.path}
                element={<route.element
                    userCredentials={userCredentials}
                    setUserCredentials={setUserCredentials}
                    setShowConnectionErrorMessage={setShowConnectionErrorMessage} />}>
            </Route>
        )
    }

    return (
        <div className="appContainer">
            <BrowserRouter>
                {userCredentials.username !== "" && (
                    <NavigationBar setUserCredentials={setUserCredentials} />
                )}
                <Routes>
                    {routeComponents}
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
