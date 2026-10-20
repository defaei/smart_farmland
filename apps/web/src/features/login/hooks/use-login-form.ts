import { useState } from "react";
import type { FormEvent } from "react";
import type { LoginFormController } from "../types";

export function useLoginForm(): LoginFormController {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");

  function togglePasswordVisibility() {
    setIsPasswordVisible((visible) => !visible);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmissionMessage("این فرم هنوز به سرویس ورود متصل نشده است.");
  }

  return {
    isPasswordVisible,
    submissionMessage,
    togglePasswordVisibility,
    handleSubmit,
  };
}
