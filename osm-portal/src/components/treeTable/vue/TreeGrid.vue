<template>
<div>
    <el-table :data = "data" border="" style="width:100%" :row-style="showTr">
        <el-table-column v-for="(column, key) in columns" :key="key" 
        :label="column.label" :prop="column.prop" :width="column.width">
            <template slot-scope="scope">
                <span v-if="spaceInconShow(key)" class="ms-tree-space" 
                    v-for="(space,levelIndex) in scope.row._level" :key="levelIndex"></span>
                <button class="button is-outlined is-primary is-small" 
                    v-if="toggleIconShow(key,scope.row)" @click="toggle(scope.$index)">
                    <i v-if="!scope.row._expanded" class="el-icon-caret-right" aria-hidden="true"></i>
                    <i v-if="scope.row._expanded" class="el-icon-caret-bottom" aria-hidden="true"></i>
                </button>
                <span v-else-if="key===0" class="ms-tree-space"></span>
                {{scope.row[column.prop]}}
            </template>
        </el-table-column>
        <el-table-column label="操作" v-if="treeType==='normal'" width="260">
            <template slot-scope="scope">
                <el-button v-if="addObjInfo.isAddButton" size="small" @click="handAdd(scope.row)">添加</el-button>
                <el-button v-if="editObjInfo.isEditButton" size="small" @click="handEdit(scope.row)">编辑</el-button>
                <el-button v-if="delObjInfo.isDelButton" type="danger" size="small" @click="handleDel(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    
</div>
</template>

<script>
import Utils from '../utils/index.js'
export default {
    name : 'tree-grid',
    props: {
        //是否需要树形格式化
        treeStructure:Boolean,
        columns:{
            type : Array,
            default:function(){return []}
        },
        dataSource:{
            type : Array,
            default:function(){return []}
        },
        requestUrl:{
           type: String,
           default : function(){return ''}
        },
        treeType:{
            type:String,
            default:function(){return 'normal'}
        },
        defaultExpandAll:{
            type:Boolean,
            default:function(){return false}
        },
        addObjInfo :{
            type:Object,
            default:function(){
                return {
                    isAddButton: true,
                    addUrl : '',
                    addFromItem:[],
                    formRules:{},
                    inputModel:{}
                }
            }
        },
        editObjInfo :{
            type:Object,
            default:function(){
                return {
                    isEditButton: true,
                    editUrl : ''
                }
            }
        },
        delObjInfo :{
            type:Object,
            default:function(){
                return {
                    isDelButton: true,
                    delUrl : ''
                }
            }
        }
    },
    data() {
        return {
            formRules: { //验证
				menuCode: [
					{ required: true, message: '请输入菜单编码', trigger: 'blur' },
					{ min:1,max:30,message:'长度为1-30'}
				],
				menuName: [
					{ required: true, message: '请输入菜单名称', trigger: 'blur' },
					{ min:1,max:40,message:'长度为1-30'}
				],
				menuUrl: [{ min:0,max:40,message:'最长长度为40'}],
				menuDesc: [{ min:0,max:40,message:'最长长度为40'}]
			},

           //添加
            showAddDialog : false,
            addFrom: {
				menuCode: '',menuName: '',menuUrl: '',menuDesc: '',seq:''
            },
            

			closeOnClickModal:false,
			formLabelWidth:'120px'
        }
    },
    computed:{
        data:function(){
            let me = this;
            if(me.treeStructure) {
                let data = Utils.MSDataTransfer.treeToArray(me.dataSource,null,null,me.defaultExpandAll);
                return data;
            }
            return me.dataSource;
        }
    },
    methods:{
        showTr:function(row,index) {//显示行
            let show = (row.row._parent?(row.row._parent._expanded && row.row._parent._show):true);
            row.row._show = show;
            return show?'':'display:none;'
        },
        toggle:function(trIndex){//展开下级
            let me = this;
            let record = me.data[trIndex];
            record._expanded = !record._expanded;
        },
        //显示层级关系的空格和图标
        spaceInconShow :function(index){
            let me = this;
            if(me.treeStructure && index === 0){
                return true;
            }
            return false;
        },
        //点击展开和关闭的时候，图标的切换
        toggleIconShow:function(index,record){
            let me = this;
            if(me.treeStructure && index === 0 && record.childList && record.childList.length > 0){
                return true;
            }
            return false;
        },
        handAdd:function(row){
           
        },
        addObjValue:function(){
           
        },
        handEdit:function(){

        },
        handleDel : function(){

        }
    }
}
</script>
<style scoped>
.ms-tree-space{
    position: relative;
    top: 1px;
    display: inline-block;
    font-size: normal;
    font-weight: 400;
    line-height: 1;
    width: 18px;
    height: 14px;
}
.ms-tree-space::before{content: ""}
table td {
    line-height: 26px;
}
</style>




