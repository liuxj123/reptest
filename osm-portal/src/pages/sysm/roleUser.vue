<template>
  <el-dialog :title="modalObj.title" :visible.sync="modalShow" width="60%" 
  	:close-on-click-modal="closeOnClickModal" :before-close="modalClose">
	<el-button type="text"  @click="addUserForRole">授权</el-button>
    <el-table :data="tableData" border style="width: 100%" stripe size="small">
		<el-table-column align="center"  prop="userName" label="用户名"  width="150" />
		<el-table-column align="center"  prop="realName" label="真实名"  width="130"  />
		<el-table-column align="center"  prop="phone" label="电话"  width="110"  />
		<el-table-column align="center"  prop="email" label="邮箱"  width="130"  />
		<el-table-column align="center"  prop="orgName" label="机构名"  width="130"  />
	    <el-table-column v-if="optionObj.isOpt" align="center"  label="操作" :width="optionObj.wid">
	      <template slot-scope="scope">
	        <el-button 
				type="text" size="small" @click="delUserForRole(scope.row)">删除</el-button>
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
    </div> 

	<el-dialog append-to-body width="50%" title="授权" :visible.sync="roleUserAddDialog" 
		:close-on-click-modal="closeOnClickModal" >
		<el-table :data="subTableData" border style="width: 100%" stripe size="small" 
		  @selection-change="handleSelectionChange" ref="multipleTable">
			<el-table-column type="selection" show-overflow-tooltip align="center" />
			<el-table-column align="center"  prop="userName" label="用户名"  width="150" />
			<el-table-column align="center"  prop="realName" label="真实名"  width="130"  />
			<el-table-column align="center"  prop="nickName" label="昵称"  width="130"  />
			<el-table-column align="center"  prop="orgName" label="机构名"  width="130"  />
		</el-table>
        <div slot="footer" class="dialog-footer">
            <el-button @click="roleUserAddDialog = false">取 消</el-button>
            <el-button type="primary" @click.native="addObjValue()">确 定</el-button>
        </div>
	</el-dialog>
	
  </el-dialog>
</template>
<style>
</style>

<script>
export default {
	name:"dialogModal",
	props : {
		modalObj : Object,
		modalShow : Boolean,
		closeOnClickModal : Boolean,
		queryParams :{
			type: Object,
			default: ()=>{return {}}
		},
		optionObj:{
			type:Object,
			default:()=>{
				return {
					isOpt : false,
					wid : 150,
					optUrl:'',
					buttonTag:{}
				}
			}
		},
		addUrl:String,
		editUrl:String
	},
	data(){
    	return {
			currentPage:1,
			total:0,
			pageSize:20,
			tableData:[] ,
			subTableData:[],
			multipleSelection: [],
			copyModalShow : this.modalShow,

			formRules: { //验证
				operationType: [
					{ required: true, message: '请输入操作类型', trigger: 'blur' },
					{ min:1,max:40,message:'长度为1-40'}
				],
				status: [
					{ required: true, message: '请选择状态', trigger: 'blur' },
				]
			},

			roleUserAddDialog:false,
		}
	},

	methods:{
		handleCurrentChange(val) {
			this.currentPage = val;
			this.getList();
		},
		modalClose:function(){
			this.copyModalShow = false;
		},
		handleSelectionChange:function(val){
			this.multipleSelection = val;
		},
		getUserNotAssign: function(){
			var param = {'roleId':this.queryParams.roleId};
			let url = this.$global.sysmBaseUrl+"/role/user2role/assignuser";
			this.$http.post(url,param).then(
				(resp)=>{
					var respData = resp.data;
					if(respData.retCode == this.$global.success) {
						this.subTableData = respData.data.items;
					}else{
						this.$notifyTag('错误',respData.retInfo+'['+respData.retCode+']','error');
					}
				}
			)
		},
		delUserForRole:function(row){
			this.$confirmTag('此操作将永久删除该文件, 是否继续?',()=>{
				let url = this.optionObj.optUrl + "/"+row.u2rId;
				this.$http.delete(url).then(
					(resp)=>{
						var respData = resp.data;
						if(respData.retCode == this.$global.success) {
							this.$notifyTag('成功','删除成功！','success');
							this.getList();
						}else{
							this.$notifyTag('错误',respData.retInfo+'['+respData.retCode+']','error');
						}
					}
				)
			});
		},
		getList:function(){
			let that = this;
			var ysindex = (that.currentPage-1)*that.pageSize;
			var params = {
				index:ysindex,
				count:that.pageSize,
				roleId:that.queryParams.roleId
			};
			that.$http.post(that.modalObj.listUrl ,params).then(
				function(resp){
					var respData = resp.data;
					if(respData.retCode == that.$global.success) {
						that.total = respData.data.totalCount;
						that.tableData = respData.data.items;
					}else {
						that.$notifyTag('错误',respData.retInfo+'['+respData.retCode+']','error');
					}
				}.bind(that)
			)
		},
		addUserForRole:function(){
			this.roleUserAddDialog = true;
			this.multipleSelection = [];
            this.getUserNotAssign();
		},
		addObjValue:function(formName){
			let length = this.multipleSelection.length
			if(length != 0){
				var userSelected = this.multipleSelection;
				var ids = '';
				userSelected.forEach(item=>{ids += ',' + item.id;});
				var para = {
					roleId : this.queryParams.roleId,
					userIds: ids.substr(1,ids.length)
				}
				this.roleUserAddDialog = false;
				var url = this.$global.sysmBaseUrl+"/role/user2role/add";
				this.$http.post(url,para).then(
					(resp)=>{
						var respData = resp.data;
						if(respData.retCode == this.$global.success) {
							this.$notifyTag('成功','添加成功！','success');
							this.getList();
						}else{
							this.$notifyTag('错误',respData.retInfo+'['+respData.retCode+']','error');
						}
					}
				)
			} else {
				this.$notifyTag('错误','请选择要授权的用户','error');
			}
		},
	},
	watch:{
		modalShow:function(val) {
			this.copyModalShow = val;
		},
		copyModalShow(val){
			this.$emit('update:modalShow',val);
		},
		queryParams:{
			handler(newValue,oldValue) {},
			deep: true
		}
	}
}
</script>