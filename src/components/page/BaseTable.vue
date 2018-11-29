<template>
    <div class="table">
        <div class="container">
            <div class="handle-box">
                <!-- <el-select v-model="select_cate" placeholder="习题类型" class="handle-select mr10">
                    <el-option :key="index" :label="item" :value="item" v-for="(item,index) in queryData.qstypeLs"></el-option>
                </el-select> -->
                <el-cascader
                  ref="courseCom"
                  expand-trigger="hover"
                  :filterable="true"
                  :options="queryData.courseLs"
                  v-model="select_course"
                  @change="selectCourse">
                </el-cascader>
                <el-select v-model="select_kemu" placeholder="科目" class="handle-select mr10">
                    <el-option label="全部" value=""></el-option>
                    <el-option :key="index" :label="item.name" :value="item.code" v-for="(item,index) in queryData.kemuLs"></el-option>
                </el-select>
                <el-select v-model="select_grade" placeholder="学阶" class="handle-select mr10">
                    <el-option label="全部" value=""></el-option>
                    <el-option :key="index" :label="item.name" :value="item.code" v-for="(item,index) in queryData.gradeLs"></el-option>
                </el-select>
                <!-- <el-date-picker
                  class="time-picker mr10"
                  v-model="time"
                  type="datetimerange"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :editable="false"
                  align="right">
                </el-date-picker>
                 <el-cascader
                    class="handle-cascader mr10"
                    expand-trigger="hover"
                    :options="courseidList"
                    v-model="selectedCourseid"
                    @change="courseidSelected"
                    placeholder="请选择课程">
                </el-cascader> -->
                <el-input v-model="select_creator" placeholder="创建者" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click.prevent.stop="search">查询</el-button>
            </div>
            <div class="control_box">
                <el-button type="danger" icon="el-icon-delete" class="handle-del" @click="delAll">批量删除</el-button>
                <el-button type="primary" icon="el-icon-plus" class="handle-del rt" @click="createQS">新建</el-button>
            </div>
            <el-table :data="data" border style="width: 100%" ref="multipleTable" :row-style="rowStyle" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="modify_time" label="日期" width="150" :sortable="true">
                </el-table-column>
                <el-table-column prop="grade" label="学阶" width="80" :sortable="true" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="subject" label="科目" width="80" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="xttype" label="习题类型" width="80" :show-overflow-tooltip="true">>
                </el-table-column>
                <el-table-column prop="creator" label="创建者" width="80" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="maincontent" label="习题内容" min-width="200" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="name" label=".." :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <!-- <el-button size="small" @click="">编辑</el-button> -->
                        <el-button size="small" @click="openQS(scope.row)">预览</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" background layout="prev, pager, next" :total="10">
                </el-pagination>
            </div>
        </div>

        <el-dialog title="预览" :visible.sync="preVisible" width="80%" center>
            <iframe :src="previewUrl" frameborder="0" class="preview_box"></iframe>
        </el-dialog>

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
import qstypeLs from '@/data/qstypeLs.json';
import gradeLs from '@/data/grade.json';
import kemuLs from '@/data/kemu.json';
import _courseLs from '@/data/course.json';

import getQSList from '@/api/getQSList';
import bus from '@/components/common/bus';

function courseFormat(arr) {
  return arr.map(value => {
    return {
      value: value.code,
      label: value.name,
      children: value.data.length > 0 ? courseFormat(value.data) : undefined
    };
  });
}

export default {
  name: 'basetable',
  data() {
    return {
      queryData: {
        qstypeLs,
        gradeLs,
        kemuLs,
        courseLs: courseFormat(_courseLs)
      },
      tableData: [],
      multipleSelection: [],
      select_cate: '',
      select_kemu: '',
      select_grade: '',
      select_creator: '',
      select_course: [],
      del_list: [],
      preVisible: false,
      delVisible: false,
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
      },
      cur_page: 1,
      previewUrl: ''
    };
  },
  computed: {
    data() {
      return this.tableData.map(item => {
        let _grade = gradeLs.find(g => {
          return +item.grade === +g.code;
        });
        let _xttype = qstypeLs.find(t => {
          return +item.xttype === +t.code;
        });
        let _subject = kemuLs.find(k => {
          return +item.subject === +k.code;
        });
        return {
          courseid: item.courseid,
          creator: item.creator,
          modify_time: item.modify_time,
          questionid: item.questionid,
          maincontent: item.maincontent,
          grade: _grade && _grade.name,
          subject: _subject && _subject.name,
          xttype: _xttype && _xttype.name
        };
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
    getData({ start = 0, num = 10, subject, grade }) {
      getQSList({
        subject: subject < 1 ? undefined : subject,
        grade: grade < 1 ? undefined : grade,
        start,
        num
      })
        .then(data => {
          this.tableData = data;
        })
        .catch(e => {
          this.$alert(err, '', {
            confirmButtonText: '确定'
          });
        });
    },
    search() {
      this.getData({ subject: +this.select_kemu, grade: +this.select_grade });
    },
    // 选择课程
    selectCourse() {
      console.log(this.select_course);
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
    // 确定删除
    deleteRow() {
      this.tableData.splice(this.idx, 1);
      this.$message.success('删除成功');
      this.delVisible = false;
    },
    courseidSelected() {},
    createQS() {
      if (this.select_course.length < 3) {
        this.$message.error('请先选择课程');
        return;
      }
      let grade = this.select_course[0];
      let subject = this.select_course[1];
      let courseid = this.select_course[this.select_course.length - 1];
      this.$confirm(`确认创建【${this.$refs.courseCom.currentLabels.join('-')}】的习题？`)
        .then(_ => {
          let url = `http://47.94.131.70:8800/api/xiti/edit.html#/new/home?grade=${grade}&subject=${subject}&courseid=${courseid}&creator=${bus.userinfo.uid}`;
          window.open(url, '_blank');
        })
        .catch(() => {});
    },
    openQS(op) {
      this.preVisible = true;
      this.previewUrl = '/api/xiti/preview.html#/' + op.questionid;
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
