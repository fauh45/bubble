import { QueryRunner } from "neogma";
import logger from "./logger";

const recommendationStrategy = [
  `MATCH (target_user:User)-[:INTERACT_WITH]->(interact_with:Post)-[:POSTED_BY]->(another_user:User)-[:LIKES]->(interact_interest:Interest)<-[:PART_OF]-(recommend_post:Post) WHERE target_user.id=$id AND NOT (target_user)-[:LIKES]->(interact_interest) AND NOT (recommend_post)-[:POSTED_BY]->(target_user) RETURN recommend_post`,
  `MATCH (target_user:User)-[:LIKES]->(:Interest)<-[:LIKES]-(:User)-[:LIKES]->(other_people_interest:Interest)<-[:PART_OF]-(recommend_post:Post) WHERE target_user.id=$id AND recommend_post.deleted=false AND NOT (target_user)-[:LIKES]->(other_people_interest) AND NOT (recommend_post)-[:POSTED_BY]->(target_user) RETURN DISTINCT recommend_post`,
];

export const getRecommendation = async (
  queryRunner: QueryRunner,
  id: string
) => {
  let result = await queryRunner.run(recommendationStrategy[0], {
    id: id,
  });

  if (result.records.length === 0) {
    result = await queryRunner.run(recommendationStrategy[1], {
      id: id,
    });
  }

  if (result.records.length > 0) {
    const postSelected =
      result.records[Math.floor(Math.random() * result.records.length)];

    logger.info(
      "Get recommend id " +
        postSelected.get("recommend_post").properties.id +
        " for " +
        id
    );
    return (
      <string>postSelected.get("recommend_post").properties.id || undefined
    );
  }

  return undefined;
};
