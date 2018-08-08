<template>
    <div class="ms-register">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
            <el-form-item prop="username">
                <el-input v-model="ruleForm.username" placeholder="username"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" placeholder="password" v-model="ruleForm.password"></el-input>
            </el-form-item>
            <el-form-item prop="rptpwd">
                <el-input type="rptpwd" placeholder="repeat password" v-model="ruleForm.repeatpwd"></el-input>
            </el-form-item>
            <div class="login-btn">
                <el-button type="primary" @click="submitForm('ruleForm')">注册</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
export default {
  data: function() {
    return {
      ruleForm: {
        username: '',
        password: '',
        repeatpwd: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        rptpwd: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          localStorage.setItem('ms_username', this.ruleForm.username);
          this.$router.push('/');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
}
</style>