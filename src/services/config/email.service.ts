import { EmailSendType, EmailStatus, EmailType } from "../../enums/email.enum";

import AppError from "../../utils/AppError";
import { EmailNotifications } from "../../db/entity/Email.entity";
import { ErrorType } from "../../enums/Eums";
import { IBookingResponse } from "../../types/payload";
import { Repository } from "typeorm";
import { TEmail } from "../../types/types";
import { User } from "../../db/entity/User";
import { addEmailToQueue } from "../../jobs/emailQueue";
import dataSource from "../../db/data-source";
import { sendEmail } from "../../config/email.config";

interface IEmailPayload {
    to: string;
    subject: string;
    html_template: string;
    text: string;
    type: EmailType;
    status: EmailStatus;
    retries: number | undefined;
    data_id: string;
}

export class EmailService {
    private readonly emailRepository =
        dataSource.getRepository(EmailNotifications);

    async createEmailNotification(emailData: IEmailPayload) {
        const payload = new EmailNotifications();

        payload.to = emailData.to;
        payload.subject = emailData.subject;
        payload.html_template = emailData.html_template;
        payload.text = emailData.text;
        payload.type = emailData.type;
        payload.status = emailData.status;
        payload.retries = emailData?.retries ?? 0;
        payload.data_id = emailData.data_id;

        const result = await this.emailRepository.save(payload);
        return result;
    }

    async sendVerificationEmail(user: User, verifyLink: string) {
        console.log(
            "LOG: ~ EmailService ~ sendVerificationEmail ~ user:",
            user
        );
        const emailObj: TEmail = {
            to: [user.email],
            subject: "Welcome to the project",
            html: `
                    <h1>Welcome to the project</h1>
                    <p>Your employee id is ${user.employeeId}</p>
                    <p>Please login to the app <a href="${verifyLink}">here</a></p>
                    `,
            text: `
                    Welcome to the project
                    Your employee id is ${user.employeeId}
                    Please login to the app
                    `,
        };

        const createEmailNotification = await this.createEmailNotification({
            to: user.email,
            subject: emailObj.subject,
            html_template: emailObj.html ?? "",
            text: emailObj.text ?? "",
            type: EmailType.USER_EMAIL_VERIFICATION,
            status: EmailStatus.IN_PROGRESS,
            retries: 0,
            data_id: String(user.id),
        });

        await addEmailToQueue(emailObj);
        return {
            createEmailNotification,
            verifyLink,
        };
    }

    async sendBookingConfirmationEmail(booking: IBookingResponse) {
        const customer = booking.customer;

        const roomsList = booking.bookedRoomResult
            .map(
                (r) => `
        <li>
          Room ${r.room.roomNumber} - ${r.room.roomType.name} 
          <br/>
          Price: $${r.room.roomType.roomPrice}
        </li>
      `
            )
            .join("");

        const emailObj: TEmail = {
            // to: [customer.email],
            to: ["avinashsharma1774@gmail.com"], // Email to test

            subject: `Booking Confirmation - ${booking.userBookingId}`,
            html: `
                <h1>Booking Confirmation</h1>
                <p>Dear ${customer.name},</p>
                <p>Your booking <strong>${
                    booking.userBookingId
                }</strong> has been confirmed.</p>
                <p><strong>Check-in:</strong> ${new Date(
                    booking.checkInDate
                ).toLocaleString()}</p>
                <p><strong>Check-out:</strong> ${new Date(
                    booking.checkOutDate
                ).toLocaleString()}</p>
                <p><strong>Total Price:</strong> $${booking.totalPrice}</p>
                <p><strong>Payment Method:</strong> ${
                    booking.payment_status
                }</p>
                <h3>Rooms Booked:</h3>
                <ul>${roomsList}</ul>
                <br/>
                <p>We look forward to hosting you!</p>
                `,
            text: `
                Dear ${customer.name},

                Your booking ${booking.userBookingId} has been confirmed.

                Check-in: ${new Date(booking.checkInDate).toLocaleString()}
                Check-out: ${new Date(booking.checkOutDate).toLocaleString()}
                Total Price: $${booking.totalPrice}
                Payment Method: ${booking.payment_status}

                Rooms Booked:
                ${booking.bookedRoomResult
                    .map(
                        (r) =>
                            `Room ${r.room.roomNumber} - ${
                                r.room.roomType.name
                            } (${r.room.roomType.facilities.join(", ")}) - $${
                                r.room.roomType.roomPrice
                            }`
                    )
                    .join("\n")}

                We look forward to hosting you!
                `,
        };

        const createEmailNotification = await this.createEmailNotification({
            to: booking.customer.email,
            subject: emailObj.subject,
            html_template: emailObj.html ?? "",
            text: emailObj.text ?? "",
            type: EmailType.BOOKING_CONFIRMATION,
            status: EmailStatus.IN_PROGRESS,
            retries: 0,
            data_id: String(booking.id),
        });

        await addEmailToQueue(emailObj);

        return {
            createEmailNotification,
            bookingId: booking.id,
        };
    }

    async getEmailById(emailId: number) {
        const result = this.emailRepository.findOne({
            where: {
                id: emailId,
            },
        });
        return result;
    }

    async sendMailDirectly(
        emailId: number,
        sentType: EmailSendType | undefined
    ) {
        const emailResponse = await this.getEmailById(emailId);

        if (!emailResponse) {
            throw new AppError(
                "Email Not Found",
                400,
                ErrorType.NOT_FOUND_ERROR
            );
        }

        const emailObj: TEmail = {
            to: [emailResponse.to],
            subject: emailResponse.subject,
            html: emailResponse.html_template,
            text: emailResponse.text,
        };

        if (sentType === EmailSendType.DIRECT) {
            const result = await sendEmail(emailObj);
            return {
                success: true,
                ...result,
                emailId: emailResponse.id,
                sentType,
            };
        } else {
            await addEmailToQueue(emailObj);
            return {
                success: true,
                emailId: emailResponse.id,
                sentType,
            };
        }
    }
}
