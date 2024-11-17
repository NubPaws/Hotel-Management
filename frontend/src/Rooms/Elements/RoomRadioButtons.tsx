function RoomStateRadioButton() {
    return (
        <>
            <div className="roomStateContainer" >
                <p>Select room state:</p>
                <input type="radio" id="clean" name="state" value="Clean"></input>
                <label htmlFor="clean">Clean</label>

                <br />
                <input type="radio" id="inspected" name="state" value="Inspected"></input>
                <label htmlFor="inspected">Inspected</label>

                <br />
                <input type="radio" id="dirty" name="state" value="Dirty"></input>
                <label htmlFor="dirty">Dirty</label>

                <br />
                <input type="radio" id="outOfOrder" name="state" value="OutOfOrder"></input>
                <label htmlFor="outOfOrder">Out Of Order</label>

                <div id="roomStateErrorMessage"></div>
            </div>
        </>
    )
}

function RoomOccupationRadioButton() {
    return (
        <>
            <div className="roomOccupationContainer" >
                <p>Select room occupation state:</p>
                <input type="radio" id="occupied" name="occupation" value="true"></input>
                <label htmlFor="occupied">Occupied</label>

                <br />
                <input type="radio" id="free" name="occupation" value="false"></input>
                <label htmlFor="free">Free</label>

                <div id="roomOccupationErrorMessage"></div>
            </div>
        </>
    )
}

export { RoomStateRadioButton, RoomOccupationRadioButton }