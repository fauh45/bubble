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
import InterestItem from "../components/InterestItem";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  checkUserAuthStatus,
  checkUsername,
  getRandomInterest,
} from "../api/query";
import { createNewUser } from "../api/mutation";
import {
  UserV1PostBody,
  UserV1PostError,
  UserV1PostResponse,
} from "@bubble/common";
import { Formik } from "formik";
import { AxiosError } from "axios";

interface Props extends RouteComponentProps {}

const OnBoarding: React.FC<Props> = (props) => {
  const [interestError, setInterestError] = useState("");
  const [mutationError, setMutationError] = useState("");

  const queryClient = useQueryClient();

  const {
    status: userAuthStatus,
    data: userAuthData,
    refetch,
  } = useQuery("userStatus", checkUserAuthStatus, {
    staleTime: 1000 * 60 * 60,
  });

  const newUserMutation = useMutation<
    UserV1PostResponse,
    AxiosError<UserV1PostError>,
    UserV1PostBody
  >((data) => createNewUser(data));

  if (userAuthStatus === "success" && userAuthData?.exist) {
    navigate("/");
  }

  interface formData {
    bio: string;
    username: string;
    name: string;
    likes: string[];
  }

  const handleSubmit = (data: formData) => {
    newUserMutation.mutate(
      {
        bio: data.bio,
        likes: data.likes,
        username: data.username,
        name: data.name,
      },
      {
        onError: (err) => {
          setMutationError(err.response?.data.message || err.message);
        },
        onSuccess: async (data) => {
          setMutationError("");
          queryClient.setQueryData(["user", data._id], data);

          await refetch();
          queryClient.invalidateQueries("userStatus");

          navigate("/");
        },
      }
    );
  };

  const handleValidation = async (
    data: formData
  ): Promise<Partial<formData>> => {
    const errors: Partial<formData> = {};

    const usernameAvailable = await checkUsername(data.username);

    if (!usernameAvailable.available)
      errors.username = "Username has been taken";

    if (data.likes.length < 3) {
      setInterestError("Interest choice are too small, minimal 3");
    } else if (data.likes.length > 5) {
      setInterestError("Interest choice are too small, maximal 5");
    } else {
      setInterestError("");
    }

    return errors;
  };

  const { status, data } = useQuery(
    "randomInterest",
    () => getRandomInterest(5),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <Page header={false}>
      <Box fill="horizontal" overflow="auto">
        <Box margin={{ vertical: "24px", horizontal: "40px" }} gap="40px">
          {mutationError !== "" && (
            <Text color="status-error">{mutationError}</Text>
          )}
          <Formik
            initialValues={{
              name: "",
              username: "",
              bio: "",
              likes: [] as string[],
            }}
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
                      <Box
                        align="start"
                        fill="horizontal"
                        gap="48px"
                        direction="row-responsive"
                      >
                        {status === "loading" && <Text>Loading...</Text>}
                        {status === "error" && <Text>Got an error...</Text>}
                        {status === "success" &&
                          data?.map((item) => {
                            return (
                              <InterestItem
                                name={item.name}
                                id={item._id}
                                checked={values.likes.includes(item._id)}
                                handleChoice={(interest_id, checked) => {
                                  if (checked) {
                                    setFieldValue("likes", [
                                      ...values.likes,
                                      interest_id,
                                    ]);
                                  } else {
                                    setFieldValue(
                                      "likes",
                                      values.likes.filter(
                                        (v) => v !== interest_id
                                      )
                                    );
                                  }
                                }}
                              />
                            );
                          })}
                      </Box>
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
                        disabled={
                          newUserMutation.isLoading || newUserMutation.isSuccess
                        }
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
