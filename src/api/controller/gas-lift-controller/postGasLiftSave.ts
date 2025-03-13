import request from "@/api/request";
import { type ResultVo, type DeepRequired, type GasLift } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /gasLift/save
 */
export function postGasLiftSave(input: GasLift, config?: AxiosRequestConfig) {
    return request.post<DeepRequired<ResultVo>>(`/gasLift/save`, input, config);
}
