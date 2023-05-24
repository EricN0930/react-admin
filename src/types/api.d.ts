// 定义请求参数的类型 和 响应的类型

// 验证码的响应类型
interface CaptchaAPIRes {
  msg: string;
  img: string;
  code: number;
  captchaEnabled: boolean;
  uuid: string;
}

// 登录的请求类型
interface LoginAPIReq {
  username: string;
  password: string;
  code: string;
  uuid: string;
}

// 登录的响应类型
interface LoginAPIRes {
  msg: string;
  code: number;
  token: string;
}