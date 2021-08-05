import { Request, Response, NextFunction } from "express";

import { User } from "../schemas/user";
import { getQueryParams, isQueryParamsExist, QueryParams } from "../helpers";
import { HttpError, HttpStatusCodes } from "../models/Errors";

export const getDbUser = async (username: string) => {
  return await User.findOne(
    { username },
    { _id: 0, __v: 0 },
    undefined,
    (err, _) => {
      if (err) {
        throw new HttpError(500, err.message);
      }
    }
  );
};

const retrieveUserData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!isQueryParamsExist(req.query)) {
    const err = new HttpError(
      HttpStatusCodes.BAD_REQUEST,
      "Please provide correct query parameters"
    );
    next(err);
  }
  const queryParams: QueryParams = getQueryParams(req.query);
  const data = await getDbUser(queryParams.username);
  return res.status(200).json(data);
};

export default { retrieveUserData };
