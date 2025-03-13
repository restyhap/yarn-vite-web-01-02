import request from "@/api/request";
import { type ResultVo, type DeepRequired, type PagePermissions } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /permissions/page
 */
export function getPermissionsPage(params: GetPermissionsPageParams, config?: AxiosRequestConfig) {
    const paramsInput = {
        ...params.page,
    };
    return request.get<DeepRequired<ResultVo>>(`/permissions/page`, {
        params: paramsInput,
        ...config,
    });
}

export interface GetPermissionsPageParams {
    page: PagePermissions;
}
