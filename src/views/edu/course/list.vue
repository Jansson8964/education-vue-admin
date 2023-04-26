<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="课程名称" prop="title">
        <el-input v-model="courseQuery.title" placeholder="请输入课程名称"/>
      </el-form-item>
      <el-form-item label="课程状态" prop="status">
        <el-select v-model="courseQuery.status" clearable placeholder="请选择课程状态">
          <el-option value="Normal" label="已发布"/>
          <el-option value="Draft" label="未发布"/>
        </el-select>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <!-- 表格 -->
    <el-table
      :data="list"
      border
      fit
      highlight-current-row>

      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="title" label="课程名称"/>
      <el-table-column prop="cover" label="课程封面" width="250px">
        <template slot-scope="scope">
          <img :src="scope.row.cover" :alt="scope.row.title" width="230">
        </template>
      </el-table-column>
      <el-table-column prop="lessonNum" label="课时数"/>
      <el-table-column prop="price" label="课程价格"/>
      <el-table-column label="课程状态">
        <template slot-scope="scope">
          <el-tag type="success">{{ scope.row.status === 'Normal' ? '已发布' : '未发布' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="gmtCreate" label="添加时间" />
      <el-table-column prop="viewCount" label="浏览数量" />
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/course/info/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑课程基本信息</el-button>
          </router-link>
          <router-link :to="'/course/chapter/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑课程大纲息</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除课程信息
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getList"
    />

  </div>
</template>
<script>
//引入调用teacher.js文件
import course from '@/api/edu/course'

export default {
  data() { //定义变量和初始值
    return {
      list: null,//查询之后接口返回集合
      page: 1,//当前页
      limit: 10,//每页记录数
      total: 0,//总记录数
      courseQuery: {} //条件封装对象
    }
  },
  created() { //页面渲染之前执行，一般调用methods定义的方法
    this.getList()
  },
  methods: {
    getList(page = 1) {
      this.page = page
      course.pageCourseCondition(this.page, this.limit, this.courseQuery)
        .then(response => {
          console.log(response.data.rows)
          this.list = response.data.rows
          this.total = response.data.total
        }) //请求成功
        .catch(error => {
          console.log(error)
        }) //请求失败
    },
    removeDataById(id) {
      this.$confirm('此操作将永久删除课程, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {//点击确定，删除成功
        //调用删除方法
        course.deleteCourse(id)
          .then(response => {//删除成功
            //提示信息
            this.$message({
              type: 'success',
              message: '删除课程成功!'
            });
            //刷新页面
            this.getList()
          })
      })//点击取消，删除失败
    },
    //课程列表的方法
    // getList() {
    //     course.getListCourse()
    //         .then(response =>{//请求成功
    //             //response接口返回的数据
    //             this.list = response.data.list
    //         })
    // },
    resetData() {//清空的方法
      //表单输入项数据清空
      this.courseQuery = {}
      //查询所有课程数据
      this.getList()
    }

  }
}
</script>
