import "./LoginScreen.css"

export function LoginScreen() {
    return (
      <>
        <div className="label">
          <div className="text-wrapper">Login</div>
        </div>
        <form>
          <div className="fieldsContainer">
            <label><b>Username</b></label>
            <input type="text" placeholder="Enter Username" name="username" className="field" required />

            <label><b>Password</b></label>
            <input type="password" placeholder="Enter Password" className="field" name="password" required />

            <button type="submit">Login</button>
          </div>
        </form>
      </>
    )
}