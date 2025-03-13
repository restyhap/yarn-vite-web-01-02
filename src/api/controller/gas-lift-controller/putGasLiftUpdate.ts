import request from "@/api/request";
import { type ResultVo, type DeepRequired, type GasLift } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /gasLift/update
 */
export function putGasLiftUpdate(input: GasLift, config?: AxiosRequestConfig) {
    return request.put<DeepRequired<ResultVo>>(`/gasLift/update`, input, config);
}
