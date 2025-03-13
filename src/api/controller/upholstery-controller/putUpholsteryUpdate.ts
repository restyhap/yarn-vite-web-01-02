import request from "@/api/request";
import { type ResultVo, type DeepRequired, type Upholstery } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /upholstery/update
 */
export function putUpholsteryUpdate(input: Upholstery, config?: AxiosRequestConfig) {
    return request.put<DeepRequired<ResultVo>>(`/upholstery/update`, input, config);
}
