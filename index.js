const express = require('express');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

const port = process.env.PORT;

app.get('/', (req, res) => {
  res.send(`My cool API ¯\\_(ツ)_/¯`);
});

app.get('/api/latest', async (req, res) => {
  const AMOUNT_OF_POSTS = 10;

  const getPost = async (id) => {
    const postRes = await fetch(
      `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`
    );
    return await postRes.json();
  };
  const srotiesRes = await fetch(
    'https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty'
  );
  let postsId = await srotiesRes.json();
  let posts = [];
  postsId = postsId.sort((a, b) => b.time > a.time).slice(0, AMOUNT_OF_POSTS);
  for (let inc = 0; inc <= postsId.length - 1; inc++)
    posts.push(await getPost(postsId[inc]));
  res.json(posts);
});
//runkit.com/
https: app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
