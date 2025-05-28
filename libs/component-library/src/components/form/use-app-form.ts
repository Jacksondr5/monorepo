"use client";

import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext } from "./form-contexts";
import { FieldInput } from "../input/field-input";
import { FieldTextarea } from "../textarea/field-textarea";
import { FieldSelect } from "../select/field-select";
import { FieldCheckboxGroup } from "../checkbox/field-checkbox-group";
import { SubmitButton } from "../button/submit-button";
import { FieldDatePicker } from "../date-picker/field-date-picker";

export const { useAppForm } = createFormHook({
  fieldComponents: {
    FieldInput,
    FieldTextarea,
    FieldSelect,
    FieldCheckboxGroup,
    FieldDatePicker,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
