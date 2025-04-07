/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-02-06 23:39:20
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-04-06 21:33:26
 * @FilePath: /yarn-vite-web-01-02/src/utils/imageUtils.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * 将Base64字符串转换为Uint8Array
 */
export const base64ToUint8Array = (base64: string): Uint8Array => {
  const binaryString = atob(base64.split(',')[1])
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes
}

/**
 * 获取图片的Buffer
 */
export const getImageBuffer = async (imageUrl: string): Promise<Buffer> => {
  const response = await fetch(imageUrl)
  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

/**
 * 获取图片的尺寸
 */
export const getImageDimensions = async (imageUrl: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      })
    }
    img.onerror = reject
    img.src = imageUrl
  })
} 