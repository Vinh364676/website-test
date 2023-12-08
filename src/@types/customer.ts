export type CustomerState = {
    customerList: Array<Customer>;
    customerDetail:Customer
    customerCount:number
};


export type Customer = {
    id: number;
    fullName: string;
};