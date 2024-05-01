import './App.css'
import {LoginScreen} from './Authentication/LoginScreen'
import { ChangePassword } from './Authentication/PasswordChange'
import { NavigationBar } from './UIElements/NavigationBar'

function App() {

  return (
    <>
      <NavigationBar />
      {/* <LoginScreen /> */}
      <ChangePassword />
    </>
  )
}

export default App
