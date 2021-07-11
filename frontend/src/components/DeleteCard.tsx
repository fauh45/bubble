import React from "react";
import { Box, Button, Heading, Layer, Spinner, Text } from "grommet";
import { useMutation, useQueryClient } from "react-query";
import { pathcPost } from "../api/mutation";
import {
  PostV1PatchBody,
  PostV1PatchError,
  PostV1PatchResponse,
} from "../../../common/build";
import { AxiosError } from "axios";

interface DeleteCardProps {
  post_id: string;
  setterShowDeletePopUp: (b: boolean) => void;
  currentState: boolean;
}

const DeleteCard: React.FC<DeleteCardProps> = ({
  post_id,
  setterShowDeletePopUp,
  currentState,
}: DeleteCardProps) => {
  const queryClient = useQueryClient();

  const deletePost = useMutation<
    PostV1PatchResponse,
    AxiosError<PostV1PatchError>,
    PostV1PatchBody
  >((body) => pathcPost(post_id, body));

  return (
    <Layer
      onClickOutside={
        deletePost.isLoading
          ? () => {}
          : () => setterShowDeletePopUp(!currentState)
      }
      onEsc={
        deletePost.isLoading
          ? () => {}
          : () => setterShowDeletePopUp(!currentState)
      }
    >
      <Box direction="column" pad="32px" gap="24px">
        {deletePost.isLoading && <Spinner />}

        <Heading level="3" margin="0">
          Confirm!
        </Heading>
        <Text>Are you sure you want to delete?</Text>
        <Box gap="12px" direction="row" justify="end">
          <Button
            label="Cancel"
            disabled={deletePost.isLoading}
            onClick={() => setterShowDeletePopUp(!currentState)}
          />
          <Button
            primary
            label={<Text color="white">Delete</Text>}
            color="red"
            onClick={() => {
              deletePost.mutate(
                { deleted: true },
                {
                  onSuccess: (data) => {
                    queryClient.invalidateQueries(["post", post_id]);

                    setterShowDeletePopUp(!currentState);
                  },
                }
              );
            }}
          />
        </Box>
      </Box>
    </Layer>
  );
};

export default DeleteCard;
