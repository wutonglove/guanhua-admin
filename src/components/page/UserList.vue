<template>
    <div class="table">
        <div class="container">
            <div class="control_box">
                <el-button type="danger" icon="el-icon-delete" class="handle-del" @click="delAll">批量删除</el-button>
                <el-button type="primary" icon="el-icon-plus" class="handle-del rt" @click="register">注册新用户</el-button>
            </div>
            <el-table :data="data" border style="width: 100%" ref="multipleTable" :row-style="rowStyle" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="name" label="姓名" width="80">
                </el-table-column>
                <el-table-column prop="username" label="用户名" width="80">
                </el-table-column>
                <el-table-column prop="gender" label="性别" width="50">
                </el-table-column>
                <el-table-column prop="kumu" label="科目" width="120">
                </el-table-column>
                <el-table-column prop="school" label="学校">
                </el-table-column>
                <el-table-column prop="school" label="手机号">
                </el-table-column>
                <el-table-column prop="school" label="邮箱">
                </el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" background layout="prev, pager, next" :total="100">
                </el-pagination>
            </div>
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
export default {
  name: 'userlist',
  data() {
    return {
      url: './static/vuetable.json',
      tableData: [],
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
  created() {
    this.getData();
  },
  computed: {
    data() {
      return this.tableData.filter(d => {
        let is_del = false;
        for (let i = 0; i < this.del_list.length; i++) {
          if (d.name === this.del_list[i].name) {
            is_del = true;
            break;
          }
        }
        if (!is_del) {
          if (
            d.address.indexOf(this.select_cate) > -1 &&
            (d.name.indexOf(this.select_word) > -1 ||
              d.address.indexOf(this.select_word) > -1)
          ) {
            return d;
          }
        }
      });
    }
  },
  methods: {
    rowStyle({ row, rowIndex }) {
      return rowIndex % 2 === 0 ? 'background-color: rgb(245,245,245)' : '';
    },
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    // 获取 easy-mock 的模拟数据
    getData() {
      // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
      if (process.env.NODE_ENV === 'development') {
        this.url = '/ms/table/list';
      }
      this.$axios
        .post(this.url, {
          page: this.cur_page
        })
        .then(res => {
          this.tableData = res.data.list;
        });
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
      bus.userinfo.role === 'Teacher'
        ? this.$router.push('/adduser2')
        : this.$router.push('/adduser1');
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
