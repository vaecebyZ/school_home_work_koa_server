const Koa = require("Koa");
const Router = require("koa-router"); // 引入koa-router
const app = new Koa();
const port = 1213;
const router = new Router(); // 创建路由，支持传递参数
const userRouter = require("./api/user");
const homeRouter = require("./api/home");
const playground = require("./api/playground");
const bodyParser = require('koa-bodyparser')

app.use(bodyParser())

router.redirect("/", "/home");

// 首页目录
app.use(homeRouter.routes());
app.use(homeRouter.allowedMethods());

// 用户接口
app.use(userRouter.routes());
app.use(userRouter.allowedMethods());


// 广场接口
app.use(playground.routes());
app.use(playground.allowedMethods());

// index配置
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port, () => {
  console.log("项目启动成功在:http://127.0.0.1:" + port + "!");
});
