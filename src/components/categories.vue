<template>
  <div class='categories'>
    <!-- 添加分类 -->
    <el-button type="success" plain @click="showCatDialog">添加分类</el-button>
      <!-- 表格部分 -->
    <el-table
      :data="categoryList"
      style="width: 100%"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading">
      <el-table-tree-column
        prop="cat_name"
        label="分类名称"
        width="180"
        tree-key="cat_id"
        parent-key="cat_pid"
        level-key="cat_level"
        :indentSize="20">
      </el-table-tree-column>
      <el-table-column prop="cat_deleted" label="是否删除" width="180">
        <template slot-scope="scope">
          {{scope.row.cat_deleted?'是':'否'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="cat_level"
        label="排序"
        width="180">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button plain size="mini" type="primary" icon="el-icon-edit" @click='showEditDialog(scope.row)'></el-button>
          <el-button plain size="mini" type="danger" icon="el-icon-delete" @click="deleteCategory(scope.row)"></el-button>
           <el-button plain size="mini" type="success" icon="el-icon-check">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页部分 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background>
    </el-pagination>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addCatDialogVisible"
      width="30%">
      <el-form :model="addForm" ref="addForm" :rules="rules">
        <el-form-item label="分类名称" prop="cat_name" width="100%" >
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
         <el-form-item label="父级名称" prop='cat_pid' width="100%">
           <el-cascader
            :options="options"
            :props="props"
            v-model="addForm.cat_pid">
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editDialogVisible"
      width="30%">
      <el-form :model="editForm" ref="editForm" :rules="rules">
        <el-form-item label="分类名称" prop="cat_name" width="100%" >
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCategory" >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categoryList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: true,
      editDialogVisible: false,
      addCatDialogVisible: false,
      addForm: {
        cat_name: '',
        cat_pid: []
      },
      editForm: {
        cat_name: '',
        cat_id: ''
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入分类的名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getCategoryList() {
      this.loading = true
      //发送ajax请求
      let res = await this.axios.get('categories', {
        params: {
          type: 3,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      console.log(res)
      let { meta: { status }, data: { result, total } } = res
      if (status === 200) {
        this.categoryList = result
        this.total = total
        this.loading = false
      }
    },
    handleSizeChange(val) {
      this.pagesize = val
      // 重新渲染页面
      this.currentPage = 1
      this.getCategoryList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      //重新渲染页面
      this.getCategoryList()
    },
    async deleteCategory(role) {
      try {
        // 发送ajax请求
        await this.$confirm('您确定要删除吗？', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // 发送ajax更新数据
        let res = await this.axios.delete(`categories/${role.cat_id}`)
        let { meta: { status }, data } = res
        if (status === 200) {
          // 重新渲染页面
          this.getCategoryList()
        }
      } catch (e) {
        this.$message.error('取消删除', e)
      }
    },
    async showCatDialog() {
      //显示对话框
      this.addCatDialogVisible = true
      // 发送ajax获取分类数据
      let res = await this.axios.get('categories?type=2')
      console.log(res)
      let { meta: { status }, data } = res
      if (status === 200) {
        this.options = data
      }
    },
    addCate() {
      this.$refs.addForm.validate(async valid => {
        if (!valid) return false
        // 发送ajax更新数据
        let { cat_name: catName, cat_pid: catPid } = this.addForm
        let res = await this.axios.post('categories', {
          cat_pid: catPid[catPid.length - 1] || 0,
          cat_name: catName,
          cat_level: catPid.length
        })
        console.log(res)
        let { meta: { status }, data } = res
        if (status === 201) {
          // 重新渲染页面
          this.getCategoryList()
          //重置表单
          this.$refs.addForm.resetFields()
          //关闭对话框
          this.addCatDialogVisible = false
          this.$message.success('添加分类成功')
        }
      })
    },
    // 显示编辑对话框
    showEditDialog(product) {
      // 弹出对话框
      this.editDialogVisible = true
      // 回显
      let { cat_name: catName, cat_id: catId } = product
      this.editForm.cat_name = catName
      this.editForm.cat_id = catId
    },
    editCategory() {
      console.log(this.editForm)
      this.$refs.editForm.validate(async valid => {
        if (!valid) return false
        // 发送ajax更新数据
        let { cat_name: catName, cat_id: catId } = this.editForm
        let res = await this.axios.put(`categories/${catId}`, {
          cat_name: catName
        })
        let { meta: { status }, data } = res
        if (status === 200) {
          // 重新渲染页面
          this.getCategoryList()
          // 重置表单
          this.$refs.editForm.resetFields()
          // 隐藏对话框
          this.editDialogVisible = false
        }
      })
    }
  },
  created() {
    this.getCategoryList()
  }
}
</script>

<style>
</style>
