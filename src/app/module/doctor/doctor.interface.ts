import { Gender } from "../../../generated/prisma/enums";

export interface IUpdateDoctorSpecialtyPayload {
  specialityId: string;
  shouldDelete?: boolean;
}
export interface IUpdateDoctorPayload {
  doctor?: {
    name?: string;
    contactNumber?: string;
    address?: string;
    gender?: Gender;
    appointmentFee?: number;
    currentWorkingPlace?: string;
    designation?: string;
    experience?: number;

    qualification?: string;
    registrationNumber?: string;
    profilePhoto?: string;
  };
  specialties?: IUpdateDoctorSpecialtyPayload[];
}
