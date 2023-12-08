import { AxiosResponse } from "axios"
import { LoginReq } from "../../@types/sign-in"
import { postAsync } from "../http-client";

class AuthService {
  loginAsync = async (model: LoginReq): Promise<AxiosResponse> => {
    return await postAsync('/auth-api/auth/login', model, undefined, undefined, false)
  }
}

export default new AuthService();
