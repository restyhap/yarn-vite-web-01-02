import { UserRoleType, UserStatus } from '@/constants/enums'

/**
 * 用户信息接口
 */
export interface IUser {
  id: string;           // 用户ID
  username: string;     // 用户名
  password: string;     // 密码
  realName?: string;    // 真实姓名
  email?: string;       // 邮箱
  phone?: string;       // 电话
  roleType: UserRoleType; // 角色类型
  status: UserStatus;   // 状态
  createdAt: string;    // 创建时间
  updatedAt: string;    // 更新时间
  // permissions?: IPermissionItem[];  // 注释掉权限相关字段
}

/**
 * 登录请求参数接口
 */
export interface ILoginParams {
  username: string;
  password: string;
  remember?: boolean;
}

/**
 * 登录响应接口
 */
export interface ILoginResult {
  token: string;
  user: IUser;
}

/**
 * 创建用户参数接口
 */
export interface ICreateUserParams {
  username: string;
  password: string;
  realName?: string;
  email?: string;
  phone?: string;
  roleType: UserRoleType;
}

/**
 * 更新用户参数接口
 */
export interface IUpdateUserParams {
  id: string;
  realName?: string;
  email?: string;
  phone?: string;
  roleType?: UserRoleType;
  status?: UserStatus;
}

/**
 * 查询用户列表参数接口
 */
export interface IQueryUserParams {
  username?: string;
  realName?: string;
  roleType?: UserRoleType;
  status?: UserStatus;
  pageNum?: number;
  pageSize?: number;
}

/**
 * 用户列表响应接口
 */
export interface IUserListResult {
  total: number;
  list: IUser[];
}

// 注释掉权限相关接口
// export interface IPermissionItem {...}

// 在已有的规格表和报价单接口中添加创建者ID
export interface ISpecification {
  id: string;
  creatorId: string;  // 创建者ID
  // ... 其他字段
}

export interface IQuote {
  id: string;
  creatorId: string;  // 创建者ID
  // ... 其他字段
}

// 查询参数接口添加创建者过滤
export interface IQueryParams {
  creatorId?: string;
  pageNum?: number;
  pageSize?: number;
  // ... 其他查询条件
}
