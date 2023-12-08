export type BrandState = {
    brandList: Array<Brand>;
    brandDetail:Brand
    brandCount:number
};


export type Brand = {
    idBrand: number;
    name: string;
    createdDT:string;
};