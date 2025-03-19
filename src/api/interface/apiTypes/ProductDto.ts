/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-03-12 10:48:42
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-03-18 17:35:06
 * @FilePath: /yarn-vite-web-01-02/src/api/interface/apiTypes/ProductDto.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { type Products, type Upholstery, type CartonDetails, type ProductionLogistics, type ProductDimensions, type SeatInnerComponents, type SeatOuterComponents, type BackInnerComponents, type BackOuterComponents, type Arms, type FoamDetails, type Castors, type Bases, type GasLift, type GasLiftCover, type Mechanism, type Fittings, type ProductImages } from "../../interface";

export interface ProductDto {
    products?: Products;
    upholstery?: Upholstery;
    cartonDetails?: CartonDetails;
    productionLogistics?: ProductionLogistics;
    productDimensions?: ProductDimensions;
    seatInnerComponents?: SeatInnerComponents;
    seatOuterComponents?: SeatOuterComponents;
    backInnerComponents?: BackInnerComponents;
    backOuterComponents?: BackOuterComponents;
    arms?: Arms;
    foamDetails?: FoamDetails;
    castors?: Castors;
    bases?: Bases;
    gasLift?: GasLift;
    gasLiftCover?: GasLiftCover;
    mechanism?: Mechanism;
    fittings?: Fittings;
    productImages?: ProductImages;
}
