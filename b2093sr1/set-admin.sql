-- Update user role to admin for aadeeshjain15@gmail.com
UPDATE "user" 
SET role = 'admin' 
WHERE email = 'aadeeshjain15@gmail.com';

-- Verify the update
SELECT id, name, email, role 
FROM "user" 
WHERE email = 'aadeeshjain15@gmail.com';
