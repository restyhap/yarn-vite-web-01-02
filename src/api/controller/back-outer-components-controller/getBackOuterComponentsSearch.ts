import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /backOuterComponents/search
 */
export function getBackOuterComponentsSearch(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/backOuterComponents/search`, config);
}
