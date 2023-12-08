
import { AxiosResponse } from "axios";
import { deleteAsync, getAsync, postAsync, putAsync } from "../http-client";

class AccountService {
    login = async (loginData: { email: string, password: string }): Promise<AxiosResponse> => {
        return await postAsync('/auth/login', loginData);
      }
    register = async (registerData: {
        firstName: string;
        lastName: string;
        gender:number;
        displayName:string;
        phoneNumber:string;
        dateOfBirth:string;
        email: string;
        password: string;
        address:string;
      }): Promise<AxiosResponse> => {
        return await postAsync('/auth/register', registerData);
      };
}

export default new AccountService();
