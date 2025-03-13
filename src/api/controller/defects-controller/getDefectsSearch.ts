import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /defects/search
 */
export function getDefectsSearch(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/defects/search`, config);
}
