import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /gasLift/search
 */
export function getGasLiftSearch(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/gasLift/search`, config);
}
