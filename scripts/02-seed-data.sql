-- Insert supervisor (encargada)
-- Note: You'll need to create this user in Supabase Auth first
-- Then update the UUID below with the actual auth user ID

-- Example: INSERT INTO profiles (id, email, full_name, role)
-- VALUES ('your-supervisor-uuid-here', 'encargada@example.com', 'Encargada', 'supervisor');

-- Insert students (servicio social - 360 hours)
-- Note: Create these users in Supabase Auth first, then insert their profiles

-- Example for Osiris:
-- INSERT INTO profiles (id, email, full_name, role)
-- VALUES ('osiris-uuid', 'osiris@example.com', 'Osiris', 'student');
-- 
-- INSERT INTO students (id, student_type, required_hours, assigned_room)
-- VALUES ('osiris-uuid', 'servicio_social', 360, 'Sala 1');

-- Example for Cristal:
-- INSERT INTO profiles (id, email, full_name, role)
-- VALUES ('cristal-uuid', 'cristal@example.com', 'Cristal', 'student');
-- 
-- INSERT INTO students (id, student_type, required_hours, assigned_room)
-- VALUES ('cristal-uuid', 'servicio_social', 360, 'Sala 2 y Galería');

-- Example for Saul:
-- INSERT INTO profiles (id, email, full_name, role)
-- VALUES ('saul-uuid', 'saul@example.com', 'Saul', 'student');
-- 
-- INSERT INTO students (id, student_type, required_hours, assigned_room)
-- VALUES ('saul-uuid', 'servicio_social', 360, 'Sala 3');

-- Students with practicas (480 hours)
-- Example for Alonso:
-- INSERT INTO profiles (id, email, full_name, role)
-- VALUES ('alonso-uuid', 'alonso@example.com', 'Alonso', 'student');
-- 
-- INSERT INTO students (id, student_type, required_hours, assigned_room)
-- VALUES ('alonso-uuid', 'practicas', 480, 'Sala 4 y 5');

-- Example for Gemma:
-- INSERT INTO profiles (id, email, full_name, role)
-- VALUES ('gemma-uuid', 'gemma@example.com', 'Gemma', 'student');
-- 
-- INSERT INTO students (id, student_type, required_hours, assigned_room)
-- VALUES ('gemma-uuid', 'practicas', 480, 'Sala 1');

-- Example for Ivanna:
-- INSERT INTO profiles (id, email, full_name, role)
-- VALUES ('ivanna-uuid', 'ivanna@example.com', 'Ivanna', 'student');
-- 
-- INSERT INTO students (id, student_type, required_hours, assigned_room)
-- VALUES ('ivanna-uuid', 'practicas', 480, 'Sala 2 y Galería');
