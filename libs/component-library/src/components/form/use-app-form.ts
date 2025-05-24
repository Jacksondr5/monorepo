"use client";

import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext } from "./form-contexts";
import { FieldInput } from "../input/field-input";
import { FieldTextarea } from "../textarea/field-textarea";
import { FieldSelect } from "../select/field-select";
import { SubmitButton } from "../button/submit-button";

export const { useAppForm } = createFormHook({
  fieldComponents: {
    FieldInput,
    FieldTextarea,
    FieldSelect,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
