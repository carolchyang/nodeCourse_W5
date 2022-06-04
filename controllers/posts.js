const resSuccess = require("../service/resSuccess");
const appError = require("../service/appError");
const Post = require("../models/post");

const posts = {
  async getPosts(req, res, next) {
    // 排序
    const sort = req.query.sort == "asc" ? "createdAt" : "-createdAt";

    // 關鍵字搜尋
    const q =
      req.query.q !== undefined ? { content: new RegExp(req.query.q) } : {};

    // 每頁幾筆： 預設 5 筆
    const pageCount = 5;
    // 目前在第幾頁： 預設為第 1 頁
    const page = req.query.page || 1;

    // 從第幾筆開始
    const startIndex = pageCount * (page - 1);

    const posts = await Post.find(q)
      .populate({
        path: "user",
        select: "name avatar",
      })
      .sort(sort)
      .skip(startIndex)
      .limit(pageCount);

    // 總資料數量
    const totalResultLen = await Post.find(q).countDocuments({});

    // 總共幾頁 - math.ceil() 無條件進位
    const totalPage = Math.ceil(totalResultLen / pageCount);

    const result = {
      // 頁碼資訊
      pagination: {
        // 所在頁碼
        currentPages: page,
        // 總共幾頁
        totalPage,
        // 是否有下一頁
        hasNext: page < totalPage,
        // 是否有上一頁
        hasPre: page > 1,
      },
      data: posts,
    };

    resSuccess(res, result);
  },
  async getPostById(req, res, next) {
    const { id } = req.params;

    // 驗證此 ID 使否存在
    const isExist = await Post.findById(id).exec();
    if (!isExist) {
      return next(appError(400, "刪除失敗，查無此貼文 ID"), next);
    }

    const post = await Post.findOne({ _id: id }).populate({
      path: "user",
      select: "name photo",
    });
    if (!post) {
      return next(appError(400, "取得失敗，查無此貼文 ID"), next);
    }
    resSuccess(res, post);
  },
  async createPost(req, res, next) {
    const { user, image, content } = req.body;

    if (content == "") {
      return next(appError(400, "新增失敗，貼文內容必須填寫"), next);
    }

    const newPost = await Post.create({
      user,
      image,
      content,
    });
    resSuccess(res, newPost);
  },
  async updatePostById(req, res, next) {
    const { content } = req.body;
    const { id } = req.params;

    // 驗證此 ID 使否存在
    const isExist = await Post.findById(id).exec();
    if (!isExist) {
      return next(appError(400, "刪除失敗，查無此貼文 ID"), next);
    }

    if (content == "") {
      return next(appError(400, "刪除失敗，貼文內容必須填寫"), next);
    }

    const newPost = await Post.findByIdAndUpdate(
      id,
      {
        content,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!newPost) {
      return next(appError(400, "更新失敗，查無此貼文 ID"), next);
    }
    resSuccess(res, newPost);
  },
  async deletePostById(req, res, next) {
    const { id } = req.params;

    // 驗證此 ID 使否存在
    const isExist = await Post.findById(id).exec();
    if (!isExist) {
      return next(appError(400, "刪除失敗，查無此貼文 ID"), next);
    }

    const delPost = await Post.findByIdAndDelete(id, {
      new: true,
    });
    if (!delPost) {
      return next(appError(400, "刪除失敗，查無此貼文 ID"), next);
    }
    resSuccess(res, delPost);
  },
  async deletePosts(req, res, next) {
    await Post.deleteMany();
    resSuccess(res, []);
  },
};

module.exports = posts;
