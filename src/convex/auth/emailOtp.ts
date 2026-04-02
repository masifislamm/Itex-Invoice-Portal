import { Email } from "@convex-dev/auth/providers/Email";
import { makeFunctionReference } from "convex/server";
import { alphabet, generateRandomString } from "oslo/crypto";

const checkRateLimit = makeFunctionReference<
  "mutation",
  { email: string },
  { allowed: boolean; retryAfterMs: number }
>("auth/rateLimiter:checkAndIncrementOtpRateLimit");

function otpEmailHtml(otp: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your OTP Code</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f7;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);padding:36px 40px;text-align:center;">
              <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">Itex Invoice</p>
              <p style="margin:6px 0 0;font-size:13px;color:#a0aec0;letter-spacing:1px;text-transform:uppercase;">by Cikohtech</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="margin:0 0 8px;font-size:24px;font-weight:700;color:#1a1a2e;">Verification Code</p>
              <p style="margin:0 0 32px;font-size:15px;color:#718096;line-height:1.6;">
                Use the code below to sign in to your account. It expires in <strong>15 minutes</strong>.
              </p>

              <!-- OTP Box -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:0 0 32px;">
                    <div style="display:inline-block;background:#f7f8fc;border:2px dashed #e2e8f0;border-radius:12px;padding:20px 48px;">
                      <span style="font-size:42px;font-weight:800;letter-spacing:16px;color:#1a1a2e;font-family:'Courier New',monospace;">${otp}</span>
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:13px;color:#a0aec0;line-height:1.6;">
                If you didn't request this code, you can safely ignore this email. Someone may have typed your email address by mistake.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px;background:#edf2f7;"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#cbd5e0;">
                &copy; ${new Date().getFullYear()} Cikohtech &mdash; Itex Invoice Platform
              </p>
              <p style="margin:6px 0 0;font-size:12px;color:#cbd5e0;">
                This is an automated message, please do not reply.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

type ActionCtx = {
  runMutation: (fn: unknown, args: unknown) => Promise<unknown>;
};

export const emailOtp = Email({
  id: "email-otp",
  maxAge: 60 * 15, // 15 minutes
  generateVerificationToken() {
    return generateRandomString(6, alphabet("0-9"));
  },
  // @ts-expect-error convex-dev/auth passes ctx as second arg at runtime
  async sendVerificationRequest(
    { identifier: email, token }: { identifier: string; token: string },
    ctx: ActionCtx,
  ) {
    // Rate limiting: max 5 OTP requests per email per 10 minutes
    const result = (await ctx.runMutation(checkRateLimit, { email })) as {
      allowed: boolean;
      retryAfterMs: number;
    };

    if (!result.allowed) {
      const mins = Math.ceil(result.retryAfterMs / 60000);
      throw new Error(
        `Too many OTP requests. Please try again in ${mins} minute(s).`,
      );
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Itex Invoice <otp@cikohtech.com>",
        to: [email],
        subject: "Your Itex Invoice verification code",
        html: otpEmailHtml(token),
        text: `Your Itex Invoice verification code is: ${token}\n\nThis code expires in 15 minutes.\n\nIf you didn't request this, please ignore this email.`,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Failed to send OTP email: ${error}`);
    }
  },
});
