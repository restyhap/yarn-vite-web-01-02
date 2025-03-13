/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-03-12 10:48:49
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-03-12 16:29:49
 * @FilePath: /yarn-vite-web-01-02/src/api/controller/file-upload-controller/getFilesRemove.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /files/remove
 */
export function getFilesRemove(params: GetFilesRemoveParams, config?: AxiosRequestConfig) {
    const paramsInput = {
        filePath: params.filePath,
    };
    return request.get<DeepRequired<ResultVo>>(`/files/remove`, {
        params: paramsInput,
        ...config,
    });
}

export interface GetFilesRemoveParams {
    filePath: string;
}
