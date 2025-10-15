-- Insert permission groups
INSERT INTO permission_group (id, "displayName", "isActive", description) VALUES
(1, 'Project Management', true, 'Permissions related to Projects'),
(2, 'Task Management', true, 'Permissions related to Tasks'),
(3, 'User Management', true, 'Permissions related to Users'),
(4, 'Employee Management', true, 'Permissions related to Employees'),
(5, 'Label Management', true, 'Permissions related to Labels');


-- Project Permissions
INSERT INTO permission ("displayName", "enumName", description, "permissionGroupId") VALUES
('Create Project', 'CREATE_PROJECT', 'Permission to create a project', 1),
('Read Project', 'READ_PROJECT', 'Permission to read project details', 1),
('Update Project', 'UPDATE_PROJECT', 'Permission to update a project', 1),
('Delete Project', 'DELETE_PROJECT', 'Permission to delete a project', 1),
('Create Task', 'CREATE_TASK', 'Permission to create a task', 2),
('Read Task', 'READ_TASK', 'Permission to read tasks', 2),
('Update Task', 'UPDATE_TASK', 'Permission to update tasks', 2),
('Delete Task', 'DELETE_TASK', 'Permission to delete tasks', 2),
('Create User', 'CREATE_USER', 'Permission to create a user', 3),
('Read User', 'READ_USER', 'Permission to view users', 3),
('Update User', 'UPDATE_USER', 'Permission to update users', 3),
('Delete User', 'DELETE_USER', 'Permission to delete users', 3),
('Create Employee', 'CREATE_EMPLOYEE', 'Permission to create an employee', 4),
('Read Employee', 'READ_EMPLOYEE', 'Permission to view employees', 4),
('Update Employee', 'UPDATE_EMPLOYEE', 'Permission to update employees', 4),
('Delete Employee', 'DELETE_EMPLOYEE', 'Permission to delete employees', 4),
('Create Label', 'CREATE_LABEL', 'Permission to create a label', 5),
('Read Label', 'READ_LABEL', 'Permission to view labels', 5),
('Update Label', 'UPDATE_LABEL', 'Permission to update labels', 5),
('Delete Label', 'DELETE_LABEL', 'Permission to delete labels', 5);
