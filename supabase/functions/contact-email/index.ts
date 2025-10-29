import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

interface RequestBody {
  name: string;
  email: string;
  subject: string;
  message: string;
}

serve(async (req: Request) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  try {
    const { name, email, subject, message } = await req.json() as RequestBody;

    // Validate inputs
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Get Resend API key from environment
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Send email to admin
    const adminResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "SWASTH SATHI <onboarding@resend.dev>",
        to: "kumarmahi8758@gmail.com",
        subject: `New Contact Form Submission: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">New Contact Form Submission</h2>
            
            <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <p><strong>Name:</strong> ${escapeHtml(name)}</p>
              <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
              <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
            </div>

            <div style="background-color: #f9fafb; padding: 16px; border-left: 4px solid #2563eb; margin: 16px 0;">
              <h3 style="margin-top: 0; color: #1f2937;">Message:</h3>
              <p style="white-space: pre-wrap; word-wrap: break-word;">${escapeHtml(message)}</p>
            </div>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 12px;">
              This email was sent from SWASTH SATHI contact form. 
              <br/>
              <strong>Reply to:</strong> ${escapeHtml(email)}
            </p>
          </div>
        `,
      }),
    });

    if (!adminResponse.ok) {
      const errorData = await adminResponse.json();
      console.error("Resend API error:", errorData);
      return new Response(
        JSON.stringify({ error: "Failed to send email" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Send confirmation email to user
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "SWASTH SATHI <onboarding@resend.dev>",
        to: email,
        subject: "We received your message - SWASTH SATHI",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Thank You, ${escapeHtml(name)}!</h2>
            
            <p>We have received your message and appreciate you reaching out to SWASTH SATHI.</p>
            
            <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <p><strong>Your Message:</strong></p>
              <p style="white-space: pre-wrap; word-wrap: break-word; color: #4b5563;">${escapeHtml(message)}</p>
            </div>

            <p>Our team will review your message and get back to you as soon as possible at <strong>${escapeHtml(email)}</strong>.</p>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 12px;">
              <strong>SWASTH SATHI</strong> - Empowering Communities with AI-Driven Health Information
              <br/>
              © 2025 All rights reserved.
            </p>
          </div>
        `,
      }),
    }).catch((err) => {
      console.error("Failed to send confirmation email:", err);
      // Don't fail if confirmation email fails
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email sent successfully",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
});

// Helper function to escape HTML
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
