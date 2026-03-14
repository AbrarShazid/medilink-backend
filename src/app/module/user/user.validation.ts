import z from "zod";
import { Gender } from "../../../generated/prisma/enums";

export const createDoctorZodSchema = z.object({
  password: z
    .string({ message: "Password must be a string" })
    .min(8, { message: "Password minimum length is 8 characters" }),

  doctor: z.object({
    name: z
      .string({ message: "Name must be a string" })
      .min(2, { message: "Name should be at least 2 characters" }),

    email: z.email({ message: "Invalid email format" }),

    profilePhoto: z
      .string({ message: "Profile photo must be a string URL" })
      .optional(),

    contactNumber: z
      .string({ message: "Contact number must be a string" })
      .min(11, "Minimum 11")
      .optional(),

    address: z.string({ message: "Address must be a string" }).optional(),

    registrationNumber: z.string({
      message: "Registration number must be a string",
    }),

    experience: z
      .number({ message: "Experience must be a number" })
      .nonnegative()
      .optional(),

    gender: z.enum(Gender, {
      message: "Invalid gender value",
    }),

    appointmentFee: z
      .number({ message: "Appointment fee must be a number" })
      .nonnegative(),

    qualification: z.string({ message: "Qualification must be a string" }),

    currentWorkingPlace: z.string({
      message: "Current working place must be a string",
    }),

    designation: z.string({ message: "Designation must be a string" }),
  }),

  specialtiesId: z
    .array(z.string({ message: "Specialty ID must be a string" }))
    .min(1, { message: "At least one specialty is required" }),
});

//for admin & superAdmin as well

export const createAdminZodSchema = z.object({
  password: z
    .string({ message: "Password must be a string" })
    .min(8, { message: "Password minimum length is 8 characters" }),

  admin: z.object({
    name: z
      .string({ message: "Name must be a string" })
      .min(2, { message: "Name should be at least 2 characters" }),

    email: z.email({ message: "Invalid email format" }),
    contactNumber: z
      .string({ message: "Contact number must be a string" })
      .min(11, "Minimum 11"),
    profilePhoto: z
      .string({ message: "Profile photo must be a string URL" })
      .optional(),
  }),
});

// for superadmin
