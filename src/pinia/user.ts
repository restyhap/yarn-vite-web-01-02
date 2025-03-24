/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-02-24 12:06:09
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-03-05 14:38:23
 * @FilePath: /yarn-vite-web-01-02/src/pinia/user.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {defineStore} from 'pinia' ;
import {ref} from "vue";
import type { User } from '@/api';
import { getUserPermissions, clearPermissionCache } from '@/utils/permissionUtils';
import type { Permissions } from '@/api';

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}') as User,
    token: localStorage.getItem('token') || '',
    permissions: null as Permissions | null
  }),
  
  actions: {
    setUserInfo(user: User) {
      this.userInfo = user;
      localStorage.setItem('userInfo', JSON.stringify(user));
      // 加载用户权限
      if (user.roleType !== undefined) {
        this.loadPermissions();
      }
    },
    
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token);
    },
    
    clearUserInfo() {
      this.userInfo = {} as User;
      this.token = '';
      this.permissions = null;
      // 清除权限缓存
      clearPermissionCache();
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
    },

    // 加载用户权限
    async loadPermissions() {
      try {
        this.permissions = await getUserPermissions();
      } catch (error) {
        this.permissions = null;
      }
    }
  }
})