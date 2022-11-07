const Router = require("koa-router");
const playground = new Router();
const db = require("../utils/db");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

// 获取广场列表
playground.get("/api/playground", async (ctx) => {
  ctx.body = {
    info: "获取广场列表",
    code: 500,
    success: false,
    msg: "获取失败！",
  };
  console.log(ctx.query);
  const page = ctx.query.page || 0;

  const results = await db.query(
    `SELECT
    p.pId,
    pTime,
    pTitle,
    pContent,
    u.uId,
    uName,
    uAvatar,
    p.ups,
    collections,
    count(r.rId) as comments
  FROM
    playground p
  LEFT JOIN user u ON p.uId = u.uId
  LEFT JOIN reply r ON p.pId = r.pId
  GROUP BY (p.pId) ORDER BY p.pTime desc
  LIMIT ${page * 10},${page * 10 + 10}`
  );

  ctx.body.playgroundList = results;
  ctx.body.success = true;
  ctx.body.code = 200;
  ctx.response.status = 200;
  ctx.body.msg = "获取成功!";
});

// 发布内容
playground.post("/api/playground/post", async (ctx) => {
  ctx.body = {
    info: "增加帖子接口",
    code: 500,
    success: false,
    msg: "发布失败！",
  };

  // 构造参数
  let data = {
    pId: "",
    pTime: "",
    uId: "",
    pTitle: "",
    pContent: null,
  };

  Object.keys(data).map((prop) => {
    data[prop] = ctx.request.body[prop];
  });

  data.pId = uuidv4();

  data.pTime = moment().format("YYYY-MM-DD HH:mm");

  const results = await db.query(
    `insert into playground values('${data.pId}','${data.pTime}','${data.pTitle}','${data.pContent}','0','${data.uId}')`
  );

  // 有且仅有一个
  if (results.affectedRows == 1) {
    ctx.body.success = true;
    ctx.body.code = 200;
    ctx.response.status = 200;
    ctx.body.msg = "发布成功!";
    ctx.body.id = data.pId;
  }
});

// 发布点赞
playground.post("/api/playground/up", async (ctx) => {
  ctx.body = {
    info: "帖子点赞接口",
    code: 500,
    success: false,
    msg: "点赞失败！",
  };

  // 构造参数
  let data = {
    pId: "",
    ups: 0,
  };

  Object.keys(data).map((prop) => {
    data[prop] = ctx.request.body[prop];
  });

  data.ups = +data.ups + 1;

  const results = await db.query(
    `update  playground set ups = ${data.ups} where pId = '${data.pId}' `
  );

  // 有且仅有一个
  if (results.affectedRows == 1) {
    ctx.body.success = true;
    ctx.body.code = 200;
    ctx.response.status = 200;
    ctx.body.msg = "点赞成功!";
  }
});

module.exports = playground;
