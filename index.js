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

app.get('/api/kids/:id', cors(), async (req, res) => {
  const itemId = req.params.id;
  const itemData = await getPost(itemId);
  const roots = itemData?.kids;

  let comments = [];
  if (!roots) return res.json([null]);
  for (let root = 0; root < roots.length; root++)
    comments.push(await getPost(roots[root]));
  res.json(comments);
});

// [ 8952, 9224, 8917, 8884, 8887, 8943, 8869, 8958, 9005, 9671, 8940, 9067, 8908, 9055, 8865, 8881, 8872, 8873, 8955, 10403, 8903, 8928, 9125, 8998, 8901, 8902, 8907, 8894, 8878, 8870, 8980, 8934, 8876 ]

// app.get('/api/kids/:id', cors(), async (req, res) => {
//   const { kids: kidsIds } = await getPost(req.params.parent);
//   let replies = [];
//   if (kids) {
//     for (let id = 0; id < kidsIds.length; id++)
//       replies.push(await getPost(kidsIds[id]));
//   } else {
//     replies.push(null);
//   }
//   res.json(replies);
// });

app.get('/api/latest', cors(), async (req, res) => {
  const AMOUNT_OF_POSTS = 10;

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
