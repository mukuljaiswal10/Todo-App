// src/lib/emailTemplates.js

export function registrationDoneEmail({ name } = {}) {
  const safeName = name ? escapeHtml(name) : "there";
  return `
  <div style="font-family:Inter,Arial,sans-serif; line-height:1.6">
    <h2>Welcome, ${safeName} 👋</h2>
    <p>Your registration is successful.</p>
    <p style="margin-top:16px;color:#666">— Pro Todo Team</p>
  </div>`;
}

/**
 * ✅ Supports BOTH:
 * 1) verifyEmailTemplate({ name, verifyUrl })
 * 2) verifyEmailTemplate(verifyUrl, name)
 */
export function verifyEmailTemplate(input, maybeName) {
  let name = "";
  let verifyUrl = "";

  // Old style: verifyEmailTemplate("https://...", "Mukul")
  if (typeof input === "string") {
    verifyUrl = input;
    name = maybeName || "";
  }
  // New style: verifyEmailTemplate({ name, verifyUrl })
  else if (input && typeof input === "object") {
    name = input.name || "";
    verifyUrl = input.verifyUrl || "";
  }

  const safeName = name ? escapeHtml(name) : "there";
  const safeUrl = verifyUrl ? escapeHtml(verifyUrl) : "";

  // If URL is missing, show a helpful message (avoid undefined link)
  if (!safeUrl) {
    return `
    <div style="font-family:Inter,Arial,sans-serif; line-height:1.6">
      <h2>Verify your email, ${safeName}</h2>
      <p>We couldn't generate a verification link right now.</p>
      <p style="color:#666;font-size:12px">
        Please request a new verification email from the app.
      </p>
      <p style="margin-top:16px;color:#666">— Pro Todo Team</p>
    </div>`;
  }

  return `
  <div style="font-family:Inter,Arial,sans-serif; line-height:1.6">
    <h2>Verify your email, ${safeName}</h2>
    <p>Please verify your email to activate your account.</p>

    <p style="margin:18px 0">
      <a href="${safeUrl}"
         style="display:inline-block;background:#111;color:#fff;padding:10px 14px;border-radius:10px;text-decoration:none">
        Verify Email
      </a>
    </p>

    <p style="color:#666;font-size:12px;margin-top:10px">
      If the button doesn’t work, copy &amp; paste this link:
    </p>
    <p style="word-break:break-all;font-size:12px;color:#444;margin-top:6px">
      ${safeUrl}
    </p>

    <p style="color:#666;font-size:12px">
      If you didn’t create this account, ignore this email.
    </p>
    <p style="margin-top:16px;color:#666">— Pro Todo Team</p>
  </div>`;
}

export function forgotPasswordEmail(resetUrl) {
  const safeUrl = resetUrl ? escapeHtml(resetUrl) : "";

  if (!safeUrl) {
    return `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:20px">
        <h2 style="margin:0 0 10px">Reset your password</h2>
        <p style="margin:0 0 16px;color:#444">
          We couldn't generate a reset link right now. Please try again.
        </p>
      </div>
    `;
  }

  return `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:20px">
      <h2 style="margin:0 0 10px">Reset your password</h2>
      <p style="margin:0 0 16px;color:#444">
        Click the button below to reset your password. This link will expire soon.
      </p>

      <p style="margin:18px 0">
        <a href="${safeUrl}"
           style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:12px 18px;border-radius:10px">
          Reset Password
        </a>
      </p>

      <p style="color:#666;font-size:12px;margin-top:10px">
        If the button doesn’t work, copy &amp; paste this link:
      </p>
      <p style="word-break:break-all;font-size:12px;color:#444;margin-top:6px">
        ${safeUrl}
      </p>

      <p style="margin:0;color:#777;font-size:12px">
        If you didn’t request this, you can ignore this email.
      </p>
    </div>
  `;
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}