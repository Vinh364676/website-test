export type HistoryState = {
    historyList: Array<History>;
    historyDetail:History
    historyCount:number
};

export type History = {
    id: number;
    deliverAddress: string;
    createDate:string;
    totalPrice:number;
    voucherId:number | null;
    orderStatus:string;
    note:string
   
};