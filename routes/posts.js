var express = require("express");
var router = express.Router();
const PostControllers = require("../controllers/posts");
const handErrorAsync = require("../service/handErrorAsync");

// 取得所有貼文
router.get("/posts", handErrorAsync(PostControllers.getPosts));

// 取得單一貼文
router.get("/post/:id", handErrorAsync(PostControllers.getPostById));

// 新增貼文
router.post("/post", handErrorAsync(PostControllers.createPost));

// 修改貼文
router.patch("/post/:id", handErrorAsync(PostControllers.updatePostById));

// 刪除單一貼文
router.delete("/post/:id", handErrorAsync(PostControllers.deletePostById));

// 刪除全部
router.delete("/posts", handErrorAsync(PostControllers.deletePosts));

module.exports = router;
