// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './vuex'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题

import axios from 'axios'
import "../static/css/main.css";
import "../static/css/color-dark.css";     /*深色主题*/
import "../static/css/comment.css";

import global from './components/global'
import {Notification,Message} from 'element-ui'

Vue.use(ElementUI);

//这样写法，在其他组件中可以用this.$http使用，
Vue.prototype.$http = axios;
//全局变量
Vue.prototype.$global = global;
//Loading.service(options);
axios.interceptors.request.use(
  config=>{
    var loginFlag = '';
    if(config.data && config.data.loginFlag != null && config.data.loginFlag != '') {
      loginFlag = config.data.loginFlag;
    }
    
    var token = store.state.token;
    if(loginFlag == null || loginFlag == '') {
      if(token != null && token != '') {
        config.headers.Authorization = 'Bearer ' + token;
      }
    }
    return config;
  },
  error=>{
    return Promise.reject(error);
  }
)

axios.interceptors.response.use(
  response => {
   return response
  },
  error => {
    let respdata  = error.response;
    if(respdata) {
      switch (respdata.status) {
        case 401:
          if(respdata.data.retCode == global.notToken 
            || respdata.data.retCode == global.TokenInv) {
              //在main.js中如果要使用element-ui中的消息组件，必须单独引用，
              //像这样：import {Notification,Message} from 'element-ui'
              //使用如下：
            Notification({
              title: '错误',
              message: error.response.data.retInfo+'['+error.response.data.retCode+']',
              position: 'bottom-right',
              type: 'error'
            });
            router.push({path:'/login'});
            
          }else{
            Notification({
              title: '错误',
              message: error.response.data.retInfo+'['+error.response.data.retCode+']',
              position: 'bottom-right',
              type: 'error'
            });
          }
         break
        default:
        Notification({
          title: '错误',
          message: '请求错误，请重新尝试',
          position: 'bottom-right',
          type: 'error'
        });
         break
       }
    }
   return Promise.reject(error)
  }
 )

 router.beforeEach((to, from, next) => {
  var token = store.state.token;
  if(!token && to.path != '/login') {
    next('/login')
  } else {
    next()
  }
  /*if (to.meta.requiresAuth) {// 判断是否需要登录权限
    alert("xxxxxxxxxxxxxxxxx");
    if (store.state.token) {// 判断是否登录
      alert("wwwwwwwwwwwwwwwww");
      next()
    } else {// 没登录则跳转到登录界面
      alert("gggggggggggggggg");
      next({
        path: '/login',
        query: {redirect: to.fullPath}
      })
    }
  } else {
    alert("yyyyyyyyyyyyyyyyy");
    next()
  }*/
})

/**
 * Message消息提示框
 * @param {*} msg :提示消息内容
 * @param {*} msgType ：消息框显示类型success/warning/info/error
 */
Vue.prototype.$messaageTag = function(msg,msgType) {
  this.$message({
    showClose: true,
    message: msg,
    type: msgType
  });
}

/**
 * Notification 消息提示框
 * @param {*} title 提示框标题 
 * @param {*} msg 消息
 * @param {*} notifyType 类型success/warning/info/error
 */
Vue.prototype.$notifyTag = function(title,msg,notifyType) {
  this.$notify({
    title: title,
    message: msg,
    position: 'bottom-right',
    type: notifyType
  });
}

/**
 * confirm 弹窗
 * @param {*} info 提示信息
 * @param {*} OkCbFun 点击确定按钮后的回调函数
 * @param {*} removeCbFun 点击取消按钮后的回调函数
 */
Vue.prototype.$confirmTag = function(info,OkCbFun,removeCbFun){
  this.$confirm(info, '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning' ,closeOnClickModal:false,
    beforeClose: (action, instance, done) => {
      done(); // 就是它!
    }
  }).then(() => {
    if(typeof OkCbFun === "function") {
      OkCbFun()
    } else {
      this.$messaageTag('此次操作成功！','success')
    }
  }).catch(() => {
    if(typeof removeCbFun === "function") {
      removeCbFun()
    } else {
      this.$messaageTag('已取消此次操作！','info')
    }       
  });
}

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
