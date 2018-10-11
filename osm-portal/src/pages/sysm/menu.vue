<template>
<div class="table">
	<div class="crumbs">
		<el-breadcrumb separator="/">
			<el-breadcrumb-item><i class="el-icon-tickets"></i> 组织机构</el-breadcrumb-item>
		</el-breadcrumb>
	</div>

	<div class="container">
		<div class="handle-box">
			<el-button type="primary" icon="search"  @click="addMenu">添加</el-button>
		</div>

		<div class="hello">
			<tree-grid :columns="columns" :tree-structure="true" :data-source="dataSource"  v-on:childMethod="getMenusList"
			:addObjInfo="addObjInfo" :editObjInfo="editObjInfo" :delObjInfo="delObjInfo" 
			:detailObjInfo="detailObjInfo"></tree-grid>
		</div>
	</div>
	<el-dialog title="添加" :visible.sync="showAddDialog" :close-on-click-modal="closeOnClickModal" 
				style="text-align: left;" >
        <el-form :model="addMenuFrom" label-width="100px" :rules="formRules" ref="addMenuFrom" size="mini">
			<el-form-item label="编码" prop="menuCode">
				<el-input v-model="addMenuFrom.menuCode" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="名称" prop="menuName">
				<el-input v-model="addMenuFrom.menuName" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="Url" prop="menuUrl">
				<el-input v-model="addMenuFrom.menuUrl" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="序号" prop="seq">
				<el-input v-model="addMenuFrom.seq" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="描述" prop="menuDesc">
				<el-input v-model="addMenuFrom.menuDesc" auto-complete="off"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="showAddDialog = false">取 消</el-button>
			<el-button type="primary" @click.native="addMenuValue('addMenuFrom')">确 定</el-button>
		</div>
    </el-dialog>
</div>
</template>
<style>
</style>

<script>
import TreeGrid from './menuTreeGrid'
//import TreeGrid from '../../components/treeTable/vue/TreeTable'
export default {
  data(){
    return {
			dataSource:[] ,
			columns: [
				{	label: '菜单编码',	prop: 'code',	width:200},
				{	label: '菜单名称',	prop: 'menuName',	width:120},
				{	label: '菜单URL',	prop: 'menuUrl',	width:200},
				{	label: '序号',	prop: 'seq',	width:80}
			],
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
			addMenuFrom: {
				menuCode: '',menuName: '',menuUrl: '',menuDesc: '',seq:''
			},

			closeOnClickModal:false,
			formLabelWidth:'120px',

			//子模块信息
			addObjInfo:{
				isAddButton:true,
				addUrl:this.$global.sysmBaseUrl+"/menus/create"
			},
			editObjInfo:{
				isEditButton:true,
				editUrl:this.$global.sysmBaseUrl+"/menus/update"
			},
			delObjInfo:{
				isDelButton:true,
				delUrl:this.$global.sysmBaseUrl+"/menus/delete"
			},
			detailObjInfo:{
				isDetailButton:true,
				DetailUrl:this.$global.sysmBaseUrl+"/menus/query"
			},
			
		}
  },
  components: {
    TreeGrid
	},
	methods:{
		handleCurrentChange:function(val){
			this.currentRow = val;
			this.getMenusList();
		},
		getMenusList:function(){
			let url = this.$global.sysmBaseUrl+"/menus/list";
			this.$http.post(url).then(
				function(resp){
					var respData = resp.data;
					console.log(respData);
					if(respData.retCode == this.$global.success) {
						this.dataSource = respData.data;
					}else {
						this.$notifyTag('错误',respData.retInfo+'['+respData.retCode+']','error');
					}
				}.bind(this)
			)
		},
		addMenu:function(){
			this.showAddDialog = true;
			//每次弹出弹窗，保证里面没有前一次的输入内容
			if(this.$refs['addMenuFrom'] !== undefined) {
				this.$refs['addMenuFrom'].resetFields();
			}
		},
		addMenuValue: function(formName){
			this.$refs[formName].validate((valid)=>{
				if(valid) {
					this.showAddDialog = false;
					let url = this.$global.sysmBaseUrl+"/menus/create";
					var para = Object.assign({},this.addMenuFrom);
					this.$http.post(url,para).then(
						(resp)=>{
							var respData = resp.data;
							if(respData.retCode == this.$global.success) {
								this.$notifyTag('成功','添加菜单成功！','success');
								this.getMenusList();
							}else{
								this.$notifyTag('错误',respData.retInfo+'['+respData.retCode+']','error');
							}
						}
					)
				} 
			})
		}
	},
	mounted:function() {
		this.addObjInfo.formRules = this.formRules;
		this.editObjInfo.formRules = this.formRules;
		this.getMenusList()
	}
}
</script>