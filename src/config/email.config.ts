import APP_CONSTANT from "../constants/AppConfig";
import { TEmail } from "../types/types";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: APP_CONSTANT.COMPANY_EMAIL_USER,
        pass: APP_CONSTANT.COMPANY_EMAIL_PASS,
    },
});

export async function sendEmail({ to, subject, text, html }: TEmail) {
    const mailOptions = {
        from: "raulshah15412@gmail.com",
        to,
        subject,
        text,
        html,
    };

    console.log({
        mailOptions,
    });
    const response = await transporter.sendMail(mailOptions);
    console.log("Email Sent: " + nodemailer.getTestMessageUrl(response));
    return response;
}
