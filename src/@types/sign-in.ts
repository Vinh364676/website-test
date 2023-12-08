export interface LoginReq {
  userName: string;
  password: string;
  isRemember: boolean;
}

export function initLoginReq() {
  return {
      userName: '',
      password: '',
      isRemember: false
  }
}

export function initErrorModel() {
  return {
      userName: '',
      password: '',
      isRemember: false
  }
}
