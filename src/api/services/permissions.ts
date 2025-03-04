/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-03-04 20:53:49
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-03-04 22:01:48
 * @FilePath: /yarn-vite-web-01-02/src/api/services/permissions.ts
 * @Description: 权限服务类
 */
import { BaseApiService } from './base';
import type { Permissions } from '../generated';

export class PermissionsService extends BaseApiService {
  /**
   * 创建权限
   */
  async createPermissions(permissions: Omit<Permissions, 'id'>): Promise<string> {
    return this.post('/permissions/save', permissions);
  }

  /**
   * 更新权限信息
   */
  async updatePermissions(permissions: Partial<Permissions> & { id: string }): Promise<Permissions> {
    return this.put('/permissions/update', permissions);
  }

  /**
   * 删除权限
   */
  async deletePermissions(id: string): Promise<void> {
    return this.delete(`/permissions/remove/${id}`);
  }

  /**
   * 获取权限详情
   */
  async getPermissionsDetail(id: string): Promise<Permissions> {
    return this.get(`/permissions/${id}`);
  }

  /**
   * 根据角色类型获取权限
   */
  async getPermissionsByRoleType(roleType: number): Promise<Permissions> {
    return this.get(`/permissions/role/${roleType}`);
  }
}

// 导出单例实例
export const permissionsService = new PermissionsService();