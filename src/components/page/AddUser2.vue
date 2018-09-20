<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 用户</el-breadcrumb-item>
                <el-breadcrumb-item>新增用户</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" :rules="rules" :status-icon="true" label-width="80px" @validate="validate">
                    <el-form-item label="用户名" prop="userid">
                        <el-input v-model="form.userid"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="pwd">
                        <el-input v-model="form.pwd" type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="重复密码" prop="rppwd">
                        <el-input v-model="form.rppwd" type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="性别">
                        <el-radio-group v-model="gender">
                            <el-radio label="男"></el-radio>
                            <el-radio label="女"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="手机号" prop="mobile" ref="mobile">
                        <el-input v-model="form.mobile"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email" ref="email">
                        <el-input v-model="form.email"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit" :disabled="!valid">注册</el-button>
                        <el-button>重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>

    </div>
</template>

<script>
import kmLs from '@/data/kemu.json';
import register from '@/api/register';
import bus from '@/components/common/bus';

export default {
  name: 'addstudent',
  data: function() {
    let validateUName = (rule, value, callback) => {
      if (rule.rule.test(value)) {
        callback();
      } else {
        callback(new Error('支持字母、数字、“_”的组合，6-10个字符'));
      }
    };
    let validatePwd = (rule, value, callback) => {
      if (!rule.rule.test(value)) {
        callback(new Error('字母、数字组合，需要包含至少一个数字，一个字母'));
      } else {
        callback();
      }
    };
    let validateRp = (rule, value, callback) => {
      if (this.form.pwd !== value) {
        callback(new Error('俩次输入的密码不一样'));
      } else {
        callback();
      }
    };
    let validatePhone = (rule, value, callback) => {
      if (rule.rule.test(value)) {
        callback();
      } else if (value.trim() === '') {
        callback();
      } else {
        callback(new Error('手机号格式不正确'));
      }
    };
    let validateEmail = (rule, value, callback) => {
      if (rule.rule.test(value)) {
        callback();
      } else if (value.trim() === '') {
        callback();
      } else {
        callback(new Error('邮箱格式不正确'));
      }
    };
    return {
      form: {
        userid: '',
        name: '',
        pwd: '',
        rppwd: '',
        email: '',
        mobile: '',
        schoolid: '',
        gender: '1',
        kemu: []
      },
      rules: {
        userid: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          {
            min: 6,
            max: 10,
            message: '长度在 6 到 10 个字符',
            trigger: 'change'
          },
          {
            validator: validateUName,
            rule: /^[a-zA-Z0-9_]{6,10}$/,
            trigger: 'change'
          }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'change' },
          {
            min: 1,
            max: 20,
            message: '',
            trigger: 'change'
          }
        ],
        pwd: [
          { required: true, message: '请输入密码', trigger: 'change' },
          {
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字符',
            trigger: 'change'
          },
          {
            validator: validatePwd,
            rule: /^(?!\d+$)(?![a-zA-Z]+$)[a-zA-Z\d]+$/,
            trigger: 'change'
          }
        ],
        rppwd: [
          {
            required: true,
            message: '俩次输入的密码不一样',
            trigger: 'change'
          },
          { validator: validateRp, trigger: 'change' }
        ],
        mobile: [
          {
            validator: validatePhone,
            trigger: 'change',
            rule: /^1[3|4|5|7|8][0-9]{9}$/
          }
        ],
        email: [
          {
            validator: validateEmail,
            rule: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
            trigger: 'change'
          }
        ]
      },
      list: kmLs,
      valid: false
    };
  },
  computed: {
    gender: {
      set(val) {
        this.form.gender = val === '男' ? '1' : '2';
      },
      get() {
        return this.form.gender === '1' ? '男' : '女';
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // localStorage.setItem('ms_username', this.ruleForm.username);
          // this.$router.push('/');
          let data = Object.assign({}, this.form);
          delete data.rppwd;
          data.kemu = data.kemu.join('|');
          let len = data.kemu.match(/\|/g) ? data.kemu.match(/\|/g).length : 0;
          for (let i = 0; i < 2 - len; i++) {
            data.kemu += '|';
          }
          data.schoolid = bus.userinfo.schoolid;
          data.callerid = '';
          data.role = 'Student'
          register(data, '/api/xiti/v1/resource/addStudent')
            .then(data => {
              this.$alert('注册成功', '', {
                confirmButtonText: '确定',
                callback: action => {
                  this.$router.push('/userlist');
                }
              });
            })
            .catch(err => {
              this.$alert(err, '', {
                confirmButtonText: '确定'
              });
            });
        } else {
          return false;
        }
      });
      // this.$message.success('提交成功！');
    },
    validate() {
      this.valid = arguments[1];
    }
  }
};
</script>