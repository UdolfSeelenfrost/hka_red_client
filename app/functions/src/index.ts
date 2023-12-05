import express, { Request, Response } from 'express';
import { onRequest } from "firebase-functions/v2/https";
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
// import { logger } from 'firebase-functions';

import { RedditLoader } from './RedditLoader';
import { isCollection, loadCollection } from './collections';
import { logger } from 'firebase-functions/v1';

const app = express();
initializeApp();
const loader = new RedditLoader();

app.get('/', (req: Request, res: Response) => {
    //redirects are weird so instead we do nothing
    res.send('please use r/something');
});

app.get('/:sub', async (req: Request, res: Response) => {
    const sub = req.params.sub,
        limit: number = +(req.query.limit || 5);

    if (isCollection(sub)) {
        return loadCollection(sub, req, res);
    }

    const subCollection = await getFirestore()
            .collection(sub),
        lastPosts = await subCollection.limit(limit).get();

    logger.log(lastPosts);
    logger.log(lastPosts.docs.length);
    if (lastPosts.docs.length < limit) {
        const added = await loader.loadSub(sub, { limit: limit - lastPosts.docs.length });
        return res.json(added);
    }

    return res.json({
        after: 'todo',
        children: lastPosts.docs.map(doc => doc.data())
    });
});

app.get('/:sub/about', (req: Request, res: Response) => {
    return res.send(`about ${req.params.sub}`);
});


exports.r = onRequest(app);