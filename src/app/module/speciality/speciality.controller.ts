import { Request, Response } from "express";
import { specialityService } from "./speciality.service";

const createSpeciality = async (req: Request, res: Response) => {
  try {
    const payload = req.body;

    const result = await specialityService.createSpeciality(payload);

    res.status(201).json({
      success: true,
      message: "Successfully create speciality",
      data: result,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to create speciality",
      error: error.message,
    });
  }
};
const getAllSpeciality = async (req: Request, res: Response) => {
  try {
    const result = await specialityService.getAllSpeciality();
    res.status(201).json({
      success: true,
      message: "Successfully fetched speciality",
      data: result,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetched speciality",
      error: error.message,
    });
  }
};

//update
const updateSpeciality = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const result = await specialityService.updateSpeciality(
      id as string,
      payload,
    );
    res.status(201).json({
      success: true,
      message: "Successfully update speciality",
      data: result,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to update speciality",
      error: error.message,
    });
  }
};

// delete 
const deleteSpeciality = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await specialityService.deleteSpeciality(
      id as string,
    );
    res.status(201).json({
      success: true,
      message: "Successfully delete speciality",
      data: result,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete speciality",
      error: error.message,
    });
  }
};

export const specialityController = {
  createSpeciality,
  getAllSpeciality,
  updateSpeciality,
  deleteSpeciality
};
