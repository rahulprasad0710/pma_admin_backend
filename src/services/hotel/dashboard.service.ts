import { Booking } from "../../db/entity/hotel/Booking";
import { Customer } from "../../db/entity/client/index";
import dataSource from "../../db/data-source";

type THotelDashboardQuery = {
    bookingDate: Date | undefined;
};

export class HotelDashboardService {
    private readonly bookingRepository = dataSource.getRepository(Booking);
    private readonly customerRepository = dataSource.getRepository(Customer);

    async getDashboardInfo(query: THotelDashboardQuery) {
        const { bookingDate } = query;

        const totalBooking = await this.bookingRepository.count({});
        const [resultNewBooking, totalCountBooking] =
            await this.bookingRepository.findAndCount({
                order: {
                    bookingDate: "DESC",
                },
                where: {
                    ...(bookingDate ? { bookingDate: bookingDate } : {}),
                },
            });

        const totalCustomer = await this.customerRepository.count();

        const [resultNewCustomer, totalCountCustomer] =
            await this.customerRepository.findAndCount({
                order: { createdAt: "DESC" },
                where: {
                    ...(bookingDate ? { createdAt: bookingDate } : {}),
                },
            });

        const result = {
            customer: {
                totalCustomer,
                resultNewCustomer,
                totalCountCustomer,
            },
            booking: {
                totalBooking,
                totalCountBooking,
                resultNewBooking,
            },
        };

        return result;
    }
}
