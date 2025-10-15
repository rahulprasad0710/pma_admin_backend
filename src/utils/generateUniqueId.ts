export async function generateUniqueId() {
    const { nanoid } = await import("nanoid");
    return nanoid(12);
}

export function makeDisplayName(enumValue: string): string {
    return enumValue
        .toLowerCase() // read_employee_details
        .split("_") // ["read", "employee", "details"]
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // ["Read", "Employee", "Details"]
        .join(" "); // "Read Employee Details"
}
