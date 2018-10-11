<template>
	<el-container>
	<el-header style="text-align: left; font-size: 12px">
      <el-button type="text"  @click="addRole">添加</el-button>
    </el-header>	
    <el-table :data="tableData" border style="width: 100%" stripe size="small">
		<el-table-column type="selection" show-overflow-tooltip align="center"></el-table-column>
    	<el-table-column align="center"  prop="roleCode" label="角色编码"  width="100"></el-table-column>
		<el-table-column align="center"  prop="roleName" label="角色名称"  width="120"></el-table-column>
		<el-table-column align="center"  prop="level" label="角色分类"  width="100" :formatter="formatLevel"></el-table-column>
		<el-table-column align="center"  prop="roleDesc" label="角色描述"  width="160"></el-table-column>
	    <el-table-column align="center"  label="操作" width="300">
	      <template slot-scope="scope">
	        <el-button type="text" size="small" @click="editRole(scope.row)">编辑</el-button>
			<el-button type="text" size="small" @click="delRole(scope.row)">删除</el-button>
			<el-button type="text" size="small" @click="detailRole(scope.row)">查看</el-button>
			<el-button type="text" size="small" @click="userAssign(scope.row)">用户授权</el-button>
			<el-button type="text" size="small" @click="menusAssign(scope.row)">菜单授权</el-button>
	      </template>
	    </el-table-column>  
  	</el-table>
    
    <el-footer style="text-align: right; font-size: 12px">
    	<el-pagination 
			@current-change="handleCurrentChange" 
			:page-size="pageSize" 
			layout="total,prev, pager, next" 
			:total=total>
		</el-pagination>
    </el-footer> 
		<!--
		add
	-->
	<el-dialog title="添加" :visible.sync="showAddDialog" :close-on-click-modal="closeOnClickModal" 
			style="text-align: left;" >
		<el-form :model="addForm" label-width="100px" :rules="formRules" ref="addForm" size="mini">
			<el-form-item label="角色编码" prop="roleCode">
				<el-input v-model="addForm.roleCode" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="角色名称" prop="roleName">
				<el-input v-model="addForm.roleName" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="角色分类" prop="level">
				<el-select v-model="addForm.level" placeholder="请选择">
					<el-option v-for="levelItem in levelDate" :key="levelItem.dictCode"
						:label="levelItem.dictName" :value="levelItem.dictCode"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="角色描述" prop="roleDesc">
				<el-input v-model="addForm.roleDesc" auto-complete="off"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="showAddDialog = false">取 消</el-button>
			<el-button type="primary" @click.native="addRoleInfo('addForm')">确 定</el-button>
		</div>
	</el-dialog>

	<!-- 编辑 -->
	<el-dialog title="编辑" :visible.sync="showEditeDialog" :close-on-click-modal="closeOnClickModal" 
			style="text-align: left;" >
		<el-form :model="editForm" label-width="100px"  ref="editForm" :rules="formRules" size="mini">
			<el-form-item label="角色名称" prop="roleName">
				<el-input v-model="editForm.roleName" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="角色分类" prop="level">
				<el-select v-model="editForm.level" placeholder="请选择">
					<el-option v-for="levelItem in levelDate" :key="levelItem.dictCode"
						:label="levelItem.dictName" :value="levelItem.dictCode"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="角色描述" prop="roleDesc">
				<el-input v-model="editForm.roleDesc" auto-complete="off"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="showEditeDialog = false">取 消</el-button>
			<el-button type="primary" ref="dialogModal" @click.native="enditRoleInfo('editForm')">确 定</el-button>
		</div>
	</el-dialog>

	<!-- 查看详情 -->
	<el-dialog title="查看详情" :visible.sync="showDetailDialog" :close-on-click-modal="closeOnClickModal" 
			style="text-align: left;" >
		<el-form :model="detailForm" label-width="100px"  ref="detailForm" size="mini">
			<el-form-item label="基本信息：" class="fi"></el-form-item>
			<el-row>
				<el-col :span="12">
					<el-form-item label="角色编码" >
						<el-input v-model="detailForm.roleCode" ></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="角色名称">
						<el-input v-model="detailForm.roleName" ></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="12">
					<el-form-item label="角色分类" >
						<el-input v-model="detailForm.level" ></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="角色描述" >
						<el-input v-model="detailForm.roleDesc" ></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			
			<el-form-item label="创建信息：" class="fi"></el-form-item>
			<el-row>
				<el-col :span="12" >
					<el-form-item label="创建人" >
						<el-input v-model="detailForm.createName" ></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="创建时间" >
						<el-input v-model="detailForm.createTime" ></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-form-item label="修改信息：" class="fi"></el-form-item>
			<el-row>
				<el-col :span="12">
					<el-form-item label="修改人">
						<el-input v-model="detailForm.updateName" ></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="修改时间">
						<el-input v-model="detailForm.updateTime" ></el-input>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="showDetailDialog = false">确 定</el-button>
		</div>
	</el-dialog>

	<!--用户授权 -->
    <dialog-modal ref="userAssignModal" :modalObj="optModalObj" :modalShow.sync="showUserAssignDialog" 
		:closeOnClickModal="closeOnClickModal" :queryParams="userAssignqueryParams" :optionObj="userAssignOptionObj"
	></dialog-modal>
	</el-container>
</template>
<style>
</style>

<script>
import roleUser from "./roleUser";
export default {
  components:{'dialog-modal':roleUser},
  data(){
    return {
		currentPage:1,
		total:0,
		pageSize:20,
		listLoading:false,
		tableData:[] ,
		levelDate:[],

		formRules: { //验证
			roleCode: [
				{ required: true, message: '请输入角色编码', trigger: 'blur' },
				{ min:1,max:30,message:'长度为1-30'}
			],
			roleName: [
				{ required: true, message: '请输入角色名称', trigger: 'blur' },
				{ min:1,max:40,message:'长度为1-40'}
			],
			level: [{ required: true, message: '请选择分类', trigger: 'blur'}],
			roleDesc: [{ min:0,max:40,message:'最长长度为40'}]
		},
			
		//添加
		showAddDialog : false,
		addForm: {roleCode: '',roleName: '',level: '',roleDesc: ''},

		// 编辑
		showEditeDialog:false,
		editForm: {id:0,roleCode: '',roleName: '',level: '',roleDesc: ''},

		// 查看详情
		showDetailDialog:false,
		detailForm: {},

		//用户授权
		showUserAssignDialog:false,
		optModalObj :{
			'title':'授权用户列表',
			'listUrl':this.$global.sysmBaseUrl+"/role/user2role/list"
		},
		userAssignOptionObj :{isOpt : true,wid : 100,optUrl:this.$global.sysmBaseUrl+"/role/user2role/delete"},
		userAssignqueryParams:{roleId:0},

		closeOnClickModal:false,
		formLabelWidth:'120px'
	}
},

	methods:{
		formatLevel : function(row,column){
			let levelD = this.levelDate;
			let levelName = '';
			for(var i=0 ;i <levelD.length; i++){
				if(levelD[i].dictCode === row.level){
					levelName = levelD[i].dictName;
					break;
				}
			}
			return levelName;
		},
		getLevelData:function(){
			var param = {'dictType':'roleLevel'};
			var url = this.$global.sysmBaseUrl+"/dict/dictbytype";
			this.$http.post(url ,param).then(
				function(resp){
				var respData = resp.data;
				if(respData.retCode == this.$global.success) {
					this.levelDate = respData.data;
				}else {
					this.$notifyTag('错误',respData.retInfo+'['+respData.retCode+']','error');
				}
			}.bind(this))
		},
		getRoleList:function(){
			var ysindex = (this.currentPage-1)*this.pageSize;
			var params = {
				index:ysindex,
				count:this.pageSize
			};
			this.listLoading = true;

			let url = this.$global.sysmBaseUrl+"/role/list";
			
			this.$http.post(url ,params).then(
				function(resp){
					var respData = resp.data;
					if(respData.retCode == this.$global.success) {
						this.total = respData.data.totalCount;
						this.tableData = respData.data.items;
					}else {
						this.$notifyTag('错误',respData.retInfo+'['+respData.retCode+']','error');
					}
				}.bind(this)
			)
			this.listLoading = false;
		},
		queryMessage:function(){
			this.getRoleList();
		},
		handleCurrentChange(val) {
			this.currentPage = val;
			this.getRoleList();
		},
		//打开添加页面
		addRole:function() {
			this.showAddDialog = true;
			//this.getLevelData();
			//每次弹出弹窗，保证里面没有前一次的输入内容
			if(this.$refs['addForm'] !== undefined) {
				this.$refs['addForm'].resetFields();
			}
		},
		//保存添加的信息
		addRoleInfo : function(formName) {
			this.$refs[formName].validate((valid)=>{
				if(valid) {
					this.showAddDialog = false;
					let url = this.$global.sysmBaseUrl+"/role/create";
					var para = Object.assign({},this.addForm);
					this.$http.post(url,para).then(
						(resp)=>{
							var respData = resp.data;
							if(respData.retCode == this.$global.success) {
								this.$notifyTag('成功','添加角色成功！','success');
								this.getRoleList();
							}else{
								this.$notifyTag('错误',respData.retInfo+'['+respData.retCode+']','error');
							}
						}
					)
				} 
			})
		},
		//弹出修改页面
		editRole:function(row) {
			this.showEditeDialog = true;
			//this.getLevelData();
			this.editForm = Object.assign({},row);
		},
		//提交修改的信息
		enditRoleInfo : function(formName) {
			this.$refs[formName].validate((valid)=>{
				if(valid) {
					this.showEditeDialog = false;
					let url = this.$global.sysmBaseUrl+"/role/update";
					var para = Object.assign({},this.editForm);
					this.$http.post(url,para).then(
						(resp)=>{
							var respData = resp.data;
							if(respData.retCode == this.$global.success) {
								this.$notifyTag('成功','修改角色成功！','success');
								this.getRoleList();
							}else{
								this.$notifyTag('错误',respData.retInfo+'['+respData.retCode+']','error');
							}
						}
					)
				} 
			})
		},
		delRole: function(row1) {
			this.$confirmTag('此操作将永久删除该文件, 是否继续?',()=>{
				let url = this.$global.sysmBaseUrl+"/role/delete/"+row1.id;
				this.$http.delete(url).then(
					(resp)=>{
						var respData = resp.data;
						if(respData.retCode == this.$global.success) {
							this.$notifyTag('成功','删除角色成功！','success');
							this.getRoleList();
						}else{
							this.$notifyTag('错误',respData.retInfo+'['+respData.retCode+']','error');
						}
					}
				)
			});
		},
		detailRole: function(row){
			let url = this.$global.sysmBaseUrl+"/role/query/"+row.id;
            this.$http.get(url).then(
                (resp)=>{
                    var respData = resp.data;
                    if(respData.retCode == this.$global.success) {
                        this.showDetailDialog = true;
                        this.detailForm = respData.data;
                    }else{
                        this.showDetailDialog = false;
                        this.$notifyTag('错误',respData.retInfo+'['+respData.retCode+']','error');
                    }
                }
            )
		},
		//角色授权--用户
		userAssign: function(row){
			this.userAssignqueryParams.roleId = row.id;
			this.showUserAssignDialog = true;
			this.$refs['userAssignModal'].getList();
		},
		//角色授权--菜单
		menusAssign : function(){

		}
	},
	mounted:function() {
		this.getLevelData();
		this.getRoleList()
	}

}
</script>