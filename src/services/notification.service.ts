import { Notification } from "../db/entity/Notification";
import { TNotification } from "../types/types";
// import { User } from "../db/entity/User";
import { UserNotification } from "../db/entity/UserNotification";
import dataSource from "../db/data-source";

export class NotificationService {
    private readonly notificationRepository =
        dataSource.getRepository(Notification);

    private readonly userNotificationRepository =
        dataSource.getRepository(UserNotification);

    async createNotification(notification: TNotification) {
        const payload = new Notification();

        payload.type = notification.type;
        payload.link = notification.link ?? "";
        payload.message = notification.message;
        payload.payload = notification.payload;
        payload.html_template = notification.html_template ?? "";

        const response = await this.notificationRepository.save(payload);
        return response;
    }

    async addNotificationToUsers(notificationId: number, userIdList: number[]) {
        const response = await Promise.all(
            userIdList.map(async (userId) => {
                const userNotification = new UserNotification();
                userNotification.notification_id = notificationId;
                userNotification.user_id = userId;
                userNotification.isRead = false;

                const result = await this.userNotificationRepository.save(
                    userNotification
                );
                return result;
            })
        );

        return response;
    }

    async getUnReadNotificationsByUserId(userId: number) {
        const response = await this.userNotificationRepository.find({
            where: {
                user: { id: userId },
                isRead: false,
            },
            relations: ["notification"],
        });
        return response;
    }

    async markAsRead(userNotificationId: number) {
        const userNotification =
            await this.userNotificationRepository.findOneBy({
                id: userNotificationId,
            });

        if (!userNotification) throw new Error("User notification not found");

        userNotification.isRead = true;
        return await this.userNotificationRepository.save(userNotification);
    }
}

export default NotificationService;
