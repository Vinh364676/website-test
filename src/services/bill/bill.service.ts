
import { AxiosResponse } from "axios";
import { deleteAsync, getAsync, postAsync, putAsync } from "../http-client";

class BillService {
  post = async (data: any): Promise<AxiosResponse> => {
    return await postAsync('/User/Bill/Create', data);
  }
  postVNpay = async (data: any): Promise<AxiosResponse> => {
    return await postAsync('/Cart/CheckoutWithVNpay', data);
  }
  getPayment = async (params: any): Promise<AxiosResponse> => {
    return await getAsync('/Cart/PaymentCallback', {
      ...params,
      isPublish: true
    })
  }
}

export default new BillService();
