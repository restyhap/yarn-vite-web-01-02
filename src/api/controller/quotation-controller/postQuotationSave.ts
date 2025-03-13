import request from "@/api/request";
import { type ResultVo, type DeepRequired, type Quotation } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /quotation/save
 */
export function postQuotationSave(input: Quotation, config?: AxiosRequestConfig) {
    return request.post<DeepRequired<ResultVo>>(`/quotation/save`, input, config);
}
