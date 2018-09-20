<template>
    <div class="home-wrap">
        <div class="ms-title">后台管理系统</div>
        <!-- <div class="ms-home">
          <div class="box-header">
            <router-link to="/home/login" class="link">登陆</router-link>
            <span>/</span>
            <router-link to="/home/register" class="link">注册</router-link>
          </div>
          <router-view></router-view>
        </div>
        -->
        <div class="ms-login">
            <div class="box-header">
                <span class="link">登陆</span>
            </div>
            <span class="login_res" v-if="res">{{res}}</span>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="uid">
                    <el-input v-model="ruleForm.uid" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item prop="pwd">
                    <el-input type="password" placeholder="请输入密码" v-model="ruleForm.pwd" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import login from '@/api/login';
import bus from '@/components/common/bus';

export default {
  data: function() {
    return {
      ruleForm: {
        uid: '', // 'admin'
        pwd: ''  // '123123'
      },
      rules: {
        uid: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        pwd: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      res: ''
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // localStorage.setItem('ms_username', this.ruleForm.uid);
          // bus.userinfo = this.ruleForm.uid;
          // this.$router.push('/');
          login(this.ruleForm)
            .then(data => {
              let userinfo = data.data.split('|');
              bus.userinfo = {
                uid: userinfo[0],
                uname: userinfo[1],
                schoolid: userinfo[19],
                role: userinfo[10]
              }
              console.log(bus.userinfo);
              this.$router.push('/');
            })
            .catch(err => {
              this.res = err;
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.home-wrap {
  position: relative;
  width: 100%;
  height: 100%;
}
.ms-title {
  position: absolute;
  top: 50%;
  width: 100%;
  margin-top: -230px;
  text-align: center;
  font-size: 30px;
  color: #fff;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 300px;
  margin: -150px 0 0 -190px;
  padding: 0 40px 40px;
  border-radius: 5px;
  background: #fff;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
}
.box-header {
  text-align: center;
  line-height: 30px;
  margin: 10px 0;
  font-size: 18px;
}
.link {
  color: #333;
}
.login_res{
  font-size: 14px;
  font-style: italic;
  color: red;
  letter-spacing: 1px;
}
</style>