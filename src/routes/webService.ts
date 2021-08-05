import express from "express";
import collectorController from "../controllers/collector";
import retrieverController from "../controllers/retriever";
const router = express.Router();

router.get("/api/v1/collect", collectorController.collectUserData);
router.get("/api/v1/retrieve", retrieverController.retrieveUserData);
export default router;
