<template>
  <div class='add'>
    <!-- 步骤条 -->
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1 " description="基本信息"></el-step>
      <el-step title="步骤 2 " description="商品图片"></el-step>
      <el-step title="步骤 3 " description="商品内容"></el-step>
    </el-steps>
    <!-- tab栏 -->
    <el-tabs tab-position="left" @tab-click="handleClick" v-model="activeName">
      <el-tab-pane label="基本信息" name="basic">
        <el-form :model="addForm" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
           <el-form-item label="商品价格">
            <el-input v-model="addForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="addForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="addForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              :props="props"
              :options="options"
              v-model="addForm.goods_cat">
          </el-cascader>
          </el-form-item>
          <el-form-item label="是否促销">
            <el-radio v-model="addForm.is_promote" :label="true">是</el-radio>
            <el-radio v-model="addForm.is_promote" :label="false">否</el-radio>
          </el-form-item>
          <el-button type="success" @click="next(1,'pic')">下一步</el-button>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="pic">
        <el-upload
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          :on-success="handleSuccess"
          list-type="picture"
          :headers="headers">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
         <el-button type="success" @click="next2(2,'content')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="content">
        <quill-editor v-model="addForm.goods_introduce">
        </quill-editor>
        <el-button type="success" plain @click="addPro">添加</el-button>
      </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      activeName: 'basic',
      addForm: {
        goods_name: '',
        goods_weight: '',
        goods_price: '',
        goods_number: '',
        goods_cat: [],
        is_promote: false,
        pic: [],
        goods_introduce: ''
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }
  },
  methods: {
    handleClick(tab) {
      this.active = +tab.index
    },
    // 获取商品列表的数据
    async getCateList() {
      let res = await this.axios.get('categories?type=3')
      let { meta: { status }, data } = res
      if (status === 200) {
        this.options = data
      }
    },
    // 点击下二步
    next(active, activeName) {
      this.active = active
      this.activeName = activeName
    },
    handleSuccess(res, file, fileList) {
      this.addForm.pic = res.data.tmp_path
    },
    // 点击第三步
    next2(active, activeName) {
      this.active = active
      this.activeName = activeName
    },
    async addPro() {
      // 发送ajax
      let res = await this.axios.post('goods', {
        ...this.addForm,
        goods_cat: this.addForm.goods_cat.join()
      })
      console.log(res)
      let { meta: { status }, data } = res
      if (status === 201) {
        this.$router.push('/goods')
        this.$message.success('恭喜你，添加成功')
      }
    }
  },
  created() {
    this.getCateList()
  }
}
</script>

<style lang='less' scoped>
.quill-editor {
  background-color: #fff;
  /deep/ .ql-editor {
    height: 300px;
  }
}
</style>
