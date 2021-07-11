import React, { useContext } from "react";
import {
  Box,
  Button,
  Form,
  FormField,
  Layer,
  Spinner,
  Text,
  TextArea,
} from "grommet";
import { UserContext } from "../context/user";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  AbuseV1GetError,
  AbuseV1GetResponse,
  AbuseV1PostBody,
  AbuseV1PostError,
  AbuseV1PostResponse,
  UserV1GetError,
  UserV1GetResponse,
} from "@bubble/common";
import { getReports, getUser } from "../api/query";
import { AxiosError } from "axios";
import { createReport } from "../api/mutation";
import { useFormik } from "formik";

interface AdminReportProps {
  message: string;
}

interface ReportCardProps {
  setterShowReportPopUp: (b: boolean) => void;
  currentState: boolean;
  post_id: string;
}

const AdminReport: React.FC<AdminReportProps> = ({
  message,
}: AdminReportProps) => {
  return (
    <Box gap="16px" border="all" height={{ min: "200px" }} round="25px">
      <Box
        background="linear-gradient(102.77deg, #865ED6 -9.18%, #18BAB9 209.09%)"
        pad="16px"
        round={{ size: "25px", corner: "top" }}
        fill
      ></Box>
      <Box pad={{ horizontal: "16px", vertical: "8px" }}>
        <Text>{message}</Text>
      </Box>
    </Box>
  );
};

const ReportCard: React.FC<ReportCardProps> = ({
  setterShowReportPopUp,
  currentState,
  post_id,
}: ReportCardProps) => {
  const user = useContext(UserContext);

  const queryClient = useQueryClient();

  const { data: userData } = useQuery<
    UserV1GetResponse,
    AxiosError<UserV1GetError>
  >(["user", user?.uid!], () => getUser(user?.uid!), {
    staleTime: 1000 * 60 * 5,
    enabled: !!user?.uid,
  });

  const newReport = useMutation<
    AbuseV1PostResponse,
    AxiosError<AbuseV1PostError>,
    AbuseV1PostBody
  >((body: AbuseV1PostBody) => createReport(post_id, body));

  const reportList = useQuery<AbuseV1GetResponse, AxiosError<AbuseV1GetError>>(
    ["reports", post_id],
    () => getReports(post_id),
    {
      enabled: !!user && !!userData && userData.is_moderator,
      retry: false,
      staleTime: 1000 * 60,
    }
  );

  const formik = useFormik({
    initialValues: {
      report: "",
    },
    onSubmit: (value, helper) => {
      newReport.mutate(
        { reason: value.report },
        {
          onError: (err) => {
            helper.setErrors({ report: err.response?.data.message });
          },
          onSuccess: (_data) => {
            queryClient.invalidateQueries("timeline");
            queryClient.invalidateQueries(["reports", post_id]);

            setterShowReportPopUp(!currentState);
          },
        }
      );
    },
  });

  return (
    <Layer
      onClickOutside={
        newReport.isLoading
          ? () => {}
          : () => setterShowReportPopUp(!currentState)
      }
      onEsc={
        newReport.isLoading
          ? () => {}
          : () => setterShowReportPopUp(!currentState)
      }
    >
      <Box>
        {/* Admin */}
        {/* Add some flow control */}
        {!!user && !!userData && userData.is_moderator && (
          <Box
            direction="column"
            pad="16px"
            gap="24px"
            width="760px"
            flex
            overflow="auto"
            height={{ max: "320px" }}
          >
            {reportList.isLoading && <Spinner />}
            {reportList.isError && (
              <Text color="status-error">
                {reportList.error.response?.data.message}
              </Text>
            )}
            {reportList.isSuccess &&
              reportList.data.reason.map((item) => (
                <AdminReport message={item} />
              ))}
          </Box>
        )}

        {/* Report */}
        <Box
          direction="column"
          pad="24px"
          gap="16px"
          width="760px"
          border={{ side: "top", size: "2px", color: "black" }}
        >
          {newReport.isLoading && <Spinner />}
          
          <Form
            onSubmit={(event) => {
              event.preventDefault();

              formik.handleSubmit();
            }}
          >
            <Box height={{ min: "82px", max: "112px" }}>
              <FormField name="report" error={formik.errors.report}>
                <TextArea
                  name="report"
                  value={formik.values.report}
                  onChange={formik.handleChange}
                  disabled={newReport.isLoading}
                  placeholder="Write the report message here.."
                  resize="vertical"
                />
              </FormField>
            </Box>
            <Box gap="8px" direction="row" justify="end">
              <Button
                label="Cancel"
                onClick={() => setterShowReportPopUp(!currentState)}
                disabled={newReport.isLoading}
              />
              <Button
                primary
                label="Confirm"
                type="submit"
                disabled={newReport.isLoading}
              />
            </Box>
          </Form>
        </Box>
      </Box>
    </Layer>
  );
};

export default ReportCard;
