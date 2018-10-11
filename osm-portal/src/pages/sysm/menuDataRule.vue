<template>
  <el-dialog :title="modalObj.title" :visible.sync="modalShow"  width="54%"
  	:close-on-click-modal="closeOnClickModal" :before-close="modalClose">
	<el-button type="text"  @click="addDataRule">添加</el-button>
    <el-table :data="tableData" border style="width: 100%" stripe size="small">
		<!--<el-table-column type="selection" show-overflow-tooltip align="center"></el-table-column>-->
		<el-table-column align="center"  prop="ruleName" label="规则名称"  width="150"></el-table-column>
		<el-table-column align="center"  prop="ruleColnum" label="规则列"  width="120"></el-table-column>
		<el-table-column align="center"  prop="ruleConditions" label="规则表达式"  width="140"></el-table-column>
		<el-table-column align="center"  prop="ruleValue" label="规则值"  width="120"></el-table-column>
	    <el-table-column v-if="optionObj.isOpt" align="center"  label="操作" :width="optionObj.wid">
	      <template slot-scope="scope">
			<el-button 
				type="text" size="small" @click="editDataRule(scope.row)">编辑</el-button>
	        <el-button 
				type="text" size="small" @click="delDataRule(scope.row)">删除</el-button>
	      </template>
	    </el-table-column>
  	</el-table>

	<el-dialog append-to-body width="40%" title="添加数据权限" :visible.sync="dataRuleAddDialog" 
		:close-on-click-modal="closeOnClickModal" >
		<el-form :model="addFrom" label-width="100px" ref="addFrom" size="mini" :rules="formRules">
            <el-form-item label="规则名称" prop="ruleName">
                <el-input v-model="addFrom.ruleName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="规则列" prop="ruleColnum">
                <el-input v-model="addFrom.ruleColnum" auto-complete="off"></el-input>
            </el-form-item>
			<el-form-item label="规则表达式" prop="ruleConditions">
                <el-input v-model="addFrom.ruleConditions" auto-complete="off"></el-input>
            </el-form-item>
			<el-form-item label="规则值" prop="ruleValue">
                <el-input v-model="addFrom.ruleValue" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dataRuleAddDialog = false">取 消</el-button>
            <el-button type="primary" @click.native="addObjValue('addFrom')">确 定</el-button>
        </div>
	</el-dialog>

	<el-dialog append-to-body width="40%" title="编辑数据权限" :visible.sync="dataRuleEditDialog" 
		:close-on-click-modal="closeOnClickModal" >
		<el-form :model="editFrom" label-width="100px" ref="editFrom" size="mini" :rules="formRules">
            <el-form-item label="规则名称" prop="ruleName">
                <el-input v-model="editFrom.ruleName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="规则列" prop="ruleColnum">
                <el-input v-model="editFrom.ruleColnum" auto-complete="off"></el-input>
            </el-form-item>
			<el-form-item label="规则表达式" prop="ruleConditions">
                <el-input v-model="editFrom.ruleConditions" auto-complete="off"></el-input>
            </el-form-item>
			<el-form-item label="规则值" prop="ruleValue">
                <el-input v-model="editFrom.ruleValue" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dataRuleEditDialog = false">取 消</el-button>
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
				ruleName: [
					{ required: true, message: '请输入规则名称', trigger: 'blur' },
					{ min:1,max:40,message:'长度为1-40'}
				],
				ruleColnum: [
					{ required: true, message: '请输入规则列名', trigger: 'blur' },
					{ min:1,max:40,message:'长度为1-40'}
				],
				ruleConditions: [
					{ required: true, message: '请输入规则表达式', trigger: 'blur' },
					{ min:1,max:40,message:'长度为1-40'}
				],
				ruleValue: [
					{ required: true, message: '请输入规则值', trigger: 'blur' },
					{ min:1,max:40,message:'长度为1-40'}
				]
			},

			dataRuleAddDialog:false,
			addFrom:{menuId:0,ruleName:'',ruleColnum:'',ruleConditions:'',ruleValue:''},

			dataRuleEditDialog:false,
			editFrom:{id:0,menuId:0,ruleName:'',ruleColnum:'',ruleConditions:'',ruleValue:''},

		}
	},

	methods:{
		formatStatus : function(row,column) {
			return row.status == 1?'禁用':row.status == 0?'隐藏':'';
		},
		modalClose:function(){
			this.copyModalShow = false;
		},
		delDataRule:function(row){
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
		addDataRule:function(){
			this.dataRuleAddDialog = true;
            this.addFrom.menuId=this.queryParams.menuId;
            //每次弹出弹窗，保证里面没有前一次的输入内容
			if(this.$refs['addFrom'] !== undefined) {
				this.$refs['addFrom'].resetFields();
            }
		},
		addObjValue:function(formName){
			this.$refs[formName].validate((valid)=>{
				if(valid) {
					this.dataRuleAddDialog = false;
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
		editDataRule:function(row){
			this.dataRuleEditDialog = true;
			this.editFrom = Object.assign({},row);
		},
		editObjValue:function(formName){
			this.$refs[formName].validate((valid)=>{
				if(valid) {
					this.dataRuleEditDialog = false;
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