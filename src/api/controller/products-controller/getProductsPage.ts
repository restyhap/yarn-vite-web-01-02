import request from "@/api/request";
import { type ResultVo, type DeepRequired, type PageProducts } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /products/page
 */
export function getProductsPage(params: GetProductsPageParams, config?: AxiosRequestConfig) {
    const paramsInput = {
        ...params.page,
    };
    return request.get<DeepRequired<ResultVo>>(`/products/page`, {
        params: paramsInput,
        ...config,
    });
}

export interface GetProductsPageParams {
    page: PageProducts;
}
