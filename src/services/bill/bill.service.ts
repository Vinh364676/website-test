
import { AxiosResponse } from "axios";
import { deleteAsync, getAsync, postAsync, putAsync } from "../http-client";

class BillService {
  post = async (data: any): Promise<AxiosResponse> => {
    return await postAsync('/User/Bill/Create', data);
  }

}

export default new BillService();
