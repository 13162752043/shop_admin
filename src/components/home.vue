<template>
  <div class='home'>
    <el-container>
      <el-header>
        <div class='logo'></div>
        <div class='logout'>
          欢迎光临
          <a href="javascript:;" @click="logout">退出</a>
        </div>
        <h1>电商管理系统</h1>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-row class="tac">
            <el-col :span="12">
             <el-menu
                :default-active="$route.path.slice(1)"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b"
                router>
               <el-submenu :index='menu.path' v-for="menu in menuList" :key="menu.id">
                 <template slot="title">
                   <i class="el-icon-location"></i>
                   <span>{{menu.authName}}</span>
                 </template>
                   <el-menu-item :index='item.path' v-for='item in menu.children' :key="item.id" >
                    <i class="el-icon-location"></i>
                    <span>{{item.authName}}</span>
                   </el-menu-item>
               </el-submenu>
             </el-menu>
            </el-col>
          </el-row>
        </el-aside>
        <el-main><router-view></router-view></el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      menuList: []
    }
  },
  methods: {
    logout(option) {
      this.$confirm('您确定退出吗?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 成功的跳转到登录页，并把login移除
          localStorage.removeItem('token')
          this.$router.push('/login')
          this.$message({
            type: 'success',
            message: '退出成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出'
          })
        })
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    }
  },
  async created() {
    //发送ajax请求
    let res = await this.axios.get('menus')
    console.log(res)
    let { meta: { status }, data } = res
    if (status === 200) {
      this.menuList = data
    }
  }
}
</script>

<style lang='less'>
.home {
  width: 100%;
  height: 100%;
  .el-container {
    height: 100%;
    .el-header {
      padding: 0;
      background: #b3c1cd;
      .logo {
        width: 200px;
        height: 60px;
        float: left;
        background: url('../assets/logo.png') center no-repeat;
      }
      .logout {
        width: 200px;
        height: 60px;
        line-height: 60px;
        float: right;
        font-weight: 700;
        a {
          color: darkorange;
        }
      }
      h1 {
        text-align: center;
        overflow: hidden;
        height: 60px;
        line-height: 60px;
        color: #fff;
      }
      .logout {
        text-align: center;
      }
    }
    .el-aside {
      background-color: #eaeef1;
      height: 100%;
      .el-row {
        width: 100%;
        height: 100%;
        .el-col {
          width: 100%;
          height: 100%;
          .el-menu {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .el-main {
      height: 100%;
    }
  }
}
</style>
