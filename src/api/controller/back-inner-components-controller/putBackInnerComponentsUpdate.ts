import request from "@/api/request";
import { type ResultVo, type DeepRequired, type BackInnerComponents } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /backInnerComponents/update
 */
export function putBackInnerComponentsUpdate(input: BackInnerComponents, config?: AxiosRequestConfig) {
    return request.put<DeepRequired<ResultVo>>(`/backInnerComponents/update`, input, config);
}
