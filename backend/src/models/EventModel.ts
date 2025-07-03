import {
  Event,
  Section,
  Row,
  Seat,
  BookingRequest,
  BookingResponse,
} from "../types";
import { v4 as uuidv4 } from "uuid";

class EventModel {
  private events: Map<string, Event> = new Map();
  private bookingLocks: Map<string, boolean> = new Map();

  private readonly GROUP_DISCOUNT_THRESHOLD = 4;
  private readonly GROUP_DISCOUNT_PERCENTAGE = 0.1; // 10% discount

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData(): void {
    // Create sample events
    const event1 = this.createSampleEvent(
      "Rock Concert 2024",
      "An amazing rock concert featuring top artists",
      "2024-06-15T19:00:00Z",
      "Narendra Modi Stadium"
    );

    const event2 = this.createSampleEvent(
      "Classical Music Evening",
      "A sophisticated evening of classical music",
      "2024-07-20T20:00:00Z",
      "Town Hall"
    );

    this.events.set(event1.id, event1);
    this.events.set(event2.id, event2);
  }

  private createSampleEvent(
    title: string,
    description: string,
    date: string,
    venue: string
  ): Event {
    const eventId = uuidv4();

    const sections: Section[] = [
      {
        id: uuidv4(),
        name: "VIP",
        price: 200,
        rows: this.createRows(["A", "B"], 10),
      },
      {
        id: uuidv4(),
        name: "Premium",
        price: 150,
        rows: this.createRows(["C", "D", "E"], 12),
      },
      {
        id: uuidv4(),
        name: "General",
        price: 100,
        rows: this.createRows(["F", "G", "H", "I", "J"], 15),
      },
    ];

    return {
      id: eventId,
      title,
      description,
      date,
      venue,
      sections,
      createdAt: new Date(),
    };
  }

  private createRows(rowNames: string[], seatsPerRow: number): Row[] {
    return rowNames.map((name) => ({
      id: uuidv4(),
      name,
      seats: this.createSeats(seatsPerRow),
    }));
  }

  private createSeats(count: number): Seat[] {
    return Array.from({ length: count }, (_, index) => ({
      id: uuidv4(),
      number: index + 1,
      isBooked: false,
    }));
  }

  getAllEvents(): Event[] {
    return Array.from(this.events.values());
  }

  getEventById(id: string): Event | undefined {
    return this.events.get(id);
  }

  createEvent(eventData: Omit<Event, "id" | "createdAt">): Event {
    // If no sections provided, auto-generate them like sample events
    let sections = eventData.sections;
    if (!sections || !Array.isArray(sections) || sections.length === 0) {
      sections = [
        {
          id: uuidv4(),
          name: "VIP",
          price: 200,
          rows: this.createRows(["A", "B"], 10),
        },
        {
          id: uuidv4(),
          name: "Premium",
          price: 150,
          rows: this.createRows(["C", "D", "E"], 12),
        },
        {
          id: uuidv4(),
          name: "General",
          price: 100,
          rows: this.createRows(["F", "G", "H", "I", "J"], 15),
        },
      ];
    }

    const event: Event = {
      id: uuidv4(),
      ...eventData,
      sections,
      createdAt: new Date(),
    };

    this.events.set(event.id, event);
    return event;
  }

  getEventAvailability(eventId: string) {
    const event = this.events.get(eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    const sections = event.sections.map((section) => ({
      sectionId: section.id,
      name: section.name,
      price: section.price,
      rows: section.rows.map((row) => ({
        rowId: row.id,
        name: row.name,
        totalSeats: row.seats.length,
        availableSeats: row.seats.filter((seat) => !seat.isBooked).length,
        bookedSeats: row.seats.filter((seat) => seat.isBooked).length,
      })),
    }));

    return {
      eventId,
      sections,
    };
  }

  async bookTickets(request: BookingRequest): Promise<BookingResponse> {
    const lockKey = `${request.eventId}-${request.sectionId}-${request.rowId}`;

    // Implement locking mechanism to prevent race conditions
    if (this.bookingLocks.get(lockKey)) {
      return {
        success: false,
        error:
          "Another booking is in progress for this section. Please try again.",
      };
    }

    this.bookingLocks.set(lockKey, true);

    try {
      const event = this.events.get(request.eventId);
      if (!event) {
        return {
          success: false,
          error: "Event not found",
        };
      }

      const section = event.sections.find((s) => s.id === request.sectionId);
      if (!section) {
        return {
          success: false,
          error: "Section not found",
        };
      }

      const row = section.rows.find((r) => r.id === request.rowId);
      if (!row) {
        return {
          success: false,
          error: "Row not found",
        };
      }

      const availableSeats = row.seats.filter((seat) => !seat.isBooked);
      if (availableSeats.length < request.numberOfTickets) {
        return {
          success: false,
          error: `Only ${availableSeats.length} seats available in this row`,
        };
      }

      // Book the seats atomically
      const seatsToBook = availableSeats.slice(0, request.numberOfTickets);
      const bookingId = uuidv4();
      const bookingTime = new Date();

      seatsToBook.forEach((seat) => {
        seat.isBooked = true;
        seat.bookedAt = bookingTime;
        seat.bookingId = bookingId;
      });

      // Calculate pricing with group discount
      const baseAmount = section.price * request.numberOfTickets;
      const isGroupDiscount =
        request.numberOfTickets >= this.GROUP_DISCOUNT_THRESHOLD;
      const discountAmount = isGroupDiscount
        ? baseAmount * this.GROUP_DISCOUNT_PERCENTAGE
        : 0;
      const totalAmount = baseAmount - discountAmount;

      return {
        success: true,
        bookingId,
        bookedSeats: seatsToBook,
        totalAmount,
        discountApplied: isGroupDiscount,
        discountAmount,
      };
    } catch (error) {
      console.log("🚀 ~ EventModel ~ bookTickets ~ error:", error);
      return {
        success: false,
        error: "An error occurred while processing your booking",
      };
    } finally {
      // Always release the lock
      this.bookingLocks.delete(lockKey);
    }
  }
}

export default EventModel;
