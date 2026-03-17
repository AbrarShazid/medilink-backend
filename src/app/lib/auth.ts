import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { bearer, emailOTP } from "better-auth/plugins";
import { sendEmail } from "../utils/email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: Role.PATIENT,
      },
      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.ACTIVE,
      },
      needPasswordChange: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
      isDeleted: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
      deletedAt: {
        type: "date",
        required: false,
        defaultValue: null,
      },
    },
  },

  plugins: [
    bearer(),
    emailOTP({
      overrideDefaultEmailVerification: true, // we don't want to verify over the link , so we did that
      async sendVerificationOTP({ email, otp, type }) {
        //4 type -> "sign-in" | "email-verification" | "forget-password" | "change-email
        //we only use 2 of them in this project  "email-verification" and "forget-password"

        if (type === "email-verification") {
          const user = await prisma.user.findUnique({
            where: {
              email,
            },
          });

          if (user && !user.emailVerified) {
            sendEmail({
              to: email,
              subject: "Medilink Verification OTP",
              templateName: "otp",
              templateData: {
                name: user.name,
                otp,
              },
            });
          }
        }


        else if(type="forget-password"){
          const user =await prisma.user.findUnique({
            where:{
              email
            }
          })

          if(user){
            sendEmail({
              to:email,
              subject:"Password reset OTP"
              ,
              templateName:"otp",
              templateData:{
                name:user.name,
                otp
              }
            })
          }
        }
      },
      expiresIn: 2 * 60,
      otpLength: 6,
    }),
  ],
  session: {
    expiresIn: 60 * 60 * 24, //1day
    updateAge: 60 * 60 * 24, //1day

    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24, //1day
    },
  },
});
