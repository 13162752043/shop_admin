<template>
  <div class='user'>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索功能 -->
    <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
      <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
    </el-input>
    <el-button type="success" plain  @click="dialogFormVisible = true">用户添加</el-button>
    <!-- 用户弹出框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item> 
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm" :dialogFormVisible="true" >确 定</el-button>
      </div>
    </el-dialog>

    <!-- 表格部分 -->
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
        width="180">
      </el-table-column>
      <el-table-column
        label="用户状态"
        width="180">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button plain size="mini" type="primary" icon="el-icon-edit"  :FormVisible="true" @click="update(scope.row.id)"></el-button>
          <el-button plain size="mini" type="danger" icon="el-icon-delete" @click="del(scope.row.id)"></el-button>
           <el-button plain size="mini" type="success" icon="el-icon-check">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑的弹出框 -->
    <el-dialog title="编辑用户" :visible.sync="FormVisible">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input  disabled v-model="form.username"></el-input>
        </el-form-item> 
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" :label-width="formLabelWidth">
          <el-input v-model="form.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="FormVisible = false">取 消</el-button>
        <el-button type="primary" :FormVisible="true" >修 改</el-button>
      </div>
    </el-dialog>
    <!-- 分页部分 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background>
    </el-pagination>
  </div>
 
</template>

<script>
  import  axios from 'axios'
  export default {
    data() {
      return {
        value:'',
        query:'',
        currentPage:1,
        pageSize:2,
        total:0,
        tableData:[],
        dialogFormVisible: false,
        FormVisible: false,
        form: {
          username: '',
          password: '',
          email: '',
          mobile: '',
        },
        formLabelWidth: '100px',
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'change' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'change' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'change' },
            { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      handleSizeChange(val) {
        // val当前页的条数
        this.pageSize=val
        //重新渲染页面
        this.getTableData()
      },
      handleCurrentChange(val) {
        // val当前页
        this.currentPage=val
        //重新渲染页面
        this.getTableData()
      },
      created(){
        // 向后台发送ajax请求数据
        this.getTableData()
      },
      // 发送ajax方法
      getTableData() {
        axios({
          method:'get',
          url:'http://localhost:8888/api/private/v1/users',
          params:{
            query:this.query,
            pagenum:this.currentPage,
            pagesize:this.pageSize
          },
          headers:{
            Authorization:localStorage.getItem('token')
          }
        }).then(res=>{
          console.log(res.data)
          if(res.data.meta.status===200){
            this.tableData=res.data.data.users,
            this.total=res.data.data.total
          }
        })
      },
      // 搜索功能的实现
      search() {
        this.currentPage = 1
        console.log(this.query)
        //重新渲染页面
        this.getTableData()
        this.query=''

      },
      // 删除功能
      del(id) {
        this.$confirm('您确定删除该用户吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 发送ajax请求
          axios({
            url:`http://localhost:8888/api/private/v1/users/${id}`,
            method:'delete',
            headers: {
               Authorization: localStorage.getItem('token')
            }
          }).then(res=>{
            if(res.data.meta.status===200){
              if(this.tableData.length===1&&this.currentPage>1){
                this.currentPage--
              }
              // 重新渲染页面
              this.getTableData()
              this.$message({
              type: 'success',
              message: '删除成功'
              })   
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })         
        })

      },
      // 添加功能表单验证
      submitForm() {
       this.$refs.form.validate((valid) => {
         if (valid) {
          //  验证成功发送ajax
          axios({
            url:'http://localhost:8888/api/private/v1/users',
            method:'post',
            data:this.form,
            headers:{
              Authorization:localStorage.getItem('token')
            }
          }).then(res=>{
            console.log(res.data)
            if(res.data.meta.status===201){
              //  重新渲染页面
              this.getTableData()
              // 隐藏弹出框
              this.dialogFormVisible =false
            }
          })
        
         } else {
           console.log('error submit!!');
           return false;
         }
       })
      },
      // 修改用户功能
      update(id) {
        console.log(id)
        this.FormVisible=true
        // 发送ajax请求
      }
      
    }
  }
</script>

<style lang='less' scoped>
  .el-breadcrumb{
    margin-bottom:10px;
    background-color: #ccc;
    height: 40px;
    line-height: 40px;
  }
  .el-input{
    width: 400px;
  }
</style>
