-- add ADMIN ROLE --

INSERT into "role" (id , "isActive" , name) VALUES ( 1 , true, 'ADMIN');

--- add ADMIN

INSERT INTO "user" (
    "id",
    email,
	"firstName",
    "lastName",
    "employeeId",
    "roleId",
    "emailVerified",
    "isActive",
    "createdAt"
) VALUES (
    1,
    'rahulstart@example.com',
    'Rahul1',
    'Prasad',
    'PMA-0001',
    1,
    FALSE,
    FALSE,
    NOW()
);

-- ADD INTERNAL COMPANy

INSERT INTO internal_company (
    id,
    name,
    slug,
    "logoUrl",
    address,
    "contactEmail",
    "contactPhone",
    "isActive",
    "createdAt",
    "updatedAt"
) VALUES (
    1,
    'TechNova Inc',
    'technova-inc',
    'https://example.com/logos/technova.png',
    '123 Innovation Drive, Silicon Valley, CA',
    'contact@technova.com',
    '+1-800-555-1234',
    TRUE,
    '2025-07-25 19:27:51.872423',
    '2025-07-25 19:27:51.872423'
);

INSERT INTO internal_company_member (
    id,
    internal_company_id,
    user_id
) VALUES (
    1,
    1,
    1
);


--- ADD FEATURE ---
INSERT INTO "feature" (
    "id",
    name,
    description,
    slug,
  	"active",
    "profilePicture",
    "internalCompanyId",
    "adminId",
    "activeSprintId"
) VALUES (
    1,
    'Booking',
    'Handles hotel room booking process',
    'booking',
  	true,
    NULL,
    1,
    1,
    NULL
);