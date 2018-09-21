<template>
    <div class="table">
        <div class="container">
            <div class="control_box">
                <el-button type="danger" icon="el-icon-delete" class="handle-del" @click="delAll">批量删除</el-button>
                <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
                <el-button type="primary" icon="el-icon-plus" class="rt" @click="register" v-if="role!='SAdmin'">注册新用户</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable" :row-style="rowStyle" @selection-change="handleSelectionChange" v-if="role === 'SAdmin'">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="id" label="ID" width="80">
                </el-table-column>
                <el-table-column prop="name" label="学校">
                </el-table-column>
                <el-table-column label="操作" width="80">
                    <template slot-scope="scope">
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 表2 -->
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable" :row-style="rowStyle" @selection-change="handleSelectionChange" v-else>
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="name" label="姓名" width="120">
                </el-table-column>
                <el-table-column prop="id" label="用户名" width="180">
                </el-table-column>
                <el-table-column prop="gender" label="性别" width="50">
                </el-table-column>
                <el-table-column prop="kemu" label="科目" width="120">
                </el-table-column>
                <el-table-column prop="school" label="学校">
                </el-table-column>
                <el-table-column prop="mobile" label="手机号">
                </el-table-column>
                <el-table-column prop="email" label="邮箱">
                </el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" background layout="prev, pager, next" :total="tableData.length">
                </el-pagination>
            </div> -->
        </div>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import bus from '@/components/common/bus';
import getSchoolList from '@/api/getSchoolList';
import getTeacherList from '@/api/getTeacherList';
import kmLs from '@/data/kemu.json';

export default {
  name: 'userlist',
  data() {
    return {
      url: './static/vuetable.json',
      tableData: [],
      total: 0,
      cur_page: 1,
      multipleSelection: [],
      select_cate: '',
      select_word: '',
      del_list: [],
      is_search: false,
      //   editVisible: false,
      preVisible: false,
      delVisible: false,
      form: {
        name: '',
        date: '',
        address: ''
      },
      idx: -1,
      courseidList: [],
      selectedCourseid: [],
      time: '',
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      }
    };
  },
  computed: {
    role() {
      return bus.userinfo.role;
    }
  },
  methods: {
    query() {
      this.getData();
    },
    rowStyle({ row, rowIndex }) {
      return rowIndex % 2 === 0 ? 'background-color: rgb(245,245,245)' : '';
    },
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      console.log(val);
      this.getData();
    },
    // 获取 easy-mock 的模拟数据
    getData() {
      this.tableData = [];
      if (this.role === 'SAdmin') {
        getSchoolList()
          .then(data => {
            this.tableData = data;
          })
          .catch(e => {
            this.$alert(err, '', {
              confirmButtonText: '确定'
            });
          });
      } else if (this.role === 'Admin') {
        let schoolid = +bus.userinfo.schoolid;
        getTeacherList({
          schoolid
        })
          .then(data => {
            this.tableData = data.map(item => {
              let kemu = [];
              for (let key in item) {
                if (/kemu\d+/.test(key)) {
                  let v = kmLs.findIndex(ke => {
                    return ke.code === item[key];
                  });
                  if (v !== -1) kemu.push(kmLs[v].name);
                }
              }
              return {
                name: item.name,
                id: item.id,
                gender: item.gender === 1 ? '男' : '女',
                email: item.email,
                mobile: item.mobile,
                school: item.schoolname,
                kemu: kemu.join('、')
              };
            });
          })
          .catch(() => {});
      }
    },
    search() {
      this.is_search = true;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    handleEdit(index, row) {
      this.idx = index;
      const item = this.tableData[index];
      this.form = {
        name: item.name,
        date: item.date,
        address: item.address
      };
      this.editVisible = true;
    },
    handleDelete(index, row) {
      this.idx = index;
      this.delVisible = true;
    },
    delAll() {
      const length = this.multipleSelection.length;
      let str = '';
      this.del_list = this.del_list.concat(this.multipleSelection);
      for (let i = 0; i < length; i++) {
        str += this.multipleSelection[i].name + ' ';
      }
      this.$message.error('删除了' + str);
      this.multipleSelection = [];
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 保存编辑
    saveEdit() {
      this.$set(this.tableData, this.idx, this.form);
      this.editVisible = false;
      this.$message.success(`修改第 ${this.idx + 1} 行成功`);
    },
    // 确定删除
    deleteRow() {
      this.tableData.splice(this.idx, 1);
      this.$message.success('删除成功');
      this.delVisible = false;
    },
    courseidSelected() {},
    register() {
      this.role === 'Teacher'
        ? this.$router.push('/adduser2')
        : this.$router.push('/adduser1');
    }
  },
  watch: {
    $route(now, old) {
      if (old.path === '/adduser1') this.getData();
    }
  }
};
</script>

<style scoped>
.handle-select {
  width: 120px;
}
.handle-cascader {
  width: 150px;
}
.handle-input {
  width: 130px;
  display: inline-block;
}
.time-picker {
  width: 260px;
}
.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}
.control_box {
  overflow: hidden;
  margin: 10px 0;
}
.rt {
  float: right;
}
.mr10 {
  margin-right: 10px;
}
.preview_box {
  width: 100%;
  height: 100%;
  min-height: 500px;
}
</style>
