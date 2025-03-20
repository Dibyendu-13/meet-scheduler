import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  try {
    const { userEmail } = await req.json();
    if (!userEmail) {
      return Response.json({ error: "User email is required." }, { status: 400 });
    }

    // Generate an instant Google Meet link
    const meetLink = `https://meet.google.com/new`;

    return Response.json({
      message: "Instant meeting link generated!",
      meetLink,
    });
  } catch (error) {
    console.error("❌ Error generating meeting link:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
