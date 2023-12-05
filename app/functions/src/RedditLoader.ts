import { getFirestore } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions/v1';

type queryParams = {
    after?: string;
    limit?: number;
}

const IMPORTANT_VALUES = [
    'before', 'after', 'children', 'kind', 'data', 'subreddit', 'author_fullname', 'title', 'name', 'ups', 'downs', 'score', 'thumbnail',
    'created', 'pinned', 'over_18', 'preview', 'images', 'subreddit_id', 'author', 'num_comments', 'permalink', 'media', 'url', 'source', 'width', 'height'
];

export class RedditLoader {
    constructor() {}

    async loadSub(subName: string, params: queryParams = { limit: 5 }) {
        let url = `http://api.reddit.com/r/${subName}`;
        if (params) {
            url += '?';
            const parts: string[] = [];
            Object.keys(params).forEach(k => {
                parts.push(`${k}=${params[k as keyof typeof params]}`);
            });
            url += parts.join('?');
        }
        let result = await (await fetch(url)).json();
        result = this.filter(result);

        const subCollection = await getFirestore()
            .collection(subName);

        for (const post of result.data.children) {
            await subCollection.doc(post.data.name.slice(3)).set(post.data);
        }

        return result.data;
    }

    private filter(response: object): object {
        const isArray = Array.isArray(response),
            filtered: Record<string,object> = {},
            filteredArray: object[] = [];

        for (const key in response) {
            if (IMPORTANT_VALUES.includes(key) || isArray) {
                let element: object = response[key as keyof typeof response];

                if ((typeof element === 'object' && element !== null) || Array.isArray(element)) {
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