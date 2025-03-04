/*;
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-03-04 20:53:49
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-03-04 22:01:48
 * @FilePath: /yarn-vite-web-01-02/src/api/services/user.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { BaseApiService } from './base';
import type { User, PageUser, ResultVO } from '../generated';

export class UserService extends BaseApiService {
  /**
   * 用户登录
   * @param username 用户名
   * @param password 密码
   */
  async login(username: string, password: string): Promise<ResultVO> {
    return this.post('/user/login', { username, password });
  }

  /**
   * 用户登出
   */
  async logout(): Promise<void> {
    return this.post('/user/logout');
  }

  /**
   * 获取当前用户信息
   */
  async getCurrentUser(): Promise<User> {
    return this.get('/user/current');
  }

  /**
   * 创建用户
   */
  async createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return this.post('/user/save', user);
  }

  /**
   * 更新用户信息
   */
  async updateUser(user: Partial<User> & { id: string }): Promise<User> {
    return this.put('/user/update', user);
  }

  /**
   * 删除用户
   */
  async deleteUser(id: string): Promise<void> {
    return this.delete(`/user/remove/${id}`);
  }

  /**
   * 获取用户列表
   */
  async getUserList(params: {
    username?: string;
    realName?: string;
    roleType?: number;
    status?: number;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<PageUser> {
    return this.get('/user/list', params);
  }

  /**
   * 获取用户详情
   */
  async getUserDetail(id: string): Promise<User> {
    return this.get(`/user/${id}`);
  }

  /**
   * 修改用户密码
   */
  async changePassword(id: string, oldPassword: string, newPassword: string): Promise<void> {
    return this.put(`/user/${id}/password`, {
      oldPassword,
      newPassword
    });
  }

  /**
   * 修改用户状态
   */
  async changeUserStatus(id: string, status: number): Promise<void> {
    return this.put('/user/update', { id, status });
  }
}

// 导出单例实例
export const userService = new UserService();