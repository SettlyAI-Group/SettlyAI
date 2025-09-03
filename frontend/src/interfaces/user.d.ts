export interface IUser {
  fullName: string;
  email: string;
  verificationType: number;
  password: string;
}

export interface IVerifyEmailRequest {
  userId: number;
  code: string;
  verificationType: number;
}

export interface IUserResponse {
  id: number;
  fullName: string;
  email: string;
}

export interface ILoginUser {
  email:string;
  password:string;
  // Todo: Add rememberMe:true or false to use refresh Token
}
