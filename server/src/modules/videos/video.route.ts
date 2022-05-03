import express from "express";
import requireUser from "../../middleware/requireUser";
import {
  findVideoHandler,
  streamVideoHandler,
  updateVideoHandler,
  uploadVideoHandler,
} from "./video.controller";
const router = express.Router();

router.post("/", requireUser, uploadVideoHandler);
router.patch("/:videoId", requireUser, updateVideoHandler);
router.get("/", findVideoHandler);
router.get("/:videoId", streamVideoHandler);
export default router;
