import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /defects/list
 */
export function getDefectsList(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/defects/list`, config);
}
