import express, {Request, Response} from "express";
import {getFirestore} from "firebase-admin/firestore";

export const app = express();

app.post("/fill/:sub", (req: Request, res: Response) => {
  res.send("not implemented");
});

app.post("/fill/:sub/:id", async (req: Request, res: Response) => {
  const sub = req.params.sub;
  const id = req.params.id;
  const postData = req.body;

  const subCollection = await getFirestore().collection(sub);
  const doc = await subCollection.doc(id).get();

  if (!doc.exists) {
    await subCollection.doc(id).set(postData.post);

    for (const comment of postData.children) {
      await doc.ref.collection("comments").doc(comment.name).set(comment);
    }
    return res.send("ok");
  }

  await doc.ref.set(postData.post, {merge: true});
  for (const comment of postData.children) {
    await doc.ref.collection("comments").doc(comment.name).set(comment);
  }
  return res.send("ok");
});
