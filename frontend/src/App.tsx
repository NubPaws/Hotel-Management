import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginScreen } from './Authentication/LoginScreen';
import { ChangePasswordScreen } from './Authentication/PasswordChangeScreen';
import { useState } from "react";
import { HomeScreen } from './HomeScreen/HomeScreen';
import Modal from './UIElements/Modal';
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
import UpdateReservationScreen from './Reservations/UpdateReservationScreen';
import EndOfDayScreen from './BackOffice/EndOfDayScreen';
import { NavigationBar } from './UIElements/NavigationBar';
import BackOfficeScreen from './BackOffice/BackOfficeScreen';
import GuestsManagementScreen from './Guests/GuestsManagementScreen';
import AdministrationScreen from './Administration/AdministrationScreen';
import CreateRoomScreen from './Rooms/CreateRoomScreen';
import { ModalErrorContextProvider } from './Utils/Contexts/ModalErrorContext';
import RoomsScreen from './Rooms/RoomsScreen';
import RoomTypesScreen from './Rooms/RoomTypesScreen';
import ReservationsScreen from './Reservations/ReservationsScreen';
import { PopupContextProvider } from './Utils/Contexts/PopupContext';
import EditReservationScreen from './Reservations/EditReservationScreen';
import BillingScreen from './Reservations/BillingScreen';


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
        { path: "/administration", element: AdministrationScreen },

        { path: "/home", element: HomeScreen },

        { path: "/rooms/types", element: RoomTypesScreen },
        { path: "/rooms/add", element: CreateRoomScreen },
        { path: "/rooms", element: RoomsScreen },

        { path: "/guests-management/", element: GuestsManagementScreen },
        { path: "/create-guest", element: CreateGuestScreen },
        { path: "/update-guest", element: UpdateGuestScreen },
        { path: "/add-reservation", element: AddReservationScreen },
        { path: "/search-guest", element: SearchGuestScreen },

        { path: "/create-task", element: CreateTaskScreen },
        { path: "/update-task", element: UpdateTaskScreen },
        { path: "/remove-task", element: RemoveTaskScreen },
        { path: "/search-task-by-id", element: SearchTaskByIdScreen },
        { path: "/search-task-by-department", element: SearchTaskByDepartmentScreen },

        { path: "/reservations", element: ReservationsScreen },
        { path: "/reservations/create", element: CreateReservationScreen },
        { path: "/reservations/edit", element: EditReservationScreen },
        { path: "/reservations/billing", element: BillingScreen },
        { path: "/cancel-reservation", element: CancelReservationScreen },
        { path: "/add-nights", element: AddNightsScreen },
        { path: "/remove-nights", element: RemoveNightScreen },
        { path: "/add-extra", element: AddExtraScreen },
        { path: "/remove-extra", element: RemoveExtraScreen },
        { path: "/update-extra", element: UpdateExtraScreen },
        { path: "/update-reservation", element: UpdateReservationScreen },

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
