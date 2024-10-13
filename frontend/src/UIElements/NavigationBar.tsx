import "./NavigationBar.css"

export function NavigationBar() {
    return (
        <>
            <div className="navigationContainer">
                <button className="navigationButton homeButton">Home</button>

                <button className="navigationButton settingsButton">Settings</button>
                <button className="navigationButton logoutButton">Logout</button>
            </div>
        </>
    )
}
