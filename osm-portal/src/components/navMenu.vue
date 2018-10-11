 <template>
  <div>
    <label v-for="menu  in menuDate" :key="menu.id">
          <el-menu-item v-if="menu.children ==null || menu.children.length == 0"  
            :key="menu.id" :index="menu.menuCode" :route="menu.menuUrl" >
            {{menu.menuName}}
          </el-menu-item>

          <el-submenu v-if="menu.children !=null && menu.children.length != 0"  :key="menu.id" :index="menu.menuCode" >
            <template slot="title">{{menu.menuName}}</template>
            <navMenu :menuDate="menu.children"></navMenu>
          </el-submenu>
      </label>
    </div>
 </template>
 <script>
 export default {
   name:"navMenu",
   props:['menuDate'],
   data() {return {}},
   methods :{}
 }
 </script>
 
 