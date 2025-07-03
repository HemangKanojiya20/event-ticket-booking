import axios from "axios";
import {
  Event,
  EventAvailability,
  BookingRequest,
  BookingResponse,
  ApiResponse,
} from "../types";

const API_BASE_URL = "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(
      `Making ${config.method?.toUpperCase()} request to ${config.url}`
    );
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const eventService = {
  getAllEvents: async (): Promise<Event[]> => {
    try {
      const response = await api.get<ApiResponse<Event[]>>("/events");
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching events:", error);
      throw new Error("Failed to fetch events");
    }
  },

  getEventById: async (id: string): Promise<Event> => {
    try {
      const response = await api.get<ApiResponse<Event>>(`/events/${id}`);
      if (!response.data.data) {
        throw new Error("Event not found");
      }
      return response.data.data;
    } catch (error) {
      console.error("Error fetching event:", error);
      throw new Error("Failed to fetch event");
    }
  },

  getEventAvailability: async (id: string): Promise<EventAvailability> => {
    try {
      const response = await api.get<ApiResponse<EventAvailability>>(
        `/events/${id}/availability`
      );
      if (!response.data.data) {
        throw new Error("Event availability not found");
      }
      return response.data.data;
    } catch (error) {
      console.error("Error fetching event availability:", error);
      throw new Error("Failed to fetch event availability");
    }
  },

  bookTickets: async (
    eventId: string,
    bookingRequest: BookingRequest
  ): Promise<BookingResponse> => {
    try {
      const response = await api.post<BookingResponse>(
        `/events/${eventId}/purchase`,
        bookingRequest
      );
      return response.data;
    } catch (error) {
      console.error("Error booking tickets:", error);
      if (axios.isAxiosError(error) && error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to book tickets");
    }
  },

  createEvent: async (eventData: {
    title: string;
    date: string;
    venue: string;
    description?: string;
  }): Promise<Event> => {
    try {
      const response = await api.post<ApiResponse<Event>>("/events", eventData);
      if (!response.data.data) {
        throw new Error("Failed to create event");
      }
      return response.data.data;
    } catch (error) {
      console.error("Error creating event:", error);
      throw new Error("Failed to create event");
    }
  },
};

export default api;
