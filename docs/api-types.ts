type post = {
    kind: string;
    data: {
        title: string;
        score: number;
        author: string;
        permalink: string;
        //mehr stuff für content: media, text, ...
    }
}

// Antwort auf /:sub
type sub = {
    after: null | string;
    children: [post]
}

type comment = {
    score: number;
    author: string;
    permalink: string;
    parent_id: string;
    body: string;
}

// Antwort auf /:sub/comments/:post
type postWithComments = {
    post: post;
    children: [comment];
}