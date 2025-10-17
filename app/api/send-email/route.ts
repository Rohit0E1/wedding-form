import { NextResponse, NextRequest } from 'next/server';
import nodemailer from 'nodemailer';

interface RequestBody {
  name: string;
  phone: string;
  email?: string;
  city: string;
  role: string;
}

export async function POST(request: NextRequest) {
  // --- **NEW VALIDATION BLOCK STARTS HERE** ---
  // These variables are checked on the server, so they are secure.
  const { EMAIL_SERVER_HOST, EMAIL_SERVER_PORT, EMAIL_SERVER_USER, EMAIL_SERVER_PASSWORD, EMAIL_FROM } = process.env;

  if (!EMAIL_SERVER_HOST || !EMAIL_SERVER_PORT || !EMAIL_SERVER_USER || !EMAIL_SERVER_PASSWORD || !EMAIL_FROM) {
    console.error("Missing required environment variables for sending email.");
    // Don't expose which variable is missing to the client.
    return NextResponse.json({ message: "Server configuration error." }, { status: 500 });
  }
  // --- **NEW VALIDATION BLOCK ENDS HERE** ---

  try {
    const { name, phone, email, city, role } = await request.json() as RequestBody;

    if (!name || !phone || !city || !role) {
      return NextResponse.json({ message: "Missing required form fields" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: EMAIL_SERVER_HOST,
      port: Number(EMAIL_SERVER_PORT),
      secure: true,
      auth: {
        user: EMAIL_SERVER_USER,
        pass: EMAIL_SERVER_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Your Website" <${EMAIL_FROM}>`,
      to: 'rohitkumar.0f1@gmail.com',
      subject: `New Wedding Inquiry from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>New Wedding Photography Lead</h2>
          <p>You have received a new inquiry from your website form.</p>
          <hr>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Email:</strong> ${email || 'Not provided'}</p>
          <p><strong>City:</strong> ${city}</p>
          <p><strong>Role:</strong> ${role}</p>
          <hr>
          <p style="font-size: 0.9em; color: #888;">This email was sent from your lead capture page.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Email sent successfully!" }, { status: 200 });

  } catch (error) {
    // Improved error handling
    let errorMessage = "An unknown error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error('API Error:', errorMessage);
    return NextResponse.json({ message: "Failed to send email." }, { status: 500 });
  }
}
