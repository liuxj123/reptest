<template>
  <div class="login-bg">
    <div class="login-content">
      <!--<span><img src="../../static/image/logo.png"></span>-->
      <span><h1>{{ msg }}</h1></span>
      <div style="width:400px;height:300px; margin: auto; background-color: #fff;">
        <h2>用户登录</h2>
        <el-form ref="loginForm" :model="loginForm" :rules="checkLogin" class="login-form">
          <el-form-item prop="username">
            <el-input type="text" v-model="loginForm.username" placeholder="注册的名称"></el-input>
          </el-form-item>
          <el-form-item  prop="password">
            <el-input type="password" v-model="loginForm.password" placeholder="密码"></el-input>
          </el-form-item>

          <el-form-item>
            <button  class="el-button--primary " style="width:60px;margin-right:30px;" @click="submitLogin('loginForm')">提交</button>
            <el-button type="text" >忘记密码</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'UHome OS 管理系统 ',
      loginForm : {
        username:'',
        password:''
      },
      checkLogin:{
        username:[
          {required:true,message:'请输入登录名',trigger:'blur'}
        ],
        password:[
          {required:true,message:'请输入密码',trigger:'blur'},
          {min:6,max:16,message:'长度在6-16个字符'}
        ]
      }
    }
  },
  methods:{
    submitLogin:function(formName){
      this.$refs[formName].validate(
        (valid)=>{
          if(valid){
            var params = {
              'userName':this.loginForm.username,
              'password':this.loginForm.password,
              'loginFlag':'login'
            }
            let url = this.$global.loginBaseUrl+"/login";
            this.$http.post(url ,params).then(
              function(resp){
                //console.log(resp.status);
                var respData = resp.data;
                if(respData.retCode == this.$global.success) {
                  //保存数据
                  this.$store.dispatch('login',respData.data).then(()=>{
                    this.$router.push({path: 'home'});
                  })
                }else {
                  this.$notifyTag('错误',respData.retInfo+'['+respData.retCode+']','error');
                }
              }.bind(this))
              .catch(()=>{
                this.loginForm.username="";
                this.loginForm.password="";
                this.$router.push({path:'/login'});})
            
          }else{
            return false
          }
        }
      );
      
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
