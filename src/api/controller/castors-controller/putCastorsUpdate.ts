import request from "@/api/request";
import { type ResultVo, type DeepRequired, type Castors } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /castors/update
 */
export function putCastorsUpdate(input: Castors, config?: AxiosRequestConfig) {
    return request.put<DeepRequired<ResultVo>>(`/castors/update`, input, config);
}
