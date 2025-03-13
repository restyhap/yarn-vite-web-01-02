import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * 搜索扶手信息表
 * /arms/search
 */
export function getArmsSearch(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/arms/search`, config);
}
