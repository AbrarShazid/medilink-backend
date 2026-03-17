import nodemailer from "nodemailer";
import { envVariables } from "../config/env";
import AppError from "../errorHelpers/AppError";
import status from "http-status";

import path from "path";

import ejs from "ejs";

const transporter = nodemailer.createTransport({
  host: envVariables.EMAIL_SENDER.SMTP_HOST,
  secure: true,
  auth: {
    user: envVariables.EMAIL_SENDER.SMTP_USER,
    pass: envVariables.EMAIL_SENDER.SMTP_PASS,
  },
  port: Number(envVariables.EMAIL_SENDER.SMTP_PORT),
});

interface sendEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  templateData: Record<string, any>;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

export const sendEmail = async ({
  to,
  subject,
  templateName,
  templateData,
  attachments,
}: sendEmailOptions) => {
  try {
    const templatePath = path.resolve(
      process.cwd(),
      `src/app/templates/${templateName}.ejs`,
    );

    const html = await ejs.renderFile(templatePath, templateData);

    const info = await transporter.sendMail({
      from: envVariables.EMAIL_SENDER.SMTP_FROM,
      to: to,
      subject: subject,
      html: html,
      attachments: attachments?.map((singleAttachment) => ({
        filename: singleAttachment.filename,
        content: singleAttachment.content,
        contentType: singleAttachment.contentType,
      })),
    });
  } catch (error: any) {
    console.log("Email Sending Error", error.message);

    throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to send email");
  }
};
