import { NextRequest, NextResponse } from "next/server";
import { validateContactForm, hasErrors } from "@/lib/validation";

// Simple in-memory rate limiter (per serverless instance)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Rate limit check
    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many requests. Please try again later.",
        },
        { status: 429 }
      );
    }

    // Parse body
    const body = await request.json();

    // Honeypot check -- fake success to not reveal spam detection
    if (body._honeypot) {
      return NextResponse.json({
        success: true,
        message:
          "Thank you for your enquiry. We'll be in touch within one business day.",
      });
    }

    // Validate
    const errors = validateContactForm(body);
    if (hasErrors(errors)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fix the errors below.",
          errors,
        },
        { status: 400 }
      );
    }

    const { name, organisation, role, email, phone, message } = body;
    const CONTACT_EMAIL =
      process.env.CONTACT_EMAIL || "hello@studyoracle.com";

    // Try Resend if API key is available
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: "StudyOracle Website <noreply@studyoracle.com>",
        to: CONTACT_EMAIL,
        replyTo: email,
        subject: `New enquiry from ${name} at ${organisation}`,
        text: [
          `Name: ${name}`,
          `Organisation: ${organisation}`,
          `Role: ${role}`,
          `Email: ${email}`,
          `Phone: ${phone || "Not provided"}`,
          "",
          `Message:`,
          message,
        ].join("\n"),
      });
    } else {
      // Fallback: log to console
      console.log("--- Contact Form Submission ---");
      console.log(`Name: ${name}`);
      console.log(`Organisation: ${organisation}`);
      console.log(`Role: ${role}`);
      console.log(`Email: ${email}`);
      console.log(`Phone: ${phone || "Not provided"}`);
      console.log(`Message: ${message}`);
      console.log("--- End Submission ---");
    }

    return NextResponse.json({
      success: true,
      message:
        "Thank you for your enquiry. We'll be in touch within one business day.",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred. Please try again later.",
      },
      { status: 500 }
    );
  }
}
