export type BillState = {
    billList: Array<Bill>;
    billDetail: Bill | null;
    billCount: number;
  };
  
  export type BillDetail = {
    id: number;
    productId: number;
    quantity: number;
    price: number;
  };
  
  export type Bill = {
    id: number;
    deliverAddress: string;
    totalPrice:number;
    voucherId: number | null;
    orderStatus: string;
    note: string;
    details: Array<BillDetail>;
  };
  