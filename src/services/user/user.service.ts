
import { AxiosResponse } from "axios";
import { deleteAsync, getAsync, postAsync, putAsync } from "../http-client";

class UserService {
  get = async (params: any): Promise<AxiosResponse> => {
    return await getAsync('/User/GetAll', {
      ...params,
      isPublish: true
    })
  }
 
}

export default new UserService();
