import apiClient from "./apiClient";

/*
=========================================================
GET QUERIES ELIGIBLE FOR FEEDBACK
=========================================================
*/
export const getFeedbackEligibleQueries = () => {
  return apiClient("/api/feedback/my-queries", {
    method: "GET",
  });
};

/*
=========================================================
CREATE FEEDBACK
=========================================================
*/
export const createFeedback = ({ queryId, rating, message }) => {
  return apiClient("/api/feedback", {
    method: "POST",
    body: JSON.stringify({
      queryId,
      rating,
      message,
    }),
  });
};

/*
=========================================================
GET MY FEEDBACKS
=========================================================
*/
export const getMyFeedbacks = () => {
  return apiClient("/api/feedback/my", {
    method: "GET",
  });
};

/*
=========================================================
GET SINGLE MY FEEDBACK
=========================================================
*/
export const getMyFeedbackById = (feedbackId) => {
  return apiClient(
    `/api/feedback/my/${encodeURIComponent(feedbackId)}`,
    {
      method: "GET",
    }
  );
};

/*
=========================================================
UPDATE MY FEEDBACK
=========================================================
*/
export const updateMyFeedback = (
  feedbackId,
  { rating, message }
) => {
  return apiClient(
    `/api/feedback/my/${encodeURIComponent(feedbackId)}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        rating,
        message,
      }),
    }
  );
};

/*
=========================================================
GET ADMIN FEEDBACKS
=========================================================
*/
export const getAdminFeedbacks = ({
  search = "",
  rating = "all",
} = {}) => {
  const params = new URLSearchParams();

  if (search.trim()) {
    params.set("search", search.trim());
  }

  if (rating !== "all") {
    params.set("rating", rating);
  }

  const queryString = params.toString();

  return apiClient(
    queryString
      ? `/api/feedback/admin?${queryString}`
      : "/api/feedback/admin",
    {
      method: "GET",
    }
  );
};

/*
=========================================================
GET SINGLE ADMIN FEEDBACK
=========================================================
*/
export const getAdminFeedbackById = (feedbackId) => {
  return apiClient(
    `/api/feedback/admin/${encodeURIComponent(feedbackId)}`,
    {
      method: "GET",
    }
  );
};