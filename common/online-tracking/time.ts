export const TimeWindowMs = 1000 * 60 * 15;

export const UserOnlinePrefix = "UserOnline/";
export const UserOnlineReceivedRecommendationPrefix = "UserOnlineRecommended/";

export const getCurrentTimeWindow = () => {
  const currDate = new Date();
  const roundedDate = new Date(
    Math.floor(currDate.getTime() / TimeWindowMs) * TimeWindowMs
  );

  return roundedDate;
};

export const getCurrentOnlineUserKey = () => {
  return UserOnlinePrefix + getCurrentTimeWindow().getTime().toString();
};

export const getCurrentRecomendedUserKey = () => {
  return (
    UserOnlineReceivedRecommendationPrefix +
    getCurrentTimeWindow().getTime().toString()
  );
};
