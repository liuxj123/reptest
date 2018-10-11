<template>
  <el-aside width="210px" style="border: 1px solid #eee">
    <el-menu router :default-active="$route.path" >
        <label v-for="menu  in menuDate" :key="menu.id">
          <el-menu-item v-if="menu.children ==null || menu.children.length == 0"  
            :key="menu.id" :index="menu.menuCode" :route="menu.menuUrl">
            {{menu.menuName}}
          </el-menu-item>

          <el-submenu v-if="menu.children !=null && menu.children.length != 0"  :key="menu.id" :index="menu.menuCode">
            <template slot="title">{{menu.menuName}}</template>
            <nav-menu :menuDate="menu.children"></nav-menu>
          </el-submenu>
      </label>
    </el-menu>
  </el-aside>
</template>
<style>
  .el-aside {
    color: #333;
    text-align: left
  }
</style>
<script>
import NavMenuComponent from "@/components/navMenu.vue";
export default {
  components:{
    "nav-menu":NavMenuComponent,
  },
  data() {
    return {
      menuStr : '',
      menuDate : []
    }
  },
  created: function () {
    this.getMenus();
  },
  methods:{
    getMenus: function(){
      var responseDate = [
        {
          'menuName':'修改密码',
          'id' : 1,
          'menuCode' : 'updatePwd',
          'menuUrl' : '/home/header'
        },
        {
          'menuName':'系统信息',
          'id' : 2,
          'menuCode' : 'sysInfo',
          'children' :[
            {
              'menuName':'组织结构',
              'id' : 3,
              'menuCode' : 'org',
              'menuUrl':'/home/org'
            },
            {
              'menuName':'菜单管理',
              'id' : 4,
              'menuCode' : 'menu',
              'menuUrl':'/home/menus'
            },
            {
              'menuName':'角色管理',
              'id' : 13,
              'menuCode' : 'role',
              'menuUrl':'/home/roles'
            },
            {
              'menuName':'用户管理',
              'id' : 5,
              'menuCode' : 'user',
               'children' :[
                {
                  'menuName':'列表信息',
                  'id' : 6,
                  'menuCode' : 'userList',
                  'menuUrl':'/home/org'
                }
              ]
            }
          ]
        },
        {
          'menuName':'生产体系',
          'id' : 7,
          'menuCode' : 'product',
          'children' :[
            {
              'menuName':'XXXX',
              'id' : 8,
              'menuCode' : 'proList',
              'menuUrl':'/home/header'
            },
            {
              'menuName':'BBB',
              'id' : 9,
              'menuCode' : 'bbb',
              'menuUrl':'/home/org'
            }
          ]
        },
        {
          'menuName':'OAT',
          'id' : 10,
          'menuCode' : 'ota',
          'children' :[
            {
              'menuName':'ccc',
              'id' : 11,
              'menuCode' : 'ccc',
              'menuUrl':'/home/footer'
            },
             {
              'menuName':'DDD',
              'id' : 12,
              'menuCode' : 'ddddd',
              'menuUrl':'/home/header'
            }
          ]
        }
      ]
    //alert(responseDate.length);
      this.menuDate = responseDate;
    }
  }
}
</script>






