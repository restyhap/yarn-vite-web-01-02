/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-03-12 10:48:46
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-03-12 16:18:05
 * @FilePath: /yarn-vite-web-01-02/src/api/controller/file-upload-controller/postFilesUpload.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /files/upload
 */
export function postFilesUpload(input?: PostFilesUploadInput, config?: AxiosRequestConfig) {
    // 创建FormData对象
    const formData = new FormData();
    if (input?.file) {
        formData.append('file', input.file);
    }
    
    // 设置请求配置，确保Content-Type为multipart/form-data
    const uploadConfig: AxiosRequestConfig = {
        ...config,
        headers: {
            ...config?.headers,
            'Content-Type': 'multipart/form-data'
        }
    };
    
    return request.post<DeepRequired<ResultVo>>(`/files/upload`, formData, uploadConfig);
}

export interface PostFilesUploadInput {
    file: File;
}
