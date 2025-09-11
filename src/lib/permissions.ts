export const permissions = {
  Admin: {
    canManageInventory: true,
    canAssignDevices: true,
    canSeeAllItems: true,
    canApproveReturns: true,
    canConfirmReceipt: true,
    canReturnDevices: true,
  },
  Teacher: {
    canManageInventory: false,
    canAssignDevices: false,
    canSeeAllItems: false,
    canApproveReturns: false,
    canConfirmReceipt: true,
    canReturnDevices: true,
  },
} as const;

export function checkPermission(
  role: "Admin" | "Teacher",
  action: keyof (typeof permissions)["Admin"]
) {
  return permissions[role][action];
}

// Usage:

// if (!checkPermission(session.role, "canManageInventory")) {
//   return new NextResponse("Forbidden", { status: 403 });
// }
