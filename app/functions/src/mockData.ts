import express, {Request, Response} from "express";
import {getFirestore} from "firebase-admin/firestore";
import {RedditLoader} from "./RedditLoader";

export const app = express();
const loader = new RedditLoader();

app.post("/fill/:sub", async (req: Request, res: Response) => {
  const sub = req.params.sub;
  const subData = req.body;
  const subCollection = await getFirestore().collection(sub);

  for (const post of subData.children) {
    await subCollection.doc(post.data.name).set(post.data);
  }

  return res.send("ok");
});

app.post("/fill/:sub/:id", async (req: Request, res: Response) => {
  const sub = req.params.sub;
  const postData = req.body;
  let id = req.params.id;

  if (!id.startsWith("t3_")) {
    id = "t3_" + id;
  }

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

app.get("/load/:sub", async (req: Request, res: Response) => {
  const sub = req.params.sub;

  const data = await loader.loadSub(sub, 25);
  let result = await fetch("https://mock-3l7bazumfq-ey.a.run.app/fill/" + sub, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (result.ok) {
    console.log("loaded and stored");
  }

  for (const post of data.children) {
    const comments = await loader.loadComments(sub, post.data.name.substr(3), 25, 3);

    let result = await fetch(`https://mock-3l7bazumfq-ey.a.run.app/fill/${sub}/${post.data.name}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comments),
    });

    if (result.ok) {
      console.log("loaded and stored comment");
    }
  }


  return res.json(data);
});
