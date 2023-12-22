// @ts-ignore
import express, {Request, Response} from "express";
import {onRequest} from "firebase-functions/v2/https";
import {initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import {setGlobalOptions} from "firebase-functions/v2/options";

import {RedditLoader} from "./RedditLoader";
import {isCollection, loadCollection} from "./collections";
import { logger } from "firebase-functions/v1";

const app = express();
initializeApp();
setGlobalOptions({maxInstances: 10});
const loader = new RedditLoader();

app.get("/", (req: Request, res: Response) => {
  // redirects are weird so instead we do nothing
  res.send("please use r/something");
});

app.get("/:sub", async (req: Request, res: Response) => {
  const sub = req.params.sub;
  const limit: number = +(req.query.limit || 5);
  const after: string | null = req.query.after ? `${req.query.after}` : null;

  if (isCollection(sub)) {
    return loadCollection(sub, req, res);
  }

  const subCollection = await getFirestore().collection(sub);

  let afterDoc: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData> | null = null;
  let lastPosts: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> | null = null;

  if (after) {
    afterDoc = await subCollection.doc(after).get();
    lastPosts = await subCollection.orderBy("created", "desc").startAfter(afterDoc).limit(limit).get();
  } else {
    lastPosts = await subCollection.orderBy("created", "desc").limit(limit).get();
  }

  let postData = lastPosts.docs.map((doc) => doc.data());

  if (lastPosts.docs.length < limit) {
    const added = await loader.loadSub(sub, limit - lastPosts.docs.length, after);
    postData = postData.concat(added.children);
  }

  return res.json({
    after: after || null,
    children: postData,
  });
});

app.get("/:sub/about", (req: Request, res: Response) => {
  return res.send(`about ${req.params.sub}`);
});

app.get("/:sub/comments/:post", async (req: Request, res: Response) => {
  const sub = req.params.sub;
  const post = req.params.post;

  const subCollection = await getFirestore().collection(sub);
  const postDocument = subCollection.doc(`t3_${post}`);

  

  const commentsDocs = (await postDocument.collection('comments').get()).docs;
  if (commentsDocs.length === 0) {
    const loaded = await loader.loadComments(sub, post);

    return res.json({
      post: (await postDocument.get()).data(),
      children: loaded.children,
    });
  }

  return res.json({
    post: (await postDocument.get()).data(),
    children: commentsDocs.map((doc) => doc.data()),
  });
});

exports.r = onRequest({
  region: "europe-west3",
}, app);
