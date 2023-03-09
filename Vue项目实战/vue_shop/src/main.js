import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
// 导入树形插件
import TreeTable from 'vue-table-with-tree-grid'


import axios from 'axios'
// // 配置请求的根路径，这样以后发起请求的时候就不用写那么长的根路径了，直接在根路径的基础上写就可以了
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 在将$http挂载到Vue的原型前，我们先要通过axios拦截添加的token，保证拥有获取数据的权限
// request就是请求拦截器，use可以挂载到回调函数身上
axios.interceptors.request.use(config => {
    // 为请求头对象添加Token验证的Authorization对象
    config.headers.Authorization = window.sessionStorage.getItem('token');
    return config;
})

Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

// 定义一个全局过滤器
Vue.filter('dateFormat', function(originVal) {
    const dt = new Date(originVal);
    const y = dt.getFullYear();
    // 长度不足2的话自动补齐0(开头补齐)
    const m = (dt.getMonth() + 1 + '').padStart(2, '0');
    // 长度不足2的话自动补齐0(开头补齐)
    const d = (dt.getDate() + '').padStart(2, '0');

    const hh = (dt.getHours() + '').padStart(2, '0');
    const mm = (dt.getMinutes() + '').padStart(2, '0');
    const ss = (dt.getSeconds() + '').padStart(2, '0');

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
})
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
