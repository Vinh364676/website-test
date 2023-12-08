
import { AxiosResponse } from "axios";
import { deleteAsync, getAsync, postAsync, putAsync } from "../http-client";

class CustomerService {
  get = async (params: any): Promise<AxiosResponse> => {
    return await getAsync('/Customer/GetAll', {
      ...params,
      isPublish: true
    })
  }
 
}

export default new CustomerService();
