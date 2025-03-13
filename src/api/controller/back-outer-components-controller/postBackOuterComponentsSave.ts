import request from "@/api/request";
import { type ResultVo, type DeepRequired, type BackOuterComponents } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /backOuterComponents/save
 */
export function postBackOuterComponentsSave(input: BackOuterComponents, config?: AxiosRequestConfig) {
    return request.post<DeepRequired<ResultVo>>(`/backOuterComponents/save`, input, config);
}
