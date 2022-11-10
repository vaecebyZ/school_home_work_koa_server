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
  const avatarList = [
    "https://pic1.zhimg.com/v2-d7095281998e30c486882935cdf7e99b_r.jpg",
    "https://tse1-mm.cn.bing.net/th/id/OIP-C.bCTQ1iSPSQ4xwq0K-TcTyQHaHa?pid=ImgDet&rs=1",
    "https://tse2-mm.cn.bing.net/th/id/OIP-C.c36jg2W8pElNPnVS9kHY_AHaHa?pid=ImgDet&rs=1",
    "https://ts1.cn.mm.bing.net/th/id/R-C.447972fd1186db3382e82ca5f0733035?rik=ATXIfhOHz2VjfQ&riu=http%3a%2f%2fn.sinaimg.cn%2fsinacn20117%2f560%2fw1080h1080%2f20190325%2ff1fe-hutwezf2949681.jpg&ehk=yhcsB71DLQluD9rErmqr8hJ994y9yyUxe9ZJtUdqiWk%3d&risl=&pid=ImgRaw&r=0",
    "https://p.qqan.com/up/2020-7/15935823062386442.jpg",
    "https://tse1-mm.cn.bing.net/th/id/OIP-C.CmWZ7JOG-pt-e6AkR9L28QHaHa?pid=ImgDet&rs=1",
    "https://ts1.cn.mm.bing.net/th/id/R-C.9b6a1e1c5622e07e498cbc39b4c9967e?rik=MR2ssNfsaW0xGw&riu=http%3a%2f%2fwx1.sinaimg.cn%2flarge%2f6970ad11gy1fq65h6svquj20ku0kl77j.jpg&ehk=L%2ff7uLodtYsxj3vuZayL%2bOQ5S08%2fEaf%2bndD2rrridpY%3d&risl=&pid=ImgRaw&r=0",
    "https://biaoqingba.cn/wp-content/uploads/2022/09/858d0b33dd3aba7.gif",
    "https://biaoqingba.cn/wp-content/uploads/2022/09/061dd90d79aa92d.gif",
    "https://tse4-mm.cn.bing.net/th/id/OIP-C.G1xy2uChRzvE2nbQEMuvjwHaDW?pid=ImgDet&rs=1",
  ];
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
  data.uAvatar = avatarList[Math.floor(Math.random() * 10)];

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
