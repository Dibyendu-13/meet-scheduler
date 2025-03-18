"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import "./Home.css"; // Import the CSS file

export default function Home() {
  const { data: session } = useSession();
  const [meetLink, setMeetLink] = useState(null);
  const [scheduledMeetLink, setScheduledMeetLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [dateTime, setDateTime] = useState("");

  if (!session) {
    return (
      <main className="container">
        <div className="card">
          <h1>Google Meet API with Next.js</h1>
          <p>Please sign in to access the meetings</p>
          <button onClick={() => signIn("google")} className="btn btn-primary">Sign in with Google</button>
        </div>
      </main>
    );
  }

  const createInstantMeeting = async () => {
    setLoading(true);
    const res = await fetch("/api/instant-meeting", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userEmail: session.user.email }), // Pass signed-in user's email
    });
  
    const data = await res.json();
    setMeetLink(data.meetLink);
    setLoading(false);
  };
  
  const scheduleMeeting = async () => {
    if (!dateTime) {
      alert("Please select a date and time!");
      return;
    }
    
    setScheduleLoading(true);
    const res = await fetch("/api/schedule-meeting", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dateTime, attendeesEmails: [session.user.email] }),
    });

    const data = await res.json();
    setScheduledMeetLink(data.meetLink);
    setScheduleLoading(false);
  };

  return (
    <main className="container">
      <div className="card">
        <h1>Welcome, {session.user.name} 👋</h1>
        <button onClick={() => signOut()} className="btn btn-danger">Sign Out</button>

        {/* Instant Meeting */}
        <button onClick={createInstantMeeting} className="btn btn-primary" disabled={loading}>
          {loading ? "Creating..." : "Create Instant Meeting"}
        </button>
        {meetLink && (
          <p>
            <a href={meetLink} target="_blank" rel="noopener noreferrer" className="meeting-link">
              Join Instant Meeting
            </a>
          </p>
        )}

        <hr />

        {/* Schedule Meeting */}
        <label className="label">Select Date & Time:</label>
        <input
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          className="input"
        />
        <button onClick={scheduleMeeting} className="btn btn-success" disabled={scheduleLoading}>
          {scheduleLoading ? "Scheduling..." : "Schedule Meeting"}
        </button>
        {scheduledMeetLink && (
          <p>
            <a href={scheduledMeetLink} target="_blank" rel="noopener noreferrer" className="meeting-link">
              Join Scheduled Meeting
            </a>
          </p>
        )}
      </div>
    </main>
  );
}
