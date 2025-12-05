"use server"

import transporter from "@/lib/nodemailer"

const styles = {
    container: "max-width:500px; margin:20px; padding:20px; auto; border:1px solid #000; border-radius:6px;",
    header: "font-size:20px; color:#333;",
    paragraph: "font-size:16px;",
    link: "display:inline-block; margin-top:15px; padding:10px 15px; background-color:#0070f3; color:#fff; text-decoration:none; border-radius:4px;"
}

export async function sendEmailAction({
    to,
    subject,
    meta
}: {
    to: string;
    subject: string;
    meta: {
        description: string;
        link: string;
    };
}) {
    const mailOptions = {
        from: process.env.NODEMAILER_USER,
        to,
        subject: `BetterAuthy - ${subject}`,
        html: `
        <div style="${styles.container}">
            <h1 style="${styles.header}">BetterAuthy</h1>
            <p style="${styles.paragraph}">${meta.description}</p>
            <a href="${meta.link}" style="${styles.link}">Take Action</a>
        </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return {success: true};
    }catch (error) {
        console.error("Error sending email:", error);
        return {success: false};
    }
}