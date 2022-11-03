const Router = require("koa-router"); // 引入koa-router
const db = require("../utils/db");
const hoemRouter = new Router(); // 创建路由，支持传递参数
const { v4: uuidv4 } = require("uuid"); // uuid
const moment = require("moment");

hoemRouter.get("/api/home", async (ctx) => {
  ctx.body = {
    info: "获取视频列表",
    code: 500,
    success: false,
    msg: "获取失败！",
  };
  const results = await db.query(`select * from videos`);

  ctx.body.videoList = results;
  ctx.body.success = true;
  ctx.body.code = 200;
  ctx.response.status = 200;
  ctx.body.msg = "获取成功!";
});

// 点赞
hoemRouter.post("/api/home/up", async (ctx) => {
  ctx.body = {
    info: "点赞/收藏接口",
    code: 500,
    success: false,
    msg: "点赞/收藏失败",
  };

  // 获取视频id 和 用户id

  // 构造参数
  let data = {
    uId: "",
    vId: "",
    type: null, // 0 点赞 1 是收藏
  };

  Object.keys(data).map((prop) => {
    data[prop] = ctx.request.body[prop];
  });

  const videoList = await db.query(
    `select * from videos where vId = '${data.vId}'`
  );

  if (videoList.length === 1) {
    const video = videoList[0];
    let sql = "";

    if (+data.type) {
      // 收藏
      video.collectionList += video.collectionList ? "," + data.uId : data.uId;
      // 去重
      video.collectionList = Array.from(
        new Set(video.collectionList.split(","))
      ).join(",");

      sql = `update videos set collectionList='${video.collectionList}' where vId='${data.vId}'`;
    } else {
      // 点赞
      video.upList += video.upList ? "," + data.uId : data.uId;
      // 去重
      video.upList = Array.from(new Set(video.upList.split(","))).join(",");

      sql = `update videos set upList='${video.upList}' where vId='${data.vId}'`;
    }

    const results = await db.query(sql);
    if ((results.changedRows = 1) && results.affectedRows == 1) {
      ctx.body.success = true;
      ctx.body.code = 200;
      ctx.response.status = 200;
      ctx.body.msg = (+data.type ? "收藏" : "点赞") + "成功!";
    }
  }
});

// 评论
hoemRouter.post("/api/home/comment", async (ctx) => {
  ctx.body = {
    info: "评论接口",
    code: 500,
    success: false,
    msg: "评论失败",
  };

  // 构造参数
  let data = {
    coId: "",
    coTime: "",
    uId: "",
    vId: "",
    comment: null,
  };

  Object.keys(data).map((prop) => {
    data[prop] = ctx.request.body[prop];
  });

  data.coId = uuidv4();

  data.coTime = moment().format("YYYY-MM-DD HH:mm");

  const results = await db.query(
    `insert into comment values('${data.coId}','${data.comment}','${data.coTime}','${data.vId}','${data.uId}')`
  );

  // 有且仅有一个
  if (results.affectedRows == 1) {
    ctx.body.success = true;
    ctx.body.code = 200;
    ctx.response.status = 200;
    ctx.body.msg = "评论成功!";
    ctx.body.id = data.coId;
  }
});

// 获取评论通过视频的id
hoemRouter.get("/api/home/GetvideoComments", async (ctx) => {
  ctx.body = {
    info: "获取视频评论",
    code: 500,
    success: false,
    msg: "获取失败！",
  };

  console.log(ctx.query);

  if (ctx.query?.vId) {
    const results = await db.query(
      `select c.coId as id, c.coContent as 'content',c.coTime as 'time',u.uName as 'userName',u.uAvatar as 'avatar',c.ups as ups from comment c , user u WHERE vId = '${ctx.query?.vId}' and c.uId = u.uId ORDER BY c.coTime desc`
    );
    console.log(results);
    // 有且仅有一个
    if (results.length > 0) {
      ctx.body.success = true;
      ctx.body.code = 200;
      ctx.response.status = 200;
      ctx.body.msg = "获取成功!";
      ctx.body.commentList = results;
    } else {
      ctx.body.success = true;
      ctx.body.code = 200;
      ctx.response.status = 200;
      ctx.body.msg = "获取成功但是ㄟ( ▔, ▔ )ㄏ";
      ctx.body.commentList = results;
    }
  }
});

// 点赞评论
hoemRouter.post("/api/comment/up", async (ctx) => {
  ctx.body = {
    info: "点赞接口",
    code: 500,
    success: false,
    msg: "点赞失败",
  };

  // 获取视频id 和 用户id

  // 构造参数
  let data = {
    uId: "",
    cId: "",
  };

  Object.keys(data).map((prop) => {
    data[prop] = ctx.request.body[prop];
  });

  const commentList = await db.query(
    `select * from comment where coId = '${data.cId}'`
  );

  if (commentList.length === 1) {
    const comment = commentList[0];

    // 收藏
    comment.ups += comment.ups ? "," + data.uId : data.uId;

    // 去重
    comment.ups = Array.from(new Set(comment.ups.split(","))).join(",");

    const sql = `update comment set ups='${comment.ups}' where coId='${data.cId}'`;

    const results = await db.query(sql);

    if ((results.changedRows = 1) && results.affectedRows == 1) {
      ctx.body.success = true;
      ctx.body.code = 200;
      ctx.response.status = 200;
      ctx.body.msg = "点赞成功!";
    }
  }
});

module.exports = hoemRouter;
