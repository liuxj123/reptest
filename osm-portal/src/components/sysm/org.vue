<template>
  <div class="hello">
   <el-button @click="showText">xxxx</el-button>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      
    }
  },
  methods:{
    showText:function(){
      this.$message({
        message: '恭喜你，这是一条成功消息',
        type: 'success'
      })
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
