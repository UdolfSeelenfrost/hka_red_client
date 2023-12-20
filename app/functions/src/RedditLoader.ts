import {getFirestore} from "firebase-admin/firestore";
import {logger} from "firebase-functions/v1";
import {authHandler} from "./auth";

const IMPORTANT_VALUES = [
  "before", "after", "children", "kind", "data", "subreddit", "author_fullname", "title", "name", "ups", "downs",
  "score", "thumbnail", "created", "pinned", "over_18", "preview", "images", "subreddit_id", "author", "num_comments",
  "permalink", "media", "url", "source", "width", "height",
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
        "Authorization": "Bearer " + await this.auth.getAccessToken(),
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

    const subCollection = await getFirestore().collection(subName);

    for (const post of result.data.children) {
      post.data.storedAt = Date.now();
      await subCollection.doc(post.data.name).set(post.data);
    }

    return result.data;
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
