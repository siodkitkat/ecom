import { Router } from "express";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { envSchema } from "../types";
import { requireLogin } from "../middlewares";
import multer from "multer";
import { errorResponse } from "../utils";
import multers3 from "multer-s3";
import Image, { IImage } from "../models/Image";
import { Document, Types } from "mongoose";
import { IUser } from "../models/User";

const env = envSchema.parse(process.env);

const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${env.CLOUDFLARE_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_ID,
    secretAccessKey: env.R2_SECRET_KEY,
  },
});

//To do add global error handler so the server doesnt crash in case of an error

const deleteImageFromDb = async ({
  image,
  s3,
}: {
  image: Document<unknown, unknown, IImage> &
    IImage & {
      _id: Types.ObjectId;
    };
  s3: S3Client;
}) => {
  let deleted = false;
  let err;

  try {
    const { $metadata: reqStatus } = await s3.send(
      new DeleteObjectCommand({
        Bucket: env.R2_BUCKET_NAME,
        Key: image.key,
      })
    );

    if (reqStatus.httpStatusCode) {
      if (reqStatus.httpStatusCode < 200 || reqStatus.httpStatusCode > 299) {
        err = new Error("Failed to delete from R2 storage.");
      } else {
        await image.remove();
        deleted = true;
      }
    }
  } catch (e) {
    err = e;
  }

  return {
    deleted: deleted,
    deletedImage: image,
    error: err,
  };
};

const authedToEdit = async ({ itemId, user }: { itemId?: string; user?: IUser }) => {
  let canEdit = false;
  let error:
      | {
          message: string;
          statusCode: number;
        }
      | undefined,
    img;

  if (!itemId) {
    error = {
      message: "Missing image id in the request body.",
      statusCode: 400,
    };
  } else {
    try {
      img = await Image.findById(itemId);
    } catch (e) {
      //
    }
  }

  if (!img) {
    error = {
      message: "Invalid image id provided. No such image exists.",
      statusCode: 404,
    };
  } else if (!user) {
    error = {
      message: "You must be logged in to do this.",
      statusCode: 401,
    };
  } else if (!img.user._id.equals(user._id)) {
    error = {
      message: "You are not authed to do that.",
      statusCode: 401,
    };
  } else {
    canEdit = true;
  }

  return {
    canEdit: canEdit,
    img: img,
    user: user,
    error: error,
  } as
    | {
        canEdit: true;
        img: Exclude<typeof img, null | undefined>;
        user: Exclude<typeof user, undefined>;
        error: undefined;
      }
    | {
        canEdit: false;
        img: typeof img;
        user: typeof user;
        error: Exclude<typeof error, undefined>;
      };
};

const imageStorage = multers3({
  s3: S3,
  bucket: env.R2_BUCKET_NAME,
  metadata: (req, file, cb) => {
    return cb(null, { fieldName: file.fieldname });
  },
  contentType: multers3.AUTO_CONTENT_TYPE,
  cacheControl: "max-age=31536000",
  key: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 100)}`);
  },
});

const uploadImage = multer({
  storage: imageStorage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.toLowerCase().startsWith("image")) {
      return cb(null, false);
    }

    return cb(null, true);
  },
});

const ImagesRouter = Router();

ImagesRouter.post("/", requireLogin, uploadImage.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json(errorResponse("Only image files are allowed.", 400));
  }

  const user = req.user as Exclude<typeof req.user, undefined>;

  const publicUrl = `${env.R2_PUBLIC_URL}/${req.file.key}`;

  const image = new Image({ key: req.file.key, publicUrl: publicUrl, user: user._id });

  await image.save();

  return res.status(200).json({
    message: "Successfully uploaded the requested image.",
    image: image,
  });
});

ImagesRouter.delete("/", requireLogin, async (req, res) => {
  const { canEdit, error, img } = await authedToEdit({ itemId: req.body.id, user: req.user });

  if (!canEdit) {
    return res.status(error.statusCode).json(errorResponse(error.message, error.statusCode));
  }

  const { deleted, deletedImage } = await deleteImageFromDb({
    image: img,
    s3: S3,
  });

  if (!deleted) {
    return res.status(500).json(errorResponse("Failed to delete the requested image", 500));
  }

  return res.status(200).json({
    message: "Successfully deleted the requested image.",
    deletedImage: deletedImage,
  });
});

ImagesRouter.post("/", requireLogin, uploadImage.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json(errorResponse("Only image files are allowed.", 400));
  }

  const user = req.user as Exclude<typeof req.user, undefined>;

  const publicUrl = `${env.R2_PUBLIC_URL}/${req.file.key}`;

  const image = new Image({ key: req.file.key, publicUrl: publicUrl, user: user._id });

  await image.save();

  return res.status(200).json({
    message: "Successfully uploaded the requested image.",
    image: image,
  });
});

export default ImagesRouter;
