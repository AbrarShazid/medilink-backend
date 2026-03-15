import z from "zod";
import { Gender } from "../../../generated/prisma/enums";

export const updatedoctorzodschema = z
  .object({
    doctor: z.object({
      name: z
        .string("Name must be string")
        .min(2, "Name must be at least 2 character"),
      contactNumber: z
        .string("Contact number must be string")
        .min(11, "Contact number must be at least 11 characters")
        .max(14, "Contact number must be at most 15 characters"),
      address: z.string("Must be string"),
      gender: z.enum(
        [Gender.MALE, Gender.FEMALE],
        "Gender must be either MALE or FEMALE",
      ),
      appointmentFee: z
        .number("Appointment fee must be a number")
        .nonnegative("Appointment fee cannot be negative"),
      currentWorkingPlace: z.string("Current working place must be string"),
      designation: z.string("Designation must be string"),
      experience: z
        .number("Appointment fee must be a number")
        .nonnegative("Appointment fee cannot be negative"),
      qualification: z.string("Qualification must be string"),
      registrationNumber: z.string("Registration number must be string"),
      profilePhoto: z.url("Profile photo must be a valid URL"),
    }),

    specialties: z.array(
      z.object({
        specialtyId: z.uuid("Specialty ID must be a valid UUID"),
        shouldDelete: z.boolean("shouldDelete must be a boolean").optional(),
      }),
    ),
  })
  .partial();
//partial basically make all field optional,
