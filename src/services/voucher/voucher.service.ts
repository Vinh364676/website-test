
import { AxiosResponse } from "axios";
import { deleteAsync, getAsync, postAsync, putAsync } from "../http-client";

class ReviewService {
  get = async (params: any): Promise<AxiosResponse> => {
    return await getAsync('/Admin/Vouchers/GetAll', {
      ...params,
      isPublish: true
    })
  }
  
  post = async (data: any): Promise<AxiosResponse> => {
    return await postAsync('/Admin/Vouchers/Create', data);
  }
 
}

export default new ReviewService();
