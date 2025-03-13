import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /products/remove/{id}
 */
export function deleteProductsRemoveById(params: DeleteProductsRemoveByIdParams, config?: AxiosRequestConfig) {
    return request.delete<DeepRequired<ResultVo>>(`/products/remove/${params.id}`, config);
}

export interface DeleteProductsRemoveByIdParams {
    id: string;
}
