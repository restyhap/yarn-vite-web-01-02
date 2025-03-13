import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /productDto/delete/{id}
 */
export function deleteProductDtoDeleteById(params: DeleteProductDtoDeleteByIdParams, config?: AxiosRequestConfig) {
    return request.delete<DeepRequired<ResultVo>>(`/productDto/delete/${params.id}`, config);
}

export interface DeleteProductDtoDeleteByIdParams {
    id: string;
}
