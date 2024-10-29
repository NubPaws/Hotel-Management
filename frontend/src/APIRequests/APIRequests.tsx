async function getUserDetails(username: string, token: string) {
    const url = "http://localhost:8000/api/Users/" + username;
    const res = await fetch(url, {
        'method': 'GET',
        'headers': {
            'Authorization': token
        }
    })
    if (res === null) {
        return null;
    }
    return await res.json()
}

async function authorizedGetRequest(url: string, token: string) {
    const res = await fetch(url, {
        'method': 'GET',
        'headers': {
            'Authorization': token
        }
    })
    return res;
}

async function authorizedPostRequestWithBody(
    token: string,
    data: string,
    url: string,
    setShowConnectionErrorMessage: React.Dispatch<React.SetStateAction<boolean>>) {
    let res = null;
    try {
        res = await fetch(url, {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            'body': data
        });
    } catch (error) {
        if (error instanceof TypeError) {
            setShowConnectionErrorMessage(true);
            return null;
        }
    }
    return res;
}

async function authorizedPostRequestWithoutBody(
    token: string,
    url: string,
    setShowConnectionErrorMessage: React.Dispatch<React.SetStateAction<boolean>>) {
    let res = null;
    try {
        res = await fetch(url, {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
    } catch (error) {
        if (error instanceof TypeError) {
            setShowConnectionErrorMessage(true);
            return null;
        }
    }
    return res;
}
export {
    getUserDetails,
    authorizedPostRequestWithBody,
    authorizedPostRequestWithoutBody,
    authorizedGetRequest
};