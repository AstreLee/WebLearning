// 1. 首先引入express
const express = require("express");
// 2. 创建应用对象
const App = express();


// 3. 创建路由规则
// request是对请求报文的封装
// response是对相应报文的封装
// 这个是get方式的路由，post方法是用不到的
App.get('/test', (request, response) => {
    // 设置响应头，设置允许跨域
    response.setHeader('Access-Control-Allow-Origin', '*');
    // 设置所有的响应头都可以接收
    response.setHeader('Access-Control-Allow-Headers', '*');
    // 设置响应体
    response.send('这是服务器端传来的消息');
})

// 接下来设置post方式的路由
App.post('/test', (request, response) => {
    // 设置响应头 设置允许跨域
    response.setHeader('Access-Control-Allow-Origin', '*');
    // 设置服务端的相应内容
    response.send("这是服务端发送的内容!");
})

// 配置post请求处理JSON字符串的路由, all表示的所有方式都可以
App.all('/json-post', (request, response) => {
    // 设置响应头 设置允许跨域
    response.setHeader('Access-Control-Allow-Origin', '*');
    // 创建对象
    const obj = {
        name: '张三',
        age: 12,
        address: 'Hubei WuHan HuBei University'
    }
    // 再从服务端发送出去
    response.send(JSON.stringify(obj));
})

// 请求超时和网络异常的处理
App.all('/delay', (request, response) => {
    // 设置请求头允许跨域
    response.setHeader('Access-Control-Allow-Origin', '*');
    setTimeout(() => {
        response.send('延时响应');
    }, 3000);
    // // 服务端发送消息
    // response.send(JSON.stringify(obj));
})

// JQuery发送AJAX请求
App.all('/jquery-server', (request, response) => {
    // 设置请求头允许跨域
    response.setHeader('Access-Control-Allow-Origin', '*');
    // 返回JSON字符串格式的内容
    const obj = { name: 'Jay' };
    // 然后服务端发送请求
    response.send(JSON.stringify(obj));
})

// axios发送请求
App.all('/axios-server', (request, response) => {
    // 设置请求头 设置允许跨域
    response.setHeader('Access-Control-Allow-Origin', '*');
    // 设置所有的响应头都可以接收
    response.setHeader('Access-Control-Allow-Headers', '*');
    // 发送JSON格式的字符串的内容
    const obj = { name: 'Jay' };
    // 然后服务端发送请求
    response.send(JSON.stringify(obj));
})
// 4. 监听端口的启动事务
App.listen("8000", () => {
    console.log("服务器端已经启动成功，等待客户机连接");
})