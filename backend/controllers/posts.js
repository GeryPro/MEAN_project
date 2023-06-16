const Post = require("../models/post");

exports.createPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId,
  });
  post
    .save()
    .then((createdPost) => {
      res.status(201).json({
        message: "Post saved successfully",
        post: {
          id: createdPost._id,
          title: createdPost.title,
          content: createdPost.content,
          imagePath: createdPost.imagePath,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({ message: "Creating post failed" });
    });
};

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId,
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then((result) => {
      if (result.matchedCount > 0) {
        res.status(200).json({
          message: "Post updated successfully",
        });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Couldn't update post!" });
    });
};

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.currentPage;
  const postQuery = Post.find();
  let fetchedPosts;

  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts fetch successfully",
        posts: fetchedPosts,
        totalPosts: count,
      });
    })
    .catch((err) => {
      res.status(500).json({ message: "Couldn't fetch posts!" });
    });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: "Post not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Couldn't fetch the post!" });
    });
};

exports.deletePost = (req, res, next) => {
  const id = req.params.id;

  Post.deleteOne({ _id: id, creator: req.userData.userId })
    .then((result) => {
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Post deleted successfully" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Couldn't delete the post!" });
    });
};
