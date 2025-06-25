import { TicketType } from "@/types/api/TicketType";
import { getCookie } from "cookies-next";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5098';

// Shared error-handling fetch wrapper
async function fetchWithErrorHandling<T>(url: string, options: RequestInit): Promise<T> {
  const token = getCookie("accessToken") as string;
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const finalOptions: RequestInit = {
    ...options,
    headers,
    credentials: "include",
  };

  try {
    const response = await fetch(url, finalOptions);

    if (!response.ok) {
      // Try to parse the error response as JSON first
      let errorData: any;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        try {
          errorData = await response.json();
        } catch (e) {
          console.log(e)
          errorData = await response.text();
        }
      } else {
        errorData = await response.text();
      }

      throw new Error(
          typeof errorData === 'object' ?
              (errorData.message || errorData.error || JSON.stringify(errorData)) :
              errorData || `Server responded with status ${response.status}`
      );
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Network error: Please check your connection');
    }
    throw error;
  }
}

// get
export async function fetchTicketTypes(): Promise<TicketType[]> {
  return fetchWithErrorHandling<TicketType[]>(`${API_BASE_URL}/api/tickettypes`, {
    method: "GET",
  });
}

// post
export async function createTicketType(data: Omit<TicketType, "ticketTypeId">): Promise<TicketType> {
  return fetchWithErrorHandling<TicketType>(`${API_BASE_URL}/api/tickettypes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// put
export async function updateTicketType(id: number, data: Omit<TicketType, "ticketTypeId">): Promise<TicketType> {
  return fetchWithErrorHandling<TicketType>(`${API_BASE_URL}/api/tickettypes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// delete
export async function deleteTicketType(id: number): Promise<void> {
  return fetchWithErrorHandling<void>(`${API_BASE_URL}/api/tickettypes/${id}`, {
    method: "DELETE",
  });
}