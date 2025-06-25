export interface Role {
    roleId: number;
    roleName: string;
    canCreate: boolean;
    canRead: boolean;
    canEdit: boolean;
    canDelete: boolean;
}