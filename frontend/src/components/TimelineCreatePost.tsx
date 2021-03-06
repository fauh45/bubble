import React from "react";
import { Box, Button, Form, FormField, Select, TextArea } from "grommet";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { searchInterest } from "../api/query";
import { InterestSerialized } from "@bubble/common";
import { useFormik } from "formik";
import { createNewPost } from "../api/mutation";

interface Props {
  interest?: InterestSerialized;
}

interface NewPostForm {
  content: string;
  interest: InterestSerialized | undefined;
}

const TimelineCreatePost: React.FC<Props> = (props) => {
  const newPostMutation = useMutation(createNewPost);
  const queryClient = useQueryClient();

  const formik = useFormik<NewPostForm>({
    initialValues: {
      content: "",
      interest: props.interest || undefined,
    },
    validate: (values) => {
      let errors: any = {};
      if (values.content.length < 1) {
        errors.content = "Content are too short";
      } else if (values.content.length > 559) {
        errors.content = "Content are too long";
      }

      if (!values.interest) {
        errors.interest = "Interest are required";
      }

      return errors;
    },
    onSubmit: async (values, { resetForm }) => {
      newPostMutation.mutate(
        {
          content: values.content,
          media: "",
          part_of: values.interest?._id!,
        },
        {
          onSuccess: () => {
            resetForm();
            queryClient.invalidateQueries("timeline");
            if (!!props.interest)
              queryClient.invalidateQueries(["interest", props.interest._id]);
          },
        }
      );
    },
  });

  const [query, setQuery] = React.useState("");

  const searchQuery = useQuery(
    ["interestQuery", query],
    () => searchInterest(query),
    {
      enabled: Boolean(query),
      staleTime: 1000 * 60
    }
  );

  return (
    <Box
      border={{ color: "#E6E6E6", side: "all" }}
      direction="column"
      width="800px"
      background={{ color: "white" }}
      pad="24px"
      gap="24px"
    >
      <Form
        onSubmit={(event) => {
          event.preventDefault();

          formik.handleSubmit();
        }}
      >
        <Box flex="grow" height={{ max: "400px" }}>
          <FormField
            error={formik.errors.content}
            name="content"
            htmlFor="content-input"
          >
            <TextArea
              id="content-input"
              name="content"
              disabled={newPostMutation.isLoading}
              value={formik.values.content}
              onChange={formik.handleChange}
              size="small"
              fill={true}
              resize="vertical"
              placeholder="What's up today?"
            />
          </FormField>
        </Box>

        <Box direction="row" justify="end" gap="16px">
          <FormField
            error={formik.errors.interest}
            name="interest"
            htmlFor="interest-input"
          >
            <Select
              id="interest-input"
              name="interest"
              disabled={!!props.interest || newPostMutation.isLoading}
              clear
              size="small"
              searchPlaceholder="Search interest.."
              onSearch={(text) => setTimeout(() => setQuery(text), 500)}
              plain
              placeholder={
                !!props.interest ? props.interest.name : "Where to post"
              }
              options={
                searchQuery.isLoading || searchQuery.isIdle
                  ? []
                  : searchQuery.data!
              }
              emptySearchMessage={
                searchQuery.isLoading
                  ? "Loading..."
                  : query.length === 0
                  ? "Search for some interest"
                  : "Nothing found"
              }
              labelKey={"name"}
              value={formik.values.interest}
              onChange={(event) => {
                formik.setFieldValue("interest", event.value);
              }}
            />
          </FormField>
          <Box height="64px">
            <Button
              primary
              disabled={newPostMutation.isLoading}
              type="submit"
              label="Post"
            />
          </Box>
        </Box>
      </Form>
    </Box>
  );
};

export default TimelineCreatePost;
