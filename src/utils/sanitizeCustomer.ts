import { Customer } from "../db/entity/client/index";
import { User } from "../db/entity/User";

type TCustomerPayload = {
    customer: Customer;
};

type TEmployeePayload = {
    employee: User;
};

export const sanitizeCustomerResult = ({
    customer,
}: TCustomerPayload): Partial<Customer> => {
    const newItem: Partial<Customer> = {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        mobileNumber: customer.mobileNumber,
        associated_internal_company_id: customer.associated_internal_company_id,
        image: customer.image,
    };

    return newItem;
};

export const sanitizeEmployeeResult = ({
    employee,
}: TEmployeePayload): Partial<User> => {
    const newItem: Partial<User> = {
        id: employee.id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        employeeId: employee.employeeId,
        email: employee.email,
        mobileNumber: employee.mobileNumber,
        profilePictureUrl: employee.profilePictureUrl,
    };

    return newItem;
};
