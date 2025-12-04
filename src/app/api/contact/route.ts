import { NextRequest, NextResponse } from "next/server";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate form data
function validateFormData(data: ContactFormData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long");
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push("Please provide a valid email address");
  }

  if (!data.subject || data.subject.trim().length < 3) {
    errors.push("Subject must be at least 3 characters long");
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.push("Message must be at least 10 characters long");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();

    // Validate the form data
    const validation = validateFormData(body);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    // Sanitize data
    const sanitizedData = {
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      subject: body.subject.trim(),
      message: body.message.trim(),
      submittedAt: new Date().toISOString(),
    };

    // Here you can:
    // 1. Save to database
    // 2. Send email notification
    // 3. Integrate with third-party services (e.g., SendGrid, Mailgun)
    
    // For now, we'll log the submission (in production, replace with actual handling)
    console.log("Contact form submission:", sanitizedData);

    // Example: Send email using a service (uncomment and configure as needed)
    // await sendEmail({
    //   to: "your-email@example.com",
    //   subject: `New Contact: ${sanitizedData.subject}`,
    //   html: `
    //     <h2>New Contact Form Submission</h2>
    //     <p><strong>Name:</strong> ${sanitizedData.name}</p>
    //     <p><strong>Email:</strong> ${sanitizedData.email}</p>
    //     <p><strong>Subject:</strong> ${sanitizedData.subject}</p>
    //     <p><strong>Message:</strong></p>
    //     <p>${sanitizedData.message}</p>
    //   `,
    // });

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for your message! I'll get back to you soon.",
        data: {
          name: sanitizedData.name,
          email: sanitizedData.email,
          submittedAt: sanitizedData.submittedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { success: false, errors: ["An unexpected error occurred. Please try again."] },
      { status: 500 }
    );
  }
}

// Handle other methods
export async function GET() {
  return NextResponse.json(
    { message: "Contact API endpoint. Use POST to submit a message." },
    { status: 200 }
  );
}
