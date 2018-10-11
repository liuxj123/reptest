<template>
  <el-dialog :title="modalObj.title" :visible.sync="modalShow" 
  	:close-on-click-modal="closeOnClickModal" :before-close="modalClose">
	<el-button type="text"  @click="addOpt">添加</el-button>
    <el-table :data="tableData" border style="width: 100%" stripe size="small">
		<!--<el-table-column type="selection" show-overflow-tooltip align="center"></el-table-column>-->
		<el-table-column align="center"  prop="operationType" label="操作类型"  width="150" />
		<el-table-column align="center"  prop="status" label="状态"  width="130" :formatter="formatStatus" />
	    <el-table-column v-if="optionObj.isOpt" align="center"  label="操作" :width="optionObj.wid">
	      <template slot-scope="scope">
			<el-button 
				type="text" size="small" @click="editOpt(scope.row)">编辑</el-button>
	        <el-button 
				type="text" size="small" @click="delOpt(scope.row)">删除</el-button>
	      </template>
	    </el-table-column>
  	</el-table>

	<el-dialog append-to-body width="40%" title="添加操作权限" :visible.sync="optAddDialog" 
		:close-on-click-modal="closeOnClickModal" >
		<el-form :model="addFrom" label-width="100px" ref="addFrom" size="mini" :rules="formRules">
            <el-form-item label="类型" prop="operationType">
                <el-input v-model="addFrom.operationType" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="addFrom.status" placeholder="请选择">
					<el-option key="0" label="隐藏" value="0"></el-option>
					<el-option key="1" label="禁用" value="1"></el-option>
				</el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="optAddDialog = false">取 消</el-button>
            <el-button type="primary" @click.native="addObjValue('addFrom')">确 定</el-button>
        </div>
	</el-dialog>

	<el-dialog append-to-body width="40%" title="编辑操作权限" :visible.sync="optEditDialog" 
		:close-on-click-modal="closeOnClickModal" >
		<el-form :model="editFrom" label-width="100px" ref="editFrom" size="mini" :rules="formRules">
            <el-form-item label="类型" prop="operationType">
                <el-input v-model="editFrom.operationType" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="editFrom.status" placeholder="请选择">
					<el-option key="0" label="隐藏" value="0" ></el-option>
					<el-option key="1" label="禁用" value="1"></el-option>
				</el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="optEditDialog = false">取 消</el-button>
            <el-button type="primary" @click.native="editObjValue('editFrom')">确 定</el-button>
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
			tableData:[] ,
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

			optAddDialog:false,
			addFrom:{menuId:0,operationType:'',status:''},

			optEditDialog:false,
			editFrom:{id:0,menuId:0,operationType:'',status:''},

		}
	},

	methods:{
		formatStatus : function(row,column) {
			return row.status == 1?'禁用':row.status == 0?'隐藏':'';
		},
		modalClose:function(){
			this.copyModalShow = false;
		},
		delOpt:function(row){
			this.$confirmTag('此操作将永久删除该文件, 是否继续?',()=>{
				let url = this.optionObj.optUrl + "/"+row.id;
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
			that.$http.post(that.modalObj.listUrl ,that.queryParams).then(
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
		addOpt:function(){
			this.optAddDialog = true;
            this.addFrom.menuId=this.queryParams.menuId;
            //每次弹出弹窗，保证里面没有前一次的输入内容
			if(this.$refs['addFrom'] !== undefined) {
				this.$refs['addFrom'].resetFields();
            }
		},
		addObjValue:function(formName){
			this.$refs[formName].validate((valid)=>{
				if(valid) {
					this.optAddDialog = false;
					let url = this.addUrl;
					var para = Object.assign({},this.addFrom);
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
				} 
			})

		},
		editOpt:function(row){
			this.optEditDialog = true;
			let s = (row.status)?'1':'0';
			this.editFrom = Object.assign({},row);
			this.editFrom.status = s;
		},
		editObjValue:function(formName){
			this.$refs[formName].validate((valid)=>{
				if(valid) {
					this.optEditDialog = false;
					let url = this.editUrl;
					var para = Object.assign({},this.editFrom);
					this.$http.post(url,para).then(
						(resp)=>{
							var respData = resp.data;
							if(respData.retCode == this.$global.success) {
                                this.$notifyTag('成功','修改成功！','success');
								this.getList();
							}else{
								this.$notifyTag('错误',respData.retInfo+'['+respData.retCode+']','error');
							}
						}
					)
				} 
			})

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
			handler(newValue,oldValue) {
				//console.log("params"+JSON.stringify(newValue)+";"+JSON.stringify(oldValue));
			},
			deep: true
		}
	}
}
</script>