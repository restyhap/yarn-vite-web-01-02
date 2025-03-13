import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /backOuterComponents/list
 */
export function getBackOuterComponentsList(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/backOuterComponents/list`, config);
}
