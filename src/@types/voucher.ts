export type VoucherState = {
    voucherList: Array<Voucher>;
};


export type Voucher = {
    id: number;
    code: string;
    value:number;
    startDate:string;
    endDate:string;
};