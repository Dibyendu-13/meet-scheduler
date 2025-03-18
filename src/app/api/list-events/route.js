import { calendar, GOOGLE_CALENDAR_ID } from "../../utils/googleCalendar";

export async function GET(req) {
  try {
    const result = await calendar.events.list({
      calendarId: GOOGLE_CALENDAR_ID,
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    return Response.json({ events: result.data.items || [] });
  } catch (error) {
    console.error("❌ Error listing events:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
