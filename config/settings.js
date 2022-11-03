let options_mysql = {
  host: "localhost",
  user: "root",
  password: "123456",
  database: "learndb",
}
let options_jwt = {
  jwt_key: 'jwt_key', //jwt密钥
  expiresIn: 60 * 60 * 24 * 3, //3天后过期
  pathNoAuth: ['/', '/login', '/system/user/existence'] //无须身份校验的路径。
}

let options_port = {
  development: 3000, //开发环境端口
  production: 3001 //生产环境端口。线上服务端端口
}

module.exports = {
  options_mysql, options_jwt, options_port
}