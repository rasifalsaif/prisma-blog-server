import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";


console.log("auth.ts loaded");
// Initialize email transporter
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.APP_USER,
        pass: process.env.APP_PASS,
    },
});


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    trustedOrigins: [process.env.APP_URL! || "http://localhost:4000"],
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "USER",
                required: false,
            },
            phone: {
                type: "string",
                required: false,
            },
            status: {
                type: "string",
                defaultValue: "ACTIVE",
                required: false,
            },
        }
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true,
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url, token }, request) => {
            const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
            try {
                const info = await transporter.sendMail({
                    from: '"Prisma Blog" <prisma@blog.com>',
                    to: user.email,
                    subject: "Please verify your email",
                    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="100%" max-width="500" cellpadding="0" cellspacing="0"
          style="background:#ffffff; border-radius:8px; padding:32px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <h1 style="margin:0; color:#111827; font-size:24px;">
                Verify your email
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="color:#374151; font-size:16px; line-height:1.6;">
              <p style="margin:0 0 16px 0;">
                Thanks for signing up 👋
              </p>
              <p style="margin:0 0 24px 0;">
                Please confirm your email address by clicking the button below.
              </p>
            </td>
          </tr>

          <!-- Button -->
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <a href="${verificationUrl}"
                style="
                  background-color:#2563eb;
                  color:#ffffff;
                  text-decoration:none;
                  padding:14px 24px;
                  border-radius:6px;
                  font-weight:600;
                  display:inline-block;
                ">
                Verify Email
              </a>
            </td>
          </tr>

          <!-- Fallback link -->
          <tr>
            <td style="color:#6b7280; font-size:14px; line-height:1.5;">
              <p style="margin:0 0 8px 0;">
                If the button doesn’t work, copy and paste this link into your browser:
              </p>
              <p style="word-break:break-all; margin:0;">
                <a href="${verificationUrl}" style="color:#2563eb;">
                  ${verificationUrl}
                </a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:32px; color:#9ca3af; font-size:12px;" align="center">
              If you didn’t create this account, you can safely ignore this email.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`
                });

                console.log("Test mail sent:", info.messageId);
            } catch (error) {
                console.error("Mail send failed:", error);
            }
        },

    },
    socialProviders: {
        google: {
            prompt: "select_account consent",
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            accessType: "offline",
        },
    },
});