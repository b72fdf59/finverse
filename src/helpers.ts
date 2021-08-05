import QueryString from "qs";

export interface QueryParams {
  username: string;
}

export const isQueryParamsExist = (query: QueryString.ParsedQs) => {
  const username = query.user;
  if (!username) {
    return false;
  }
  return true;
};

export const getQueryParams = (query: QueryString.ParsedQs) => {
  const params: QueryParams = { username: query.user as string };
  return params;
};
