"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import Toastify CSS
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
      <main className="main-container">
        <div className="meeting-card">
          <h1>Google Meet Scheduler</h1>
          <p>Please sign in to access the meetings</p>
          <button onClick={() => signIn("google")} className="btn primary-btn">
            Sign in with Google
          </button>
        </div>
      </main>
    );
  }

  const createInstantMeeting = async () => {
    setLoading(true);
    const res = await fetch("/api/instant-meeting", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userEmail: session.user.email }), // Use session email
    });

    const data = await res.json();
    setMeetLink(data.meetLink);
    setLoading(false);

    if (data.meetLink) {
      toast.success("Instant meeting created successfully!", {
        position: "top-center",
        autoClose: 5000,
      });
    } else {
      toast.error("Failed to create instant meeting.", {
        position: "top-center",
        autoClose: 5000,
      });
    }
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
      body: JSON.stringify({ dateTime, attendeesEmails: [session.user.email] }), // Use session email
    });

    const data = await res.json();
    setScheduledMeetLink(data.meetLink);
    setScheduleLoading(false);
   //position: "top-center",
    if (data.meetLink) {
      toast.success("Meeting scheduled successfully!", {
        position: "top-center",
        autoClose: 5000,
      });
    } else {
      toast.error("Failed to schedule meeting.", {
        position: "top-center",
        autoClose: 5000,
      });
    }
  };

  return (
    <main className="main-container">
      <div className="meeting-card">
        <h1>Google Meet Scheduler</h1>
       
        <h3>Welcome, {session.user.name} 👋</h3>
        <button onClick={() => signOut()} className="btn btn-danger">Sign Out</button>

        {/* Instant Meeting Section */}
        <section className="instant-meeting">
          <h2>Create an Instant Meeting</h2>
          <button
            onClick={createInstantMeeting}
            className="btn primary-btn"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Instant Meeting"}
          </button>
          {meetLink && (
            <p>
              <a href={meetLink} target="_blank" rel="noopener noreferrer" className="link">
                Join Instant Meeting
              </a>
            </p>
          )}
        </section>

        <div className="divider" />

        {/* Scheduled Meeting Section */}
        <section className="scheduled-meeting">
          <h2>Schedule a Future Meeting</h2>
          <label className="input-label">Select Date & Time:</label>
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            className="input-field"
          />
          <div style={{ marginLeft: "5px" }}>
            <button
              onClick={scheduleMeeting}
              className="btn success-btn"
              disabled={scheduleLoading}
            >
              {scheduleLoading ? "Scheduling..." : "Schedule Meeting"}
            </button>
            {scheduledMeetLink && (
              <p>
                <a href={scheduledMeetLink} target="_blank" rel="noopener noreferrer" className="link">
                  Join Scheduled Meeting
                </a>
              </p>
            )}
          </div>
        </section>
      </div>

      {/* Toast Container for displaying notifications */}
      <ToastContainer />
    </main>
  );
}
