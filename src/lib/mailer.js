import nodemailer from "nodemailer";

export function getTransport() {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 465);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !port || !user || !pass) {
        throw new Error("❌ Missing SMTP env vars");
    }

    return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
    });
}

export async function sendMail({ to, subject, html }) {
    const transporter = getTransport();
    const from = process.env.EMAIL_FROM || process.env.SMTP_USER;

    await transporter.sendMail({
        from,
        to,
        subject,
        html,
    });
}
export default sendMail;