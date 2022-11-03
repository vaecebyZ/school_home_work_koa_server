const Router = require("koa-router");
const userRouter = new Router();
const db = require("../utils/db");
const { v4: uuidv4 } = require("uuid");

userRouter.get("/api/user/login", async (ctx) => {
  ctx.body = "用户页面登录";
});

// 登陆
userRouter.post("/api/user/login", async (ctx) => {
  ctx.body = {
    info: "用户页面登录API",
    code: 500,
    success: false,
    msg: "登陆失败！",
  };

  ctx.response.status = 500;

  ctx.type = "json";

  // 构造参数
  let data = {
    username: "",
    password: "",
  };

  Object.keys(data).map((prop) => {
    data[prop] = ctx.request.body[prop];
  });

  const results = await db.query(
    `select * from user where uName='${data.username}' and uPassword='${data.password}'`
  );
  // 有且仅有一个
  if (results.length == 1) {
    console.log(results);
    ctx.body.success = true;
    ctx.body.code = 200;
    ctx.response.status = 200;
    ctx.body.userInfo = results[0];
    ctx.body.msg = "登陆成功!";
  }
});

// 注册
userRouter.post("/api/user/register", async (ctx) => {
  ctx.body = {
    info: "用户页面注册API",
    code: 500,
    success: false,
    msg: "注册失败！",
  };

  // 构造参数
  let data = {
    username: "",
    password: "",
  };

  Object.keys(data).map((prop) => {
    data[prop] = ctx.request.body[prop];
  });

  data.id = uuidv4();
  data.uAvatar =
    "https://tse2-mm.cn.bing.net/th/id/OIP-C.c36jg2W8pElNPnVS9kHY_AHaHa?pid=ImgDet&rs=1";

  const results = await db.query(
    `insert into user (uId,uName,uPassword,uAvatar) values('${data.id}','${data.username}','${data.password}','${data.uAvatar}')`
  );

  // 有且仅有一个
  console.log(results);
  if (results.affectedRows == 1) {
    if (results.length == 1) {
      ctx.body.success = true;
      ctx.body.code = 200;
      ctx.response.status = 200;
      ctx.body.msg = "注册成功!";
      ctx.body.id = data.id;
    }
  }
});

// 更改用户名
userRouter.post("/api/user/setusername", async (ctx) => {
  ctx.body = {
    info: "修改用户名API",
    code: 500,
    success: false,
    msg: "修改失败！",
  };

  // 构造参数
  let data = {
    uName: "",
    uId: "",
    oldUName: "",
  };

  Object.keys(data).map((prop) => {
    data[prop] = ctx.request.body[prop];
  });

  console.log(data);

  const results = await db.query(
    `UPDATE user set uName="${data.uName}" where uName="${data.oldUName}" and uId="${data.uId}"`
  );
  // 有且仅有一个
  if (results.changedRows == 1 && results.affectedRows == 1) {
    console.log(results);
    ctx.body.success = true;
    ctx.body.code = 200;
    ctx.response.status = 200;
    ctx.body.msg = "修改成功!";
  }
});

// 更改密码
userRouter.post("/api/user/setuserpwd", async (ctx) => {
  ctx.body = {
    info: "修改用户名密码",
    code: 500,
    success: false,
    msg: "修改失败！",
  };

  // 构造参数
  let data = {
    uPassword: "",
    uOldPassword: "",
    uId: "",
  };

  Object.keys(data).map((prop) => {
    data[prop] = ctx.request.body[prop];
  });

  console.log(data);

  const results = await db.query(
    `UPDATE user set uPassword="${data.uPassword}" where uId="${data.uId}" and uPassword="${data.uOldPassword}"`
  );
  // 有且仅有一个
  if ((results.changedRows = 1) && results.affectedRows == 1) {
    console.log(results);
    ctx.body.success = true;
    ctx.body.code = 200;
    ctx.response.status = 200;
    ctx.body.msg = "修改成功!";
  }
});

module.exports = userRouter;
