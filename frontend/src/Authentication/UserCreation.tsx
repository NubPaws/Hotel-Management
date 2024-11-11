import { validatePassword, validateUsername, validateRadioButton } from "./Validation";

async function createUser(event : any,
    token: string,
    setShowErrorMessage: React.Dispatch<React.SetStateAction<boolean>>,
    setShowConnectionErrorMessage: React.Dispatch<React.SetStateAction<boolean>>,
    setShowSuccessMessage: React.Dispatch<React.SetStateAction<boolean>>,
    setShowUserExistsErrorMessage: React.Dispatch<React.SetStateAction<boolean>>
) {
    event.preventDefault();
    // if (validateUsername()
    //     && validatePassword("password", "passwordErrorMessage")
    //     // && confirmPassword("password", "confirmPassword", "confirmPasswordErrorMessage")
    //     && validateRadioButton("role", "userRoleErrorMessage", "Role must be chosen")
    //     && validateRadioButton("department", "userDepartmentErrorMessage", "Role must be chosen")) {
    //     let enteredUsername = document.getElementById("username") as HTMLInputElement;
    //     let enteredPassword = document.getElementById("password") as HTMLInputElement;

    //     const userRole: NodeListOf<HTMLInputElement> = document.querySelectorAll('input[name="role"]');
    //     let userRoleIndex = 0;

    //     for (let i = 0; i < userRole.length; i++) {
    //         if (userRole[i].checked) {
    //             userRoleIndex = i;
    //         }
    //     }

    //     const userDepartment: NodeListOf<HTMLInputElement> = document.querySelectorAll('input[name="department"]');
    //     let userDepartmentIndex = 0;

    //     for (let i = 0; i < userDepartment.length; i++) {
    //         if (userDepartment[i].checked) {
    //             userDepartmentIndex = i;
    //         }
    //     }

    //     let userData = {
    //         "username": enteredUsername.value,
    //         "password": enteredPassword.value,
    //         "role": userRole[userRoleIndex].value,
    //         "department": userDepartment[userDepartmentIndex].value
    //     };

    //     let res = null;
    //     try {
    //         let createUserForm = document.getElementById("createUserForm") as HTMLFormElement;
    //         res = await fetch(createUserForm.action, {
    //             'method': 'POST',
    //             'headers': {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': token
    //             },
    //             'body': JSON.stringify(userData)
    //         });
    //     } catch (error) {
    //         if (error instanceof TypeError) {
    //             setShowConnectionErrorMessage(true);
    //             return;
    //         }
    //     }

    //     let status = res!.status;
    //     if (status === 400) {
    //         setShowErrorMessage(true);
    //     }
    //     if (status === 409) {
    //         setShowUserExistsErrorMessage(true);
    //     }
    //     if (status === 200) {
    //         setShowSuccessMessage(true)
    //         // Clearing the form
    //         let confirmPassword = document.getElementById("confirmPassword") as HTMLInputElement;
    //         enteredUsername.value = "";
    //         enteredPassword.value = "";
    //         confirmPassword.value = "";
    //         userRole[userRoleIndex].checked = false;
    //         userDepartment[userDepartmentIndex].checked = false;
    //     }
    // }
}

export { createUser };