import { google } from "googleapis";
import fs from "fs";
import path from "path";

const SCOPES = ["https://www.googleapis.com/auth/calendar.events"];

// Load Service Account Credentials
const KEY_FILE_PATH = path.join(process.cwd(), "config/service-account.json");
const credentials = JSON.parse(fs.readFileSync(KEY_FILE_PATH, "utf8"));

// Google Calendar ID
const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;

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
