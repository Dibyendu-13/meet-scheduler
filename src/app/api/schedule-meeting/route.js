import { calendar, GOOGLE_CALENDAR_ID } from "../../utils/googleCalendar";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  try {
    const { dateTime, attendeesEmails } = await req.json();

    if (!dateTime || !attendeesEmails || !Array.isArray(attendeesEmails) || attendeesEmails.length === 0) {
      return Response.json({ error: "Invalid input. Provide dateTime and at least one attendee email." }, { status: 400 });
    }

    const startTime = new Date(dateTime);
    if (isNaN(startTime)) {
      return Response.json({ error: "Invalid dateTime format. Use ISO 8601 (YYYY-MM-DDTHH:MM:SSZ)." }, { status: 400 });
    }

    const event = {
      summary: "Scheduled Google Meet Meeting",
      start: { dateTime: startTime.toISOString(), timeZone: "Asia/Kolkata" },
      end: { dateTime: new Date(startTime.getTime() + 30 * 60000).toISOString(), timeZone: "Asia/Kolkata" },
      attendees: attendeesEmails.map(email => ({ email })),
      conferenceData: {
        createRequest: {
          requestId: uuidv4(),
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    };

    const response = await calendar.events.insert({
      calendarId: GOOGLE_CALENDAR_ID,
      resource: event,
      conferenceDataVersion: 1,
    });

    return Response.json({
      message: "Meeting scheduled!",
      eventLink: response.data.htmlLink,
      meetLink: response.data.conferenceData?.entryPoints?.[0]?.uri || "No Meet link generated",
    });
  } catch (error) {
    console.error("❌ Error scheduling meeting:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
