import { useUserStore } from '@/pinia/user';
import { getPermissionsSearch } from '@/api';
import type { Permissions } from '@/api';

// 模块类型
export enum ModuleType {
  PROD = 'prod',
  SPEC = 'spec',
  QUOTE = 'quote',
  SETTINGS = 'settings'
}

// 权限操作类型
export enum PermissionAction {
  VIEW = 'View',
  CREATE = 'Create',
  EDIT = 'Edit',
  DELETE = 'Delete',
  USERS = 'Users',
  PERMISSIONS = 'Permissions'
}

// 权限缓存
let permissionsCache: Permissions | null = null;

/**
 * 获取当前用户的权限
 * @returns Promise<Permissions>
 */
export const getUserPermissions = async (): Promise<Permissions> => {
  const userStore = useUserStore();
  
  // 如果用户store中已有权限数据，直接使用
  if (userStore.permissions) {
    return userStore.permissions;
  }
  
  // 如果已经有缓存，直接返回
  if (permissionsCache) {
    return permissionsCache;
  }
  
  try {
    console.log('正在获取用户权限数据...');
    const res = await getPermissionsSearch();
    console.log('权限数据响应:', res);
    
    if (res.code === '200' && res.data && res.data.length > 0) {
      // 根据用户角色类型找到对应的权限
      const userRoleType = userStore.userInfo.roleType;
      console.log('当前用户角色类型:', userRoleType);
      
      const userPermission = res.data.find((p: Permissions) => p.roleType === userRoleType);
      
      if (userPermission) {
        console.log('找到用户权限:', userPermission);
        // 缓存权限
        permissionsCache = userPermission;
        return userPermission;
      } else {
        console.warn('未找到用户对应的权限配置');
      }
    } else {
      console.warn('权限数据为空或格式不正确');
    }
    
    // 如果没有找到权限，返回空权限
    const emptyPermission = {
      roleType: userStore.userInfo.roleType
    };
    console.log('使用空权限:', emptyPermission);
    return emptyPermission;
  } catch (error) {
    console.error('获取权限失败:', error);
    return {
      roleType: userStore.userInfo.roleType
    };
  }
};

/**
 * 检查用户是否有特定模块的特定操作权限
 * @param moduleType 模块类型
 * @param action 操作类型
 * @returns Promise<boolean>
 */
export const checkPermission = async (moduleType: ModuleType, action: PermissionAction): Promise<boolean> => {
  const userStore = useUserStore();
  
  // 如果没有token，说明未登录
  if (!userStore.token) {
    console.warn('用户未登录，无权限');
    return false;
  }
  
  // 管理员默认拥有所有权限
  if (userStore.userInfo.roleType === 0) {
    console.log('管理员用户，拥有所有权限');
    return true;
  }
  
  try {
    const permissions = await getUserPermissions();
    const permissionKey = `${moduleType}${action}` as keyof Permissions;
    
    const hasPermission = permissions[permissionKey] === 1;
    console.log(`检查权限: ${moduleType}${action} = ${hasPermission}`);
    
    return hasPermission;
  } catch (error) {
    console.error('权限检查失败:', error);
    return false;
  }
};

/**
 * 清除权限缓存
 */
export const clearPermissionCache = () => {
  permissionsCache = null;
};

/**
 * 根据权限判断是否显示元素
 * @param moduleType 模块类型
 * @param action 操作类型
 * @returns Promise<boolean>
 */
export const shouldShowElement = async (moduleType: ModuleType, action: PermissionAction): Promise<boolean> => {
  return await checkPermission(moduleType, action);
}; 