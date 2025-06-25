// services/api/mutator/custom-instance.ts
export const customInstance = async <T>({
                                            url,
                                            method,
                                            params,
                                            data,
                                            headers,
                                            signal,
                                        }: {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    params?: Record<string, any>;
    data?: any;
    headers?: Record<string, string>;
    signal?: AbortSignal;
}): Promise<T> => {
    // Construct the URL with query parameters
    const queryParams = params
        ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
        : '';
    const fullUrl = `${url}${queryParams}`;

    // Prepare the request options
    const options: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        signal, // Add the signal to request options
        ...(data && { body: JSON.stringify(data) }),
    };

    // Make the request
    const response = await fetch(fullUrl, options);

    // Handle errors
    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    // Parse the response
    const result = await response.json();
    return result as T;
};