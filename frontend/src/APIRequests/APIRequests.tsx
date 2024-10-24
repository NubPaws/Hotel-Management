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

export { getUserDetails };