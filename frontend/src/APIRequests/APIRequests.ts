
export class FetchError extends Error {}
export class RequestError extends Error {}

const BASE_URL = "http://localhost:8000/"

/**
 * Makes an HTTP request to a specified endpoint with customizable options.
 *
 * @param endpoint - The API endpoint to send the request to, appended to the BASE_URL.
 * @param method - The HTTP method for the request, either "POST" or "GET".
 * @param contentType - Specifies the content type for the request body; can be either "text" or "json".
 * @param body - The data to send in the request body. If provided as JSON, it will be stringified.
 * @param authorization - Optional Bearer token for authorization. If provided, it will be included in the request headers.
 *
 * @returns The response object if the request succeeds; otherwise, `undefined` if an error occurs.
 * 
 * @throws FetchError - if the fetch request failed; connection issue.
 * @throws RequestError - if the response is invalid; request issue.
 */
export async function makeRequest(
	endpoint: string,
	method: "POST" | "GET",
	contentType: "text" | "json",
	body?: object | string,
	authorization?: string,
): Promise<Response> {
	const bodyStr = (typeof body === "string") ? body : JSON.stringify(body);
	
	const headers: Record<string, string> = {
		"Content-Type": `application/${contentType}`,
	};
	
	if (authorization) {
		headers["Authorization"] = authorization;
	}

    const fetchOptions: RequestInit = {
		method: method,
		headers: headers,
	};

    if (method === "POST" && bodyStr) {
		fetchOptions.body = bodyStr;
	}

	try {
		const res = await fetch(`${BASE_URL}${endpoint}`, fetchOptions);
        
		return res;
	} catch (error: any) {
		if (error instanceof TypeError) {
			throw new FetchError("Network or fetch-related error occurred.");
		}
		throw new RequestError(error.message || "Request error occurred.");
	}
}

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
    setShowConnectionErrorMessage: React.Dispatch<React.SetStateAction<boolean>>
) {
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
    setShowConnectionErrorMessage: React.Dispatch<React.SetStateAction<boolean>>
) {
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