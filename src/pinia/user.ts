/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-02-24 12:06:09
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-02-24 12:06:37
 * @FilePath: /yarn-vite-web-01-02/src/pinia/user.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {defineStore} from 'pinia' ;
import {ref} from "vue";
import type {IUser} from '@/api/user.d'
import { UserRoleType } from '@/constants/enums'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}') as IUser,
    token: localStorage.getItem('token') || '',
    // permissions: [] as { moduleId: ModuleType, actions: PermissionAction[] }[] // 注释掉权限相关代码
  }),
  
  actions: {
    setUserInfo(user: IUser) {
      this.userInfo = user;
      localStorage.setItem('userInfo', JSON.stringify(user));
      // if (user.roleType !== undefined) {
      //   this.setPermissions(user.roleType);
      // }
    },
    
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token);
    },
    
    clearUserInfo() {
      this.userInfo = {} as IUser;
      this.token = '';
      // this.permissions = [];
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
    }

    // 注释掉权限相关方法
    // checkPermission(moduleId: ModuleType, action: PermissionAction): boolean {...}
    // setPermissions(roleType: UserRoleType) {...}
  }
})