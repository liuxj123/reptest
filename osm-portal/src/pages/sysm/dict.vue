<template>
<div class="table">
	<div class="crumbs">
		<el-breadcrumb separator="/">
			<el-breadcrumb-item><i class="el-icon-tickets"></i> 字典管理</el-breadcrumb-item>
		</el-breadcrumb>
	</div>

	<div class="container">
		<div class="handle-box">
			<ul>
				<li v-for="item in people" ref="refContent" :key="item">{{item}}</li>
			</ul>
			<el-select v-model="status" clearable placeholder="请选择">
				<el-option value="1" label="启用">启用</el-option>
				<el-option value="0" label="禁用">禁用</el-option>
			</el-select>
			<el-input v-model="dictType" placeholder="类型" class="handle-input mr10"></el-input>
			<el-button type="primary" icon="search" @click="queryMessage">搜索</el-button>
			<el-button type="primary" icon="search" @click="addDict">添加</el-button>
			<el-button type="primary" icon="search" @click="startDict">启用</el-button>
			<el-button type="primary" icon="search" @click="stopDict">禁用</el-button>

			<!--<button type="button" class="el-button el-button--primary el-button--small " 
				ref="addDict" @click="addDict"><i class="search"></i><span>添加</span></button>
			<button type="button" class="el-button el-button--primary el-button--small " 
				ref="startDict" @click="startDict"><i class="search"></i><span>启用</span></button>
			<button type="button" class="el-button el-button--primary el-button--small " 
				ref="stopDict" @click="stopDict"><i class="search"></i><span>禁用</span></button>-->
		</div>
		<el-table :data="tableData" border style="width: 100%" stripe size="small"
		ref="multipleTable" @selection-change="handleSelectionChange">
			<el-table-column type="selection" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column align="center"  prop="dictType" label="类型" ></el-table-column>
			<el-table-column align="center"  prop="dictName" label="名称" ></el-table-column>
			<el-table-column align="center"  prop="dictCode" label="代码"  width="100"></el-table-column>
			<el-table-column align="center"  prop="status" label="状态"  width="80" 
				:formatter="formateStatus"></el-table-column>
			<el-table-column align="center"  prop="dictDesc" label="描述" ></el-table-column>
			
			<el-table-column align="center" label="操作" width="250" ref="sss">
				<template slot-scope="scope" >
					<button type="button" class="el-button el-button--text el-button--small " 
				ref="updateDict" @click="editDict(scope.row)"><i class="search"></i><span>编辑</span></button>
					<!--<el-button ref="LXJ" type="text"  size="small" @click="editDict(scope.row)">编辑</el-button>-->
					<el-button type="text" size="small" @click="delDict(scope.row)">删除</el-button>
					<el-button type="text" size="small" @click="queryDict(scope.row)">详情</el-button>
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
	</div>
		<!--
		add
	-->
	<el-dialog title="添加" :visible.sync="showAddDialog" :close-on-click-modal="closeOnClickModal" 
			style="text-align: left;" >
		<el-form :model="addDictForm" label-width="100px" :rules="formRules" ref="addDictForm" size="mini">
			<el-form-item label="类型" prop="dictType">
				<el-autocomplete 
					v-model="addDictForm.dictType"
  					:fetch-suggestions="querySearch"
					placeholder="请输入内容" 
					@select="handleSelect">
				</el-autocomplete>
				<!--<el-input v-model="addDictForm.dictType" auto-complete="off"></el-input>-->
			</el-form-item>
			<el-form-item label="名称" prop="dictName">
				<el-input v-model="addDictForm.dictName" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="代码" prop="dictCode">
				<el-input v-model="addDictForm.dictCode" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="描述" prop="dictDesc">
				<el-input v-model="addDictForm.dictDesc" auto-complete="off"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="showAddDialog = false">取 消</el-button>
			<el-button type="primary" @click.native="addDictInfo('addDictForm')">确 定</el-button>
		</div>
	</el-dialog>

	<!-- 编辑 -->
	<el-dialog title="编辑" :visible.sync="showEditeDialog" :close-on-click-modal="closeOnClickModal" 
			style="text-align: left;" >
		<el-form :model="editDictForm" label-width="100px"  ref="editDictForm" :rules="formRules" size="mini">
			<el-form-item label="类型" prop="dictType">
				<el-autocomplete 
					v-model="editDictForm.dictType"
  					:fetch-suggestions="querySearch"
					placeholder="请输入内容" 
					@select="handleSelect">
				</el-autocomplete>
			</el-form-item>
			<el-form-item label="名称" prop="dictName">
				<el-input v-model="editDictForm.dictName" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="代码" prop="dictCode">
				<el-input v-model="editDictForm.dictCode" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="描述" prop="dictDesc">
				<el-input v-model="editDictForm.dictDesc" auto-complete="off"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="showEditeDialog = false">取 消</el-button>
			<el-button type="primary" ref="dialogModal" @click.native="enditDictInfo('editDictForm')">确 定</el-button>
		</div>
	</el-dialog>

	<!-- 查看详情 -->
	<el-dialog title="查看详情" :visible.sync="showQueryDialog" :close-on-click-modal="closeOnClickModal" 
			style="text-align: left;" >
		<el-form :model="queryDictForm" label-width="100px"  ref="queryDictForm" size="mini">
			<el-form-item label="基本信息：" class="fi"></el-form-item>
			<el-row>
				<el-col :span="12">
					<el-form-item label="类型" >
						<div class="detaile-box">{{queryDictForm.dictType}}</div>
						<!--<el-input v-model="queryDictForm.dictType" ></el-input>-->
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="名称">
						<div class="detaile-box">{{queryDictForm.dictName}}</div>
						<!--<el-input v-model="queryDictForm.dictName" ></el-input>-->
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="12">
					<el-form-item label="代码" >
						<div class="detaile-box">{{queryDictForm.dictCode}}</div>
						<!--<el-input v-model="queryDictForm.dictCode" ></el-input>-->
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="描述" >
						<div class="detaile-box">{{queryDictForm.dictDesc}}</div>
						<!--<el-input v-model="queryDictForm.dictDesc" ></el-input>-->
					</el-form-item>
				</el-col>
			</el-row>
			<el-form-item label="创建信息：" class="fi"></el-form-item>
			<el-row>
				<el-col :span="12" >
					<el-form-item label="创建人" >
						<div class="detaile-box">{{queryDictForm.createName}}</div>
						<!--<el-input v-model="queryDictForm.createName" ></el-input>-->
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="创建时间" >
						<div class="detaile-box">{{queryDictForm.createTime}}</div>
						<!--<el-input v-model="queryDictForm.createTime" ></el-input>-->
					</el-form-item>
				</el-col>
			</el-row>
			<el-form-item label="修改信息：" class="fi"></el-form-item>
			<el-row>
				<el-col :span="12">
					<el-form-item label="修改人">
						<div class="detaile-box">{{queryDictForm.updateName}}</div>
						<!--<el-input v-model="queryDictForm.updateName" ></el-input>-->
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="修改时间">
						<div class="detaile-box">{{queryDictForm.updateTime}}</div>
						<!--<el-input v-model="queryDictForm.updateTime" ></el-input>-->
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="showQueryDialog = false">关 闭</el-button>
		</div>
	</el-dialog>
	
</div>
</template>

<script>
export default {
  data(){
    return {
		people:['三姑','四婶','五叔','六姨','七舅姥爷'],

		currentPage:1,
		total:0,
		pageSize:20,
		listLoading:false,
		tableData:[] ,
		dictType:'',
		status:'',
		
		restaurants: [],
		multipleSelection: [],

		formRules: { //验证
			dictType: [
				{ required: true, message: '请输入字典类型', trigger: 'blur' },
				{ min:1,max:30,message:'长度为1-30'}
			],
			dictName: [
				{ required: true, message: '请输入字典名称', trigger: 'blur' },
				{ min:1,max:30,message:'长度为1-40'}
			],
			dictCode: [
				{ required: true, message: '请输入字典代码', trigger: 'blur' },
				{ min:1,max:40,message:'长度为1-40'}
			],
			dictDesc: [
				{ min:0,max:40,message:'最长长度为40'}
			]
		},
			
		//添加
		showAddDialog : false,
		addDictForm: {dictType: '',dictName: '',dictCode: '',dictDesc: ''},

		// 编辑
		showEditeDialog:false,
		editDictForm: {id:0,dictType: '',dictName: '',dictCode: '',dictDesc: ''},

		// 查看详情
		showQueryDialog:false,
		queryDictForm: {},
		
		closeOnClickModal:false,
		formLabelWidth:'120px'
	}
},

	methods:{
		init(){
			
			this.$nextTick(()=>{console.log(this.$refs["updateDict"]);})
			//操作权限判断
			/*let url = '';
			let optData = [{"status":0,"operationType":'addDict'},{"status":0,"operationType":'startDict'}];
			let that = this;
			if(optData.length != 0) {
				optData.forEach(function(item){
					if(item.status) {
						that.$refs[item.operationType].remove()//隐藏
					}else {
						//禁用
						that.$refs[item.operationType].disabled = 'disabled';
						var classNames = that.$refs[item.operationType].classList.value + ' is-disabled';
						that.$refs[item.operationType].classList = classNames
					}
				})
			}*/

		},
		formateStatus:function(row,column){
			let statusName = (row.status)?'启用':'禁用';
			return statusName;
		},
		getDictList:function(){
			this.$refs.multipleTable.clearSelection();
			var ysindex = (this.currentPage-1)*this.pageSize;
			var params = {
				index:ysindex,
				count:this.pageSize,
				dictType:this.dictType,
				status:this.status
			};
			this.listLoading = true;

			let url = this.GLOBAL.SYSM_BASE_URL+"/dict/list";
			
			this.$axios.post(url ,params).then(
				function(resp){
					var respData = resp.data;
					if(respData.retCode == this.GLOBAL.SUCCESS) {
						this.total = respData.data.totalCount;
						this.tableData = respData.data.items;
						this.$nextTick(()=>{console.log(this.$refs["updateDict"]);})
					}else {
						this.$notifyTag('错误',respData.retInfo+'['+respData.retCode+']','error');
					}
				}.bind(this)
			)
			this.listLoading = false;
		},
		queryMessage:function(){
			this.getDictList();
			//this.queryFrom.orgName = this.queryFrom.orgName;
		},
		handleCurrentChange(val) {
			this.currentPage = val;
			this.getDictList();
			//this.queryFrom.orgName = this.queryFrom.orgName;
		},
		//打开添加页面
		addDict:function() {
			this.showAddDialog = true;
			this.loadDictType();
			//每次弹出弹窗，保证里面没有前一次的输入内容
			if(this.$refs['addDictForm'] !== undefined) {
				this.$refs['addDictForm'].resetFields();
			}
		},
		//弹出修改页面
		editDict:function(row) {
			this.showEditeDialog = true;
			this.loadDictType();
			this.editDictForm = Object.assign({},row);
		},
		delDict: function(row1) {
			this.$confirmTag('此操作将永久删除该文件, 是否继续?',()=>{
				let url = this.GLOBAL.SYSM_BASE_URL+"/dict/delete/"+row1.id;
				this.$axios.delete(url).then(
					(resp)=>{
						var respData = resp.data;
						if(respData.retCode == this.GLOBAL.SUCCESS) {
							this.$notifyTag('成功','删除数据字典成功！','success');
							this.getDictList();
						}else{
							this.$notifyTag('错误',respData.retInfo+'['+respData.retCode+']','error');
						}
					}
				)
			});
		},
		//保存添加的信息
		addDictInfo : function(formName) {
			this.$refs[formName].validate((valid)=>{
				if(valid) {
					this.showAddDialog = false;
					let url = this.GLOBAL.SYSM_BASE_URL+"/dict/create";
					var para = Object.assign({},this.addDictForm);
					this.$axios.post(url,para).then(
						(resp)=>{
							var respData = resp.data;
							if(respData.retCode == this.GLOBAL.SUCCESS) {
								this.$notifyTag('成功','添加数据字典成功！','success');
								this.getDictList();
							}else{
								this.$notifyTag('错误',respData.retInfo+'['+respData.retCode+']','error');
							}
						}
					)
				} 
			})
		},
		//提交修改的信息
		enditDictInfo : function(formName) {
			this.$refs[formName].validate((valid)=>{
				if(valid) {
					this.showEditeDialog = false;
					let url = this.GLOBAL.SYSM_BASE_URL+"/dict/update";
					var para = Object.assign({},this.editDictForm);
					this.$axios.post(url,para).then(
						(resp)=>{
							var respData = resp.data;
							if(respData.retCode == this.GLOBAL.SUCCESS) {
								this.$notifyTag('成功','修改数据字典成功！','success');
								this.getDictList();
							}else{
								this.$notifyTag('错误',respData.retInfo+'['+respData.retCode+']','error');
							}
						}
					)
				} 
			})
		},
		queryDict : function(row) {
			let url = this.GLOBAL.SYSM_BASE_URL+"/dict/query/"+row.id;
			this.$axios.get(url).then(
				(resp)=>{
					var respData = resp.data;
					if(respData.retCode == this.GLOBAL.SUCCESS) {
						this.showQueryDialog = true;
						this.queryDictForm = respData.data;
					}else{
						this.showQueryDialog = false;
						this.$notifyTag('错误',respData.retInfo+'['+respData.retCode+']','error');
					}
				}
			)
		},
		querySearch(queryString, cb) {
			var restaurants = this.restaurants;
			var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
			// 调用 callback 返回建议列表的数据
			cb(results);
		},
		createFilter(queryString) {
			return (restaurant) => {
				return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
			};
		},
		loadDictType(){
			let url = this.GLOBAL.SYSM_BASE_URL+"/dict/type";
			this.$axios.post(url).then(
				(resp)=>{
					var respData = resp.data;
					if(respData.retCode == this.GLOBAL.SUCCESS) {
						this.restaurants = respData.data;
					}
				}
			)
		},
		handleSelect(item) {
			//console.log(item);
		},
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		startDict() {
			let multS = this.multipleSelection;
			if(multS.length != 0) {
				let ids = [];
				multS.forEach(item=>{
					if(!item.status) {ids.push(item.id);}
				})
				if(ids.length == 0) {
					this.$notifyTag('成功','请选择需要启动的数据！','success');
					return;
				}
				this.startOrStop({ids:ids.join(','),status:1});
				
			}else {
				this.$notifyTag('成功','请选择需要启动的数据！','success');
				return;
			}
		},
		stopDict(){
			let multS = this.multipleSelection;
			if(multS.length != 0) {
				let ids = [];
				multS.forEach(item =>{
					if(item.status) {ids.push(item.id);}
				})
				if(ids.length == 0) {
					this.$notifyTag('成功','请选择需要禁用的数据！','success');
					return;
				}
				this.startOrStop({ids:ids.join(','),status:0});
			}else {
				this.$notifyTag('成功','请选择需要禁用的数据！','success');
				return;
			}
		},
		startOrStop(params) {
			this.$axios.post(this.GLOBAL.SYSM_BASE_URL+"/dict/startOrStop",params)
			.then(
				(resp)=>{
					var respData = resp.data;
					if(respData.retCode == this.GLOBAL.SUCCESS) {
						this.$notifyTag('成功','操作成功！','success');
						this.getDictList();
					}else{
						this.$notifyTag('错误',respData.retInfo+'['+respData.retCode+']','error');
					}
				}
			)
		}
	},
	mounted:function() {
		
		//this.restaurants = this.loadDictType();
		this.getDictList();
	},
	created:function() {
		this.init();
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