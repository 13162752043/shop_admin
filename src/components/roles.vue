<template>
  <div class='role'>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/role' }">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <el-button type="success" plain @click="showAddDialog">添加用户</el-button>
    <!-- 权限列表 -->
    <el-table
      :data="roleList"
      style="width: 100%">
      <el-table-column
        type="expand">
        <template slot-scope="scope">
          <el-row v-if="scope.row.children.length===0">
            暂无数据
          </el-row>
          <!-- 获取权限一级标题 -->
          <el-row  class='level1' v-for="level1 in scope.row.children" :key="level1.id">
            <el-col :span="4" >
              <el-tag closable  @close="deleteRight(scope.row,level1.id)">{{level1.authName}}
              </el-tag>
            </el-col>
            <el-col :span="20">
              <!-- 获取权限二级标题 -->
              <el-row class='level2' v-for="level2 in level1.children" :key="level2.id">
                <el-col :span="4">
                  <el-tag   @close="deleteRight(scope.row,level2.id)" closable type="success">{{level2.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <!-- 获取三级标题 -->
                  <el-tag  @close="deleteRight(scope.row,level3.id)" closable class='level3' type='danger' v-for="level3 in level2.children" :key="level3.id">{{level3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        type="index">
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        label="描述"
        width="180">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button plain size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
          <el-button plain size="mini" type="danger" icon="el-icon-delete" @click="deleteRole(scope.row.id)"></el-button>
           <el-button :assignDialogVisible = "true" plain size="mini" type="success" icon="el-icon-check" @click="showAssignRight(scope.row)">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="assignDialogVisible"
      width="30%">
      <el-tree
        ref="tree"
        :data="rightList"
        :props="defaultProps"
        show-checkbox
        default-expand-all
        node-key="id">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click='assignRight'>确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="30%">
      <el-form :model="addForm" ref="addForm" :rules="rules" >
        <el-form-item label="用户名称" prop="roleName" width="100%">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
         <el-form-item label="角色描述" prop='roleDesc' width="100%">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click='addRole' >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="editDialogVisible"
      width="30%">
      <el-form :model="editForm" ref="editForm" :rules="rules" >
        <el-form-item label="用户名称" prop="roleName" width="100%">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
         <el-form-item label="角色描述" prop='roleDesc' width="100%">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click='editRole'>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      roleList: [],
      rightList: [],
      editDialogVisible: false,
      assignDialogVisible: false,
      addDialogVisible: false,
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      id: '',
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      editForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'change' }
        ],
      }
    }
  },
  methods: {
    async getRoleList() {
      let res = await this.axios.get('roles')
      let {meta: {status}, data} = res
      if (status === 200) {
        this.roleList = data
      }
    },
    async getRigthList() {
    // 获取所有的权限数据
      let res = await this.axios.get(`rights/tree`)
      let { meta: { status }, data } = res
      if (status === 200) {
        this.rightList = data
      }
    },
    async deleteRight(role, rightId) {
      // 发送ajax
      let res = await this.axios.delete(`roles/${role.id}/rights/${rightId}`)
      let {meta: {status}, data} = res
      if(status === 200) {
        // 重新渲染页面
        // 因为只更新权限列表
        role.children = data
        // this.getRoleList()

      }
    },
    // 展示所有权限
    showAssignRight(role) {
      console.log(role)
      this.id = role.id
      // 展示对话框
      this.assignDialogVisible = true
      // 获取所有的权限信息
      this.getRigthList()
      // 获取所有的3级权限的节点
       this.$nextTick(() => {
        let temp = []
        role.children.forEach(l1 => {
          l1.children.forEach(l2 => {
            l2.children.forEach(l3 => {
              // 把3级的id存起来
              temp.push(l3.id)
            })
          })
        })
        // 设置默认选中
        this.$refs.tree.setCheckedKeys(temp)
      })
    },
    // 分配权限
    async assignRight() {
      // 获取选中的id
      let checked = this.$refs.tree.getCheckedKeys()
      // 获取所有半选的id
      let halfChecked = this.$refs.tree.getHalfCheckedKeys()
      // 拼接成数组
      let total = [...checked,...halfChecked]
      // 发送ajax请求
      let res = await this.axios.post(`roles/${this.id}/rights`,{
        rids: total.join()
      })
      let {meta: {status}, data} = res
      if(status === 200) {
        // 重新渲染页面
        this.getRoleList()
        // 关闭小框框
        this.assignDialogVisible = false
      }
    },
    // 删除角色
    async deleteRole(id) {
      // 发送ajax请求
      let res = await this.axios.delete(`roles/${id}`)
      let {meta: {status}, data} = res
      if(status === 200) {
        // 重新渲染页面
        this.getRoleList()

      }
    },
    // 弹出添加用户对话框
    showAddDialog() {
      // 点击弹出对话框
      this.addDialogVisible = true
    },
    // 添加用户
    addRole() {
      // 进行表单验证
      this.$refs.addForm.validate(async valid => {
        if (!valid) return false
        // 发送ajax请求
        let res = await this.axios.post('roles',this.addForm)
        console.log(res)
        let {meta: {status}, data} = res
        if (status === 201) {
          // 重新渲染页面
          this.getRoleList()
          // 重置表单
          this.$refs.addForm.resetFields()
          // 关闭对话框
          this.addDialogVisible = false
          // 提示消息
          this.$message.success('添加成功')
        }
      })

    },
    // 显示编辑对话框
    showEditDialog(role) {
      // 实现数据的回显
      this.editForm.id = role.id
      this.editForm.roleName = role.roleName
      this.editForm.roleDesc = role.roleDesc
      // 显示对话框
      this.editDialogVisible = true
    },
    // 修改用户信息
    editRole(role) {
      // 对表单进行验证
      this.$refs.editForm.validate(async valid => {
        if(!valid) return false
        let res = await this.axios.put(`roles/${this.editForm.id}`,this.editForm)
        let {meta: {status}, data} = res
        if(status = 200){
          // 重新渲染页面
          this.getRoleList()
          // 重置表单
          this.$refs.editForm.resetFields()
          // 关闭对话框
          this.editDialogVisible = false
          // 提示消息
          this.$message.success('修改成功')
        }
      })
    }

  },
 created() {
    this.getRoleList()
  }
}
</script>
<style lang='less' scoped>
.level2 {
  margin-bottom: 10px;
}

.level3 {
  margin-right: 10px;
  margin-bottom: 5px;
}

</style>
