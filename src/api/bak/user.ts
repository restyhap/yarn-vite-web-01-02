/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-02-24 11:36:50
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-02-24 15:34:54
 * @FilePath: /yarn-vite-web-01-02/src/api/user.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import http from '@/axios/index';
import type { IApiResponse } from '@/types/axios';
import type { 
  ILoginParams, 
  ILoginResult, 
  IUser, 
  ICreateUserParams, 
  IUpdateUserParams,
  IQueryUserParams,
  IUserListResult 
} from './user.d';

/**
 * 用户登录
 * @param data 登录参数
 */
export function login(data: ILoginParams) {
  return http.post<IApiResponse<IUser[]>>('/user/login', data);
}

/**
 * 用户登出
 */
export function logout() {
  return http.post('/user/logout');
}

/**
 * 获取当前用户信息
 */
export function getCurrentUser() {
  return http.get<IUser>('/user/current');
}

/**
 * 创建用户
 * @param data 用户信息
 */
export function createUser(data: ICreateUserParams) {
  return http.post<IApiResponse<string>>('/user/save', data);
}

/**
 * 更新用户信息
 * @param data 用户信息
 */
export function updateUser(data: IUpdateUserParams) {
  return http.put<IUser>(`/user/update`, data);
}

/**
 * 删除用户
 * @param id 用户ID
 */
export function deleteUser(id: string) {
  return http.delete(`/user/remove/${id}`);
}

/**
 * 获取用户列表
 * @param params 查询参数
 */
export function getUserList(params: IQueryUserParams) {
  return http.get<IApiResponse<IUser[]>>('/user/list', { params });
}

/**
 * 获取用户详情
 * @param id 用户ID
 */
export function getUserDetail(id: string) {
  return http.get<IUser>(`/user/${id}`);
}

/**
 * 修改用户密码
 * @param id 用户ID
 * @param oldPassword 旧密码
 * @param newPassword 新密码
 */
export function changePassword(id: string, oldPassword: string, newPassword: string) {
  return http.put(`/user/${id}/password`, {
    oldPassword,
    newPassword
  });
}

/**
 * 修改用户状态
 * @param id 用户ID
 * @param status 状态
 */
export function changeUserStatus(id: string, status: number) {
  return http.put(`/user/update`, { id,status });
}

