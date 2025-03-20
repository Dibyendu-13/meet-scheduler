import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // Ensure this exists
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.accessToken) {
            return Response.json({ error: "Unauthorized. Please log in first." }, { status: 401 });
        }

        const { dateTime, attendeesEmails } = await req.json();

        if (!dateTime || !Array.isArray(attendeesEmails) || attendeesEmails.length === 0) {
            return Response.json({ error: "Invalid input. Provide dateTime and at least one attendee email." }, { status: 400 });
        }

        // Initialize OAuth Client
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: session.accessToken });

        // Google Calendar API
        const calendar = google.calendar({ version: "v3", auth: oauth2Client });

        // Convert time to IST (India Standard Time)
        const startTimeUTC = new Date(dateTime);
        const startTimeIST = new Date(startTimeUTC.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
        const endTimeIST = new Date(startTimeIST.getTime() + 30 * 60000); // 30-minute duration

        // Create Google Meet Event
        const event = {
            summary: "Scheduled Google Meet Meeting",
            start: { dateTime: startTimeIST.toISOString(), timeZone: "Asia/Kolkata" },
            end: { dateTime: endTimeIST.toISOString(), timeZone: "Asia/Kolkata" },
            attendees: attendeesEmails.map(email => ({ email })),
            conferenceData: {
                createRequest: {
                    requestId: uuidv4(),
                    conferenceSolutionKey: { type: "hangoutsMeet" },
                },
            },
        };

        // Insert event into the user's Google Calendar
        const response = await calendar.events.insert({
            calendarId: "primary",
            resource: event,
            conferenceDataVersion: 1,
        });

        return Response.json({
            success: true,
            message: "Meeting scheduled successfully!",
            eventLink: response.data.htmlLink,
            meetLink: response.data.conferenceData?.entryPoints?.[0]?.uri || "No Meet link generated",
            eventId: response.data.id,
        });
    } catch (error) {
        console.error("❌ Error scheduling meeting:", error);
        return Response.json({ success: false, error: error.message || "An unexpected error occurred" }, { status: 500 });
    }
}
