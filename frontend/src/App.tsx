import './App.css'
import { LoginScreen } from './Authentication/LoginScreen'
import { ChangePassword } from './Authentication/PasswordChange'
import { NavigationBar } from './UIElements/NavigationBar'
import { UserCreationScreen } from './Authentication/UserCreationScreen'

function App() {

    return (
        <div className="appContainer">
            <NavigationBar />
            {/* <LoginScreen /> */}
            {/* <ChangePassword /> */}
            <UserCreationScreen />
        </div>
    )
}

export default App
