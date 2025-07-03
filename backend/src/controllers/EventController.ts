import { Request, Response } from "express";
import EventModel from "../models/EventModel";
import { BookingRequest } from "../types";

class EventController {
  private eventModel: EventModel;

  constructor() {
    this.eventModel = new EventModel();
  }

  getAllEvents = async (req: Request, res: Response): Promise<void> => {
    try {
      const events = this.eventModel.getAllEvents();
      res.json({
        success: true,
        data: events,
      });
    } catch (error) {
      console.log("🚀 ~ EventController ~ getAllEvents= ~ error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch events",
      });
    }
  };

  getEventById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const event = this.eventModel.getEventById(id);

      if (!event) {
        res.status(404).json({
          success: false,
          error: "Event not found",
        });
        return;
      }

      res.json({
        success: true,
        data: event,
      });
    } catch (error) {
      console.log("🚀 ~ EventController ~ getEventById= ~ error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch event",
      });
    }
  };

  getEventAvailability = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const availability = this.eventModel.getEventAvailability(id);

      res.json({
        success: true,
        data: availability,
      });
    } catch (error) {
      if (error instanceof Error && error.message === "Event not found") {
        res.status(404).json({
          success: false,
          error: "Event not found",
        });
      } else {
        res.status(500).json({
          success: false,
          error: "Failed to fetch event availability",
        });
      }
    }
  };

  bookTickets = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const bookingRequest: BookingRequest = {
        eventId: id,
        ...req.body,
      };

      // Validate request
      if (
        !bookingRequest.sectionId ||
        !bookingRequest.rowId ||
        !bookingRequest.numberOfTickets
      ) {
        res.status(400).json({
          success: false,
          error: "Missing required fields: sectionId, rowId, numberOfTickets",
        });
        return;
      }

      if (
        bookingRequest.numberOfTickets <= 0 ||
        bookingRequest.numberOfTickets > 10
      ) {
        res.status(400).json({
          success: false,
          error: "Number of tickets must be between 1 and 10",
        });
        return;
      }

      if (
        !bookingRequest.customerInfo ||
        !bookingRequest.customerInfo.name ||
        !bookingRequest.customerInfo.email
      ) {
        res.status(400).json({
          success: false,
          error: "Customer information (name, email) is required",
        });
        return;
      }

      const result = await this.eventModel.bookTickets(bookingRequest);

      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.log("🚀 ~ EventController ~ bookTickets= ~ error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to process booking",
      });
    }
  };

  createEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      const eventData = req.body;

      // Basic validation
      if (!eventData.title || !eventData.date || !eventData.venue) {
        res.status(400).json({
          success: false,
          error: "Missing required fields: title, date, venue",
        });
        return;
      }

      const event = this.eventModel.createEvent(eventData);

      res.status(201).json({
        success: true,
        data: event,
      });
    } catch (error) {
      console.log("🚀 ~ EventController ~ createEvent= ~ error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to create event",
      });
    }
  };
}

export default EventController;
