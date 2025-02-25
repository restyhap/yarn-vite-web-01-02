/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-02-13 10:58:54
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-02-24 11:11:33
 * @FilePath: /yarn-vite-web-01-02/src/utils/idUtils.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

/**
 * 生成17位时间戳字符串
 * 格式：年(2位)月日时分秒毫秒+自增序号(如: 25021415201012301)
 * @returns {string} 17位时间戳字符串
 */

// 用于生成自增序号的计数器
let counter = 0;

export function getId(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);  // 取年份后两位
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');
  const millisecond = String(now.getMilliseconds()).padStart(3, '0');
  
  // 自增序号(0-99)，达到99后归零
  counter = (counter + 1) % 100;
  const sequence = String(counter).padStart(2, '0');
  
  // 格式: YYMMDDHHmmssXXXSS (17位)
  // YY: 年份后两位(2位)
  // MM: 月份(2位)
  // DD: 日期(2位)
  // HH: 小时(2位)
  // mm: 分钟(2位)
  // ss: 秒钟(2位)
  // XXX: 毫秒数(3位)
  // SS: 自增序号(2位)
  // 说明:
  // 1. 使用毫秒级时间戳，保证时间精度
  // 2. 使用自增序号代替随机数，保证同一毫秒内的顺序性
  // 3. 自增序号从00-99循环，支持同一毫秒内生成100个不同的ID
  // 4. 总长度为17位
  // 5. 按时间正序或倒序排列都能保持正确的时间顺序
  return `${year}${month}${day}${hour}${minute}${second}${millisecond}${sequence}`;
}
