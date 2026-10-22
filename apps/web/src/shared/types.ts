export type Status = "idle" | "fetching" | "pending" | "completed" | "rejected";

export interface ValidationFailed {
  valid: false;
  message: string;
}

export interface ValidationSuccess<T> {
  valid: true;
  data: T;
}

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailed;
