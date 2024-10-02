import * as functions from "firebase-functions";
import {initializeApp} from "firebase-admin/app";
import {Firestore} from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import {Storage} from "@google-cloud/storage";
import {onCall} from "firebase-functions/v2/https";


initializeApp();

const firestore = new Firestore();
const storage = new Storage();

const rawVideoBucketName = "ycleee-yt-raw-videos";
const thumbnailBucketName = "ycleee-yt-thumbnails";

const videoCollectionId = "videos";

export interface Video {
  id?: string,
  uid?: string,
  filename?: string,
  status?: "processing" | "processed",
  title?: string,
  description?: string,
  thumbnailUrl?: string
}

export const createUser = functions.auth.user().onCreate((user) => {
  const userInfo = {
    uid: user.uid,
    email: user.email,
    photoUrl: user.photoURL,
  };

  firestore.collection("users").doc(user.uid).set(userInfo);
  logger.info(`User Created: ${JSON.stringify(userInfo)}`);
  return;
});

export const generateUploadUrl = onCall({maxInstances: 1}, async (request) => {
  // Check if the user is authentication
  if (!request.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called while authenticated."
    );
  }

  const auth = request.auth;
  const data = request.data;
  const bucket = storage.bucket(rawVideoBucketName);

  // Generate a unique filename for upload
  const fileName = `${auth.uid}-${Date.now()}.${data.fileExtension}`;

  // Get a v4 signed URL for uploading file
  const [url] = await bucket.file(fileName).getSignedUrl({
    version: "v4",
    action: "write",
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  });

  const thumbnailFileName = `${auth.uid}-${Date.now()}-thumbnail.jpg`;

  const [thumbnailUrl] = await storage.bucket(thumbnailBucketName)
    .file(thumbnailFileName).getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    });


  // Create a document in Firestore with initial metadata
  const videoId = fileName.split(".")[0];
  await firestore.collection(videoCollectionId).doc(videoId).set({
    id: videoId,
    uid: auth.uid,
    filename: fileName,
    status: "processing",
    title: data.title || "",
    description: data.description || "",
    thumbnailUrl: `https://storage.googleapis.com/${thumbnailBucketName}/${thumbnailFileName}`,
  });

  return {url, fileName, videoId, thumbnailUrl, thumbnailFileName};
});

export const getVideos = onCall({maxInstances: 1}, async () => {
  const querySnapshot =
    await firestore.collection(videoCollectionId).limit(10).get();
  return querySnapshot.docs.map((doc) => doc.data());
});

export const makeThumbnailPublic = onCall({maxInstances: 1},
  async (request) => {
    if (!request.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "The function must be called while authenticated."
      );
    }

    const {thumbnailFileName} = request.data;
    const file = storage.bucket(thumbnailBucketName).file(thumbnailFileName);
    await file.makePublic();

    console.log(`File ${thumbnailFileName} is now public.`);
    return {success: true, message: "File is now public"};
  }
);
