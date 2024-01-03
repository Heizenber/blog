const express = require("express");

const db = require("../data/database");

const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/posts");
});

router.get("/posts", async (req, res) => {
  const [posts] = await db.query(
    `SELECT posts.*, authors.name 
    FROM posts INNER JOIN authors ON posts.author_id = authors.id`
  );

  res.render("posts-list", { posts: posts });
});

router.get("/new-post", async (req, res) => {
  const [authors] = await db.query("SELECT * FROM authors");
  res.render("create-post", { authors: authors });
});

router.post("/posts", async (req, res) => {
  const data = [
    req.body.title,
    req.body.summary,
    req.body.content,
    req.body.author,
  ];
  await db.query(
    `INSERT INTO posts (title, summary, body, author_id)
    VALUES (?)`,
    [data]
  );
  res.redirect("/posts");
});

router.get("/posts/:id", async (req, res) => {
  const query = `
    SELECT posts.*, authors.name, authors.email FROM posts
    INNER JOIN authors ON posts.author_id = authors.id
    WHERE posts.id = ?
    `
  const [posts] = await db.query(query, [req.params.id])
  if (!posts || posts.length === 0) {
    return res.status(404).render("404");
  }

  const postData = {
    ...posts[0],
    date: posts[0].date.toISOString(),
    humanReadableDate: posts[0].date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
      }),
  }

  res.render("post-detail", { post: postData });
});

module.exports = router;
