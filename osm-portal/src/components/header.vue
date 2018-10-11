  <template>
   <el-header class="header_style" >
      <el-row>
        <el-col :span="2"><img src="static/img/logo.png"></el-col>
        <el-col v-if="this.$store.state.user != null" :span="20">欢迎[{{user.userName}}]登录</el-col>
        <el-col :span="2"><router-link to="/login" v-on:click.native="removeInfe">退出登录</router-link></el-col>
      </el-row>
    </el-header>
  </template>
 <script>
 export default {
   data() {
     return {
       //src : require('../assets/uilogo.png')
     }
   },
   methods : {
     removeInfe: function(){
      let url = this.$global.loginBaseUrl+"/secure/logout";
      this.$http.get(url).then((req)=>{
        console.log(req.headers);
        this.$store.dispatch('logout').then(() => {
          this.$router.replace('/login')
        })
      })
     }
   },
   computed:{
     user() {
       return this.$store.state.user
     }
   }
 }
 </script>
 
  
  
