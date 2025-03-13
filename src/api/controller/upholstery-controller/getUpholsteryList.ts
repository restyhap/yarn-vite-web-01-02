import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /upholstery/list
 */
export function getUpholsteryList(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/upholstery/list`, config);
}
