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
            @change="changeState(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button plain size="mini" type="primary" icon="el-icon-edit"  :FormVisible="true" @click="showEdit(scope.row)"></el-button>
          <el-button plain size="mini" type="danger" icon="el-icon-delete" @click="del(scope.row.id)"></el-button>
           <el-button plain size="mini" type="success" icon="el-icon-check" @click='showAssignDialog(scope.row)'>分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
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
    <!-- 用户弹出框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm" :dialogFormVisible="true" >确 定</el-button>
      </div>
    </el-dialog>
     <!-- 编辑的弹出框 -->
    <el-dialog title="编辑用户" :visible.sync="FormVisible">
      <el-form :model="editForm" :rules="rules" ref="editForm">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input  disabled v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="FormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser" :FormVisible="true">修 改</el-button>
      </div>
    </el-dialog>
      <!-- 分配角色的弹出框 -->
    <el-dialog title="分配用户" :visible.sync="assignVisible">
      <el-form :model="assignForm" :rules="rules" ref="assignForm">
        <el-form-item label="用户名" :label-width="formLabelWidth" >
          <el-input  disabled v-model="assignForm.username"></el-input>
        </el-form-item>
        <el-form-item label="角色列表" :label-width="formLabelWidth" prop="rid">
          <el-select v-model="assignForm.rid" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="assignVisible = false">取 消</el-button>
        <el-button type="primary" @click='assignRole'>确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: '',
      query: '',
      currentPage: 1,
      pageSize: 2,
      total: 0,
      tableData: [],
      assignVisible: false,
      dialogFormVisible: false,
      FormVisible: false,
      form: {
        id: '',
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        id: '',
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      assignForm: {
        id: '',
        rid: '',
        username: ''
      },
      formLabelWidth: '100px',
      roleList: [],
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          { min: 3, max: 9, message: '长度在 3 到 5 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          {
            min: 6,
            max: 12,
            message: '长度在 6 到 12 个字符',
            trigger: 'change'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'change' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        mobile: [
          {
            pattern: /^1\d{10}$/,
            message: '请输入正确的手机号',
            trigger: 'change'
          }
        ],
        rid: [{ required: true, message: '请选择角色', trigger: 'blur' }]
      }
    }
  },
  methods: {
    async getRoleList() {
      let res = await this.axios.get('roles')
      let { meta: { status }, data } = res
      if (status === 200) {
        this.roleList = data
      }
    },
    // 发送ajax方法
    async getTableData() {
      let res = await this.axios({
        method: 'get',
        url: 'users',
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      console.log(res)
      if (res.meta.status === 200) {
        this.tableData = res.data.users
        this.total = res.data.total
      }
    },
    handleSizeChange(val) {
      // val当前页的条数
      this.pageSize = val
      // 重新渲染页面
      this.getTableData()
    },
    handleCurrentChange(val) {
      // val当前页
      this.currentPage = val
      // 重新渲染页面
      this.getTableData()
    },
    // 搜索功能的实现
    search() {
      this.currentPage = 1
      // 重新渲染页面
      this.getTableData()
      this.query = ''
    },
    // 删除功能
    del(id) {
      this.$confirm('您确定删除该用户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 发送ajax请求
          this.axios({
            url: `users/${id}`,
            method: 'delete'
          }).then(res => {
            if (res.meta.status === 200) {
              if (this.tableData.length === 1 && this.currentPage > 1) {
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
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 状态改变事件
    async changeState(user) {
      // 发送ajax请求
      let res = await this.axios({
        url: `users/${user.id}/state/${user.mg_state}`,
        method: 'put'
      })
      if (res.meta.status === 200) {
        this.$message.success('修改状态成功')
        // 重新渲染页面
        this.getTableData()
      } else {
        this.$message.error('修改状态失败')
      }
    },
    // 添加功能表单验证
    submitForm() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          //  验证成功发送ajax
          let res = await this.axios({
            url: 'users',
            method: 'post',
            data: this.form
          })
          if (res.meta.status === 201) {
            //  重新渲染页面最后一页
            this.total++
            this.currentPage = Math.ceil(this.total / this.pageSize)
            this.getTableData()
            // 隐藏弹出框
            this.dialogFormVisible = false
            // 重置表单
            this.$refs.form.resetFields()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 展示编辑对话框
    showEdit(user) {
      this.FormVisible = true
      // 让数据回显, 把user中的值赋值editForm中
      this.editForm.id = user.id
      this.editForm.username = user.username
      this.editForm.email = user.email
      this.editForm.mobile = user.mobile
    },
    // 修改用户数据
    editUser() {
      // 表单验证
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          // 发送ajax请求
          let res = await this.axios({
            url: `users/${this.editForm.id}`,
            method: 'put',
            data: this.editForm
          })
          if (res.meta.status === 200) {
            // 重新渲染页面
            this.getTableData()
            // 表单重置
            this.$refs.editForm.resetFields()
            //隐藏对话框
            this.FormVisible = false
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 显示分配角色对话框
    async showAssignDialog(role) {
      console.log(role)
      // 显示对话框
      this.assignVisible = true
      // 数据回显
      this.assignForm.username = role.username
      this.assignForm.id = role.id
      // 根据用户id获取角色id
      let res = await this.axios.get(`users/${this.assignForm.id}`)
      let { meta: { status }, data: { rid } } = res
      console.log(res)
      if (status === 200) {
        if (rid === -1) {
          rid = ''
        }
        this.assignForm.rid = rid
      }
    },
    // 分配角色
    assignRole() {
      // 进行表单验证
      this.$refs.assignForm.validate(async valid => {
        if (!valid) return false
        let res = await this.axios.put(`users/${this.assignForm.id}/role`, {
          rid: this.assignForm.rid
        })
        let { meta: { status }, data } = res
        if (status === 200) {
          // 重新渲染页面
          this.getTableData()
          // 表单重置
          this.$refs.assignForm.resetFields()
          //隐藏对话框
          this.assignVisible = false
        }
      })
    }
  },
  created() {
    // 向后台发送ajax请求数据
    this.getTableData()
    this.getRoleList()
  }
}
</script>
<style lang='less' scoped>
.el-input {
  width: 400px;
}
</style>
