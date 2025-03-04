/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface User {
  id?: string;
  username?: string;
  password?: string;
  realName?: string;
  email?: string;
  phone?: string;
  /** @format int32 */
  roleType?: number;
  /** @format int32 */
  status?: number;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface ResultVO {
  /** 状态码 */
  code?: string;
  /** 返回消息 */
  message?: string;
  /** 返回的数据 */
  data?: object;
}

export interface Upholstery {
  id?: string;
  productId?: string;
  fabricManufacturer?: string;
  colourCode?: string;
  leatherGrade?: string;
  usagePerChair?: number;
}

export interface SeatOuterComponents {
  id?: string;
  productId?: string;
  material?: string;
  dimensions?: string;
  manufacturerName?: string;
}

export interface SeatInnerComponents {
  id?: string;
  productId?: string;
  materialCode?: string;
  /** @format int32 */
  thickness?: number;
  /** @format int32 */
  layersCount?: number;
  dimensions?: string;
}

export interface Quotation {
  id?: string;
  image?: string;
  supplier?: string;
  supplierItemCode?: string;
  specificationDetails?: string;
  /** @format date-time */
  sampleLeadTime?: string;
  /** @format int32 */
  overallDimensionsWidth?: number;
  /** @format int32 */
  overallDimensionsDepth?: number;
  /** @format int32 */
  overallDimensionsHeight?: number;
  /** @format int32 */
  boxDimensionsWidth?: number;
  /** @format int32 */
  boxDimensionsDepth?: number;
  /** @format int32 */
  boxDimensionsHeight?: number;
  /** @format int32 */
  boxWeightNetWeighth?: number;
  netWeightGrossWeight?: string;
  effectiveVol?: string;
  /** @format int32 */
  loadingQty?: number;
  moq?: string;
  fobPrice?: number;
  /** @format int32 */
  currency?: number;
  /** @format int32 */
  bifmaTested?: number;
  /** @format int32 */
  cadBlockAvailable?: number;
  /** @format int32 */
  productDataAvailable?: number;
  /** @format int32 */
  productImagesAvailable?: number;
  salesContacts?: string;
  /** @format date-time */
  createTime?: string;
  validPeriod?: string;
  port?: string;
  remark?: string;
}

export interface QcReports {
  id?: string;
  modelCode?: string;
  factoryCode?: string;
  supplier?: string;
  client?: string;
  poNumber?: string;
  /** @format date-time */
  inspectionDate?: string;
  /** @format int32 */
  orderQty?: number;
  /** @format date-time */
  reportDate?: string;
  /** @format int32 */
  inspectQty?: number;
  qcOfficer?: string;
  passFail?: string;
  /** @format date-time */
  secondQcDate?: string;
  comments?: string;
  stocksInWarehouse?: string;
  samplingOfProductsQuantity?: string;
  shippingMarks?: string;
  barcode?: string;
  packingOutside?: string;
  packingInside?: string;
  chairComponentsPacked?: string;
  chairComponentsUnpacked?: string;
  fittingPackPacked?: string;
  fittingPackUnpacked?: string;
  productionLabel?: string;
  assemblyInstructions?: string;
  imageOfComponentsSeat?: string;
  imageOfComponentsBack?: string;
  imageOfComponentsBase?: string;
  imageOfComponentsCastors?: string;
  imageOfComponentsGasLiftCover?: string;
  imageOfComponentsGasLiftStamp?: string;
  imageOfComponentsArmrest?: string;
  imageOfComponentMechanism?: string;
  imageOfComponentsHeadrest?: string;
  imageOfProductBuiltFront?: string;
  imageOfProductBuiltSide?: string;
  imageOfProductBuiltBack?: string;
  imageOfProductBuilt45Degree?: string;
  frontImageOfProductBuiltCompare1?: string;
  frontImageOfProductBuiltCompare2?: string;
  functionCheckSeatHeightExtension?: string;
  functionCheckMechanismAdjustment?: string;
  functionCheckArmrestAdjustment?: string;
  functionCheckHeadrestAdjustment?: string;
  functionCheckOther1?: string;
  functionCheckOther2?: string;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface Products {
  id?: string;
  tccode?: string;
  supplier?: string;
  supplierCode?: string;
  supplierName?: string;
  fireStandard?: string;
  fob20ContainerPrice?: number;
  fob40ContainerPrice?: number;
  shippingPort?: string;
}

export interface ProductionLogistics {
  id?: string;
  productId?: string;
  /** @format int32 */
  productionTime?: number;
  effectiveVolume?: number;
  /** @format int32 */
  loadingQuantity20gp?: number;
  /** @format int32 */
  loadingQuantity40hc?: number;
  netWeight?: number;
  grossWeight?: number;
}

export interface ProductImages {
  id?: string;
  prodId?: string;
  frontImgPath?: string;
  sideImgPath?: string;
  backImgPath?: string;
  angleImgPath?: string;
}

export interface ProductDimensions {
  id?: string;
  productId?: string;
  /** @format int32 */
  seatWidth?: number;
  /** @format int32 */
  seatDepth?: number;
  /** @format int32 */
  seatHeightMin?: number;
  /** @format int32 */
  seatHeightMax?: number;
  /** @format int32 */
  backWidth?: number;
  /** @format int32 */
  backHeight?: number;
  /** @format int32 */
  backHeightFromSeat?: number;
  /** @format int32 */
  overallWidth?: number;
  /** @format int32 */
  overallDepth?: number;
  /** @format int32 */
  overallHeightMin?: number;
  /** @format int32 */
  overallHeightMax?: number;
}

export interface Permissions {
  id?: string;
  /** @format int32 */
  roleType?: number;
  /** @format int32 */
  prodView?: number;
  /** @format int32 */
  prodCreate?: number;
  /** @format int32 */
  prodEdit?: number;
  /** @format int32 */
  prodDelete?: number;
  /** @format int32 */
  specView?: number;
  /** @format int32 */
  specCreate?: number;
  /** @format int32 */
  specEdit?: number;
  /** @format int32 */
  specDelete?: number;
  /** @format int32 */
  quoteView?: number;
  /** @format int32 */
  quoteCreate?: number;
  /** @format int32 */
  quoteEdit?: number;
  /** @format int32 */
  quoteDelete?: number;
  /** @format int32 */
  settingsUsers?: number;
  /** @format int32 */
  settingsPermissions?: number;
}

export interface Mechanism {
  id?: string;
  productId?: string;
  description?: string;
  /** @format int32 */
  leversCount?: number;
  lockingPositions?: string;
  modelNo?: string;
  supplierName?: string;
}

export interface GasLiftCover {
  id?: string;
  productId?: string;
  description?: string;
  material?: string;
  colour?: string;
}

export interface GasLift {
  id?: string;
  productId?: string;
  description?: string;
  gasLiftClass?: string;
  /** @format int32 */
  casingLength?: number;
  /** @format int32 */
  extensionSize?: number;
  /** @format int32 */
  taper?: number;
}

export interface FoamDetails {
  id?: string;
  productId?: string;
  description?: string;
  /** @format int32 */
  seatDensity?: number;
  /** @format int32 */
  backDensity?: number;
  /** @format int32 */
  seatThickness?: number;
  /** @format int32 */
  backThickness?: number;
}

export interface Fittings {
  id?: string;
  productId?: string;
  /** @format int32 */
  fittingNumber?: number;
  description?: string;
  /** @format int32 */
  quantity?: number;
  material?: string;
}

export interface Defects {
  id?: string;
  reportId?: string;
  defectTitle?: string;
  defectDescription?: string;
  improvementSuggestion?: string;
  inspector?: string;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface DefectImages {
  id?: string;
  defectId?: string;
  imagePath?: string;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface Castors {
  id?: string;
  productId?: string;
  description?: string;
  /** @format int32 */
  pinThickness?: number;
  /** @format int32 */
  wheelDiameter?: number;
}

export interface CartonDetails {
  id?: string;
  productId?: string;
  /** @format int32 */
  width?: number;
  /** @format int32 */
  depth?: number;
  /** @format int32 */
  height?: number;
  boardType?: string;
  /** @format int32 */
  itemsPerCarton?: number;
  cartonVolume?: number;
}

export interface Bases {
  id?: string;
  productId?: string;
  description?: string;
  /** @format int32 */
  sizeDiameter?: number;
  material?: string;
  type?: string;
}

export interface BackOuterComponents {
  id?: string;
  productId?: string;
  material?: string;
  dimensions?: string;
  manufacturerName?: string;
}

export interface BackInnerComponents {
  id?: string;
  productId?: string;
  materialCode?: string;
  /** @format int32 */
  thickness?: number;
  /** @format int32 */
  layersCount?: number;
  dimensions?: string;
}

/** $!{table.comment} */
export interface Arms {
  id?: string;
  productId?: string;
  material?: string;
  type?: string;
  manufacturer?: string;
  description?: string;
  /** @format int32 */
  armHeightFromSeat?: number;
  /** @format int32 */
  armHeightFromFloor?: number;
}

export interface DefectsDTO {
  defects?: Defects;
  defectImages?: DefectImages[];
}

export interface QcReportsDTO {
  qcReports?: QcReports;
  defectsDTO?: DefectsDTO[];
}

export interface ProductDTO {
  products?: Products;
  upholstery?: Upholstery;
  cartonDetails?: CartonDetails;
  productionLogistics?: ProductionLogistics;
  productDimensions?: ProductDimensions;
  seatInnerComponents?: SeatInnerComponents;
  seatOuterComponents?: SeatOuterComponents;
  backInnerComponents?: BackInnerComponents;
  backOuterComponents?: BackOuterComponents;
  /** $!{table.comment} */
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

export interface PageUser {
  records?: User[];
  /** @format int64 */
  pageNumber?: number;
  /** @format int64 */
  pageSize?: number;
  /** @format int64 */
  totalPage?: number;
  /** @format int64 */
  totalRow?: number;
  optimizeCountQuery?: boolean;
}

export interface PageUpholstery {
  records?: Upholstery[];
  /** @format int64 */
  pageNumber?: number;
  /** @format int64 */
  pageSize?: number;
  /** @format int64 */
  totalPage?: number;
  /** @format int64 */
  totalRow?: number;
  optimizeCountQuery?: boolean;
}

export interface PageSeatOuterComponents {
  records?: SeatOuterComponents[];
  /** @format int64 */
  pageNumber?: number;
  /** @format int64 */
  pageSize?: number;
  /** @format int64 */
  totalPage?: number;
  /** @format int64 */
  totalRow?: number;
  optimizeCountQuery?: boolean;
}

export interface PageSeatInnerComponents {
  records?: SeatInnerComponents[];
  /** @format int64 */
  pageNumber?: number;
  /** @format int64 */
  pageSize?: number;
  /** @format int64 */
  totalPage?: number;
  /** @format int64 */
  totalRow?: number;
  optimizeCountQuery?: boolean;
}

export interface PageQuotation {
  records?: Quotation[];
  /** @format int64 */
  pageNumber?: number;
  /** @format int64 */
  pageSize?: number;
  /** @format int64 */
  totalPage?: number;
  /** @format int64 */
  totalRow?: number;
  optimizeCountQuery?: boolean;
}

export interface PageQcReports {
  records?: QcReports[];
  /** @format int64 */
  pageNumber?: number;
  /** @format int64 */
  pageSize?: number;
  /** @format int64 */
  totalPage?: number;
  /** @format int64 */
  totalRow?: number;
  optimizeCountQuery?: boolean;
}

export interface PageProducts {
  records?: Products[];
  /** @format int64 */
  pageNumber?: number;
  /** @format int64 */
  pageSize?: number;
  /** @format int64 */
  totalPage?: number;
  /** @format int64 */
  totalRow?: number;
  optimizeCountQuery?: boolean;
}

export interface PageProductionLogistics {
  records?: ProductionLogistics[];
  /** @format int64 */
  pageNumber?: number;
  /** @format int64 */
  pageSize?: number;
  /** @format int64 */
  totalPage?: number;
  /** @format int64 */
  totalRow?: number;
  optimizeCountQuery?: boolean;
}

export interface PageProductImages {
  records?: ProductImages[];
  /** @format int64 */
  pageNumber?: number;
  /** @format int64 */
  pageSize?: number;
  /** @format int64 */
  totalPage?: number;
  /** @format int64 */
  totalRow?: number;
  optimizeCountQuery?: boolean;
}

export interface PageProductDimensions {
  records?: ProductDimensions[];
  /** @format int64 */
  pageNumber?: number;
  /** @format int64 */
  pageSize?: number;
  /** @format int64 */
  totalPage?: number;
  /** @format int64 */
  totalRow?: number;
  optimizeCountQuery?: boolean;
}

export interface PagePermissions {
  records?: Permissions[];
  /** @format int64 */
  pageNumber?: number;
  /** @format int64 */
  pageSize?: number;
  /** @format int64 */
  totalPage?: number;
  /** @format int64 */
  totalRow?: number;
  optimizeCountQuery?: boolean;
}

export interface PageMechanism {
  records?: Mechanism[];
  /** @format int64 */
  pageNumber?: number;
  /** @format int64 */
  pageSize?: number;
  /** @format int64 */
  totalPage?: number;
  /** @format int64 */
  totalRow?: number;
  optimizeCountQuery?: boolean;
}

export interface PageGasLiftCover {
  records?: GasLiftCover[];
  /** @format int64 */
  pageNumber?: number;
  /** @format int64 */
  pageSize?: number;
  /** @format int64 */
  totalPage?: number;
  /** @format int64 */
  totalRow?: number;
  optimizeCountQuery?: boolean;
}

export interface PageGasLift {
  records?: GasLift[];
  /** @format int64 */
  pageNumber?: number;
  /** @format int64 */
  pageSize?: number;
  /** @format int64 */
  totalPage?: number;
  /** @format int64 */
  totalRow?: number;
  optimizeCountQuery?: boolean;
}

export interface PageFoamDetails {
  records?: FoamDetails[];
  /** @format int64 */
  pageNumber?: number;
  /** @format int64 */
  pageSize?: number;
  /** @format int64 */
  totalPage?: number;
  /** @format int64 */
  totalRow?: number;
  optimizeCountQuery?: boolean;
}

export interface PageFittings {
  records?: Fittings[];
  /** @format int64 */
  pageNumber?: number;
  /** @format int64 */
  pageSize?: number;
  /** @format int64 */
  totalPage?: number;
  /** @format int64 */
  totalRow?: number;
  optimizeCountQuery?: boolean;
}

export interface PageDefects {
  records?: Defects[];
  /** @format int64 */
  pageNumber?: number;
  /** @format int64 */
  pageSize?: number;
  /** @format int64 */
  totalPage?: number;
  /** @format int64 */
  totalRow?: number;
  optimizeCountQuery?: boolean;
}

export interface PageDefectImages {
  records?: DefectImages[];
  /** @format int64 */
  pageNumber?: number;
  /** @format int64 */
  pageSize?: number;
  /** @format int64 */
  totalPage?: number;
  /** @format int64 */
  totalRow?: number;
  optimizeCountQuery?: boolean;
}

export interface PageCastors {
  records?: Castors[];
  /** @format int64 */
  pageNumber?: number;
  /** @format int64 */
  pageSize?: number;
  /** @format int64 */
  totalPage?: number;
  /** @format int64 */
  totalRow?: number;
  optimizeCountQuery?: boolean;
}

export interface PageCartonDetails {
  records?: CartonDetails[];
  /** @format int64 */
  pageNumber?: number;
  /** @format int64 */
  pageSize?: number;
  /** @format int64 */
  totalPage?: number;
  /** @format int64 */
  totalRow?: number;
  optimizeCountQuery?: boolean;
}

export interface PageBases {
  records?: Bases[];
  /** @format int64 */
  pageNumber?: number;
  /** @format int64 */
  pageSize?: number;
  /** @format int64 */
  totalPage?: number;
  /** @format int64 */
  totalRow?: number;
  optimizeCountQuery?: boolean;
}

export interface PageBackOuterComponents {
  records?: BackOuterComponents[];
  /** @format int64 */
  pageNumber?: number;
  /** @format int64 */
  pageSize?: number;
  /** @format int64 */
  totalPage?: number;
  /** @format int64 */
  totalRow?: number;
  optimizeCountQuery?: boolean;
}

export interface PageBackInnerComponents {
  records?: BackInnerComponents[];
  /** @format int64 */
  pageNumber?: number;
  /** @format int64 */
  pageSize?: number;
  /** @format int64 */
  totalPage?: number;
  /** @format int64 */
  totalRow?: number;
  optimizeCountQuery?: boolean;
}

export interface PageArms {
  records?: Arms[];
  /** @format int64 */
  pageNumber?: number;
  /** @format int64 */
  pageSize?: number;
  /** @format int64 */
  totalPage?: number;
  /** @format int64 */
  totalRow?: number;
  optimizeCountQuery?: boolean;
}

export interface UploadPayload {
  /** @format binary */
  file: File;
}

export interface PageParams {
  page: PageUser;
}

export interface Page1Params {
  page: PageUpholstery;
}

export interface Page2Params {
  page: PageSeatOuterComponents;
}

export interface Page3Params {
  page: PageSeatInnerComponents;
}

export interface Page4Params {
  page: PageQuotation;
}

export interface Page5Params {
  page: PageQcReports;
}

export interface Page6Params {
  page: PageProducts;
}

export interface Page7Params {
  page: PageProductionLogistics;
}

export interface Page8Params {
  page: PageProductImages;
}

export interface Page9Params {
  page: PageProductDimensions;
}

export interface Page10Params {
  page: PagePermissions;
}

export interface Page11Params {
  page: PageMechanism;
}

export interface Page12Params {
  page: PageGasLiftCover;
}

export interface Page13Params {
  page: PageGasLift;
}

export interface Page14Params {
  page: PageFoamDetails;
}

export interface Page15Params {
  page: PageFittings;
}

export interface RemoveFileParams {
  filePath: string;
}

export interface Page16Params {
  page: PageDefects;
}

export interface Page17Params {
  page: PageDefectImages;
}

export interface Page18Params {
  page: PageCastors;
}

export interface Page19Params {
  page: PageCartonDetails;
}

export interface Page20Params {
  page: PageBases;
}

export interface Page21Params {
  page: PageBackOuterComponents;
}

export interface Page22Params {
  page: PageBackInnerComponents;
}

export interface Page23Params {
  page: PageArms;
}

export interface LoginParams {
  user: User;
}

export namespace UserController {
  /**
   * No description
   * @tags user-controller
   * @name Update
   * @request PUT:/user/update
   * @response `200` `ResultVO` OK
   */
  export namespace Update {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = User;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags user-controller
   * @name Save
   * @request POST:/user/save
   * @response `200` `ResultVO` OK
   */
  export namespace Save {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = User;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags user-controller
   * @name Search
   * @request GET:/user/search
   * @response `200` `ResultVO` OK
   */
  export namespace Search {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags user-controller
   * @name Page
   * @request GET:/user/page
   * @response `200` `ResultVO` OK
   */
  export namespace Page {
    export type RequestParams = {};
    export type RequestQuery = {
      page: PageUser;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags user-controller
   * @name List
   * @request GET:/user/list
   * @response `200` `ResultVO` OK
   */
  export namespace List {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags user-controller
   * @name GetInfo
   * @request GET:/user/getInfo/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace GetInfo {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags user-controller
   * @name Remove
   * @request DELETE:/user/remove/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace Remove {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags user-controller
   * @name Login
   * @request GET:/user/login
   * @response `200` `ResultVO` OK
   */
  export namespace Login {
    export type RequestParams = {};
    export type RequestQuery = {
      user: User;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags user-controller
   * @name Login3
   * @request PUT:/user/login
   * @response `200` `ResultVO` OK
   */
  export namespace Login3 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = User;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags user-controller
   * @name Login2
   * @request POST:/user/login
   * @response `200` `ResultVO` OK
   */
  export namespace Login2 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = User;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags user-controller
   * @name Login5
   * @request DELETE:/user/login
   * @response `200` `ResultVO` OK
   */
  export namespace Login5 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = User;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags user-controller
   * @name Login6
   * @request OPTIONS:/user/login
   * @response `200` `ResultVO` OK
   */
  export namespace Login6 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = User;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags user-controller
   * @name Login1
   * @request HEAD:/user/login
   * @response `200` `ResultVO` OK
   */
  export namespace Login1 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = User;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags user-controller
   * @name Login4
   * @request PATCH:/user/login
   * @response `200` `ResultVO` OK
   */
  export namespace Login4 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = User;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }
}

export namespace UpholsteryController {
  /**
   * No description
   * @tags upholstery-controller
   * @name Update1
   * @request PUT:/upholstery/update
   * @response `200` `ResultVO` OK
   */
  export namespace Update1 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = Upholstery;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags upholstery-controller
   * @name Save1
   * @request POST:/upholstery/save
   * @response `200` `ResultVO` OK
   */
  export namespace Save1 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = Upholstery;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags upholstery-controller
   * @name Search1
   * @request GET:/upholstery/search
   * @response `200` `ResultVO` OK
   */
  export namespace Search1 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags upholstery-controller
   * @name Page1
   * @request GET:/upholstery/page
   * @response `200` `ResultVO` OK
   */
  export namespace Page1 {
    export type RequestParams = {};
    export type RequestQuery = {
      page: PageUpholstery;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags upholstery-controller
   * @name List1
   * @request GET:/upholstery/list
   * @response `200` `ResultVO` OK
   */
  export namespace List1 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags upholstery-controller
   * @name GetInfo1
   * @request GET:/upholstery/getInfo/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace GetInfo1 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags upholstery-controller
   * @name Remove1
   * @request DELETE:/upholstery/remove/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace Remove1 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }
}

export namespace SeatOuterComponentsController {
  /**
   * No description
   * @tags seat-outer-components-controller
   * @name Update2
   * @request PUT:/seatOuterComponents/update
   * @response `200` `ResultVO` OK
   */
  export namespace Update2 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = SeatOuterComponents;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags seat-outer-components-controller
   * @name Save2
   * @request POST:/seatOuterComponents/save
   * @response `200` `ResultVO` OK
   */
  export namespace Save2 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = SeatOuterComponents;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags seat-outer-components-controller
   * @name Search2
   * @request GET:/seatOuterComponents/search
   * @response `200` `ResultVO` OK
   */
  export namespace Search2 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags seat-outer-components-controller
   * @name Page2
   * @request GET:/seatOuterComponents/page
   * @response `200` `ResultVO` OK
   */
  export namespace Page2 {
    export type RequestParams = {};
    export type RequestQuery = {
      page: PageSeatOuterComponents;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags seat-outer-components-controller
   * @name List2
   * @request GET:/seatOuterComponents/list
   * @response `200` `ResultVO` OK
   */
  export namespace List2 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags seat-outer-components-controller
   * @name GetInfo2
   * @request GET:/seatOuterComponents/getInfo/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace GetInfo2 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags seat-outer-components-controller
   * @name Remove2
   * @request DELETE:/seatOuterComponents/remove/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace Remove2 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }
}

export namespace SeatInnerComponentsController {
  /**
   * No description
   * @tags seat-inner-components-controller
   * @name Update3
   * @request PUT:/seatInnerComponents/update
   * @response `200` `ResultVO` OK
   */
  export namespace Update3 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = SeatInnerComponents;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags seat-inner-components-controller
   * @name Save3
   * @request POST:/seatInnerComponents/save
   * @response `200` `ResultVO` OK
   */
  export namespace Save3 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = SeatInnerComponents;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags seat-inner-components-controller
   * @name Search3
   * @request GET:/seatInnerComponents/search
   * @response `200` `ResultVO` OK
   */
  export namespace Search3 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags seat-inner-components-controller
   * @name Page3
   * @request GET:/seatInnerComponents/page
   * @response `200` `ResultVO` OK
   */
  export namespace Page3 {
    export type RequestParams = {};
    export type RequestQuery = {
      page: PageSeatInnerComponents;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags seat-inner-components-controller
   * @name List3
   * @request GET:/seatInnerComponents/list
   * @response `200` `ResultVO` OK
   */
  export namespace List3 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags seat-inner-components-controller
   * @name GetInfo3
   * @request GET:/seatInnerComponents/getInfo/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace GetInfo3 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags seat-inner-components-controller
   * @name Remove3
   * @request DELETE:/seatInnerComponents/remove/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace Remove3 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }
}

export namespace QuotationController {
  /**
   * No description
   * @tags quotation-controller
   * @name Update4
   * @request PUT:/quotation/update
   * @response `200` `ResultVO` OK
   */
  export namespace Update4 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = Quotation;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags quotation-controller
   * @name Save4
   * @request POST:/quotation/save
   * @response `200` `ResultVO` OK
   */
  export namespace Save4 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = Quotation;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags quotation-controller
   * @name Search4
   * @request GET:/quotation/search
   * @response `200` `ResultVO` OK
   */
  export namespace Search4 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags quotation-controller
   * @name Page4
   * @request GET:/quotation/page
   * @response `200` `ResultVO` OK
   */
  export namespace Page4 {
    export type RequestParams = {};
    export type RequestQuery = {
      page: PageQuotation;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags quotation-controller
   * @name List4
   * @request GET:/quotation/list
   * @response `200` `ResultVO` OK
   */
  export namespace List4 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags quotation-controller
   * @name GetInfo4
   * @request GET:/quotation/getInfo/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace GetInfo4 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags quotation-controller
   * @name Remove4
   * @request DELETE:/quotation/remove/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace Remove4 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }
}

export namespace QcReportsController {
  /**
   * No description
   * @tags qc-reports-controller
   * @name Update5
   * @request PUT:/qcReports/update
   * @response `200` `ResultVO` OK
   */
  export namespace Update5 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = QcReports;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags qc-reports-controller
   * @name Save6
   * @request POST:/qcReports/save
   * @response `200` `ResultVO` OK
   */
  export namespace Save6 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = QcReports;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags qc-reports-controller
   * @name Search5
   * @request GET:/qcReports/search
   * @response `200` `ResultVO` OK
   */
  export namespace Search5 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags qc-reports-controller
   * @name Page5
   * @request GET:/qcReports/page
   * @response `200` `ResultVO` OK
   */
  export namespace Page5 {
    export type RequestParams = {};
    export type RequestQuery = {
      page: PageQcReports;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags qc-reports-controller
   * @name List5
   * @request GET:/qcReports/list
   * @response `200` `ResultVO` OK
   */
  export namespace List5 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags qc-reports-controller
   * @name GetInfo5
   * @request GET:/qcReports/getInfo/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace GetInfo5 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags qc-reports-controller
   * @name Remove5
   * @request DELETE:/qcReports/remove/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace Remove5 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }
}

export namespace ProductsController {
  /**
   * No description
   * @tags products-controller
   * @name Update6
   * @request PUT:/products/update
   * @response `200` `ResultVO` OK
   */
  export namespace Update6 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = Products;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags products-controller
   * @name Save7
   * @request POST:/products/save
   * @response `200` `ResultVO` OK
   */
  export namespace Save7 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = Products;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags products-controller
   * @name Search6
   * @request GET:/products/search
   * @response `200` `ResultVO` OK
   */
  export namespace Search6 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags products-controller
   * @name Page6
   * @request GET:/products/page
   * @response `200` `ResultVO` OK
   */
  export namespace Page6 {
    export type RequestParams = {};
    export type RequestQuery = {
      page: PageProducts;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags products-controller
   * @name List6
   * @request GET:/products/list
   * @response `200` `ResultVO` OK
   */
  export namespace List6 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags products-controller
   * @name GetInfo6
   * @request GET:/products/getInfo/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace GetInfo6 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags products-controller
   * @name Remove6
   * @request DELETE:/products/remove/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace Remove6 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }
}

export namespace ProductionLogisticsController {
  /**
   * No description
   * @tags production-logistics-controller
   * @name Update7
   * @request PUT:/productionLogistics/update
   * @response `200` `ResultVO` OK
   */
  export namespace Update7 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ProductionLogistics;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags production-logistics-controller
   * @name Save8
   * @request POST:/productionLogistics/save
   * @response `200` `ResultVO` OK
   */
  export namespace Save8 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ProductionLogistics;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags production-logistics-controller
   * @name Search7
   * @request GET:/productionLogistics/search
   * @response `200` `ResultVO` OK
   */
  export namespace Search7 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags production-logistics-controller
   * @name Page7
   * @request GET:/productionLogistics/page
   * @response `200` `ResultVO` OK
   */
  export namespace Page7 {
    export type RequestParams = {};
    export type RequestQuery = {
      page: PageProductionLogistics;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags production-logistics-controller
   * @name List7
   * @request GET:/productionLogistics/list
   * @response `200` `ResultVO` OK
   */
  export namespace List7 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags production-logistics-controller
   * @name GetInfo7
   * @request GET:/productionLogistics/getInfo/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace GetInfo7 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags production-logistics-controller
   * @name Remove7
   * @request DELETE:/productionLogistics/remove/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace Remove7 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }
}

export namespace ProductImagesController {
  /**
   * No description
   * @tags product-images-controller
   * @name Update8
   * @request PUT:/productImages/update
   * @response `200` `ResultVO` OK
   */
  export namespace Update8 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ProductImages;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags product-images-controller
   * @name Save9
   * @request POST:/productImages/save
   * @response `200` `ResultVO` OK
   */
  export namespace Save9 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ProductImages;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags product-images-controller
   * @name Search8
   * @request GET:/productImages/search
   * @response `200` `ResultVO` OK
   */
  export namespace Search8 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags product-images-controller
   * @name Page8
   * @request GET:/productImages/page
   * @response `200` `ResultVO` OK
   */
  export namespace Page8 {
    export type RequestParams = {};
    export type RequestQuery = {
      page: PageProductImages;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags product-images-controller
   * @name List8
   * @request GET:/productImages/list
   * @response `200` `ResultVO` OK
   */
  export namespace List8 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags product-images-controller
   * @name GetInfo8
   * @request GET:/productImages/getInfo/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace GetInfo8 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags product-images-controller
   * @name Remove8
   * @request DELETE:/productImages/remove/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace Remove8 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }
}

export namespace ProductDimensionsController {
  /**
   * No description
   * @tags product-dimensions-controller
   * @name Update9
   * @request PUT:/productDimensions/update
   * @response `200` `ResultVO` OK
   */
  export namespace Update9 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ProductDimensions;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags product-dimensions-controller
   * @name Save11
   * @request POST:/productDimensions/save
   * @response `200` `ResultVO` OK
   */
  export namespace Save11 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ProductDimensions;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags product-dimensions-controller
   * @name Search9
   * @request GET:/productDimensions/search
   * @response `200` `ResultVO` OK
   */
  export namespace Search9 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags product-dimensions-controller
   * @name Page9
   * @request GET:/productDimensions/page
   * @response `200` `ResultVO` OK
   */
  export namespace Page9 {
    export type RequestParams = {};
    export type RequestQuery = {
      page: PageProductDimensions;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags product-dimensions-controller
   * @name List9
   * @request GET:/productDimensions/list
   * @response `200` `ResultVO` OK
   */
  export namespace List9 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags product-dimensions-controller
   * @name GetInfo9
   * @request GET:/productDimensions/getInfo/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace GetInfo9 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags product-dimensions-controller
   * @name Remove9
   * @request DELETE:/productDimensions/remove/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace Remove9 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }
}

export namespace PermissionsController {
  /**
   * No description
   * @tags permissions-controller
   * @name Update10
   * @request PUT:/permissions/update
   * @response `200` `ResultVO` OK
   */
  export namespace Update10 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = Permissions;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags permissions-controller
   * @name Save12
   * @request POST:/permissions/save
   * @response `200` `ResultVO` OK
   */
  export namespace Save12 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = Permissions;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags permissions-controller
   * @name Search10
   * @request GET:/permissions/search
   * @response `200` `ResultVO` OK
   */
  export namespace Search10 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags permissions-controller
   * @name Page10
   * @request GET:/permissions/page
   * @response `200` `ResultVO` OK
   */
  export namespace Page10 {
    export type RequestParams = {};
    export type RequestQuery = {
      page: PagePermissions;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags permissions-controller
   * @name List10
   * @request GET:/permissions/list
   * @response `200` `ResultVO` OK
   */
  export namespace List10 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags permissions-controller
   * @name GetInfo10
   * @request GET:/permissions/getInfo/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace GetInfo10 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags permissions-controller
   * @name Remove10
   * @request DELETE:/permissions/remove/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace Remove10 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }
}

export namespace MechanismController {
  /**
   * No description
   * @tags mechanism-controller
   * @name Update11
   * @request PUT:/mechanism/update
   * @response `200` `ResultVO` OK
   */
  export namespace Update11 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = Mechanism;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags mechanism-controller
   * @name Save13
   * @request POST:/mechanism/save
   * @response `200` `ResultVO` OK
   */
  export namespace Save13 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = Mechanism;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags mechanism-controller
   * @name Search11
   * @request GET:/mechanism/search
   * @response `200` `ResultVO` OK
   */
  export namespace Search11 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags mechanism-controller
   * @name Page11
   * @request GET:/mechanism/page
   * @response `200` `ResultVO` OK
   */
  export namespace Page11 {
    export type RequestParams = {};
    export type RequestQuery = {
      page: PageMechanism;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags mechanism-controller
   * @name List11
   * @request GET:/mechanism/list
   * @response `200` `ResultVO` OK
   */
  export namespace List11 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags mechanism-controller
   * @name GetInfo11
   * @request GET:/mechanism/getInfo/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace GetInfo11 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags mechanism-controller
   * @name Remove11
   * @request DELETE:/mechanism/remove/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace Remove11 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }
}

export namespace GasLiftCoverController {
  /**
   * No description
   * @tags gas-lift-cover-controller
   * @name Update12
   * @request PUT:/gasLiftCover/update
   * @response `200` `ResultVO` OK
   */
  export namespace Update12 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = GasLiftCover;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags gas-lift-cover-controller
   * @name Save14
   * @request POST:/gasLiftCover/save
   * @response `200` `ResultVO` OK
   */
  export namespace Save14 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = GasLiftCover;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags gas-lift-cover-controller
   * @name Search12
   * @request GET:/gasLiftCover/search
   * @response `200` `ResultVO` OK
   */
  export namespace Search12 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags gas-lift-cover-controller
   * @name Page12
   * @request GET:/gasLiftCover/page
   * @response `200` `ResultVO` OK
   */
  export namespace Page12 {
    export type RequestParams = {};
    export type RequestQuery = {
      page: PageGasLiftCover;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags gas-lift-cover-controller
   * @name List12
   * @request GET:/gasLiftCover/list
   * @response `200` `ResultVO` OK
   */
  export namespace List12 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags gas-lift-cover-controller
   * @name GetInfo12
   * @request GET:/gasLiftCover/getInfo/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace GetInfo12 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags gas-lift-cover-controller
   * @name Remove12
   * @request DELETE:/gasLiftCover/remove/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace Remove12 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }
}

export namespace GasLiftController {
  /**
   * No description
   * @tags gas-lift-controller
   * @name Update13
   * @request PUT:/gasLift/update
   * @response `200` `ResultVO` OK
   */
  export namespace Update13 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = GasLift;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags gas-lift-controller
   * @name Save15
   * @request POST:/gasLift/save
   * @response `200` `ResultVO` OK
   */
  export namespace Save15 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = GasLift;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags gas-lift-controller
   * @name Search13
   * @request GET:/gasLift/search
   * @response `200` `ResultVO` OK
   */
  export namespace Search13 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags gas-lift-controller
   * @name Page13
   * @request GET:/gasLift/page
   * @response `200` `ResultVO` OK
   */
  export namespace Page13 {
    export type RequestParams = {};
    export type RequestQuery = {
      page: PageGasLift;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags gas-lift-controller
   * @name List13
   * @request GET:/gasLift/list
   * @response `200` `ResultVO` OK
   */
  export namespace List13 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags gas-lift-controller
   * @name GetInfo13
   * @request GET:/gasLift/getInfo/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace GetInfo13 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags gas-lift-controller
   * @name Remove13
   * @request DELETE:/gasLift/remove/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace Remove13 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }
}

export namespace FoamDetailsController {
  /**
   * No description
   * @tags foam-details-controller
   * @name Update14
   * @request PUT:/foamDetails/update
   * @response `200` `ResultVO` OK
   */
  export namespace Update14 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = FoamDetails;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags foam-details-controller
   * @name Save16
   * @request POST:/foamDetails/save
   * @response `200` `ResultVO` OK
   */
  export namespace Save16 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = FoamDetails;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags foam-details-controller
   * @name Search14
   * @request GET:/foamDetails/search
   * @response `200` `ResultVO` OK
   */
  export namespace Search14 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags foam-details-controller
   * @name Page14
   * @request GET:/foamDetails/page
   * @response `200` `ResultVO` OK
   */
  export namespace Page14 {
    export type RequestParams = {};
    export type RequestQuery = {
      page: PageFoamDetails;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags foam-details-controller
   * @name List14
   * @request GET:/foamDetails/list
   * @response `200` `ResultVO` OK
   */
  export namespace List14 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags foam-details-controller
   * @name GetInfo14
   * @request GET:/foamDetails/getInfo/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace GetInfo14 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags foam-details-controller
   * @name Remove14
   * @request DELETE:/foamDetails/remove/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace Remove14 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }
}

export namespace FittingsController {
  /**
   * No description
   * @tags fittings-controller
   * @name Update15
   * @request PUT:/fittings/update
   * @response `200` `ResultVO` OK
   */
  export namespace Update15 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = Fittings;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags fittings-controller
   * @name Save17
   * @request POST:/fittings/save
   * @response `200` `ResultVO` OK
   */
  export namespace Save17 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = Fittings;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags fittings-controller
   * @name Search15
   * @request GET:/fittings/search
   * @response `200` `ResultVO` OK
   */
  export namespace Search15 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags fittings-controller
   * @name Page15
   * @request GET:/fittings/page
   * @response `200` `ResultVO` OK
   */
  export namespace Page15 {
    export type RequestParams = {};
    export type RequestQuery = {
      page: PageFittings;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags fittings-controller
   * @name List15
   * @request GET:/fittings/list
   * @response `200` `ResultVO` OK
   */
  export namespace List15 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags fittings-controller
   * @name GetInfo15
   * @request GET:/fittings/getInfo/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace GetInfo15 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags fittings-controller
   * @name Remove15
   * @request DELETE:/fittings/remove/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace Remove15 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }
}

export namespace DefectsController {
  /**
   * No description
   * @tags defects-controller
   * @name Update16
   * @request PUT:/defects/update
   * @response `200` `ResultVO` OK
   */
  export namespace Update16 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = Defects;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags defects-controller
   * @name Save18
   * @request POST:/defects/save
   * @response `200` `ResultVO` OK
   */
  export namespace Save18 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = Defects;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags defects-controller
   * @name Search16
   * @request GET:/defects/search
   * @response `200` `ResultVO` OK
   */
  export namespace Search16 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags defects-controller
   * @name Page16
   * @request GET:/defects/page
   * @response `200` `ResultVO` OK
   */
  export namespace Page16 {
    export type RequestParams = {};
    export type RequestQuery = {
      page: PageDefects;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags defects-controller
   * @name List16
   * @request GET:/defects/list
   * @response `200` `ResultVO` OK
   */
  export namespace List16 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags defects-controller
   * @name GetInfoByReportId
   * @request GET:/defects/getInfoByReportId/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace GetInfoByReportId {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags defects-controller
   * @name GetInfo16
   * @request GET:/defects/getInfo/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace GetInfo16 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags defects-controller
   * @name Remove16
   * @request DELETE:/defects/remove/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace Remove16 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }
}

export namespace DefectImagesController {
  /**
   * No description
   * @tags defect-images-controller
   * @name Update17
   * @request PUT:/defectImages/update
   * @response `200` `ResultVO` OK
   */
  export namespace Update17 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = DefectImages;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags defect-images-controller
   * @name Save19
   * @request POST:/defectImages/save
   * @response `200` `ResultVO` OK
   */
  export namespace Save19 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = DefectImages;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags defect-images-controller
   * @name Search17
   * @request GET:/defectImages/search
   * @response `200` `ResultVO` OK
   */
  export namespace Search17 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags defect-images-controller
   * @name Page17
   * @request GET:/defectImages/page
   * @response `200` `ResultVO` OK
   */
  export namespace Page17 {
    export type RequestParams = {};
    export type RequestQuery = {
      page: PageDefectImages;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags defect-images-controller
   * @name List17
   * @request GET:/defectImages/list
   * @response `200` `ResultVO` OK
   */
  export namespace List17 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags defect-images-controller
   * @name GetInfo17
   * @request GET:/defectImages/getInfo/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace GetInfo17 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags defect-images-controller
   * @name Remove17
   * @request DELETE:/defectImages/remove/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace Remove17 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }
}

export namespace CastorsController {
  /**
   * No description
   * @tags castors-controller
   * @name Update18
   * @request PUT:/castors/update
   * @response `200` `ResultVO` OK
   */
  export namespace Update18 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = Castors;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags castors-controller
   * @name Save20
   * @request POST:/castors/save
   * @response `200` `ResultVO` OK
   */
  export namespace Save20 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = Castors;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags castors-controller
   * @name Search18
   * @request GET:/castors/search
   * @response `200` `ResultVO` OK
   */
  export namespace Search18 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags castors-controller
   * @name Page18
   * @request GET:/castors/page
   * @response `200` `ResultVO` OK
   */
  export namespace Page18 {
    export type RequestParams = {};
    export type RequestQuery = {
      page: PageCastors;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags castors-controller
   * @name List18
   * @request GET:/castors/list
   * @response `200` `ResultVO` OK
   */
  export namespace List18 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags castors-controller
   * @name GetInfo18
   * @request GET:/castors/getInfo/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace GetInfo18 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags castors-controller
   * @name Remove18
   * @request DELETE:/castors/remove/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace Remove18 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }
}

export namespace CartonDetailsController {
  /**
   * No description
   * @tags carton-details-controller
   * @name Update19
   * @request PUT:/cartonDetails/update
   * @response `200` `ResultVO` OK
   */
  export namespace Update19 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CartonDetails;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags carton-details-controller
   * @name Save21
   * @request POST:/cartonDetails/save
   * @response `200` `ResultVO` OK
   */
  export namespace Save21 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CartonDetails;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags carton-details-controller
   * @name Search19
   * @request GET:/cartonDetails/search
   * @response `200` `ResultVO` OK
   */
  export namespace Search19 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags carton-details-controller
   * @name Page19
   * @request GET:/cartonDetails/page
   * @response `200` `ResultVO` OK
   */
  export namespace Page19 {
    export type RequestParams = {};
    export type RequestQuery = {
      page: PageCartonDetails;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags carton-details-controller
   * @name List19
   * @request GET:/cartonDetails/list
   * @response `200` `ResultVO` OK
   */
  export namespace List19 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags carton-details-controller
   * @name GetInfo19
   * @request GET:/cartonDetails/getInfo/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace GetInfo19 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags carton-details-controller
   * @name Remove19
   * @request DELETE:/cartonDetails/remove/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace Remove19 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }
}

export namespace BasesController {
  /**
   * No description
   * @tags bases-controller
   * @name Update20
   * @request PUT:/bases/update
   * @response `200` `ResultVO` OK
   */
  export namespace Update20 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = Bases;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags bases-controller
   * @name Save22
   * @request POST:/bases/save
   * @response `200` `ResultVO` OK
   */
  export namespace Save22 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = Bases;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags bases-controller
   * @name Search20
   * @request GET:/bases/search
   * @response `200` `ResultVO` OK
   */
  export namespace Search20 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags bases-controller
   * @name Page20
   * @request GET:/bases/page
   * @response `200` `ResultVO` OK
   */
  export namespace Page20 {
    export type RequestParams = {};
    export type RequestQuery = {
      page: PageBases;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags bases-controller
   * @name List20
   * @request GET:/bases/list
   * @response `200` `ResultVO` OK
   */
  export namespace List20 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags bases-controller
   * @name GetInfo20
   * @request GET:/bases/getInfo/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace GetInfo20 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags bases-controller
   * @name Remove20
   * @request DELETE:/bases/remove/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace Remove20 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }
}

export namespace BackOuterComponentsController {
  /**
   * No description
   * @tags back-outer-components-controller
   * @name Update21
   * @request PUT:/backOuterComponents/update
   * @response `200` `ResultVO` OK
   */
  export namespace Update21 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = BackOuterComponents;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags back-outer-components-controller
   * @name Save23
   * @request POST:/backOuterComponents/save
   * @response `200` `ResultVO` OK
   */
  export namespace Save23 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = BackOuterComponents;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags back-outer-components-controller
   * @name Search21
   * @request GET:/backOuterComponents/search
   * @response `200` `ResultVO` OK
   */
  export namespace Search21 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags back-outer-components-controller
   * @name Page21
   * @request GET:/backOuterComponents/page
   * @response `200` `ResultVO` OK
   */
  export namespace Page21 {
    export type RequestParams = {};
    export type RequestQuery = {
      page: PageBackOuterComponents;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags back-outer-components-controller
   * @name List21
   * @request GET:/backOuterComponents/list
   * @response `200` `ResultVO` OK
   */
  export namespace List21 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags back-outer-components-controller
   * @name GetInfo21
   * @request GET:/backOuterComponents/getInfo/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace GetInfo21 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags back-outer-components-controller
   * @name Remove21
   * @request DELETE:/backOuterComponents/remove/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace Remove21 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }
}

export namespace BackInnerComponentsController {
  /**
   * No description
   * @tags back-inner-components-controller
   * @name Update22
   * @request PUT:/backInnerComponents/update
   * @response `200` `ResultVO` OK
   */
  export namespace Update22 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = BackInnerComponents;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags back-inner-components-controller
   * @name Save24
   * @request POST:/backInnerComponents/save
   * @response `200` `ResultVO` OK
   */
  export namespace Save24 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = BackInnerComponents;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags back-inner-components-controller
   * @name Search22
   * @request GET:/backInnerComponents/search
   * @response `200` `ResultVO` OK
   */
  export namespace Search22 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags back-inner-components-controller
   * @name Page22
   * @request GET:/backInnerComponents/page
   * @response `200` `ResultVO` OK
   */
  export namespace Page22 {
    export type RequestParams = {};
    export type RequestQuery = {
      page: PageBackInnerComponents;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags back-inner-components-controller
   * @name List22
   * @request GET:/backInnerComponents/list
   * @response `200` `ResultVO` OK
   */
  export namespace List22 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags back-inner-components-controller
   * @name GetInfo22
   * @request GET:/backInnerComponents/getInfo/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace GetInfo22 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags back-inner-components-controller
   * @name Remove22
   * @request DELETE:/backInnerComponents/remove/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace Remove22 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }
}

export namespace ArmsController {
  /**
   * No description
   * @tags arms-controller
   * @name Update23
   * @request PUT:/arms/update
   * @response `200` `ResultVO` OK
   */
  export namespace Update23 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = Arms;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags arms-controller
   * @name Save25
   * @request POST:/arms/save
   * @response `200` `ResultVO` OK
   */
  export namespace Save25 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = Arms;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags arms-controller
   * @name Search23
   * @summary 搜索扶手信息表
   * @request GET:/arms/search
   * @response `200` `ResultVO` OK
   */
  export namespace Search23 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags arms-controller
   * @name Page23
   * @request GET:/arms/page
   * @response `200` `ResultVO` OK
   */
  export namespace Page23 {
    export type RequestParams = {};
    export type RequestQuery = {
      page: PageArms;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags arms-controller
   * @name List23
   * @request GET:/arms/list
   * @response `200` `ResultVO` OK
   */
  export namespace List23 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags arms-controller
   * @name GetInfo23
   * @request GET:/arms/getInfo/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace GetInfo23 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags arms-controller
   * @name Remove23
   * @request DELETE:/arms/remove/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace Remove23 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }
}

export namespace QcReportsDtoController {
  /**
   * No description
   * @tags qc-reports-dto-controller
   * @name Save5
   * @request POST:/qcReportsDto/save
   * @response `200` `ResultVO` OK
   */
  export namespace Save5 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = QcReportsDTO;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags qc-reports-dto-controller
   * @name Get
   * @request GET:/qcReportsDto/get/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace Get {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags qc-reports-dto-controller
   * @name Delete
   * @request DELETE:/qcReportsDto/delete/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace Delete {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }
}

export namespace ProductDtoController {
  /**
   * No description
   * @tags product-dto-controller
   * @name Save10
   * @request POST:/productDto/save
   * @response `200` `ResultVO` OK
   */
  export namespace Save10 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ProductDTO;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags product-dto-controller
   * @name Get1
   * @request GET:/productDto/get/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace Get1 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags product-dto-controller
   * @name Delete1
   * @request DELETE:/productDto/delete/{id}
   * @response `200` `ResultVO` OK
   */
  export namespace Delete1 {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }
}

export namespace FileUploadController {
  /**
   * No description
   * @tags file-upload-controller
   * @name Upload
   * @request POST:/files/upload
   * @response `200` `ResultVO` OK
   */
  export namespace Upload {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = UploadPayload;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }

  /**
   * No description
   * @tags file-upload-controller
   * @name RemoveFile
   * @request GET:/files/remove
   * @response `200` `ResultVO` OK
   */
  export namespace RemoveFile {
    export type RequestParams = {};
    export type RequestQuery = {
      filePath: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ResultVO;
  }
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "http://localhost:8080" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title 标题
 * @version v1
 * @license Apache 2.0 (http://springdoc.org)
 * @baseUrl http://localhost:8080
 * @externalDocs https://springshop.wiki.github.org/docs
 * @contact
 *
 * 我的API文档
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  userController = {
    /**
     * No description
     *
     * @tags user-controller
     * @name Update
     * @request PUT:/user/update
     * @response `200` `ResultVO` OK
     */
    update: (data: User, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/user/update`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-controller
     * @name Save
     * @request POST:/user/save
     * @response `200` `ResultVO` OK
     */
    save: (data: User, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/user/save`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-controller
     * @name Search
     * @request GET:/user/search
     * @response `200` `ResultVO` OK
     */
    search: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/user/search`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-controller
     * @name Page
     * @request GET:/user/page
     * @response `200` `ResultVO` OK
     */
    page: (query: PageParams, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/user/page`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-controller
     * @name List
     * @request GET:/user/list
     * @response `200` `ResultVO` OK
     */
    list: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/user/list`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-controller
     * @name GetInfo
     * @request GET:/user/getInfo/{id}
     * @response `200` `ResultVO` OK
     */
    getInfo: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/user/getInfo/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-controller
     * @name Remove
     * @request DELETE:/user/remove/{id}
     * @response `200` `ResultVO` OK
     */
    remove: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/user/remove/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-controller
     * @name Login
     * @request GET:/user/login
     * @response `200` `ResultVO` OK
     */
    login: (query: LoginParams, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/user/login`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-controller
     * @name Login3
     * @request PUT:/user/login
     * @response `200` `ResultVO` OK
     */
    login3: (data: User, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/user/login`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-controller
     * @name Login2
     * @request POST:/user/login
     * @response `200` `ResultVO` OK
     */
    login2: (data: User, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/user/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-controller
     * @name Login5
     * @request DELETE:/user/login
     * @response `200` `ResultVO` OK
     */
    login5: (data: User, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/user/login`,
        method: "DELETE",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-controller
     * @name Login6
     * @request OPTIONS:/user/login
     * @response `200` `ResultVO` OK
     */
    login6: (data: User, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/user/login`,
        method: "OPTIONS",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-controller
     * @name Login1
     * @request HEAD:/user/login
     * @response `200` `ResultVO` OK
     */
    login1: (data: User, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/user/login`,
        method: "HEAD",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-controller
     * @name Login4
     * @request PATCH:/user/login
     * @response `200` `ResultVO` OK
     */
    login4: (data: User, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/user/login`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  };
  upholsteryController = {
    /**
     * No description
     *
     * @tags upholstery-controller
     * @name Update1
     * @request PUT:/upholstery/update
     * @response `200` `ResultVO` OK
     */
    update1: (data: Upholstery, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/upholstery/update`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags upholstery-controller
     * @name Save1
     * @request POST:/upholstery/save
     * @response `200` `ResultVO` OK
     */
    save1: (data: Upholstery, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/upholstery/save`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags upholstery-controller
     * @name Search1
     * @request GET:/upholstery/search
     * @response `200` `ResultVO` OK
     */
    search1: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/upholstery/search`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags upholstery-controller
     * @name Page1
     * @request GET:/upholstery/page
     * @response `200` `ResultVO` OK
     */
    page1: (query: Page1Params, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/upholstery/page`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags upholstery-controller
     * @name List1
     * @request GET:/upholstery/list
     * @response `200` `ResultVO` OK
     */
    list1: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/upholstery/list`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags upholstery-controller
     * @name GetInfo1
     * @request GET:/upholstery/getInfo/{id}
     * @response `200` `ResultVO` OK
     */
    getInfo1: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/upholstery/getInfo/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags upholstery-controller
     * @name Remove1
     * @request DELETE:/upholstery/remove/{id}
     * @response `200` `ResultVO` OK
     */
    remove1: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/upholstery/remove/${id}`,
        method: "DELETE",
        ...params,
      }),
  };
  seatOuterComponentsController = {
    /**
     * No description
     *
     * @tags seat-outer-components-controller
     * @name Update2
     * @request PUT:/seatOuterComponents/update
     * @response `200` `ResultVO` OK
     */
    update2: (data: SeatOuterComponents, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/seatOuterComponents/update`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags seat-outer-components-controller
     * @name Save2
     * @request POST:/seatOuterComponents/save
     * @response `200` `ResultVO` OK
     */
    save2: (data: SeatOuterComponents, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/seatOuterComponents/save`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags seat-outer-components-controller
     * @name Search2
     * @request GET:/seatOuterComponents/search
     * @response `200` `ResultVO` OK
     */
    search2: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/seatOuterComponents/search`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags seat-outer-components-controller
     * @name Page2
     * @request GET:/seatOuterComponents/page
     * @response `200` `ResultVO` OK
     */
    page2: (query: Page2Params, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/seatOuterComponents/page`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags seat-outer-components-controller
     * @name List2
     * @request GET:/seatOuterComponents/list
     * @response `200` `ResultVO` OK
     */
    list2: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/seatOuterComponents/list`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags seat-outer-components-controller
     * @name GetInfo2
     * @request GET:/seatOuterComponents/getInfo/{id}
     * @response `200` `ResultVO` OK
     */
    getInfo2: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/seatOuterComponents/getInfo/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags seat-outer-components-controller
     * @name Remove2
     * @request DELETE:/seatOuterComponents/remove/{id}
     * @response `200` `ResultVO` OK
     */
    remove2: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/seatOuterComponents/remove/${id}`,
        method: "DELETE",
        ...params,
      }),
  };
  seatInnerComponentsController = {
    /**
     * No description
     *
     * @tags seat-inner-components-controller
     * @name Update3
     * @request PUT:/seatInnerComponents/update
     * @response `200` `ResultVO` OK
     */
    update3: (data: SeatInnerComponents, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/seatInnerComponents/update`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags seat-inner-components-controller
     * @name Save3
     * @request POST:/seatInnerComponents/save
     * @response `200` `ResultVO` OK
     */
    save3: (data: SeatInnerComponents, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/seatInnerComponents/save`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags seat-inner-components-controller
     * @name Search3
     * @request GET:/seatInnerComponents/search
     * @response `200` `ResultVO` OK
     */
    search3: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/seatInnerComponents/search`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags seat-inner-components-controller
     * @name Page3
     * @request GET:/seatInnerComponents/page
     * @response `200` `ResultVO` OK
     */
    page3: (query: Page3Params, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/seatInnerComponents/page`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags seat-inner-components-controller
     * @name List3
     * @request GET:/seatInnerComponents/list
     * @response `200` `ResultVO` OK
     */
    list3: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/seatInnerComponents/list`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags seat-inner-components-controller
     * @name GetInfo3
     * @request GET:/seatInnerComponents/getInfo/{id}
     * @response `200` `ResultVO` OK
     */
    getInfo3: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/seatInnerComponents/getInfo/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags seat-inner-components-controller
     * @name Remove3
     * @request DELETE:/seatInnerComponents/remove/{id}
     * @response `200` `ResultVO` OK
     */
    remove3: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/seatInnerComponents/remove/${id}`,
        method: "DELETE",
        ...params,
      }),
  };
  quotationController = {
    /**
     * No description
     *
     * @tags quotation-controller
     * @name Update4
     * @request PUT:/quotation/update
     * @response `200` `ResultVO` OK
     */
    update4: (data: Quotation, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/quotation/update`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags quotation-controller
     * @name Save4
     * @request POST:/quotation/save
     * @response `200` `ResultVO` OK
     */
    save4: (data: Quotation, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/quotation/save`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags quotation-controller
     * @name Search4
     * @request GET:/quotation/search
     * @response `200` `ResultVO` OK
     */
    search4: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/quotation/search`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags quotation-controller
     * @name Page4
     * @request GET:/quotation/page
     * @response `200` `ResultVO` OK
     */
    page4: (query: Page4Params, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/quotation/page`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags quotation-controller
     * @name List4
     * @request GET:/quotation/list
     * @response `200` `ResultVO` OK
     */
    list4: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/quotation/list`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags quotation-controller
     * @name GetInfo4
     * @request GET:/quotation/getInfo/{id}
     * @response `200` `ResultVO` OK
     */
    getInfo4: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/quotation/getInfo/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags quotation-controller
     * @name Remove4
     * @request DELETE:/quotation/remove/{id}
     * @response `200` `ResultVO` OK
     */
    remove4: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/quotation/remove/${id}`,
        method: "DELETE",
        ...params,
      }),
  };
  qcReportsController = {
    /**
     * No description
     *
     * @tags qc-reports-controller
     * @name Update5
     * @request PUT:/qcReports/update
     * @response `200` `ResultVO` OK
     */
    update5: (data: QcReports, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/qcReports/update`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags qc-reports-controller
     * @name Save6
     * @request POST:/qcReports/save
     * @response `200` `ResultVO` OK
     */
    save6: (data: QcReports, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/qcReports/save`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags qc-reports-controller
     * @name Search5
     * @request GET:/qcReports/search
     * @response `200` `ResultVO` OK
     */
    search5: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/qcReports/search`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags qc-reports-controller
     * @name Page5
     * @request GET:/qcReports/page
     * @response `200` `ResultVO` OK
     */
    page5: (query: Page5Params, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/qcReports/page`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags qc-reports-controller
     * @name List5
     * @request GET:/qcReports/list
     * @response `200` `ResultVO` OK
     */
    list5: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/qcReports/list`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags qc-reports-controller
     * @name GetInfo5
     * @request GET:/qcReports/getInfo/{id}
     * @response `200` `ResultVO` OK
     */
    getInfo5: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/qcReports/getInfo/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags qc-reports-controller
     * @name Remove5
     * @request DELETE:/qcReports/remove/{id}
     * @response `200` `ResultVO` OK
     */
    remove5: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/qcReports/remove/${id}`,
        method: "DELETE",
        ...params,
      }),
  };
  productsController = {
    /**
     * No description
     *
     * @tags products-controller
     * @name Update6
     * @request PUT:/products/update
     * @response `200` `ResultVO` OK
     */
    update6: (data: Products, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/products/update`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags products-controller
     * @name Save7
     * @request POST:/products/save
     * @response `200` `ResultVO` OK
     */
    save7: (data: Products, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/products/save`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags products-controller
     * @name Search6
     * @request GET:/products/search
     * @response `200` `ResultVO` OK
     */
    search6: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/products/search`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags products-controller
     * @name Page6
     * @request GET:/products/page
     * @response `200` `ResultVO` OK
     */
    page6: (query: Page6Params, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/products/page`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags products-controller
     * @name List6
     * @request GET:/products/list
     * @response `200` `ResultVO` OK
     */
    list6: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/products/list`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags products-controller
     * @name GetInfo6
     * @request GET:/products/getInfo/{id}
     * @response `200` `ResultVO` OK
     */
    getInfo6: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/products/getInfo/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags products-controller
     * @name Remove6
     * @request DELETE:/products/remove/{id}
     * @response `200` `ResultVO` OK
     */
    remove6: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/products/remove/${id}`,
        method: "DELETE",
        ...params,
      }),
  };
  productionLogisticsController = {
    /**
     * No description
     *
     * @tags production-logistics-controller
     * @name Update7
     * @request PUT:/productionLogistics/update
     * @response `200` `ResultVO` OK
     */
    update7: (data: ProductionLogistics, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/productionLogistics/update`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags production-logistics-controller
     * @name Save8
     * @request POST:/productionLogistics/save
     * @response `200` `ResultVO` OK
     */
    save8: (data: ProductionLogistics, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/productionLogistics/save`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags production-logistics-controller
     * @name Search7
     * @request GET:/productionLogistics/search
     * @response `200` `ResultVO` OK
     */
    search7: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/productionLogistics/search`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags production-logistics-controller
     * @name Page7
     * @request GET:/productionLogistics/page
     * @response `200` `ResultVO` OK
     */
    page7: (query: Page7Params, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/productionLogistics/page`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags production-logistics-controller
     * @name List7
     * @request GET:/productionLogistics/list
     * @response `200` `ResultVO` OK
     */
    list7: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/productionLogistics/list`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags production-logistics-controller
     * @name GetInfo7
     * @request GET:/productionLogistics/getInfo/{id}
     * @response `200` `ResultVO` OK
     */
    getInfo7: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/productionLogistics/getInfo/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags production-logistics-controller
     * @name Remove7
     * @request DELETE:/productionLogistics/remove/{id}
     * @response `200` `ResultVO` OK
     */
    remove7: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/productionLogistics/remove/${id}`,
        method: "DELETE",
        ...params,
      }),
  };
  productImagesController = {
    /**
     * No description
     *
     * @tags product-images-controller
     * @name Update8
     * @request PUT:/productImages/update
     * @response `200` `ResultVO` OK
     */
    update8: (data: ProductImages, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/productImages/update`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags product-images-controller
     * @name Save9
     * @request POST:/productImages/save
     * @response `200` `ResultVO` OK
     */
    save9: (data: ProductImages, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/productImages/save`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags product-images-controller
     * @name Search8
     * @request GET:/productImages/search
     * @response `200` `ResultVO` OK
     */
    search8: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/productImages/search`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags product-images-controller
     * @name Page8
     * @request GET:/productImages/page
     * @response `200` `ResultVO` OK
     */
    page8: (query: Page8Params, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/productImages/page`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags product-images-controller
     * @name List8
     * @request GET:/productImages/list
     * @response `200` `ResultVO` OK
     */
    list8: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/productImages/list`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags product-images-controller
     * @name GetInfo8
     * @request GET:/productImages/getInfo/{id}
     * @response `200` `ResultVO` OK
     */
    getInfo8: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/productImages/getInfo/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags product-images-controller
     * @name Remove8
     * @request DELETE:/productImages/remove/{id}
     * @response `200` `ResultVO` OK
     */
    remove8: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/productImages/remove/${id}`,
        method: "DELETE",
        ...params,
      }),
  };
  productDimensionsController = {
    /**
     * No description
     *
     * @tags product-dimensions-controller
     * @name Update9
     * @request PUT:/productDimensions/update
     * @response `200` `ResultVO` OK
     */
    update9: (data: ProductDimensions, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/productDimensions/update`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags product-dimensions-controller
     * @name Save11
     * @request POST:/productDimensions/save
     * @response `200` `ResultVO` OK
     */
    save11: (data: ProductDimensions, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/productDimensions/save`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags product-dimensions-controller
     * @name Search9
     * @request GET:/productDimensions/search
     * @response `200` `ResultVO` OK
     */
    search9: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/productDimensions/search`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags product-dimensions-controller
     * @name Page9
     * @request GET:/productDimensions/page
     * @response `200` `ResultVO` OK
     */
    page9: (query: Page9Params, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/productDimensions/page`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags product-dimensions-controller
     * @name List9
     * @request GET:/productDimensions/list
     * @response `200` `ResultVO` OK
     */
    list9: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/productDimensions/list`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags product-dimensions-controller
     * @name GetInfo9
     * @request GET:/productDimensions/getInfo/{id}
     * @response `200` `ResultVO` OK
     */
    getInfo9: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/productDimensions/getInfo/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags product-dimensions-controller
     * @name Remove9
     * @request DELETE:/productDimensions/remove/{id}
     * @response `200` `ResultVO` OK
     */
    remove9: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/productDimensions/remove/${id}`,
        method: "DELETE",
        ...params,
      }),
  };
  permissionsController = {
    /**
     * No description
     *
     * @tags permissions-controller
     * @name Update10
     * @request PUT:/permissions/update
     * @response `200` `ResultVO` OK
     */
    update10: (data: Permissions, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/permissions/update`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags permissions-controller
     * @name Save12
     * @request POST:/permissions/save
     * @response `200` `ResultVO` OK
     */
    save12: (data: Permissions, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/permissions/save`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags permissions-controller
     * @name Search10
     * @request GET:/permissions/search
     * @response `200` `ResultVO` OK
     */
    search10: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/permissions/search`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags permissions-controller
     * @name Page10
     * @request GET:/permissions/page
     * @response `200` `ResultVO` OK
     */
    page10: (query: Page10Params, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/permissions/page`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags permissions-controller
     * @name List10
     * @request GET:/permissions/list
     * @response `200` `ResultVO` OK
     */
    list10: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/permissions/list`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags permissions-controller
     * @name GetInfo10
     * @request GET:/permissions/getInfo/{id}
     * @response `200` `ResultVO` OK
     */
    getInfo10: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/permissions/getInfo/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags permissions-controller
     * @name Remove10
     * @request DELETE:/permissions/remove/{id}
     * @response `200` `ResultVO` OK
     */
    remove10: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/permissions/remove/${id}`,
        method: "DELETE",
        ...params,
      }),
  };
  mechanismController = {
    /**
     * No description
     *
     * @tags mechanism-controller
     * @name Update11
     * @request PUT:/mechanism/update
     * @response `200` `ResultVO` OK
     */
    update11: (data: Mechanism, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/mechanism/update`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags mechanism-controller
     * @name Save13
     * @request POST:/mechanism/save
     * @response `200` `ResultVO` OK
     */
    save13: (data: Mechanism, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/mechanism/save`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags mechanism-controller
     * @name Search11
     * @request GET:/mechanism/search
     * @response `200` `ResultVO` OK
     */
    search11: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/mechanism/search`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags mechanism-controller
     * @name Page11
     * @request GET:/mechanism/page
     * @response `200` `ResultVO` OK
     */
    page11: (query: Page11Params, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/mechanism/page`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags mechanism-controller
     * @name List11
     * @request GET:/mechanism/list
     * @response `200` `ResultVO` OK
     */
    list11: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/mechanism/list`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags mechanism-controller
     * @name GetInfo11
     * @request GET:/mechanism/getInfo/{id}
     * @response `200` `ResultVO` OK
     */
    getInfo11: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/mechanism/getInfo/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags mechanism-controller
     * @name Remove11
     * @request DELETE:/mechanism/remove/{id}
     * @response `200` `ResultVO` OK
     */
    remove11: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/mechanism/remove/${id}`,
        method: "DELETE",
        ...params,
      }),
  };
  gasLiftCoverController = {
    /**
     * No description
     *
     * @tags gas-lift-cover-controller
     * @name Update12
     * @request PUT:/gasLiftCover/update
     * @response `200` `ResultVO` OK
     */
    update12: (data: GasLiftCover, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/gasLiftCover/update`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags gas-lift-cover-controller
     * @name Save14
     * @request POST:/gasLiftCover/save
     * @response `200` `ResultVO` OK
     */
    save14: (data: GasLiftCover, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/gasLiftCover/save`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags gas-lift-cover-controller
     * @name Search12
     * @request GET:/gasLiftCover/search
     * @response `200` `ResultVO` OK
     */
    search12: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/gasLiftCover/search`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags gas-lift-cover-controller
     * @name Page12
     * @request GET:/gasLiftCover/page
     * @response `200` `ResultVO` OK
     */
    page12: (query: Page12Params, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/gasLiftCover/page`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags gas-lift-cover-controller
     * @name List12
     * @request GET:/gasLiftCover/list
     * @response `200` `ResultVO` OK
     */
    list12: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/gasLiftCover/list`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags gas-lift-cover-controller
     * @name GetInfo12
     * @request GET:/gasLiftCover/getInfo/{id}
     * @response `200` `ResultVO` OK
     */
    getInfo12: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/gasLiftCover/getInfo/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags gas-lift-cover-controller
     * @name Remove12
     * @request DELETE:/gasLiftCover/remove/{id}
     * @response `200` `ResultVO` OK
     */
    remove12: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/gasLiftCover/remove/${id}`,
        method: "DELETE",
        ...params,
      }),
  };
  gasLiftController = {
    /**
     * No description
     *
     * @tags gas-lift-controller
     * @name Update13
     * @request PUT:/gasLift/update
     * @response `200` `ResultVO` OK
     */
    update13: (data: GasLift, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/gasLift/update`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags gas-lift-controller
     * @name Save15
     * @request POST:/gasLift/save
     * @response `200` `ResultVO` OK
     */
    save15: (data: GasLift, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/gasLift/save`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags gas-lift-controller
     * @name Search13
     * @request GET:/gasLift/search
     * @response `200` `ResultVO` OK
     */
    search13: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/gasLift/search`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags gas-lift-controller
     * @name Page13
     * @request GET:/gasLift/page
     * @response `200` `ResultVO` OK
     */
    page13: (query: Page13Params, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/gasLift/page`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags gas-lift-controller
     * @name List13
     * @request GET:/gasLift/list
     * @response `200` `ResultVO` OK
     */
    list13: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/gasLift/list`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags gas-lift-controller
     * @name GetInfo13
     * @request GET:/gasLift/getInfo/{id}
     * @response `200` `ResultVO` OK
     */
    getInfo13: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/gasLift/getInfo/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags gas-lift-controller
     * @name Remove13
     * @request DELETE:/gasLift/remove/{id}
     * @response `200` `ResultVO` OK
     */
    remove13: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/gasLift/remove/${id}`,
        method: "DELETE",
        ...params,
      }),
  };
  foamDetailsController = {
    /**
     * No description
     *
     * @tags foam-details-controller
     * @name Update14
     * @request PUT:/foamDetails/update
     * @response `200` `ResultVO` OK
     */
    update14: (data: FoamDetails, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/foamDetails/update`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags foam-details-controller
     * @name Save16
     * @request POST:/foamDetails/save
     * @response `200` `ResultVO` OK
     */
    save16: (data: FoamDetails, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/foamDetails/save`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags foam-details-controller
     * @name Search14
     * @request GET:/foamDetails/search
     * @response `200` `ResultVO` OK
     */
    search14: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/foamDetails/search`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags foam-details-controller
     * @name Page14
     * @request GET:/foamDetails/page
     * @response `200` `ResultVO` OK
     */
    page14: (query: Page14Params, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/foamDetails/page`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags foam-details-controller
     * @name List14
     * @request GET:/foamDetails/list
     * @response `200` `ResultVO` OK
     */
    list14: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/foamDetails/list`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags foam-details-controller
     * @name GetInfo14
     * @request GET:/foamDetails/getInfo/{id}
     * @response `200` `ResultVO` OK
     */
    getInfo14: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/foamDetails/getInfo/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags foam-details-controller
     * @name Remove14
     * @request DELETE:/foamDetails/remove/{id}
     * @response `200` `ResultVO` OK
     */
    remove14: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/foamDetails/remove/${id}`,
        method: "DELETE",
        ...params,
      }),
  };
  fittingsController = {
    /**
     * No description
     *
     * @tags fittings-controller
     * @name Update15
     * @request PUT:/fittings/update
     * @response `200` `ResultVO` OK
     */
    update15: (data: Fittings, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/fittings/update`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags fittings-controller
     * @name Save17
     * @request POST:/fittings/save
     * @response `200` `ResultVO` OK
     */
    save17: (data: Fittings, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/fittings/save`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags fittings-controller
     * @name Search15
     * @request GET:/fittings/search
     * @response `200` `ResultVO` OK
     */
    search15: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/fittings/search`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags fittings-controller
     * @name Page15
     * @request GET:/fittings/page
     * @response `200` `ResultVO` OK
     */
    page15: (query: Page15Params, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/fittings/page`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags fittings-controller
     * @name List15
     * @request GET:/fittings/list
     * @response `200` `ResultVO` OK
     */
    list15: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/fittings/list`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags fittings-controller
     * @name GetInfo15
     * @request GET:/fittings/getInfo/{id}
     * @response `200` `ResultVO` OK
     */
    getInfo15: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/fittings/getInfo/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags fittings-controller
     * @name Remove15
     * @request DELETE:/fittings/remove/{id}
     * @response `200` `ResultVO` OK
     */
    remove15: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/fittings/remove/${id}`,
        method: "DELETE",
        ...params,
      }),
  };
  defectsController = {
    /**
     * No description
     *
     * @tags defects-controller
     * @name Update16
     * @request PUT:/defects/update
     * @response `200` `ResultVO` OK
     */
    update16: (data: Defects, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/defects/update`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags defects-controller
     * @name Save18
     * @request POST:/defects/save
     * @response `200` `ResultVO` OK
     */
    save18: (data: Defects, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/defects/save`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags defects-controller
     * @name Search16
     * @request GET:/defects/search
     * @response `200` `ResultVO` OK
     */
    search16: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/defects/search`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags defects-controller
     * @name Page16
     * @request GET:/defects/page
     * @response `200` `ResultVO` OK
     */
    page16: (query: Page16Params, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/defects/page`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags defects-controller
     * @name List16
     * @request GET:/defects/list
     * @response `200` `ResultVO` OK
     */
    list16: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/defects/list`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags defects-controller
     * @name GetInfoByReportId
     * @request GET:/defects/getInfoByReportId/{id}
     * @response `200` `ResultVO` OK
     */
    getInfoByReportId: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/defects/getInfoByReportId/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags defects-controller
     * @name GetInfo16
     * @request GET:/defects/getInfo/{id}
     * @response `200` `ResultVO` OK
     */
    getInfo16: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/defects/getInfo/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags defects-controller
     * @name Remove16
     * @request DELETE:/defects/remove/{id}
     * @response `200` `ResultVO` OK
     */
    remove16: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/defects/remove/${id}`,
        method: "DELETE",
        ...params,
      }),
  };
  defectImagesController = {
    /**
     * No description
     *
     * @tags defect-images-controller
     * @name Update17
     * @request PUT:/defectImages/update
     * @response `200` `ResultVO` OK
     */
    update17: (data: DefectImages, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/defectImages/update`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags defect-images-controller
     * @name Save19
     * @request POST:/defectImages/save
     * @response `200` `ResultVO` OK
     */
    save19: (data: DefectImages, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/defectImages/save`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags defect-images-controller
     * @name Search17
     * @request GET:/defectImages/search
     * @response `200` `ResultVO` OK
     */
    search17: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/defectImages/search`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags defect-images-controller
     * @name Page17
     * @request GET:/defectImages/page
     * @response `200` `ResultVO` OK
     */
    page17: (query: Page17Params, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/defectImages/page`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags defect-images-controller
     * @name List17
     * @request GET:/defectImages/list
     * @response `200` `ResultVO` OK
     */
    list17: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/defectImages/list`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags defect-images-controller
     * @name GetInfo17
     * @request GET:/defectImages/getInfo/{id}
     * @response `200` `ResultVO` OK
     */
    getInfo17: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/defectImages/getInfo/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags defect-images-controller
     * @name Remove17
     * @request DELETE:/defectImages/remove/{id}
     * @response `200` `ResultVO` OK
     */
    remove17: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/defectImages/remove/${id}`,
        method: "DELETE",
        ...params,
      }),
  };
  castorsController = {
    /**
     * No description
     *
     * @tags castors-controller
     * @name Update18
     * @request PUT:/castors/update
     * @response `200` `ResultVO` OK
     */
    update18: (data: Castors, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/castors/update`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags castors-controller
     * @name Save20
     * @request POST:/castors/save
     * @response `200` `ResultVO` OK
     */
    save20: (data: Castors, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/castors/save`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags castors-controller
     * @name Search18
     * @request GET:/castors/search
     * @response `200` `ResultVO` OK
     */
    search18: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/castors/search`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags castors-controller
     * @name Page18
     * @request GET:/castors/page
     * @response `200` `ResultVO` OK
     */
    page18: (query: Page18Params, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/castors/page`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags castors-controller
     * @name List18
     * @request GET:/castors/list
     * @response `200` `ResultVO` OK
     */
    list18: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/castors/list`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags castors-controller
     * @name GetInfo18
     * @request GET:/castors/getInfo/{id}
     * @response `200` `ResultVO` OK
     */
    getInfo18: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/castors/getInfo/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags castors-controller
     * @name Remove18
     * @request DELETE:/castors/remove/{id}
     * @response `200` `ResultVO` OK
     */
    remove18: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/castors/remove/${id}`,
        method: "DELETE",
        ...params,
      }),
  };
  cartonDetailsController = {
    /**
     * No description
     *
     * @tags carton-details-controller
     * @name Update19
     * @request PUT:/cartonDetails/update
     * @response `200` `ResultVO` OK
     */
    update19: (data: CartonDetails, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/cartonDetails/update`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags carton-details-controller
     * @name Save21
     * @request POST:/cartonDetails/save
     * @response `200` `ResultVO` OK
     */
    save21: (data: CartonDetails, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/cartonDetails/save`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags carton-details-controller
     * @name Search19
     * @request GET:/cartonDetails/search
     * @response `200` `ResultVO` OK
     */
    search19: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/cartonDetails/search`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags carton-details-controller
     * @name Page19
     * @request GET:/cartonDetails/page
     * @response `200` `ResultVO` OK
     */
    page19: (query: Page19Params, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/cartonDetails/page`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags carton-details-controller
     * @name List19
     * @request GET:/cartonDetails/list
     * @response `200` `ResultVO` OK
     */
    list19: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/cartonDetails/list`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags carton-details-controller
     * @name GetInfo19
     * @request GET:/cartonDetails/getInfo/{id}
     * @response `200` `ResultVO` OK
     */
    getInfo19: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/cartonDetails/getInfo/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags carton-details-controller
     * @name Remove19
     * @request DELETE:/cartonDetails/remove/{id}
     * @response `200` `ResultVO` OK
     */
    remove19: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/cartonDetails/remove/${id}`,
        method: "DELETE",
        ...params,
      }),
  };
  basesController = {
    /**
     * No description
     *
     * @tags bases-controller
     * @name Update20
     * @request PUT:/bases/update
     * @response `200` `ResultVO` OK
     */
    update20: (data: Bases, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/bases/update`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags bases-controller
     * @name Save22
     * @request POST:/bases/save
     * @response `200` `ResultVO` OK
     */
    save22: (data: Bases, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/bases/save`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags bases-controller
     * @name Search20
     * @request GET:/bases/search
     * @response `200` `ResultVO` OK
     */
    search20: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/bases/search`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags bases-controller
     * @name Page20
     * @request GET:/bases/page
     * @response `200` `ResultVO` OK
     */
    page20: (query: Page20Params, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/bases/page`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags bases-controller
     * @name List20
     * @request GET:/bases/list
     * @response `200` `ResultVO` OK
     */
    list20: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/bases/list`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags bases-controller
     * @name GetInfo20
     * @request GET:/bases/getInfo/{id}
     * @response `200` `ResultVO` OK
     */
    getInfo20: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/bases/getInfo/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags bases-controller
     * @name Remove20
     * @request DELETE:/bases/remove/{id}
     * @response `200` `ResultVO` OK
     */
    remove20: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/bases/remove/${id}`,
        method: "DELETE",
        ...params,
      }),
  };
  backOuterComponentsController = {
    /**
     * No description
     *
     * @tags back-outer-components-controller
     * @name Update21
     * @request PUT:/backOuterComponents/update
     * @response `200` `ResultVO` OK
     */
    update21: (data: BackOuterComponents, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/backOuterComponents/update`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags back-outer-components-controller
     * @name Save23
     * @request POST:/backOuterComponents/save
     * @response `200` `ResultVO` OK
     */
    save23: (data: BackOuterComponents, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/backOuterComponents/save`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags back-outer-components-controller
     * @name Search21
     * @request GET:/backOuterComponents/search
     * @response `200` `ResultVO` OK
     */
    search21: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/backOuterComponents/search`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags back-outer-components-controller
     * @name Page21
     * @request GET:/backOuterComponents/page
     * @response `200` `ResultVO` OK
     */
    page21: (query: Page21Params, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/backOuterComponents/page`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags back-outer-components-controller
     * @name List21
     * @request GET:/backOuterComponents/list
     * @response `200` `ResultVO` OK
     */
    list21: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/backOuterComponents/list`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags back-outer-components-controller
     * @name GetInfo21
     * @request GET:/backOuterComponents/getInfo/{id}
     * @response `200` `ResultVO` OK
     */
    getInfo21: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/backOuterComponents/getInfo/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags back-outer-components-controller
     * @name Remove21
     * @request DELETE:/backOuterComponents/remove/{id}
     * @response `200` `ResultVO` OK
     */
    remove21: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/backOuterComponents/remove/${id}`,
        method: "DELETE",
        ...params,
      }),
  };
  backInnerComponentsController = {
    /**
     * No description
     *
     * @tags back-inner-components-controller
     * @name Update22
     * @request PUT:/backInnerComponents/update
     * @response `200` `ResultVO` OK
     */
    update22: (data: BackInnerComponents, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/backInnerComponents/update`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags back-inner-components-controller
     * @name Save24
     * @request POST:/backInnerComponents/save
     * @response `200` `ResultVO` OK
     */
    save24: (data: BackInnerComponents, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/backInnerComponents/save`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags back-inner-components-controller
     * @name Search22
     * @request GET:/backInnerComponents/search
     * @response `200` `ResultVO` OK
     */
    search22: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/backInnerComponents/search`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags back-inner-components-controller
     * @name Page22
     * @request GET:/backInnerComponents/page
     * @response `200` `ResultVO` OK
     */
    page22: (query: Page22Params, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/backInnerComponents/page`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags back-inner-components-controller
     * @name List22
     * @request GET:/backInnerComponents/list
     * @response `200` `ResultVO` OK
     */
    list22: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/backInnerComponents/list`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags back-inner-components-controller
     * @name GetInfo22
     * @request GET:/backInnerComponents/getInfo/{id}
     * @response `200` `ResultVO` OK
     */
    getInfo22: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/backInnerComponents/getInfo/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags back-inner-components-controller
     * @name Remove22
     * @request DELETE:/backInnerComponents/remove/{id}
     * @response `200` `ResultVO` OK
     */
    remove22: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/backInnerComponents/remove/${id}`,
        method: "DELETE",
        ...params,
      }),
  };
  armsController = {
    /**
     * No description
     *
     * @tags arms-controller
     * @name Update23
     * @request PUT:/arms/update
     * @response `200` `ResultVO` OK
     */
    update23: (data: Arms, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/arms/update`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags arms-controller
     * @name Save25
     * @request POST:/arms/save
     * @response `200` `ResultVO` OK
     */
    save25: (data: Arms, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/arms/save`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags arms-controller
     * @name Search23
     * @summary 搜索扶手信息表
     * @request GET:/arms/search
     * @response `200` `ResultVO` OK
     */
    search23: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/arms/search`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags arms-controller
     * @name Page23
     * @request GET:/arms/page
     * @response `200` `ResultVO` OK
     */
    page23: (query: Page23Params, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/arms/page`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags arms-controller
     * @name List23
     * @request GET:/arms/list
     * @response `200` `ResultVO` OK
     */
    list23: (params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/arms/list`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags arms-controller
     * @name GetInfo23
     * @request GET:/arms/getInfo/{id}
     * @response `200` `ResultVO` OK
     */
    getInfo23: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/arms/getInfo/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags arms-controller
     * @name Remove23
     * @request DELETE:/arms/remove/{id}
     * @response `200` `ResultVO` OK
     */
    remove23: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/arms/remove/${id}`,
        method: "DELETE",
        ...params,
      }),
  };
  qcReportsDtoController = {
    /**
     * No description
     *
     * @tags qc-reports-dto-controller
     * @name Save5
     * @request POST:/qcReportsDto/save
     * @response `200` `ResultVO` OK
     */
    save5: (data: QcReportsDTO, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/qcReportsDto/save`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags qc-reports-dto-controller
     * @name Get
     * @request GET:/qcReportsDto/get/{id}
     * @response `200` `ResultVO` OK
     */
    get: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/qcReportsDto/get/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags qc-reports-dto-controller
     * @name Delete
     * @request DELETE:/qcReportsDto/delete/{id}
     * @response `200` `ResultVO` OK
     */
    delete: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/qcReportsDto/delete/${id}`,
        method: "DELETE",
        ...params,
      }),
  };
  productDtoController = {
    /**
     * No description
     *
     * @tags product-dto-controller
     * @name Save10
     * @request POST:/productDto/save
     * @response `200` `ResultVO` OK
     */
    save10: (data: ProductDTO, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/productDto/save`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags product-dto-controller
     * @name Get1
     * @request GET:/productDto/get/{id}
     * @response `200` `ResultVO` OK
     */
    get1: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/productDto/get/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags product-dto-controller
     * @name Delete1
     * @request DELETE:/productDto/delete/{id}
     * @response `200` `ResultVO` OK
     */
    delete1: (id: string, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/productDto/delete/${id}`,
        method: "DELETE",
        ...params,
      }),
  };
  fileUploadController = {
    /**
     * No description
     *
     * @tags file-upload-controller
     * @name Upload
     * @request POST:/files/upload
     * @response `200` `ResultVO` OK
     */
    upload: (data: UploadPayload, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/files/upload`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * No description
     *
     * @tags file-upload-controller
     * @name RemoveFile
     * @request GET:/files/remove
     * @response `200` `ResultVO` OK
     */
    removeFile: (query: RemoveFileParams, params: RequestParams = {}) =>
      this.request<ResultVO, any>({
        path: `/files/remove`,
        method: "GET",
        query: query,
        ...params,
      }),
  };
}
