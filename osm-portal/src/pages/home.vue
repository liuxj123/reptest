<template>
<div>
  <el-container >
   <v-header></v-header>
  </el-container>
  <el-container style=" border: 1px solid #eee">
    <v-aside></v-aside>
  <el-container>
    <router-view />
  </el-container>
</el-container>
</div>
</template>
<script>
import HeaderComponent from "@/components/header.vue";
import AsideComponent from "./aside.vue";

export default {
  components:{
    'v-header': HeaderComponent,
    'v-aside': AsideComponent,
  }
}
</script>





