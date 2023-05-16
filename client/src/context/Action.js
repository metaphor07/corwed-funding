export const connectSuccess = (user) => ({
  type: "CONNECT_SUCCESS",
  payload: user,
});

export const connectFailure = () => ({
  type: "CONNECT_FAILURE",
});
