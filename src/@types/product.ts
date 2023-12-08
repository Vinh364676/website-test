export type ProductState = {
    productCount?: number;
    productList:Array<Product>;
    productDetail:Product

};

export type Product ={
    productId:number,
    productName:string,
    price:number,
    quantity:number,
    brandId:number,
    categoryId:number,
    img:string,
    thumnail:string,
    size:string,
    color:string,
    description:string,
    code:string,
    gender:string,
    status:string,
    createdDT:string,
    accessoryId:number

}
