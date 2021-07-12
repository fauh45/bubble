import React, { useState } from "react";
import {
  Box,
  Button,
  Form,
  FormField,
  Heading,
  Text,
  TextInput,
} from "grommet";
import { navigate, RouteComponentProps } from "@reach/router";
import Page from "../components/Page";
import InterestList from "../components/InterestList";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { checkUserAuthStatus, checkUsername } from "../api/query";
import { createNewUser } from "../api/mutation";
import { UserV1PostBody } from "@bubble/common";
import { Formik } from "formik";

interface Props extends RouteComponentProps {}

const OnBoarding: React.FC<Props> = (props) => {
  const [interestError, setInterestError] = useState("");

  const queryClient = useQueryClient();

  const { status: userAuthStatus, data: userAuthData } = useQuery(
    "userStatus",
    checkUserAuthStatus,
    {
      staleTime: 1000 * 60 * 60,
    }
  );

  const newUserMutation = useMutation((data: UserV1PostBody) =>
    createNewUser(data)
  );

  if (userAuthStatus === "success" && userAuthData?.exist) {
    navigate("/");
  }

  let lastUsername = "";
  const selectedInterestId = new Set<string>();

  const handleChoice = (interest_id: string, checked: boolean) => {
    if (checked) selectedInterestId.add(interest_id);
    else selectedInterestId.delete(interest_id);
  };

  interface formData {
    bio: string;
    username: string;
    name: string;
  }

  const handleSubmit = (data: formData) => {
    newUserMutation.mutate({
      bio: data.bio,
      likes: Array.from(selectedInterestId),
      username: data.username,
      name: data.name,
    });

    queryClient.invalidateQueries("userStatus");
  };

  const handleValidation = async (
    data: formData
  ): Promise<Partial<formData>> => {
    const errors: Partial<formData> = {};

    console.log(lastUsername);

    const usernameAvailable = await checkUsername(data.username);

    if (!usernameAvailable.available)
      errors.username = "Username has been taken";

    if (selectedInterestId.size < 3) {
      setInterestError("Interest choice are too small, minimal 3");
    } else if (selectedInterestId.size > 5) {
      setInterestError("Interest choice are too small, maximal 5");
    } else {
      setInterestError("");
    }

    return errors;
  };

  return (
    <Page header={false}>
      <Box fill="horizontal" overflow="auto">
        <Box margin={{ vertical: "24px", horizontal: "40px" }} gap="40px">
          <Formik
            initialValues={{ name: "", username: "", bio: "" }}
            onSubmit={(values) => handleSubmit(values)}
            validate={(values) => handleValidation(values)}
          >
            {({
              values,
              errors,
              handleChange,
              handleSubmit,
              setFieldValue,
            }) => (
              <Form
                onSubmit={(event) => {
                  event.preventDefault();

                  handleSubmit();
                }}
              >
                <FormField
                  name="name"
                  htmlFor="name-input"
                  label="Public Name"
                  error={errors.name}
                >
                  <TextInput
                    id="name-input"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                  />
                </FormField>
                <FormField
                  name="username"
                  htmlFor="username-input"
                  label="Your Choice of Username"
                  error={errors.username}
                >
                  <TextInput
                    id="username-input"
                    name="username"
                    value={values.username}
                    onChange={handleChange}
                  />
                </FormField>
                <FormField
                  name="bio"
                  htmlFor="bio-input"
                  label="Short biography for your account"
                  error={errors.bio}
                >
                  <TextInput
                    id="bio-input"
                    name="bio"
                    value={values.bio}
                    onChange={handleChange}
                  />
                </FormField>

                <Box direction="column" gap="24px">
                  <Heading margin="0" level="4">
                    Choose 3 to 5 interests.
                  </Heading>

                  {interestError !== "" && (
                    <Text color="status-error">{interestError}</Text>
                  )}

                  <Box overflow="auto" flex="shrink" responsive>
                    {userAuthStatus === "loading" && <Text>Loading...</Text>}
                    {userAuthStatus === "success" && (
                      <InterestList handleChoice={handleChoice} />
                    )}
                  </Box>

                  <Box direction="row" gap="32px">
                    <Box>
                      <Button
                        label="Back"
                        secondary
                        onClick={() => {
                          navigate(-1);
                        }}
                      />
                    </Box>
                    <Box>
                      <Button
                        label="Ok"
                        primary
                        disabled={newUserMutation.isLoading}
                        type="submit"
                      />
                    </Box>
                  </Box>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
    </Page>
  );
};

export default OnBoarding;
