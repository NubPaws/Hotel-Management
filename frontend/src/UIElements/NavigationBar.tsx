import "./NavigationBar.css"

export function NavigationBar() {
    return (
        <>
            <div>
                <button className="navigation-button home-button">Home</button>

                <button className="navigation-button settings-button">Settings</button>
                <button className="navigation-button logout-button">Logout</button>
            </div>
        </>
    )
}
