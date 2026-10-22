import { Schema, ValidationError } from "yup";
import { ValidationResult } from "../types";

export const validateWithYup = async <T>(data: unknown, schema: Schema<T>): Promise<ValidationResult<T>> => {
  try {
    const validatedData = await schema.validate(data, { abortEarly: false });
    return { valid: true, data: validatedData };
  } catch (err) {
    if (err instanceof ValidationError) return { valid: false, message: err.errors[0] ?? err.message };
    throw err;
  }
};
