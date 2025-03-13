import request from "@/api/request";
import { type ResultVo, type DeepRequired, type PageQuotation } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /quotation/page
 */
export function getQuotationPage(params: GetQuotationPageParams, config?: AxiosRequestConfig) {
    const paramsInput = {
        ...params.page,
    };
    return request.get<DeepRequired<ResultVo>>(`/quotation/page`, {
        params: paramsInput,
        ...config,
    });
}

export interface GetQuotationPageParams {
    page: PageQuotation;
}
