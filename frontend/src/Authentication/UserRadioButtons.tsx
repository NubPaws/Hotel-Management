function UserDepartmentRadioButton() {
    return (
        <div className="userDepartmentContainer" >
        <p>Select user department:</p>
        <input type="radio" id="General" name="department" value="General"></input>
        <label htmlFor="General">General</label>
        <br />

        <input type="radio" id="FrontDesk" name="department" value="FrontDesk"></input>
        <label htmlFor="FrontDesk">Front Desk</label>
        <br />

        <input type="radio" id="Housekeeping" name="department" value="HouseKeeping"></input>
        <label htmlFor="Housekeeping">Housekeeping</label>
        <br />

        <input type="radio" id="Maintenance" name="department" value="Maintenance"></input>
        <label htmlFor="Maintenance">Maintenance</label>
        <br />

        <input type="radio" id="FoodAndBeverage" name="department" value="FoodAndBeverage"></input>
        <label htmlFor="FoodAndBeverage">Food And Beverage</label>
        <br />

        <input type="radio" id="Security" name="department" value="Security"></input>
        <label htmlFor="Security">Security</label>
        <br />

        <input type="radio" id="Concierge" name="department" value="Concierge"></input>
        <label htmlFor="Concierge">Concierge</label>
        <br />

        <div id="userDepartmentErrorMessage"></div>
    </div>
    )
}

export function getUserDepartment() {
    const userDepartment: NodeListOf<HTMLInputElement> = document.querySelectorAll('input[name="department"]');
    let userDepartmentIndex = -1;

    for (let i = 0; i < userDepartment.length; i++) {
        if (userDepartment[i].checked) {
            userDepartmentIndex = i;
        }
    }

    if (userDepartmentIndex  === -1) {
        return null;
    }

    return userDepartment[userDepartmentIndex];
}

export { UserDepartmentRadioButton }