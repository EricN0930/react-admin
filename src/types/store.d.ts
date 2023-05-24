// 【重点】d.ts 文件仅在没有任何导入时才被视为环境模块声明.如果您提供了一个导入行，它现在被视为
// 一个普通的模块文件，而不是全局文件！！！

// 【重点】类型声明不要直接使用引入 import...from...   而是 使用 import("@/...")这种语法

// TS中提供了ReturnType，用来获取函数类型的返回值类型
type RootState = ReturnType<typeof import('@/store/index.ts').getState>;

interface Window{
    __REDUX_DEVTOOLS_EXTENSION__: function;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: function;
}