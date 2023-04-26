<template>
  <div class="app-container">
    <el-alert title="提示：请不要轻易删除或者修改学员信息 以免数据错误，功能还有待完善！！" :closable="false" type="warning"/>
    <br/>
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="手机号" prop="mobile">
        <el-input
          v-model="queryParams.mobile"
          placeholder="请输入手机号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="studentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="学员ID" align="center" prop="id" />
      <el-table-column label="学员手机号" align="center" prop="mobile" />
      <el-table-column label="学员昵称" align="center" prop="nickname" />
      <el-table-column label="学员性别" align="center" prop="sex">
        <template slot-scope="scope">{{ scope.row.sex == 1 ? '女' : '男' }}</template>
      </el-table-column>
      <el-table-column label="学员年龄" align="center" prop="age" />
      <el-table-column label="学员头像" align="center" prop="avatar">
        <template slot-scope="scope">
            <img :src="scope.row.avatar" :alt="scope.row.nickname" width="100">
          </template>
      </el-table-column>
      <el-table-column label="注册时间" align="center" prop="gmtCreate" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
<el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: right;"
      layout="total, prev, pager, next, jumper"
      @current-change="getList"
    />

    <!-- 添加或修改学员信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学员ID" prop="id">
          <el-input v-model="form.id" placeholder="请输入学员ID" :disabled="true" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入学员手机号" />
        </el-form-item>
        <el-form-item label="学员昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入学员昵称" />
        </el-form-item>
        <el-form-item label="学员性别" prop="sex">
          <el-select v-model="form.sex" placeholder="请选择性别">
            <el-option
              v-for="dict in sexOption"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学员年龄" prop="age">
          <el-input v-model="form.age" placeholder="请输入学员年龄" />
        </el-form-item>
        <el-form-item label="学员头像" prop="avatar">
          <el-input v-model="form.avatar" placeholder="请输入学员头像" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import stuentApi from "@/api/edu/student";

export default {
  name: "Role",
  data() {
    return {
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      //当前页
      page: 1,
      //每页记录数
      limit: 10,
      // 总条数
      total: 0,
      // 学员信息表格数据
      studentList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        mobile: ''
      },
      // 表单参数
      form: {},
      // 自定义性别数据
      sexOption: [
        {
          value: '2',
          label: '男'
        },
        {
          value: '1',
          label: '女'
        }
      ],
      // 表单校验
      rules: {
        mobile: [
          { required: true, message: "学员名称不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询学员信息列表 */
    getList(page=1) {
      this.page = page
      this.loading = true;
      stuentApi.listStudent(this.page,this.limit,this.queryParams).then(response => {
        this.studentList = response.data.rows;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {

      };
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加学员信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      stuentApi.getStudent(id).then(response => {
        console.log(response)
        this.form = response.data.data;
        this.open = true;
        this.title = "修改学员信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            stuentApi.updateStudent(this.form).then(response => {
              this.$message({
                type: 'success',
                message: '修改成功!'
              });
              this.open = false;
              this.getList();
            });
          } else {
            stuentApi.addStudent(this.form).then(response => {
              this.$message({
                type: 'success',
                message: '添加成功!'
              });
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('此操作将永久删除该学生, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        stuentApi.delStudent(row.id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getList()
        })
      })
    }
  }
}
</script>