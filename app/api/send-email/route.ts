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
  try {
    const { name, phone, email, city, role } = await request.json() as RequestBody;

    if (!name || !phone || !city || !role) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Your Website" <${process.env.EMAIL_FROM}>`,
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

  } catch (error: any) {
    // --- **IMPROVED LOGGING** ---
    // We now log the specific error to the server console for better debugging.
    console.error('--- EMAIL SENDING FAILED ---');
    console.error(`Timestamp: ${new Date().toISOString()}`);
    console.error(`Error: ${error.message}`);
    console.error('-----------------------------');

    return NextResponse.json({ message: "Failed to send email. Please check server logs." }, { status: 500 });
  }
}
