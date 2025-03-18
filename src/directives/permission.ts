/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-03-17 21:43:34
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-03-17 22:00:04
 * @FilePath: /yarn-vite-web-01-02/src/directives/permission.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Directive, DirectiveBinding } from 'vue';
import { checkPermission, ModuleType, PermissionAction } from '@/utils/permissionUtils';

/**
 * 权限指令
 * 使用方法：v-permission="{ module: 'prod', action: 'View' }"
 */
export const permission: Directive = {
  async mounted(el: HTMLElement, binding: DirectiveBinding) {
    try {
      const { module, action } = binding.value;
      
      if (!module || !action) {
        console.warn('v-permission指令需要提供module和action参数');
        return;
      }
      
      // 检查权限
      const hasPermission = await checkPermission(module as ModuleType, action as PermissionAction);
      
      if (!hasPermission) {
        // 如果没有权限，从DOM中移除元素
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        } else {
          el.style.display = 'none'; // 备用方案，如果无法移除元素
        }
      }
    } catch (error) {
      console.error('权限指令执行失败:', error);
      // 出错时默认不显示元素
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      } else {
        el.style.display = 'none';
      }
    }
  }
};

export default permission; 