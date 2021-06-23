import { Db, ObjectId } from "mongodb";

export interface UserAccountModel {
  _id: ObjectId;
  name: string;
  is_moderator: boolean;
  username: string;
  email: string;
  bio: string;
  onboarding: boolean;
  likes: ObjectId[];
}

export interface InterestModel {
  _id: ObjectId;
  name: string;
  followers_aggreagate: number;
  followers: ObjectId[];
  posts: ObjectId[];
}

export const getUserById = async (
  db: Db,
  user_id: string
): Promise<UserAccountModel> => {
  const user = await db
    .collection<UserAccountModel>("user_account")
    .findOne({ _id: new ObjectId(user_id) });

  if (user === null) throw new Error("User not found");

  return user;
};

export const createUser = async (db: Db, user: UserAccountModel) => {
  await db.collection<UserAccountModel>("user_account").insertOne(user);
};

export const checkUsername = async (
  db: Db,
  username: string
): Promise<boolean> => {
  return (
    (await db
      .collection<UserAccountModel>("user_account")
      .findOne({ username: username }, { projection: { username: 1 } })) !==
    null
  );
};

export const checkInterest = async (
  db: Db,
  interest_id: string
): Promise<boolean> => {
  return (
    (await db
      .collection<InterestModel>("interest_page")
      .findOne(
        { _id: new ObjectId(interest_id) },
        { projection: { _id: 1 } }
      )) !== null
  );
};

export const checkInterestMany = async (
  db: Db,
  interest_ids: string[]
): Promise<boolean> => {
  const result = await Promise.all(
    interest_ids.map((id) => checkInterest(db, id))
  );

  return result.every((val) => val === true);
};
