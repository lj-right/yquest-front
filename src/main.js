import Vue from 'vue'
import App from './App.vue'
import router from './router'
//import ElementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios';
import store from './store'


Vue.config.productionTip = false
Vue.use(ElementUI);

// 请求拦截器
axios.interceptors.request.use(
  config => {
    // 从localStorage中获取token
    const token = localStorage.getItem('token');
    if (token) {
      // 将token添加到请求头中，通常使用Authorization字段
      config.headers['Authorization'] = token;
      // 或者根据后端要求，可能直接是token，不加Bearer
      // config.headers['Authorization'] = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
