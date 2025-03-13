/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-03-05 15:00:29
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-03-05 15:06:00
 * @FilePath: /yarn-vite-web-01-02/src/examples/test-types.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 导入一个未使用的模块来测试IDE警告
import { ref } from 'vue';

// 定义一个接口
interface User {
  id: number;
  name: string;
  email?: string;
}

// 定义一个类型别名
type UserRole = 'admin' | 'user' | 'guest';

// 定义一个带有类型注解的函数
function createUser(name: string, role: UserRole): User {
  // 未使用的变量来测试IDE警告
  const timestamp = Date.now();

  return {
    id: Math.random(),
    name,
    // 缺少必需属性来测试IDE错误
    // email: undefined
  };
}

// 使用错误的类型来测试IDE错误提示
const newUser = createUser('张三', 'superadmin');

// 访问可能为undefined的属性来测试IDE提示
// 使用可选链操作符来安全地访问可能为undefined的属性
if (newUser.email) {
  console.log(newUser.email.length);
} else {
  console.log('Email is undefined');
}

// 导出一些内容以测试模块系统
export { User, UserRole, createUser };