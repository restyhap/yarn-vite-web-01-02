import request from "@/api/request";
import { type ResultVo, type DeepRequired, type BackOuterComponents } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /backOuterComponents/update
 */
export function putBackOuterComponentsUpdate(input: BackOuterComponents, config?: AxiosRequestConfig) {
    return request.put<DeepRequired<ResultVo>>(`/backOuterComponents/update`, input, config);
}
