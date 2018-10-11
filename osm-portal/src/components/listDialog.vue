<template>
  <el-dialog :title="modalObj.title" :visible.sync="modalShow" 
  	:close-on-click-modal="closeOnClickModal" :before-close="modalClose">
    <el-table :data="tableData" border style="width: 100%" stripe size="small">
		<el-table-column type="selection" show-overflow-tooltip align="center"></el-table-column>
		<el-table-column  v-for="(item,key) in modalObj.tableColumn" 
			align="center"  :prop="item[0]" :label="item[1]"  :width="item[2]" :key="key"></el-table-column>
		
	    <el-table-column v-if="optionObj.isOpt" align="center"  label="操作" :width="optionObj.wid">
	      <template slot-scope="scope">
	        <el-button 
				:type="optionObj.buttonTag.type" :size="optionObj.buttonTag.size" @click="callbackModal(scope.row)">
				{{optionObj.buttonTag.lable}}</el-button>
	      </template>
	    </el-table-column>
  	</el-table>
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
					buttonTag:{}
				}
			}
		}
	},
	data(){
    	return {
			tableData:[] ,
			copyModalShow : this.modalShow
		}
	},

	methods:{
		modalClose:function(){
			this.copyModalShow = false;
		},
		callbackModal:function(row){
			let url = this.optionObj.buttonTag.optUrl + "/"+row.id;
			let that = this;
			that.$http.post(url).then(
				function(resp){
					var respData = resp.data;
					if(respData.retCode == that.$global.success) {
						that.total = respData.data.totalCount;
						that.tableData = respData.data.items;
					}else {
						that.$notifyTag('错误',respDate.retInfo+'['+respData.retCode+']','error');
					}
				}.bind(that)
			)
		},
		getList:function(){
			let that = this;
			//let url = this.$global.sysmBaseUrl+"/org/userlist";
			//console.log(JSON.stringify(that.queryParams));
			that.$http.post(that.modalObj.listUrl ,that.queryParams).then(
				function(resp){
					var respData = resp.data;
					if(respData.retCode == that.$global.success) {
						that.total = respData.data.totalCount;
						that.tableData = respData.data.items;
					}else {
						that.$notifyTag('错误',respDate.retInfo+'['+respData.retCode+']','error');
					}
				}.bind(that)
			)
		}
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
				console.log("params"+JSON.stringify(newValue)+";"+JSON.stringify(oldValue));
			},
			deep: true
		}
	}
}
</script>