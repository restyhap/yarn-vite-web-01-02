import request from "@/api/request";
import { type ResultVo, type DeepRequired, type Defects } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /defects/update
 */
export function putDefectsUpdate(input: Defects, config?: AxiosRequestConfig) {
    return request.put<DeepRequired<ResultVo>>(`/defects/update`, input, config);
}
