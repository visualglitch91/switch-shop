import { useState } from "react";
import { Button, TextField, Stack } from "@mui/material";
import DialogBase, { DialogBaseControlProps } from "../DialogBase";
import useModal from "./useModal";

function Prompt({
  title,
  fields,
  initialValues = [],
  onConfirm,
  ...props
}: {
  title: string;
  fields: string[];
  initialValues?: string[];
  onConfirm: (values: string[]) => void;
} & DialogBaseControlProps) {
  const [values, setValues] = useState(() =>
    fields.map((_, index) => initialValues[index] || "")
  );

  return (
    <DialogBase
      title={title}
      {...props}
      footer={
        <Button
          color="primary"
          variant="contained"
          onClick={() => onConfirm(values)}
        >
          Confirmar
        </Button>
      }
    >
      <Stack spacing={2}>
        {fields.map((label, index) => (
          <TextField
            key={index}
            label={label}
            value={values[index]}
            onChange={(event) => {
              const value = event.currentTarget.value;

              setValues((prev) => {
                const next = [...prev];
                next[index] = value;
                return next;
              });
            }}
          />
        ))}
      </Stack>
    </DialogBase>
  );
}

export function usePrompt() {
  const mount = useModal();

  function prompt({
    title,
    fields,
    initialValues,
    onConfirm,
  }: {
    title: string;
    fields: string[];
    initialValues: string[];
    onConfirm: (values: string[]) => void;
  }) {
    mount((_, props) => (
      <Prompt
        {...props}
        title={title}
        fields={fields}
        initialValues={initialValues}
        onConfirm={(values) => {
          props.onClose();
          onConfirm(values);
        }}
      />
    ));
  }

  return prompt;
}
