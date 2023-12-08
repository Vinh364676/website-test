export type ReviewState = {
    reviewList: Array<Review>;
    reviewDetail:Review
    reviewCount:number
};


export type Review = {
    id: number;
    productId: number;
    rating: string;
    comment:string;
    createdDt:string;
    userId:number
};