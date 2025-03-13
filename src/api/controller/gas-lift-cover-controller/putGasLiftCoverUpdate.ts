import request from "@/api/request";
import { type ResultVo, type DeepRequired, type GasLiftCover } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /gasLiftCover/update
 */
export function putGasLiftCoverUpdate(input: GasLiftCover, config?: AxiosRequestConfig) {
    return request.put<DeepRequired<ResultVo>>(`/gasLiftCover/update`, input, config);
}
