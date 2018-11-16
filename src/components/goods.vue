<template>
  <div class="goods">
     <!-- 添加分类 -->
    <el-button type="success" @click="$router.push('/goods-add')">添加分类</el-button>
      <!-- 表格部分 -->
    <el-table
      :data="goodList"
      style="width: 100%">
      <el-table-column
        type="index"
        width="50"
        :index="indexMethod">
      </el-table-column>
      <el-table-tree-column
        prop="goods_name"
        label="商品名称"
        width="180">
      </el-table-tree-column>
      <el-table-column 
        prop="goods_price"
        label="商品价格"
        width="180">
      </el-table-column>
      <el-table-column
        prop="goods_weight"
        label="商品重量"
        width="180">
      </el-table-column>
      <el-table-column
        label="创建时间"
        width="180">
        <template slot-scope="scope">
          {{scope.row.add_time|dateFilter}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button plain size="mini" type="primary" icon="el-icon-edit"></el-button>
          <el-button plain size="mini" type="danger" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodList: [],
      query: '',
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  methods: {
    async getGoodList() {
      let res = await this.axios.get('goods', {
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      console.log(res)
      let { meta: { status }, data: { goods, total } } = res
      if (status === 200) {
        this.goodList = goods
        this.total = total
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      // 重新渲染页面
      this.getGoodList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      //重新渲染页面
      this.getGoodList()
    },
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1
    }
  },
  created() {
    this.getGoodList()
  }
}
</script>

<style>
</style>
