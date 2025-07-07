import { Resend } from "resend";

export async function sendEmail({
    to,
    subject,
    react,
}) {
    const resend = new Resend(process.env.RESEND_API_KEY || "");

    try {

        const data = await resend.emails.send({
            from: "ExpensifyX <no-reply@expensifyx.site>",
            to,
            subject,
            react,
        });

        console.log("📨 Email sended ");

        return { success: true, data };
    } catch (error) {
        console.error("❌ Failed to send email:", error || error);
        return { success: false, error };
    }
}
