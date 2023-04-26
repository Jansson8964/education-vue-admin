<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="订单号" prop="orderNo">
        <el-input v-model="queryParams.orderNo" placeholder="请输入订单号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="orderList">
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column label="订单号" align="center" prop="orderNo">
        <template slot-scope="scope">
          <el-button type="text" @click="handleOrderView(scope.row)">{{scope.row.orderNo}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="课程信息" align="center" prop="courseTitle">
        <template slot-scope="scope">
          <el-button type="text" @click="handleCourseView(scope.row.courseId)">{{scope.row.courseTitle}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="讲师信息" align="center" prop="teacherName">
        <template slot-scope="scope">
          <el-button type="text" @click="handleTeacherView(scope.row.teacherId)">{{scope.row.teacherName}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="用户信息" align="center" prop="nickname">
        <template slot-scope="scope">
          <el-button type="text" @click="handleStudentView(scope.row.memberId)">{{scope.row.nickname}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="用户手机号" align="center" prop="mobile" />
      <el-table-column label="支付方式" align="center" prop="payType">
        <template slot-scope="scope">
          <el-tag type="success">
            <el-row v-if="scope.row.payType === 1" type="success">微信</el-row>
            <el-row v-if="scope.row.payType === 2" type="brandColor">支付宝</el-row>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="支付价格" align="center" prop="totalFee" />
      <el-table-column label="支付状态" align="center" prop="status">
        <template slot-scope="scope">
          <el-tag>
            <el-row v-if="scope.row.status === 0" type="success">未支付</el-row>
            <el-row v-if="scope.row.status === 1" type="success">已支付</el-row>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="订单时间" align="center" prop="gmtCreate" />
<!--       <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="handleRemark(scope.row)">备注</el-button>
        </template> -->
      </el-table-column> 
    </el-table>

    <el-pagination :current-page="page" :page-size="limit" :total="total" style="padding: 30px 0; text-align: right;"
      layout="total, prev, pager, next, jumper" @current-change="getList" />
    
    <!-- 订单详情 -->
    <order-view :visible="ctrl.orderViewVisible" :orderData="orderData" :title="ctrl.dialogTitle" @close-callback="closeOrder"></order-view>

    <!-- 课程详情 -->
    <course-view :visible="ctrl.courseViewVisible" :courseData="courseData" :title="ctrl.dialogTitle" @close-callback="closeOrder"></course-view>
  
    <!-- 讲师详情 -->
    <teacher-view :visible="ctrl.teacherViewVisible" :tearcherData="tearcherData" :title="ctrl.dialogTitle" @close-callback="closeOrder"></teacher-view>
  
    <!-- 学员详情 -->
    <student-view :visible="ctrl.studentViewVisible" :studentData="studentData" :title="ctrl.dialogTitle" @close-callback="closeOrder"></student-view>
  </div>
</template>

<script>
import orderApi from "@/api/order/order";
import courseApi from "@/api/edu/course";
import teacherApi from "@/api/edu/teacher";
import studentApi from "@/api/edu/student";
import OrderView from './orderView';
import courseView from './courseView';
import teacherView from './teacherView';
import studentView from './studentView';

export default {
  name: "order",
  components: {OrderView, courseView, teacherView, studentView},
  data() {
    return {
      // 遮罩层
      loading: false,
      // 显示搜索条件
      showSearch: true,
      //当前页
      page: 1,
      //每页记录数
      limit: 10,
      // 总条数
      total: 0,
      // 学员信息表格数据
      orderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        orderNo: ''
      },
      // 表单参数
      form: {},

      orderData: {},
      courseData: {},
      tearcherData: {},
      studentData: {},
      ctrl: {
        orderViewVisible: false,
        dialogTitle: '',
        courseViewVisible: false,
        teacherViewVisible: false,
        studentViewVisible: false,
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //订单列表
    getList(page = 1) {
      this.page = page
      this.loading = true;
      orderApi.listOrder(this.page, this.limit, this.queryParams).then(response => {
        this.orderList = response.data.rows;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 表单重置
    reset() {
      this.queryParams = {}
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.handleQuery();
    },
    //订单备注
    handleRemark(row) {
      this.$message({
        type: 'warning',
        message: '想啥呢, 没开发!'
      });
    },
    //订单详情
    handleOrderView(row) {
      this.orderData = row
      this.ctrl.dialogTitle = row.orderNo + ' ---- 订单详情'
      this.ctrl.orderViewVisible = true
    },
    // 关闭编辑弹窗回调
    closeOrder() {
      this.ctrl.orderViewVisible = false;
      this.ctrl.courseViewVisible = false;
      this.ctrl.teacherViewVisible = false;
      this.ctrl.studentViewVisible = false;
    },
    //课程详情
    handleCourseView(courseId) {
      courseApi.getCourseInfoId(courseId).then(response => {
        this.courseData = response.data.courseInfoVo
        this.ctrl.dialogTitle = response.data.courseInfoVo.title + ' ---- 课程详情'
        this.ctrl.courseViewVisible = true
      })
    },
    //讲师详情
    handleTeacherView(teacherId) {
      teacherApi.getTeacherInfo(teacherId).then(response => {
        this.tearcherData = response.data.teacher
        this.ctrl.dialogTitle = response.data.teacher.name + ' ---- 讲师详情'
        this.ctrl.teacherViewVisible = true
      })
    },
    //学员详情
    handleStudentView(memberId) {
      studentApi.getStudent(memberId).then(response => {
        console.log(response);
        this.studentData = response.data.data
        this.ctrl.dialogTitle = response.data.data.nickname + ' ---- 学员详情'
        this.ctrl.studentViewVisible = true
      })
    }
  }
}
</script>