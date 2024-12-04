// type Role = "admin" | "user";

// type Permission = {
//   role: Role[];
//   allowed: boolean;
// };

// const roleBasedAccessControl = {
//   admin: ["time_table", "manage_user"],
//   user: ["my_subjects", "subjects"],
// };

// export function checkPermission(userRole: Role, allowedRoles: Role[]): boolean {
//   if (!userRole || !allowedRoles) return false;
//   return allowedRoles.includes(userRole);
// }
