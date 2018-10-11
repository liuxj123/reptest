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
        <el-table-column label="操作" v-if="treeType==='normal'" width="350">
            <template slot-scope="scope">
                <el-button v-if="addObjInfo.isAddButton" type="text"  size="small" @click="handAdd(scope.row)">添加</el-button>
                <el-button v-if="editObjInfo.isEditButton" type="text" size="small" @click="handEdit(scope.row)">编辑</el-button>
                <el-button v-if="delObjInfo.isDelButton" type="text"  size="small" @click="handleDel(scope.row)">删除</el-button>
                <el-button v-if="detailObjInfo.isDetailButton" type="text"  size="small" @click="handleDetial(scope.row)">详情</el-button>
                <el-button type="text"  size="small" @click="handleOptRule(scope.row)">操作权限</el-button>
                <el-button type="text"  size="small" @click="handleDataRule(scope.row)">数据权限</el-button>
            </template>
        </el-table-column>
    </el-table>
    <!--添加 -->
    <el-dialog v-if="addObjInfo.isAddButton" title="添加" :visible.sync="showAddDialog" :close-on-click-modal="closeOnClickModal" 
				style="text-align: left;" >
        <el-form :model="addFrom" label-width="100px" :rules="addObjInfo.formRules" ref="addFrom" size="mini">
            <el-form-item label="编码" prop="menuCode">
                <el-input v-model="addFrom.menuCode" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="名称" prop="menuName">
                <el-input v-model="addFrom.menuName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="Url" prop="menuUrl">
                <el-input v-model="addFrom.menuUrl" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="序号" prop="seq">
                <el-input v-model="addFrom.seq" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="menuDesc">
                <el-input type="textarea" v-model="addFrom.menuDesc" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="showAddDialog = false">取 消</el-button>
            <el-button type="primary" @click.native="addObjValue('addFrom')">确 定</el-button>
        </div>
    </el-dialog>

    <!--修改 -->
    <el-dialog v-if="editObjInfo.isEditButton" title="编辑" :visible.sync="showEditDialog" :close-on-click-modal="closeOnClickModal" 
				style="text-align: left;" >
        	<el-form :model="editFrom" label-width="100px" :rules="editObjInfo.formRules" ref="editFrom" size="mini">
				<el-form-item label="名称" prop="menuName">
					<el-input v-model="editFrom.menuName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="Url" prop="menuUrl">
					<el-input v-model="editFrom.menuUrl" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="序号" prop="seq">
					<el-input v-model="editFrom.seq" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="描述" prop="menuDesc">
					<el-input v-model="editFrom.menuDesc" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="showEditDialog = false">取 消</el-button>
				<el-button type="primary" @click.native="editObjValue('editFrom')">确 定</el-button>
			</div>
    </el-dialog>
    <!--详情 -->
    <el-dialog  v-if="detailObjInfo.isDetailButton"  title="查看详情" :visible.sync="showDetailDialog" :close-on-click-modal="closeOnClickModal" 
				style="text-align: left;" >
        <el-form :model="DetailForm" label-width="100px"  ref="DetailForm" size="mini">
            <el-form-item label="基本信息：" class="fi"></el-form-item>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="编码" >
                        <el-input v-model="DetailForm.menuCode" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="序号" >
                        <el-input v-model="DetailForm.seq" ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="名称">
                        <el-input v-model="DetailForm.menuName" ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="Url" >
                        <el-input  v-model="DetailForm.menuUrl" ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="描述" >
                        <el-input type="textarea" v-model="DetailForm.menuDesc" ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            
            <el-form-item label="创建信息：" class="fi"></el-form-item>
            <el-row>
                <el-col :span="12" >
                    <el-form-item label="创建人" >
                        <el-input v-model="DetailForm.createName" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="创建时间" >
                        <el-input v-model="DetailForm.createTime" ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="修改信息：" class="fi"></el-form-item>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="修改人">
                        <el-input v-model="DetailForm.updateName" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="修改时间">
                        <el-input v-model="DetailForm.updateTime" ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="showDetailDialog = false">确 定</el-button>
        </div>
    </el-dialog>
    
     <!--操作权限 -->
    <dialog-modal ref="optdiamodal" :modalObj="optModalObj" :modalShow.sync="showOptRuleDialog" 
			:closeOnClickModal="closeOnClickModal" :queryParams="optqueryParams" :optionObj="optOptionObj"
            :addUrl="optAddUrl" :editUrl="optEditUrl"></dialog-modal>

     <!--数据权限 -->
    <dialog-data ref="drdiamodal" :modalObj="dataRuleModalObj" :modalShow.sync="showDataRuleDialog" 
			:closeOnClickModal="closeOnClickModal" :queryParams="dataRulequeryParams" :optionObj="dataRuleOptionObj"
            :addUrl="dataRuleAddUrl" :editUrl="dataRuleEditUrl"></dialog-data>

</div>
</template>

<script>
import Utils from '../../components/treeTable/utils/index.js'
import optdialog from "./menuOptRule";
import dataRuledialog from "./menuDataRule";
export default {
    name : 'menu-tree',
    components : {
        'dialog-modal':optdialog,
        'dialog-data':dataRuledialog
    },
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
                    formRules:{}
                }
            }
        },
        editObjInfo :{
            type:Object,
            default:function(){
                return {
                    isEditButton: true,
                    editUrl : '',
                    formRules:{}
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
        },
        detailObjInfo:{
            type:Object,
            default:function(){
                return {
                    isDetailButton: true,
                    DetailUrl : ''
                }
            }
        }
    },
    data() {
        return {
           //添加
            showAddDialog : false,
            addFrom: {
				id:0,menuCode: '',menuName: '',menuUrl: '',menuDesc: '',seq:''
            },
            //修改
            showEditDialog : false,
            editFrom: {
				id:0,menuCode: '',menuName: '',menuUrl: '',menuDesc: '',seq:''
            },
            //
            showDetailDialog:false,
            DetailForm: {},

            //操作权限
            showOptRuleDialog:false,
            optModalObj :{
                'title':'操作权限列表',
                'listUrl':this.$global.sysmBaseUrl+"/menus/operation/list"
            },
            optOptionObj :{isOpt : true,wid : 200,optUrl:this.$global.sysmBaseUrl+"/menus/operation/delete"},
            optqueryParams:{index:0,count:200, menuId:0},
            optAddUrl:this.$global.sysmBaseUrl+"/menus/operation/create",
            optEditUrl:this.$global.sysmBaseUrl+"/menus/operation/update",

            //数据权限
            showDataRuleDialog:false,
            dataRuleModalObj :{
                'title':'操作权限列表',
                'listUrl':this.$global.sysmBaseUrl+"/menus/datarule/list"
            },
            dataRuleOptionObj :{isOpt : true,wid : 200,optUrl:this.$global.sysmBaseUrl+"/menus/datarule/delete"},
            dataRulequeryParams:{index:0,count:200, menuId:0},
            dataRuleAddUrl:this.$global.sysmBaseUrl+"/menus/datarule/create",
            dataRuleEditUrl:this.$global.sysmBaseUrl+"/menus/datarule/update",

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
            this.showAddDialog = true;
            this.addFrom.id=row.id;
            //每次弹出弹窗，保证里面没有前一次的输入内容
			if(this.$refs['addFrom'] !== undefined) {
				this.$refs['addFrom'].resetFields();
            }
        },
        addObjValue:function(formName){
            this.$refs[formName].validate((valid)=>{
				if(valid) {
					this.showAddDialog = false;
					let url = this.addObjInfo.addUrl;
					var para = Object.assign({},this.addFrom);
					this.$http.post(url,para).then(
						(resp)=>{
							var respData = resp.data;
							if(respData.retCode == this.$global.success) {
                                this.$notifyTag('成功','添加菜单成功！','success');
								this.$emit('childMethod');
							}else{
								this.$notifyTag('错误',respData.retInfo+'['+respData.retCode+']','error');
							}
						}
					)
				} 
			})
        },
        handEdit:function(row){
            this.showEditDialog = true;
            this.editFrom = Object.assign({},row);
        },
        editObjValue:function(formName){
            this.$refs[formName].validate((valid)=>{
				if(valid) {
					this.showEditDialog = false;
					let url = this.editObjInfo.editUrl;
                    var para = Object.assign({},this.editFrom);
                    alert(this.editFrom);
					this.$http.post(url,para).then(
						(resp)=>{
							var respData = resp.data;
							if(respData.retCode == this.$global.success) {
								this.$notifyTag('成功','修改菜单成功！','success');
								this.$emit('childMethod');
							}else{
								this.$notifyTag('错误',respData.retInfo+'['+respData.retCode+']','error');
							}
						}
					)
				} 
			})
        },
        handleDel : function(row){
            this.$confirmTag('此操作将永久删除该文件, 是否继续?',()=>{
				let url = this.delObjInfo.delUrl+"/"+row.id;
				this.$http.delete(url).then(
					(resp)=>{
						var respData = resp.data;
						if(respData.retCode == this.$global.success) {
							this.$notifyTag('成功','删除菜单成功！','success');
							this.$emit('childMethod');
						}else{
							this.$notifyTag('错误',respData.retInfo+'['+respData.retCode+']','error');
						}
					}
				)
			});
        },
        handleDetial : function(row){
            let url = this.detailObjInfo.DetailUrl+"/"+row.id;
            this.$http.get(url).then(
                (resp)=>{
                    var respData = resp.data;
                    if(respData.retCode == this.$global.success) {
                        this.showDetailDialog = true;
                        this.DetailForm = respData.data;
                    }else{
                        this.showDetailDialog = false;
                        this.$notifyTag('错误',respData.retInfo+'['+respData.retCode+']','error');
                    }
                }
            )
        },
            
        handleOptRule : function(row) {
            this.optqueryParams.menuId = row.id;
			this.showOptRuleDialog = true;
			this.$refs['optdiamodal'].getList();
        },
        handleDataRule : function(row) {
            this.dataRulequeryParams.menuId = row.id;
			this.showDataRuleDialog = true;
			this.$refs['drdiamodal'].getList();
        },
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




