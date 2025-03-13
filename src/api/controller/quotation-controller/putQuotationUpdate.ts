import request from "@/api/request";
import { type ResultVo, type DeepRequired, type Quotation } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /quotation/update
 */
export function putQuotationUpdate(input: Quotation, config?: AxiosRequestConfig) {
    return request.put<DeepRequired<ResultVo>>(`/quotation/update`, input, config);
}
