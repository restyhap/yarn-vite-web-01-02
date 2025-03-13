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
