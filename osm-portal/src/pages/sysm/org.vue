<template>
<div class="table">
	<div class="crumbs">
		<el-breadcrumb separator="/">
			<el-breadcrumb-item><i class="el-icon-tickets"></i> 组织机构</el-breadcrumb-item>
		</el-breadcrumb>
	</div>

	<div class="container">
		<div class="handle-box">
			<el-input v-model="orgName" placeholder="机构名称" class="handle-input mr10"></el-input>
			<el-button type="primary" icon="search" @click="queryMessage">搜索</el-button>
			<el-button type="primary" icon="search"  @click="addOrg">添加</el-button>
			<!--<el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>-->
		</div>
		<el-table :data="tableData" border style="width: 100%" stripe size="small">
			<el-table-column type="selection" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column align="center"  prop="orgCode" label="机构编码"  width="100"></el-table-column>
			<el-table-column align="center"  prop="orgName" label="机构名称"  width="120"></el-table-column>
			<el-table-column align="center"  prop="adress" label="机构地址"  width="150"></el-table-column>
			<el-table-column align="center"  prop="contactName" label="联系人"  width="120"></el-table-column>
			<el-table-column align="center"  prop="contactPhone" label="联系电话"  width="120"></el-table-column>
			<el-table-column align="center"  label="操作" width="200">
			<template slot-scope="scope">
				<el-button type="text" size="small" @click="queryOrg(scope.row)">查看</el-button>
				<el-button type="text" size="small" @click="editOrg(scope.row)">编辑</el-button>
				<el-button type="text" size="small" @click="delOrg(scope.row)">删除</el-button>
				<el-button type="text" size="small" @click="queryUserInOrg(scope.row)">用户</el-button>
			</template>
			</el-table-column>  
		</el-table>

		<div class="pagination">
			<el-pagination 
				@current-change="handleCurrentChange" 
				:page-size="pageSize" 
				layout="total,prev, pager, next" 
				:total=total>
            </el-pagination>
			<!--<el-pagination 
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="currentPage"
				:page-sizes="[20, 35, 50, 60]"
				:page-size="pageSize"
				layout="total, sizes, prev, pager, next"
				:total="total">
			</el-pagination>-->
		</div>
	</div>
		<!--
		add
	-->
	<el-dialog title="添加" :visible.sync="showAddDialog" :close-on-click-modal="closeOnClickModal" 
			style="text-align: left;" >
		<el-form :model="addOrgForm" label-width="100px" :rules="formRules" ref="addOrgForm" size="mini">
			<el-form-item label="机构编码" prop="orgCode">
				<el-input v-model="addOrgForm.orgCode" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="机构名称" prop="orgName">
				<el-input v-model="addOrgForm.orgName" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="联系人" prop="contactName">
				<el-input v-model="addOrgForm.contactName" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="联系电话" prop="contactPhone">
				<el-input v-model="addOrgForm.contactPhone" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="地址" prop="adress">
				<el-input type="textarea" v-model="addOrgForm.adress" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="描述" prop="orgDesc">
				<el-input v-model="addOrgForm.orgDesc" auto-complete="off"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="showAddDialog = false">取 消</el-button>
			<el-button type="primary" @click.native="addOrgInfo('addOrgForm')">确 定</el-button>
		</div>
	</el-dialog>

	<!-- 编辑 -->
	<el-dialog title="编辑" :visible.sync="showEditeDialog" :close-on-click-modal="closeOnClickModal" 
			style="text-align: left;" >
		<el-form :model="editOrgForm" label-width="100px"  ref="editOrgForm" :rules="formRules" size="mini">
			<el-form-item label="机构编码" prop="orgCode">
				<el-input v-model="editOrgForm.orgCode" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="机构名称" prop="orgName">
				<el-input v-model="editOrgForm.orgName" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="联系人" prop="contactName">
				<el-input v-model="editOrgForm.contactName" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="联系电话" prop="contactPhone">
				<el-input v-model="editOrgForm.contactPhone" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="地址" prop="adress">
				<el-input type="textarea" v-model="editOrgForm.adress" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="描述" prop="orgDesc">
				<el-input v-model="editOrgForm.orgDesc" auto-complete="off"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="showEditeDialog = false">取 消</el-button>
			<el-button type="primary" ref="dialogModal" @click.native="enditOrgInfo('editOrgForm')">确 定</el-button>
		</div>
	</el-dialog>

	<!-- 查看详情 -->
	<el-dialog title="查看详情" :visible.sync="showQueryDialog" :close-on-click-modal="closeOnClickModal" 
			style="text-align: left;" >
		<el-form :model="queryOrgForm" label-width="100px"  ref="queryOrgForm" size="mini">
			<el-form-item label="基本信息：" class="fi"></el-form-item>
			<el-row>
				<el-col :span="12">
					<el-form-item label="机构编码" >
						<el-input v-model="queryOrgForm.orgCode" ></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="机构名称">
						<el-input v-model="queryOrgForm.orgName" ></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="12">
					<el-form-item label="联系人" >
						<el-input v-model="queryOrgForm.contactName" ></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="联系电话" >
						<el-input v-model="queryOrgForm.contactPhone" ></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="24">
					<el-form-item label="地址" >
						<el-input type="textarea" v-model="queryOrgForm.adress" ></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="24">
					<el-form-item label="描述" >
						<el-input type="textarea" v-model="queryOrgForm.orgDesc" ></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-form-item label="创建信息：" class="fi"></el-form-item>
			<el-row>
				<el-col :span="12" >
					<el-form-item label="创建人" >
						<el-input v-model="queryOrgForm.createName" ></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="创建时间" >
						<el-input v-model="queryOrgForm.createTime" ></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-form-item label="修改信息：" class="fi"></el-form-item>
			<el-row>
				<el-col :span="12">
					<el-form-item label="修改人">
						<el-input v-model="queryOrgForm.updateName" ></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="修改时间">
						<el-input v-model="queryOrgForm.updateTime" ></el-input>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="showQueryDialog = false">确 定</el-button>
		</div>
	</el-dialog>

	<dialog-modal ref="diamodal" :modalObj="modalObj" :modalShow.sync="showOrgUsersDialog" 
		:closeOnClickModal="closeOnClickModal" :queryParams="queryParams" ></dialog-modal>
	
</div>
</template>
<style>
</style>

<script>
import dialogModal from "../../components/listDialog";

export default {
  components : {'dialog-modal':dialogModal},
  data(){
    return {
		currentPage:1,
		total:0,
		pageSize:20,
		listLoading:false,
		tableData:[] ,
		orgName:'',

		formRules: { //验证
			orgCode: [
				{ required: true, message: '请输入组织机构编码', trigger: 'blur' },
				{ min:1,max:30,message:'长度为1-30'}
			],
			orgName: [
				{ required: true, message: '请输入组织机构名称', trigger: 'blur' },
				{ min:1,max:30,message:'长度为1-30'}
			],
			adress: [
				{ min:0,max:200,message:'最长长度为200'}
			],
			contactName: [
				{ min:0,max:40,message:'最长长度为40'}
			],
			contactPhone: [
				{min:1,max:30,message:'最长长度为30'}
			],
		},
			
		//添加
		showAddDialog : false,
		addOrgForm: {
			orgCode: '',orgName: '',adress: '',
			contactName: '',contactPhone: '',orgDesc: ''
		},

		// 编辑
		showEditeDialog:false,
		editOrgForm: {
			id:0,orgCode: '',orgName: '',adress: '',
			contactName: '',contactPhone: '',orgDesc: ''
		},

		// 查看详情
		showQueryDialog:false,
		queryOrgForm: {},

		//查看用户
		showOrgUsersDialog:false,
		modalObj :{
			'title':'用户列表',
			'tableColumn':[
				['userName','用户名',140],
				['nickName','昵称',130],
				['realName','真名',100],
				['phone','联系电话',120],
				['email','Emall',120]
			],
			'listUrl':this.$global.sysmBaseUrl+"/org/userlist"
		},
		queryParams:{
			index:0,
			count:200,
			orgId:0
		},

		closeOnClickModal:false,
		formLabelWidth:'120px'
	}
},

	methods:{
		getOrgList:function(){
			var ysindex = (this.currentPage-1)*this.pageSize;
			var params = {
				index:ysindex,
				count:this.pageSize,
				orgName:this.orgName
			};
			this.listLoading = true;

			let url = this.$global.sysmBaseUrl+"/org/list";
			
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
			this.getOrgList();
			//this.queryFrom.orgName = this.queryFrom.orgName;
		},
		handleCurrentChange(val) {
			this.currentPage = val;
			this.getOrgList();
			//this.queryFrom.orgName = this.queryFrom.orgName;
		},
		//打开添加页面
		addOrg:function() {
			this.showAddDialog = true;
			//每次弹出弹窗，保证里面没有前一次的输入内容
			if(this.$refs['addOrgForm'] !== undefined) {
				this.$refs['addOrgForm'].resetFields();
			}
		},
		//弹出修改页面
		editOrg:function(row) {
			this.showEditeDialog = true;
			this.editOrgForm = Object.assign({},row);
		},
		delOrg: function(row1) {
			this.$confirmTag('此操作将永久删除该文件, 是否继续?',()=>{
				let url = this.$global.sysmBaseUrl+"/org/delete/"+row1.id;
				this.$http.delete(url).then(
					(resp)=>{
						var respData = resp.data;
						if(respData.retCode == this.$global.success) {
							this.$notifyTag('成功','删除组织机构成功！','success');
							this.getOrgList();
						}else{
							this.$notifyTag('错误',respData.retInfo+'['+respData.retCode+']','error');
						}
					}
				)
			});
		},
		//保存添加的信息
		addOrgInfo : function(formName) {
			this.$refs[formName].validate((valid)=>{
				if(valid) {
					this.showAddDialog = false;
					let url = this.$global.sysmBaseUrl+"/org/create";
					var para = Object.assign({},this.addOrgForm);
					this.$http.post(url,para).then(
						(resp)=>{
							var respData = resp.data;
							if(respData.retCode == this.$global.success) {
								this.$notifyTag('成功','添加组织机构成功！','success');
								this.getOrgList();
							}else{
								this.$notifyTag('错误',respData.retInfo+'['+respData.retCode+']','error');
							}
						}
					)
				} 
			})
		},
		//提交修改的信息
		enditOrgInfo : function(formName) {
			this.$refs[formName].validate((valid)=>{
				if(valid) {
					this.showEditeDialog = false;
					let url = this.$global.sysmBaseUrl+"/org/update";
					var para = Object.assign({},this.editOrgForm);
					this.$http.post(url,para).then(
						(resp)=>{
							var respData = resp.data;
							if(respData.retCode == this.$global.success) {
								this.$notifyTag('成功','修改组织机构成功！','success');
								this.getOrgList();
							}else{
								this.$notifyTag('错误',respData.retInfo+'['+respData.retCode+']','error');
							}
						}
					)
				} 
			})
		},
		queryOrg : function(row) {
			this.showQueryDialog = true;
			this.queryOrgForm = Object.assign({},row);
		},
		queryUserInOrg : function(row){
			this.queryParams.orgId = row.id;
			this.showOrgUsersDialog = true;
			this.$refs['diamodal'].getList();
		}

	},
	mounted:function() {
		this.getOrgList()
	}

}
</script>
<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
</style>