const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();
app.use(
  cors({
    origin: 'https://st-news-api-production.up.railway.app',
  })
);
dotenv.config();

const port = process.env.PORT;

app.get('/', (req, res) => {
  res.send(`My cool API ¯\\_(ツ)_/¯`);
});

const getPost = async (id) => {
  const postRes = await fetch(
    `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`
  );
  return await postRes.json();
};

// Get post's main comments

app.get('/api/roots/:id', cors(), async (req, res) => {
  const itemId = req.params.id;
  const itemData = await getPost(itemId);
  const roots = itemData?.kids;

  let comments = [];
  if (!roots) return res.json([null]);
  for (let root = 0; root < roots.length; root++)
    comments.push(await getPost(roots[root]));
  res.json(comments);
});

app.get('/api/:item', cors(), async (req, res) => {
  res.json(await getPost(req.params.item));
});

// Initial point
app.get('/api/latest', cors(), async (req, res) => {
  const AMOUNT_OF_POSTS = 20;

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

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
