/**
 * 函数名：mineReadFile
 * 参数：文件路径path
 * 返回值：Promise对象
 */
function mineReadFile(path) {
    return new Promise((resolve, reject) => {
        require('fs').readFile(path, (err, data) => {
            if (err)  reject(err);
            else resolve(data);
        })
    })
}

// 接下来就是调用我们的这个mineReadFile函数
mineReadFile('./resource/content.txt')
.then(value => {
    // 注意value本身就是一个buffer对象，所以要用toString()进行转换
    console.log(value.toString());
}, reason =>{
    console.log(reason);
})