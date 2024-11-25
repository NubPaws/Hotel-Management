import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginScreen } from './Authentication/LoginScreen';
import { ChangePasswordScreen } from './Authentication/PasswordChangeScreen';
import { useState } from "react";
import { HomeScreen } from './HomeScreen/HomeScreen';
import Modal from './UIElements/Modal';
import CreateGuestScreen from './Guests/CreateGuestScreen';
import UpdateGuestScreen from './Guests/UpdateGuestScreen';
import { CreateTaskScreen } from './Tasks/CreateTask';
import { UpdateTaskScreen } from './Tasks/UpdateTask';
import { RemoveTaskScreen } from './Tasks/RemoveTask';
import { SearchTaskByDepartmentScreen, SearchTaskByIdScreen } from './Tasks/SearchTask';
import CreateReservationScreen from './Reservations/CreateReservationScreen';
import CreateUserScreen from './Authentication/CreateUserScreen.tsx';
import { UserCredentials } from './APIRequests/ServerData';
import EndOfDayScreen from './BackOffice/EndOfDayScreen';
import NavigationBar from './UIElements/NavigationBar';
import BackOfficeScreen from './BackOffice/BackOfficeScreen';
import GuestsScreen from './Guests/GuestsScreen';
import AdministrationScreen from './Authentication/AdministrationScreen.tsx';
import CreateRoomScreen from './Rooms/CreateRoomScreen';
import { ModalErrorContextProvider } from './Utils/Contexts/ModalErrorContext';
import RoomsScreen from './Rooms/RoomsScreen';
import RoomTypesScreen from './Rooms/RoomTypesScreen';
import ReservationsScreen from './Reservations/ReservationsScreen';
import { PopupContextProvider } from './Utils/Contexts/PopupContext';
import EditReservationScreen from './Reservations/EditReservationScreen';
import BillingScreen from './Reservations/BillingScreen';
import EditUserScreen from './Authentication/EditUserScreen.tsx';


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
        { path: "/change-password", element: ChangePasswordScreen },
        
        { path: "/administration", element: AdministrationScreen },
        { path: "/administration/create-user", element: CreateUserScreen },
        { path: "/administration/edit-user", element: EditUserScreen },

        { path: "/home", element: HomeScreen },

        { path: "/rooms/types", element: RoomTypesScreen },
        { path: "/rooms/add", element: CreateRoomScreen },
        { path: "/rooms", element: RoomsScreen },

        { path: "/guests/", element: GuestsScreen },
        { path: "/guests/add", element: CreateGuestScreen },
        { path: "/guests/update-guest", element: UpdateGuestScreen },

        { path: "/create-task", element: CreateTaskScreen },
        { path: "/update-task", element: UpdateTaskScreen },
        { path: "/remove-task", element: RemoveTaskScreen },
        { path: "/search-task-by-id", element: SearchTaskByIdScreen },
        { path: "/search-task-by-department", element: SearchTaskByDepartmentScreen },

        { path: "/reservations", element: ReservationsScreen },
        { path: "/reservations/create", element: CreateReservationScreen },
        { path: "/reservations/edit", element: EditReservationScreen },
        { path: "/reservations/billing", element: BillingScreen },

        { path: "/back-office/end-of-day", element: EndOfDayScreen },
        { path: "/back-office", element: BackOfficeScreen}
    ];

    const routeComponents = [];
    for (const route of userRoutes) {
        routeComponents.push(
            <Route path={route.path}
                key={route.path}
                element={<route.element
                    userCredentials={userCredentials}
                    setUserCredentials={setUserCredentials}
                    setShowConnectionErrorMessage={setShowConnectionErrorMessage} />}>
            </Route>
        )
    }

    return (
        <PopupContextProvider>
        <ModalErrorContextProvider>
        <div className="app-container">
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
        </ModalErrorContextProvider>
        </PopupContextProvider>
    );
}

export default App;
