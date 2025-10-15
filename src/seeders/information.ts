const COMPANY_INFORMATION = {
    name: "The Velora Escape",
    slug: "the-velora-escape",
    logo: "https://sample.com/logos/the-velora-escape.png",
    address: "456 Serenity Lane, Tranquil Town, CA",
    email: "info@theveloraescape.com",
    phone: "+1-800-555-5678",
};

const COMPANY_MAIN_ADMIN = {
    firstName: "Rahul",
    lastName: "Prasad",
    email: "raulshah15412@gmail.com",
    mobileNumber: "9819828300",
    role: "SUPER_ADMIN",
};
// You can modify the above information as per your requirements
const COMPANY_INFORMATION_SEEDER = [
    COMPANY_INFORMATION.name,
    COMPANY_INFORMATION.slug,
    COMPANY_INFORMATION.logo,
    COMPANY_INFORMATION.address,
    COMPANY_INFORMATION.email,
    COMPANY_INFORMATION.phone,
    true,
    new Date().toISOString(),
    new Date().toISOString(),
];

export { COMPANY_INFORMATION_SEEDER, COMPANY_MAIN_ADMIN };
