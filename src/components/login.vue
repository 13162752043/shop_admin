<template>
  <div class="login">
    <el-form  status-icon :model="form" :rules="rules" ref="form" label-width="80px">
      <div class='pic'>
        <img src="../assets/1.jpg" alt="">
      </div>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">登录</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 引入axios
import axios from 'axios'
// shift + tab : 往前按了一下tab
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          { min: 4, max: 10, message: '长度在 4 到 10 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 重置表单
    reset () {
      this.$refs.form.resetFields()
    },
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 登录成功发送ajax请求,如果成功跳转到登录页
          axios({
            url:'http://localhost:8888/api/private/v1/login',
            method: 'post',
            data: this.form
          }).then(res=>{
            if(res.data.meta.status==200){
              // 提示信息
              this.$message({
              message: '登录成功',
              type: 'success'
              })
              // 把token存入localstorage
              localStorage.setItem('token', res.data.data.token)
              // 跳转页面
              this.$router.push('/home')
            }
          })
        } else {
          this.$message('登录失败')
          return false
        }
      })
    },
  }
}
</script>

<style lang='less' scoped>
.login{
  overflow: hidden;
  height: 100%;
  background-color: #2d434c;
  .el-form{
    width: 400px;
    margin:200px auto;
    background-color: #fff;
    color:#fff;
    padding:70px 20px 5px 0;
    border-radius: 10px;
    position: relative;
    .pic {
      width: 150px;
      height: 150px;
      position:absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -100px;
      border: 10px solid #fff;
      border-radius:50%; 
      img {
        border-radius:50%; 
        width: 150px;
        height: 150px;
      }

    }
  }
}
 
</style>
