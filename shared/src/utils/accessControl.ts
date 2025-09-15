export function hasPermission(permission: string, userPermissions: string[]) {
  return permission === "" || userPermissions.includes(permission);
}