export interface IRegisterPatientData {
  name: string;
  email: string;
  password: string;
}
export interface ILogInData {
  email: string;
  password: string;
}

export interface IChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
