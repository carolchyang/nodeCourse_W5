const resSuccess = require("../service/resSuccess");
const appError = require("../service/appError");
const User = require("../models/user");

const users = {
  async getUsers(req, res, next) {
    const users = await User.find();
    resSuccess(res, users);
  },
  async getUserById(req, res, next) {
    const { id } = req.params;
    const user = await User.findOne({ _id: id });
    if (!user) {
      return next(appError(400, "取得失敗，查無此用戶 ID"), next);
    }
    resSuccess(res, user);
  },
  async createUser(req, res, next) {
    const { name, avatar, email } = req.body;

    const newUser = await User.create({
      name,
      avatar,
      email,
    });
    resSuccess(res, newUser);
  },
  async updateUserById(req, res, next) {
    const { name, gender, avatar } = req.body;
    const { id } = req.params;

    // 驗證此 ID 使否存在
    const isExist = await User.findById(id).exec();
    if (!isExist) {
      return next(appError(400, "刪除失敗，查無此用戶 ID"), next);
    }

    const newUser = await User.findByIdAndUpdate(
      id,
      {
        name,
        gender,
        avatar,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!newUser) {
      return next(appError(400, "更新失敗，查無此用戶 ID"), next);
    }
    resSuccess(res, newUser);
  },
  async deleteUserById(req, res, next) {
    const { id } = req.params;

    // 驗證此 ID 使否存在
    const isExist = await User.findById(id);
    if (!isExist) {
      return next(appError(400, "刪除失敗，查無此用戶 ID"), next);
    }

    const delUser = await User.findByIdAndDelete(id, {
      new: true,
    });
    if (!delUser) {
      return next(appError(400, "刪除失敗，查無此用戶 ID"), next);
    }
    resSuccess(res, delUser);
  },
  async deleteUsers(req, res, next) {
    await User.deleteMany();
    resSuccess(res, []);
  },
};

module.exports = users;
