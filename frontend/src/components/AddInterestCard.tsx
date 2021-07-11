import React from "react";
import {
  Box,
  Button,
  Form,
  FormField,
  Heading,
  Layer,
  Spinner,
  TextInput,
} from "grommet";
import { useFormik } from "formik";
import { useMutation, useQueryClient } from "react-query";
import { createInterest } from "../api/mutation";
import {
  InterestV1PostBody,
  InterestV1PostError,
  InterestV1PostResponse,
} from "@bubble/common";
import { navigate } from "@reach/router";
import { AxiosError } from "axios";

interface AddInterestProps {
  setterShowAddPopUp: (b: boolean) => void;
  currentState: boolean;
}

const AddInterestCard: React.FC<AddInterestProps> = (props) => {
  const queryClient = useQueryClient();

  const newInterest = useMutation<
    InterestV1PostResponse,
    AxiosError<InterestV1PostError>,
    InterestV1PostBody
  >(createInterest);

  const formik = useFormik({
    initialValues: {
      id: "",
      name: "",
      description: "",
    },
    validate: (values) => {
      let errors: Partial<typeof values> = {};

      if (values.id.length < 1) errors.id = "Description cannot be empty";
      if (values.name.length < 1) errors.name = "Name cannot be empty";
      if (values.description.length < 1)
        errors.description = "Description cannot be empty";

      return errors;
    },
    onSubmit: (values, helper) => {
      newInterest.mutate(
        {
          _id: values.id,
          description: values.description,
          name: values.name,
        },
        {
          onError: (err) => {
            helper.setErrors({ id: err.response?.data.message });
          },
          onSuccess: (data) => {
            props.setterShowAddPopUp(!props.currentState);
            queryClient.setQueryData(["interest", data._id], data);

            navigate("/i/" + data._id);
          },
        }
      );
    },
  });

  return (
    <Layer
      onClickOutside={
        newInterest.isLoading
          ? () => {}
          : () => props.setterShowAddPopUp(!props.currentState)
      }
      onEsc={
        newInterest.isLoading
          ? () => {}
          : () => props.setterShowAddPopUp(!props.currentState)
      }
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
            Create new Interest
          </Heading>

          {newInterest.isLoading && <Spinner />}

          <Form
            onSubmit={(event) => {
              event.preventDefault();

              formik.handleSubmit();
            }}
          >
            <FormField label="Interest Id" error={formik.errors.id}>
              <TextInput
                value={formik.values.id}
                name="id"
                onChange={formik.handleChange}
              />
            </FormField>

            <FormField label="Interest Name" error={formik.errors.name}>
              <TextInput
                value={formik.values.name}
                name="name"
                onChange={formik.handleChange}
              />
            </FormField>

            <FormField
              label="Interest Description"
              error={formik.errors.description}
            >
              <TextInput
                value={formik.values.description}
                name="description"
                onChange={formik.handleChange}
              />
            </FormField>

            <Box gap="8px" direction="row" justify="end">
              <Button
                label="Cancel"
                disabled={newInterest.isLoading}
                onClick={() => props.setterShowAddPopUp(!props.currentState)}
              />
              <Button
                primary
                label="Confirm"
                type="submit"
                disabled={newInterest.isLoading}
              />
            </Box>
          </Form>
        </Box>
      </Box>
    </Layer>
  );
};

export default AddInterestCard;
