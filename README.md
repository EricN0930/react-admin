# 创建项目

# 样式初始化
npm i reset-css
> reset-css比Normalize.css更直接，干净利落去除默认样式，更适合在企业里的场景

正确的样式引入顺序
* 样式初始化一般放在最前面
* UI框架样式
* 组件的样式

# scss的安装和初步使用
npm i --save-dev sass

# 路径别名的配置
目前ts对@指向src目录的提示是不支持的，vite默认也不支持
所以需要手动配置@符号的指向
在vite。config。ts中添加配置
```TS
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@":path.resolve(__dirname,'./src')
    }
  }
})

```
npm i -D @types/node

# 配置路径别名的提示
虽然路径别名已经有了，但是在文件中输入@是没有提示路径的  
需要在tsconfig。json中，添加两项配置：  
```ts
"baseUrl": "./",
"paths": {
    "@/*": [
    "src/*"
    ]
}
```