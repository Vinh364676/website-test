export type AddressState = {
    addressList: Array<Address>;
    addressDetail:Address
    addressCount:number
};


export type Address = {
    id: number;
    userId:number;
    ward: string;
    district: string;
    houseNumber:string;
    note:string;
    status:boolean;
    customerId:number;
    province:string;
    phoneNumber:string;
};