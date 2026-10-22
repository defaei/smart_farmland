import { toast } from "react-toastify";
import { useAppDispatch } from "@/shared/redux/hooks";
import { validateWithYup } from "@/shared/validation/yup-validation";
import { store } from "@/shared/redux/store";
import { loginTypeSchema, loginLenthSchema } from "../validation";

export function useLoginSubmit() {
  const dispatch = useAppDispatch();

  return async (): Promise<void> => {
    const { data, status } = store.getState().login;

    if (status === "pending" || status === "fetching") {
      return;
    }

    const typeValidation = await validateWithYup(data, loginTypeSchema);

    if (!typeValidation.valid) {
      toast.error(typeValidation.message);
      return;
    }

    const lengthValidation = await validateWithYup(data, loginLenthSchema);

    if (!lengthValidation.valid) {
      toast.error(lengthValidation.message);
      return;
    }
  };
}
