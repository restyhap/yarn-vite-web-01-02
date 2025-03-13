import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /gasLift/list
 */
export function getGasLiftList(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/gasLift/list`, config);
}
