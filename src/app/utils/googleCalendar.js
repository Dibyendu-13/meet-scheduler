import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/calendar.events"];
const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;

// Decode service account JSON from environment variable
const credentials = JSON.parse(
  Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT, "base64").toString("utf-8")
);

// Authenticate Google API with impersonation
const auth = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key.replace(/\\n/g, "\n"),
  SCOPES,
  GOOGLE_CALENDAR_ID
);

export const calendar = google.calendar({ version: "v3", auth });
export { GOOGLE_CALENDAR_ID };
