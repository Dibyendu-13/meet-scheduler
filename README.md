# Google Meet API with Next.js

This project integrates Google Meet with Next.js, allowing users to create instant meetings and schedule meetings using Google Calendar API. Authentication is handled via NextAuth.js with Google as the provider.

## Features

- Google authentication using NextAuth.js
- Instant meeting creation with Google Meet
- Scheduled meeting creation using Google Calendar API
- User-friendly interface built with Next.js

## Prerequisites

To run this project, ensure you have the following:

- **Google Cloud Project** with Google Calendar API enabled
- **OAuth 2.0 Credentials** (Client ID and Client Secret)
- **Google Calendar ID** (usually your Google email)
- **Next.js** installed in your development environment

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/google-meet-nextjs.git
   cd google-meet-nextjs
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env.local` file and add the following variables:
   ```env
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   NEXTAUTH_SECRET=your_nextauth_secret
   GOOGLE_CALENDAR_ID=your_google_calendar_id
   ```

## Running the Project

Start the Next.js development server:
```sh
npm run dev
```

## Authentication

This project uses NextAuth.js for authentication. Users must sign in with Google to create or schedule meetings.

## API Endpoints

### 1. Create an Instant Meeting
- **Endpoint:** `POST /api/instant-meeting`
- **Request Body:**
  ```json
  {
    "userEmail": "user@example.com"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Instant meeting created!",
    "eventLink": "https://calendar.google.com/event?eid=XYZ",
    "meetLink": "https://meet.google.com/xyz-abc"
  }
  ```

### 2. Schedule a Meeting
- **Endpoint:** `POST /api/schedule-meeting`
- **Request Body:**
  ```json
  {
    "dateTime": "2024-03-20T15:30:00.000Z",
    "attendeesEmails": ["user@example.com"]
  }
  ```
- **Response:**
  ```json
  {
    "message": "Scheduled meeting created!",
    "eventLink": "https://calendar.google.com/event?eid=XYZ",
    "meetLink": "https://meet.google.com/xyz-abc"
  }
  ```

### 3. List Upcoming Meetings
- **Endpoint:** `GET /api/list-meetings`
- **Response:**
  ```json
  {
    "events": [
      {
        "summary": "Team Standup",
        "start": "2024-03-21T10:00:00Z",
        "end": "2024-03-21T10:30:00Z",
        "meetLink": "https://meet.google.com/xyz-abc"
      }
    ]
  }
  ```

## Deployment

To deploy the project, use Vercel or any Next.js-compatible hosting provider.
```sh
vercel deploy
```

## License

This project is licensed under the MIT License.