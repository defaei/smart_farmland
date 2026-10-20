import type { FormEvent } from "react";

export interface LoginFormController {
  isPasswordVisible: boolean;
  submissionMessage: string;
  togglePasswordVisibility: () => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
}
