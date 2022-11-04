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
    `select * from playground limit ${page * 10},${page * 10 + 10};`
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
    `insert into playground values('${data.pId}','${data.pTime}','${data.pTitle}','${data.pContent}','${data.uId}')`
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


module.exports = playground;