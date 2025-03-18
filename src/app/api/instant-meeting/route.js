import { calendar, GOOGLE_CALENDAR_ID } from "../../utils/googleCalendar";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  try {
    const { userEmail } = await req.json(); // Get email from request body
    if (!userEmail) {
      throw new Error("User email is required.");
    }

    const now = new Date();
    const event = {
      summary: "Instant Google Meet Meeting",
      start: { dateTime: now.toISOString(), timeZone: "Asia/Kolkata" },
      end: { dateTime: new Date(now.getTime() + 30 * 60000).toISOString(), timeZone: "Asia/Kolkata" },
      attendees: [{ email: userEmail }], // Use signed-in user's email
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
      message: "Instant meeting created!",
      eventLink: response.data.htmlLink,
      meetLink: response.data.conferenceData?.entryPoints?.[0]?.uri || "No Meet link generated",
    });
  } catch (error) {
    console.error("❌ Error creating meeting:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
