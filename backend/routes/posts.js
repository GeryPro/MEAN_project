const express = require("express");

const PostConstroller = require("../controllers/posts");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();

router.post("", checkAuth, extractFile, PostConstroller.createPost);

router.put("/:id", checkAuth, extractFile, PostConstroller.updatePost);

router.get("", PostConstroller.getPosts);

router.get("/:id", PostConstroller.getPost);

router.delete("/:id", checkAuth, PostConstroller.deletePost);

module.exports = router;
