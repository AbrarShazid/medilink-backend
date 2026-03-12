import { UserStatus } from "../../../generated/prisma/enums";
import { auth } from "../../lib/auth";

interface IregirsterPatientData {
  name: string;
  email: string;
  password: string;
}
interface IlogInData {
  email: string;
  password: string;
}

const registerPatient = async (payload: IregirsterPatientData) => {
  const data = await auth.api.signUpEmail({
    body: {
      name: payload.name,
      email: payload.email,
      password: payload.password,
    },
  });

  if (!data.user) {
    throw new Error("Failed to register patient");
  }

  // TODO: add this patiemt to patient table as well after create patient table by using prisma

  return data;
};

const logInUser = async (payload: IlogInData) => {
  const data = await auth.api.signInEmail({
    body: {
      email: payload.email,
      password: payload.password,
    },
  });


  if(data.user.isDeleted || data.user.status===UserStatus.DELETED){
     throw new Error("User is deleted");
  }

    if (data.user.status === UserStatus.BLOCKED) {
        throw new Error("User is blocked");
    }

    return data

};

export const authService = {
  registerPatient,
  logInUser
};
