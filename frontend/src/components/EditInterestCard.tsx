import React from "react";
import {
  Box,
  Button,
  Form,
  FormField,
  Heading,
  Layer,
  TextInput,
} from "grommet";
import { useFormik } from "formik";

interface EditInterestProps {
  id: string;
  name: string;
  description: string;
  setterShowEditPopUP: (b: boolean) => void;
  currentState: boolean;
}

const EditInterestCard: React.FC<EditInterestProps> = (props) => {
  const formik = useFormik({
    initialValues: {
      name: props.name,
      description: props.description,
    },
    validate: (values) => {
      let errors: Partial<typeof values> = {};

      if (values.name.length < 1) errors.name = "Name cannot be empty";
      if (values.description.length < 1)
        errors.description = "Name cannot be empty";

      return errors;
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <Layer
      onClickOutside={() => props.setterShowEditPopUP(!props.currentState)}
      onEsc={() => props.setterShowEditPopUP(!props.currentState)}
    >
      <Box background={{ color: "white" }}>
        <Box
          direction="column"
          pad="24px"
          gap="16px"
          width="800px"
          border={{ side: "top", size: "2px", color: "black" }}
        >
          <Heading level="3" margin="0">
            Edit {props.name} properties
          </Heading>

          <Form
            onSubmit={(event) => {
              event.preventDefault();

              formik.handleSubmit();
            }}
          >
            <FormField label="Edit Name" error={formik.errors.name}>
              <TextInput
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
              />
            </FormField>

            <FormField
              label="Edit Description"
              error={formik.errors.description}
            >
              <TextInput
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
              />
            </FormField>

            <Box gap="8px" direction="row" justify="end">
              <Button
                label="Cancel"
                onClick={() => props.setterShowEditPopUP(!props.currentState)}
              />
              <Button
                primary
                label="Confirm"
                type="submit"
                disabled={formik.isSubmitting}
              />
            </Box>
          </Form>
        </Box>
      </Box>
    </Layer>
  );
};

export default EditInterestCard;
