import {getFirestore} from "firebase-admin/firestore";
import {logger} from "firebase-functions/v1";
import {authHandler} from "./auth";

const IMPORTANT_VALUES = [
  "before", "after", "children", "kind", "data", "subreddit", "author_fullname", "title", "name", "ups", "downs",
  "score", "thumbnail", "created", "pinned", "over_18", "preview", "images", "subreddit_id", "author", "num_comments",
  "permalink", "media", "url", "source", "width", "height", "replies", "parent_id", "body",
];

export class RedditLoader {
  private auth = authHandler;

  async loadSub(subName: string, limit = 5, after: string | null = null) {
    let url = `http://oauth.reddit.com/r/${subName}?limit=${limit}`;
    if (after) {
      url += `&after=${after}`;
    }

    const fetchOptions = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "bearer " + await this.auth.getAccessToken(),
        "User-Agent": "firebase:redditclient-80ec9:v0.1 (by /u/udolf_seelenfrost)",
      },
    };

    const fetchresult = await fetch(url, fetchOptions);

    if (!fetchresult.ok) {
      logger.log("Loader: " + fetchresult.status.toString());
      logger.log("Loader: " + fetchresult.statusText.toString());
      logger.log("Loader: " + await fetchresult.text());
      return {children: []};
    }

    let result = await fetchresult.json();
    result = this.filter(result);

    const subCollection = await getFirestore().collection(subName);

    for (const post of result.data.children) {
      post.data.storedAt = Date.now();
      await subCollection.doc(post.data.name).set(post.data);
    }

    return result.data;
  }

  async loadComments(subName: string, postName: string, limit = 10, depth = 3) {
    const url = `http://oauth.reddit.com/r/${subName}/comments/${postName}?limit=${limit}&depth=${depth}`;

    const fetchOptions = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "bearer " + await this.auth.getAccessToken(),
        "User-Agent": "firebase:redditclient-80ec9:v0.1 (by /u/udolf_seelenfrost)",
      },
    };

    const fetchresult = await fetch(url, fetchOptions);

    if (!fetchresult.ok) {
      logger.log(fetchresult.status.toString());
      logger.log(fetchresult.statusText.toString());
      logger.log(await fetchresult.text());
      return {children: []};
    }

    let result = await fetchresult.json();
    result = this.filter(result);

    const postDoc = await getFirestore().collection(subName).doc(`t3_${postName}`);
    const commentsCollection = postDoc.collection("comments");
    const loadedComments = [];

    if ((await postDoc.get()).data() === undefined) {
      await postDoc.set(result[0].data.children[0].data);
    }

    for (const comment of result[1].data.children) {
      if (comment.kind === "more" /* TODO: avoid duplicates */) {
        await postDoc.set({replies: comment.data}, {merge: true});
      } else {
        comment.data.storedAt = Date.now();
        await commentsCollection.doc(comment.data.name).set(comment.data);
        loadedComments.push(comment.data);
      }
    }

    return {
      post: (await postDoc.get()).data(),
      children: loadedComments,
    };
  }

  private filter(response: object): object {
    const isArray = Array.isArray(response);
    const filtered: Record<string, object> = {};
    const filteredArray: object[] = [];

    for (const key in response) {
      if (IMPORTANT_VALUES.includes(key) || isArray) {
        let element: object = response[key as keyof typeof response];

        if ((typeof element === "object" && element !== null) ||
            Array.isArray(element)) {
          element = this.filter(element);
        }

        if (isArray) {
          filteredArray.push(element);
        } else {
          filtered[key as keyof typeof filtered] = element;
        }
      }
    }

    return isArray ? filteredArray : filtered;
  }
}
