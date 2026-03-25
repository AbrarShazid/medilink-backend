import z from "zod";

const createSpecialityZodSchema=z.object({
    title:z.string("Title is required"),
    description:z.string("Description must be string").optional()
})

export const specialityValidation={
    createSpecialityZodSchema
}