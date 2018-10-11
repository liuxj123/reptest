<script>
import Vue from 'vue'
import {Notification,Message} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);

 var notifyError = function(msg) {
     
}

 var notifyInfo = function(msg) {
    Notification.info({
        title:'消息',
        message:msg,
        position: 'bottom-right',
        duration:3500
    })
}

var notifyWarning = function(msg) {
    Notification.error({
        title:'警告',
        message:msg,
        type:'warning',
        position: 'bottom-right',
        duration:3500
    })
}

var notifySuccess = function(msg) {
    Notification.error({
        title:'成功',
        message:msg,
        type:'success',
        position: 'bottom-right',
        duration:3500
    })
}

export default {
   notifyError,notifyInfo,notifyWarning,notifySuccess
}

</script>