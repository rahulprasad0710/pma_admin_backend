import { BookingRoom } from "../../db/entity/hotel/BookingRoom";
import { RoomType } from "../../db/entity/hotel/RoomType";
import dataSource from "../../db/data-source";

async function getRoomTypeMonthlyAvailability(
    roomTypeId: number,
    year: number,
    month: number
) {
    const startDate = new Date(year, month - 1, 1); // first day of month
    const endDate = new Date(year, month, 0); // last day of month

    const roomTypeRepo = dataSource.getRepository(RoomType);

    // Fetch total rooms of this type
    const roomType = await roomTypeRepo.findOne({
        where: { id: roomTypeId },
        relations: ["rooms"],
    });
    if (!roomType) throw new Error("Room type not found");

    const totalRooms = roomType.rooms.length;

    // Loop over each date in month
    const availability: { date: string; availableRooms: number }[] = [];
    for (
        let d = new Date(startDate);
        d <= endDate;
        d.setDate(d.getDate() + 1)
    ) {
        const dateStr = d.toISOString().split("T")[0];

        // Count booked rooms for this date
        const bookedRooms = await roomTypeRepo
            .createQueryBuilder("rt")
            .leftJoin("rt.rooms", "r")
            .leftJoin("r.bookingRooms", "br")
            .leftJoin(
                "br.booking",
                "b",
                ":date BETWEEN b.checkInDate AND b.checkOutDate",
                { date: dateStr }
            )
            .where("rt.id = :roomTypeId", { roomTypeId })
            .andWhere("b.id IS NOT NULL")
            .getCount();

        availability.push({
            date: dateStr,
            availableRooms: totalRooms - bookedRooms,
        });
    }

    return availability;
}

async function getRoomTypeMonthlyAvailabilityOptimized(
    roomTypeId: number,
    year: number,
    month: number
) {
    const startDate = new Date(year, month - 1, 1); // first day of month
    const endDate = new Date(year, month, 0); // last day of month

    const roomTypeRepo = dataSource.getRepository(RoomType);
    const bookingRoomRepo = dataSource.getRepository(BookingRoom);

    // Fetch total rooms of this type
    const roomType = await roomTypeRepo.findOne({
        where: { id: roomTypeId },
        relations: ["rooms"],
    });
    if (!roomType) throw new Error("Room type not found");
    const totalRooms = roomType.rooms.length;

    // Fetch all bookings for these rooms that overlap the month
    const bookingRooms = await bookingRoomRepo
        .createQueryBuilder("br")
        .leftJoinAndSelect("br.booking", "b")
        .leftJoinAndSelect("br.room", "r")
        .where("r.roomTypeId = :roomTypeId", { roomTypeId })
        .andWhere("b.checkOutDate >= :startDate", { startDate })
        .andWhere("b.checkInDate <= :endDate", { endDate })
        .getMany();

    // Prepare daily availability map
    const availabilityMap: Record<string, number> = {};
    for (
        let d = new Date(startDate);
        d <= endDate;
        d.setDate(d.getDate() + 1)
    ) {
        availabilityMap[d.toISOString().split("T")[0]] = totalRooms;
    }

    // Subtract booked rooms for each date range
    for (const br of bookingRooms) {
        const checkIn = new Date(br.booking.checkInDate);
        const checkOut = new Date(br.booking.checkOutDate);

        for (
            let d = new Date(checkIn);
            d <= checkOut;
            d.setDate(d.getDate() + 1)
        ) {
            const dateStr = d.toISOString().split("T")[0];
            if (availabilityMap[dateStr] !== undefined) {
                availabilityMap[dateStr] = Math.max(
                    0,
                    availabilityMap[dateStr] - 1
                );
            }
        }
    }

    // Convert to array
    return Object.entries(availabilityMap).map(([date, availableRooms]) => ({
        date,
        availableRooms,
    }));
}

async function getRoomTypeCalendar(
    roomTypeId: number,
    year: number,
    month: number
) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const roomTypeRepo = dataSource.getRepository(RoomType);
    const bookingRoomRepo = dataSource.getRepository(BookingRoom);

    // Get all rooms for this type
    const roomType = await roomTypeRepo.findOne({
        where: { id: roomTypeId },
        relations: ["rooms"],
    });
    if (!roomType) throw new Error("Room type not found");

    const rooms = roomType.rooms;

    // Get all bookings for these rooms that overlap this month
    const bookingRooms = await bookingRoomRepo
        .createQueryBuilder("br")
        .leftJoinAndSelect("br.booking", "b")
        .leftJoinAndSelect("br.room", "r")
        .where("r.roomTypeId = :roomTypeId", { roomTypeId })
        .andWhere("b.checkOutDate >= :startDate", { startDate })
        .andWhere("b.checkInDate <= :endDate", { endDate })
        .getMany();

    // Prepare daily calendar
    const calendar: Record<
        string,
        { availableRooms: number; availableRoomIds: number[] }
    > = {};

    for (
        let d = new Date(startDate);
        d <= endDate;
        d.setDate(d.getDate() + 1)
    ) {
        const dateStr = d.toISOString().split("T")[0];

        // Find booked room IDs for that day
        const bookedRoomIds = bookingRooms
            .filter((br) => {
                const checkIn = new Date(br.booking.checkInDate);
                const checkOut = new Date(br.booking.checkOutDate);
                return d >= checkIn && d <= checkOut;
            })
            .map((br) => br.room.id);

        const availableRoomIds = rooms
            .filter((r) => !bookedRoomIds.includes(r.id))
            .map((r) => r.id);

        calendar[dateStr] = {
            availableRooms: availableRoomIds.length,
            availableRoomIds,
        };
    }

    return calendar;
}

async function getRoomTypeAvailability({
    roomTypeId,
    checkInDate,
    checkOutDate,
}: {
    roomTypeId: number[];
    checkInDate: string;
    checkOutDate: string;
}) {
    console.log({
        roomTypeId,
        checkInDate,
        checkOutDate,
    });

    const bookingRoomRepo = dataSource.getRepository(BookingRoom);

    const response = await Promise.all(
        roomTypeId?.map(async (item) => {
            const bookingRooms = await bookingRoomRepo
                .createQueryBuilder("br")
                .leftJoinAndSelect("br.booking", "b")
                .leftJoinAndSelect("br.room", "r")
                .where("r.roomTypeId = :roomTypeId", { roomTypeId: item })
                .andWhere("b.checkOutDate <= :checkOutDate", { checkOutDate })
                .andWhere("b.checkInDate >= :checkInDate", { checkInDate })
                .getMany();

            return {
                roomTypeId: item,
                roomIdList: bookingRooms.map((br) => br.roomById),
            };
        })
    );

    return response;
}

async function getRoomAvailability({
    roomId,
    checkInDate,
    checkOutDate,
}: {
    roomId: number[];
    checkInDate: Date;
    checkOutDate: Date;
}) {
    console.log({
        roomId,
        checkInDate,
        checkOutDate,
    });

    // function toMidnight(dateStr: string) {
    //     const d = new Date(dateStr);
    //     d.setUTCHours(0, 0, 0, 0);
    //     return d.toISOString();
    // }

    // const checkInDateNormalized = toMidnight(checkInDate);
    // const checkOutDateNormalized = toMidnight(checkOutDate);

    const bookingRoomRepo = dataSource.getRepository(BookingRoom);

    const response = await Promise.all(
        roomId?.map(async (item) => {
            const bookingRooms = await bookingRoomRepo
                .createQueryBuilder("br")
                .leftJoinAndSelect("br.booking", "b")
                .where("br.roomById = :roomById", { roomById: item })
                .andWhere("b.checkInDate <= :checkOutDate", { checkInDate })
                .andWhere("b.checkOutDate >= :checkInDate", { checkOutDate })
                .getMany();

            return {
                roomId: item,
                bookingRooms,
            };
        })
    );

    return response;
}

// SELECT br.*,
//        b.*,
//        r.*
// FROM booking_room br
// LEFT JOIN booking b ON br."bookingId" = b.id
// LEFT JOIN room r ON br."roomById" = r.id
// WHERE r."roomTypeId" = 2
//   AND b."checkInDate" >= '2025-08-20'
//   AND b."checkOutDate" <= '2025-08-20';

export default {
    getRoomTypeMonthlyAvailability,
    getRoomTypeMonthlyAvailabilityOptimized,
    getRoomTypeCalendar,
    getRoomTypeAvailability,
    getRoomAvailability,
};
