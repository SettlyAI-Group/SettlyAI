export interface IUser {
  fullName: string;
  email: string;
  password: string;
}

export interface ILoginUser {
  email:string;
  password:string;
  // Todo: Add rememberMe:true or false to use refresh Token
}
