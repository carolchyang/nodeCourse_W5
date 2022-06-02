var express = require("express");
var router = express.Router();
const UserControllers = require("../controllers/users");
const handErrorAsync = require("../service/handErrorAsync");

// 取得所有用戶
router.get("/users", handErrorAsync(UserControllers.getUsers));

// 取得單一用戶
router.get("/user/:id", handErrorAsync(UserControllers.getUserById));

// 新增用戶
router.post("/user", handErrorAsync(UserControllers.createUser));

// 修改用戶資訊
router.patch("/user/:id", handErrorAsync(UserControllers.updateUserById));

// 刪除單一用戶
router.delete("/user/:id", handErrorAsync(UserControllers.deleteUserById));

// 刪除全部用戶
router.delete("/users", handErrorAsync(UserControllers.deleteUsers));

module.exports = router;
