export const Facility = {
    WIFI: "WIFI",
    AIR_CONDITIONING: "AIR_CONDITIONING",
    TV: "TV",
    MINI_BAR: "MINI_BAR",
    ROOM_SERVICE: "ROOM_SERVICE",
    SWIMMING_POOL: "SWIMMING_POOL",
    GYM: "GYM",
    PARKING: "PARKING",
    BREAKFAST_INCLUDED: "BREAKFAST_INCLUDED",
    PET_FRIENDLY: "PET_FRIENDLY",
    SEA_VIEW: "SEA_VIEW",
    BALCONY: "BALCONY",
    SAFE_BOX: "SAFE_BOX",
    HAIR_DRYER: "HAIR_DRYER",
    COFFEE_MAKER: "COFFEE_MAKER",
} as const;

export type Facility = (typeof Facility)[keyof typeof Facility];
