import http from "http";
import express, { Response, Request, Express, NextFunction } from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();

import routes from "./routes/webService";
import { DatabaseError, HttpError, HttpStatusCodes } from "./models/Errors";
import { User } from "./schemas/user";

const server: Express = express();

export const seedDb = async () => {
  const user = new User({
    username: "usergood",
    password: "datagood",
  });
  await user.save();
};

const eraseDatabaseOnSync = true;
mongoose.connect(
  process.env.DATABASE_URL || "mongodb://localhost:27017/test",
  async (err) => {
    console.log(err);
    if (err) throw new DatabaseError(500, err?.message);
    if (eraseDatabaseOnSync) {
      await User.deleteMany({});
      await seedDb();
    }
    console.log("Connected to db");
  }
);

server.use(morgan("dev"));
server.use(express.urlencoded({ extended: false }));
server.use(express.json());

server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "origin, X-Requested-With,Content-Type,Accept, Authorization"
  );
  next();
});

server.use("/", routes);

server.use((_req, _res, next: NextFunction) => {
  const err = new HttpError(HttpStatusCodes.NOT_FOUND, "not found");
  next(err);
});

server.use(
  (err: HttpError, _req: Request, res: Response, _next: NextFunction) => {
    console.log(err);
    const status = err.status || HttpStatusCodes.INTERNAL_SERVER;
    const message = err.message || "something went wrong";
    res.status(status).send({
      status,
      message,
    });
  }
);

const httpServer = http.createServer(server);
const PORT: any = process.env.PORT ?? 6060;
httpServer.listen(PORT, () =>
  console.log(`The server is running on port ${PORT}`)
);
