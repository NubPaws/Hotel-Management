import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginScreen } from './Users/LoginScreen';
import { ChangePasswordScreen } from './Users/PasswordChangeScreen';
import { useState } from "react";
import { HomeScreen } from './HomeScreen/HomeScreen';
import Modal from './UIElements/Modal';
import CreateGuestScreen from './Guests/CreateGuestScreen';
import UpdateGuestScreen from './Guests/UpdateGuestScreen';
import CreateReservationScreen from './Reservations/CreateReservationScreen';
import CreateUserScreen from './Users/CreateUserScreen.tsx';
import { UserCredentials } from './APIRequests/ServerData';
import EndOfDayScreen from './BackOffice/EndOfDayScreen';
import NavigationBar from './UIElements/NavigationBar';
import BackOfficeScreen from './BackOffice/BackOfficeScreen';
import GuestsScreen from './Guests/GuestsScreen';
import AdministrationScreen from './Users/AdministrationScreen.tsx';
import CreateRoomScreen from './Rooms/CreateRoomScreen';
import { ModalErrorContextProvider } from './Utils/Contexts/ModalErrorContext';
import RoomsScreen from './Rooms/RoomsScreen';
import RoomTypesScreen from './Rooms/RoomTypesScreen';
import ReservationsScreen from './Reservations/ReservationsScreen';
import { PopupContextProvider } from './Utils/Contexts/PopupContext';
import TasksScreen from './Tasks/TasksScreen';
import CreateTaskScreen from './Tasks/CreateTaskScreen';
import EditReservationScreen from './Reservations/EditReservationScreen';
import BillingScreen from './Reservations/BillingScreen';
import EditUserScreen from './Users/EditUserScreen.tsx';


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
        { path: "/guests/update", element: UpdateGuestScreen },

        { path: "/tasks", element: TasksScreen },
        { path: "/tasks/add", element: CreateTaskScreen },

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
                    <NavigationBar
                        userCredentials={userCredentials}
                        setUserCredentials={setUserCredentials}
                        setShowConnectionErrorMessage={setShowConnectionErrorMessage}
                    />
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
