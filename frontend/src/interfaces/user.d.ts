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
