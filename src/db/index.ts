// Client
import {
    Account,
    Customer,
    Session,
    Verification,
} from "./entity/client/index";
import {
    BookingLogs,
    BookingServiceFailures,
} from "./entity/hotel/BookingServiceFailure";
import {
    InventoryLocation,
    InventoryMovement,
    ProductVariantInventory,
    ProductVariantInventoryDetails,
} from "./entity/ecommerce/Inventory";

import { Activity } from "./entity/activity";
import { AdminAudit } from "./entity/AdminAudit";
import { AttributeValue } from "./entity/ecommerce/AttributeValue";
import { BaseEntityWithAudit } from "./entity/Audit";
// Hotel Entity
import { Booking } from "./entity/hotel/Booking";
import { BookingRoom } from "./entity/hotel/BookingRoom";
import { Brands } from "./entity/ecommerce/Brand";
import { Categories } from "./entity/ecommerce/Categories";
import { Comment } from "./entity/comment";
// import { Customer } from "./entity/Customer";
import { Department } from "./entity/department";
import { EmailNotifications } from "./entity/Email.entity";
import { Feature } from "./entity/Feature";
import { FeatureTaskStatus } from "./entity/FeatureTaskStatus";
import { FeatureUpload } from "./entity/FeatureUpload";
import { InternalCompany } from "./entity/InternalCompany";
import { Label } from "./entity/taskLabel";
import { Notification } from "./entity/Notification";
import { Permission } from "./entity/Permission";
import { PermissionGroup } from "./entity/PermissionGroup";
import { Product } from "./entity/ecommerce/Product";
import { ProductAttribute } from "./entity/ecommerce/Attribute";
import { ProductUpload } from "./entity/ecommerce/ProductUploads";
import { ProductVariant } from "./entity/ecommerce/ProductVariants";
import { ProductVariantPrice } from "./entity/ecommerce/ProductPricing";
import { Project } from "./entity/project";
import { ProjectTaskStatus } from "./entity/ProjectTaskStatus";
import { Role } from "./entity/role";
import { Room } from "./entity/hotel/Room";
import { RoomType } from "./entity/hotel/RoomType";
import { Sprint } from "./entity/sprint";
import { SubCategories } from "./entity/ecommerce/SubCategories";
import { Task } from "./entity/task";
import { TaskStatus } from "./entity/taskStatus";
import { UploadFile } from "./entity/uploads";
import { User } from "./entity/User";
import { UserInternalCompany } from "./entity/UserInternalCompany";
import { UserNotification } from "./entity/UserNotification";
import { VariantAttribute } from "./entity/ecommerce/VariantAttribute";

// ECOMMERCE ENTITIES

export default [
    User,
    Project,
    Task,
    UploadFile,
    Label,
    Sprint,
    Comment,
    Activity,
    Notification,
    UserNotification,
    Department,
    Role,
    PermissionGroup,
    Permission,
    BaseEntityWithAudit,
    TaskStatus,
    ProjectTaskStatus,
    InternalCompany,
    Feature,
    FeatureUpload,
    AdminAudit,
    FeatureTaskStatus,
    Customer,
    // Hotel
    Booking,
    BookingRoom,
    Room,
    RoomType,
    BookingServiceFailures,
    BookingLogs,
    UserInternalCompany,
    EmailNotifications,
    Customer,
    Account,
    Session,
    Verification,
    // ECOMMERCE ENTITIES
    Categories,
    SubCategories,
    Brands,
    Product,
    ProductVariant,
    ProductVariantPrice,
    ProductUpload,
    ProductAttribute,
    AttributeValue,
    VariantAttribute,
    ProductVariantInventory,
    InventoryLocation,
    InventoryMovement,
    ProductVariantInventoryDetails,
];
