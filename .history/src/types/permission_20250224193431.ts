export interface Permission {
  id: string;
  name: string;
}

export interface Module {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Record<string, boolean>;
}

// 角色类型枚举
export enum RoleType {
  ADMIN = 0,    // 管理员
  SUPPLIER = 1, // 供应商
  EMPLOYEE = 2  // 员工
}

// 权限记录接口
export interface IPermission {
  id: string;
  roleType: RoleType;
  // 规格表权限
  prodView: number;
  prodCreate: number;
  prodEdit: number;
  prodDelete: number;
  // 质检表权限
  specView: number;
  specCreate: number;
  specEdit: number;
  specDelete: number;
  // 报价单权限
  quoteView: number;
  quoteCreate: number;
  quoteEdit: number;
  quoteDelete: number;
  // 系统设置权限
  settingsUsers: number;
  settingsPermissions: number;
} 