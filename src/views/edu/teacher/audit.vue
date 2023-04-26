<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="讲师名" prop="name">
        <el-input v-model="teacherQuery.name" placeholder="请输入讲师名"/>
      </el-form-item>
      <el-form-item label="讲师头衔" prop="level">
        <el-select
          v-model="teacherQuery.level"
          clearable
          placeholder="请选择讲师头衔"
        >
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="注册时间">
        <el-date-picker
          v-model="teacherQuery.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="teacherQuery.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getList()"
        >查询
        </el-button
        >
        <el-button type="default" @click="resetData()">清空</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" width="200"/>
      <el-table-column
        prop="phonenumber"
        label="手机号"
        align="center"
        width="200"
      />
      <el-table-column prop="email" label="邮箱" align="center" width="200"/>
      <el-table-column
        prop="auditStatus"
        label="审核状态"
        width="200"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.auditStatus == '0'" size="normal"
          >待审核
          </el-tag
          >
          <el-tag
            type="success"
            v-else-if="scope.row.auditStatus == '1'"
            size="normal"
          >
            审核通过
          </el-tag
          >
          <el-tag
            v-else-if="scope.row.auditStatus == '2'"
            type="warning"
            size="normal"
          >
            审核不通过
          </el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="gmtCreate" label="添加时间" width="200"/>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改
          </el-button
          >
          <el-button
            type="success"
            size="mini"
            icon="el-icon-edit"
            @click="handleAudit(scope.row)"
          >审核
          </el-button
          >
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-message"
            @click="handleView(scope.row.id)"
          >查看
          </el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: right"
      layout="total, prev, pager, next, jumper"
      @current-change="getList"
    />

    <el-dialog
      :title="title"
      :visible.sync="auditDialogVisible"
      width="600px"
      append-to-body
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="讲师编号:">
          <span>{{ form.id }}</span>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="审核结果">
              <el-radio-group v-model="form.auditStatus">
                <el-radio :label="1">通过</el-radio>
                <el-radio :label="2">不通过</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="审核意见">
              <el-input
                v-model="form.auditOpinion"
                type="textarea"
                placeholder="请输入审核意见"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 讲师详情 -->
    <view-lecturer
      :visible="ctrl.viewVisible"
      :formData="formData"
      :title="ctrl.dialogTitle"
      @close-callback="closeCllback"
    ></view-lecturer>
  </div>
</template>
<script>
import teacher from '@/api/edu/teacher'
import ViewLecturer from './view'

export default {
  components: { ViewLecturer },
  data() {
    //定义变量和初始值
    return {
      // 数据是否正在加载
      listLoading: false,
      //查询之后接口返回集合
      list: null,
      //当前页
      page: 1,
      //每页记录数
      limit: 10,
      //总记录数
      total: 0,
      //条件封装对象
      teacherQuery: {},

      formData: {},
      ctrl: {
        loading: false,
        viewVisible: false
      },

      //审核弹窗
      auditDialogVisible: false,
      title: '',
      form: { auditOpinion: '', auditStatus: '', id: '' }
    }
  },
  created() {
    //在页面渲染之前执行，一般调用methods定义的方法
    this.getList()
  },
  methods: {
    // 关闭弹窗回调
    closeCllback() {
      this.ctrl.viewVisible = false
    },
    handleView(id) {
      teacher.getTeacherInfo(id).then((response) => {
        this.formData = response.data.teacher
        this.teacher = response.data.teacher
        //详情标题
        this.ctrl.dialogTitle = response.data.teacher.name + ' —— 查看详情'
        //显示详情弹框
        this.ctrl.viewVisible = true
      })
    },
    //讲师列表的方法
    getList(page = 1) {
      this.page = page
      teacher
        .getTeacherListPage(this.page, this.limit, this.teacherQuery)
        .then((response) => {
          this.list = response.data.rows
          this.total = response.data.total
        }) //请求成功
        .catch((error) => {
        }) //请求失败
    },
    resetData() {
      //清空表单
      //表单输入项数据清空
      this.teacherQuery = {}
      //查询所有讲师数据
      this.getList()
    },
    //审核按钮
    handleAudit(row) {
      this.auditDialogVisible = true
      this.title = row.name + ' ----- 审核'
      this.form.id = row.id
      this.form.auditStatus = row.auditStatus
      this.form.auditOpinion = row.auditOpinion
    },
    //审核确认按钮
    submitForm: function() {
      teacher.updateAudit(this.form).then((response) => {
        this.auditDialogVisible = false
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        this.getList()
      })
    },
    //审核取消按钮
    cancel() {
      this.auditDialogVisible = false
    },
    handleUpdate(row) {
      if (row.auditStatus === 1) {
        this.$message({
          type: 'warning',
          message: '审核已通过，禁止修改！'
        })
      } else {
        this.$router.push({
          path: '/teacher/edit/' + row.id
        })
      }
    }
  }
}
</script>
