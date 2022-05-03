import { StatusCodes } from "http-status-codes";
import { Video } from "./video.model";
import { User } from "./../user/user.model";
import { Response, Request } from "express";
import busboy from "busboy";
import { createVideo, findVideo, findVideos } from "./video.service";
import fs from "fs";
import path from "path";
import { UpdateVideoBody, UpdateVideoParams } from "./video.schema";
const MIME_TYPES = ["video/mp4"];
const CHUUNK_SIZE_IN_BYTE = 1000000;
function getPath(
  {
    videoId,
    extension,
  }: {
    videoId: Video["videoId"];
    extension: Video["extension"];
  },
  path: any
) {
  const paths = path.join(
    __dirname,
    "../../",
    `videos/${videoId}.${extension}`
  );
  return paths;
  // return `${process.cwd()}/videos/${videoId}.${extension}`;
}

export async function uploadVideoHandler(req: Request, res: Response) {
  const bb = busboy({ headers: req.headers });

  const user = res.locals.user;

  const video = await createVideo({ owner: user._id });
  bb.on("file", async (_, file, info) => {
    const extension = info.mimeType.split("/")[1];

    if (!MIME_TYPES.includes(info.mimeType)) {
      return res.status(StatusCodes.BAD_REQUEST).send("Invalid file type");
    }
    const filePath = getPath(
      {
        videoId: video.videoId,
        extension,
      },
      path
    );

    video.extension = extension;

    await video.save();

    const stream = fs.createWriteStream(filePath);

    file.pipe(stream);
  });

  bb.on("close", () => {
    res.writeHead(StatusCodes.CREATED, {
      Connection: "close",
      "Content-Type": "application/json",
    });

    res.write(JSON.stringify(video));
    res.end();
  });

  return req.pipe(bb);
}

export async function updateVideoHandler(
  req: Request<UpdateVideoParams, {}, UpdateVideoBody>,
  res: Response
) {
  const { videoId } = req.params;
  const { title, description, published } = req.body;
  const { _id: userId } = res.locals.user;
  console.log("the user is ", res.locals.user);
  const video = await findVideo(videoId);

  if (!video) {
    return res.status(StatusCodes.NOT_FOUND).send("Video not found");
  }
  console.log(userId);
  console.log(video.owner);

  if (String(video.owner) !== String(userId)) {
    return res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized Access...");
  }

  video.title = title;
  video.description = description;
  video.published = published;

  await video.save();

  return res.status(StatusCodes.OK).send(video);
}

export async function findVideoHandler(req: Request, res: Response) {
  const videos = await findVideos();

  return res.status(StatusCodes.OK).send(videos);
}

export async function streamVideoHandler(req: Request, res: Response) {
  const { videoId } = req.params;

  const range = req.headers.range;
  console.log(range);
  if (!range) {
    return res.status(StatusCodes.BAD_REQUEST).send("range must be provided");
  }

  const video = await findVideo(videoId);

  if (!Video) {
    return res.status(StatusCodes.NOT_FOUND).send("video not found");
  }

  const filePath = getPath(
    {
      videoId: video.videoId,
      extension: video.extension,
    },
    path
  );

  const fileSizeInBytes = fs.statSync(filePath).size;

  const chunkStart = Number(range.replace(/\D/g, ""));

  const chunkEnd = Math.min(
    chunkStart + CHUUNK_SIZE_IN_BYTE,
    fileSizeInBytes - 1
  );

  const contentLength = chunkEnd - chunkStart + 1;

  const headers = {
    "Content-Range": `bytes ${chunkStart} - ${chunkEnd}/${fileSizeInBytes}`,
    "Accept-Ranges": "bytes",
    "Content-length": contentLength,
    "Content-Type": `video/${video.extension}`,
    // "Cross-Origin_Resource-Policy": "cross-origin",
  };

  res.writeHead(StatusCodes.PARTIAL_CONTENT, headers);

  const videoStream = fs.createReadStream(filePath, {
    start: chunkStart,
    end: chunkEnd,
  });

  videoStream.pipe(res);
}
