<template>
  <div class="app-container">
    <!-- 查询表单 -->
    <el-form :inline="true" size="small">
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="searchObj.username"
          placeholder="请输入用户名"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="fetchData()"
          >查询</el-button
        >
        <el-button type="default" size="mini" @click="resetData()"
          >清空</el-button
        >
      </el-form-item>
    </el-form>

    <!-- 工具条 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          size="small"
          @click="handleAdd()"
          v-if="hasPerm('user.add')"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          size="small"
          @click="removeRows()"
          v-if="hasPerm('user.remove')"
          >批量删除</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="listLoading"
      :data="userList"
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <!-- <el-table-column label="序号" width="100" align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column> -->
      <el-table-column prop="userId" label="用户编号" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="nickName" label="用户昵称" />
      <el-table-column prop="phonenumber" label="手机号" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="sex" label="性别">
        <template slot-scope="scope">{{ scope.row.sex == 0 ? '男' : '女' }}</template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="gmtCreate" label="创建时间" width="180" />
      <el-table-column label="操作" width="230" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-if="hasPerm('user.update')"
          >修改</el-button>
          <el-button
            type="text"
            size="mini"
            icon="el-icon-delete"
            @click="removeDataById(scope.row)"
            v-if="hasPerm('user.remove')"
          >删除</el-button>
          <router-link :to="'/acl/user/role/' + scope.row.userId">
            <el-button
              type="text"
              size="mini"
              icon="el-icon-info"
              v-if="hasPerm('user.assgin')"
            >分配角色</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
      style="padding: 30px 0; text-align: right"
      layout="sizes, prev, pager, next, jumper, ->, total, slot"
      @current-change="fetchData"
      @size-change="changeSize"
    />

    <!-- 添加或修改用户对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" placeholder="请输入用户名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户昵称" prop="nickName">
              <el-input v-model="form.nickName" placeholder="请输入用户昵称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phonenumber">
              <el-input v-model="form.phonenumber" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入用户密码" maxlength="20" show-password />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusRadio"
                  :key="dict.value"
                  :label="dict.value"
                  >{{ dict.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="性别" prop="sex">
              <el-select v-model="form.sex" placeholder="请选择性别">
                <el-option
                  v-for="dict in sexOption"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="form.remark"
                type="textarea"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import userApi from "@/api/acl/user";

export default {
  data() {
    return {
      // 数据是否正在加载
      listLoading: true,
      // 数据库中的总记录数
      total: 0,
      // 默认页码
      page: 1,
      // 每页记录数
      limit: 10,
      // 查询参数
      searchObj: {},
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 批量选择中选择的记录列表
      multipleSelection: [],

      //用户表格数据
      userList: [],
      // 表单参数
      form: {},

      // 自定义状态数据
      statusRadio: [
        {
          value: '0',
          label: '正常'
        },
        {
          value: '1',
          label: '停用'
        }
      ],
      // 自定义性别数据
      sexOption: [
        {
          value: '0',
          label: '男'
        },
        {
          value: '1',
          label: '女'
        }
      ],

      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 表单校验
      rules: {
        username: [
          { required: true, message: "用户名称不能为空", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "用户名称长度必须介于 2 和 20 之间",
            trigger: "blur",
          },
        ],
        nickName: [
          { required: true, message: "用户昵称不能为空", trigger: "blur" },
        ],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        phonenumber: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "用户密码不能为空", trigger: "blur" },
          { min: 5, max: 20, message: '用户密码长度必须介于 5 和 20 之间', trigger: 'blur' }
        ],
      },
    };
  },
  // 生命周期函数：内存准备完毕，页面尚未渲染
  created() {
    this.fetchData();
  },

  methods: {
    // 表单重置
    reset() {
      this.form = {
        userId: undefined,
        username: undefined,
        nickName: undefined,
        password: undefined,
        phonenumber: undefined,
        email: undefined,
        sex: undefined,
        status: "0",
        remark: undefined
      };
    },
    // 新增按钮操作
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加用户";
    },
    // 提交按钮
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.userId != undefined) {
            userApi.updateUser(this.form).then(response => {
              this.$message({
                message: '修改成功',
                type: 'success'
              });
              this.open = false;
              this.fetchData();
            });
          } else {
            userApi.addUser(this.form).then(response => {
               this.$message({
                message: '添加成功',
                type: 'success'
              });
              this.open = false;
              this.fetchData();
            });
          }
        }
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 修改按钮操作
    handleUpdate(row) {
      this.reset();
      const userId = row.userId
      userApi.getById(userId).then(response => {
        this.form = response.data.item;
        this.open = true;
        this.title = "修改用户";
        this.form.password = "";
      });
    },
    // 当页码发生改变的时候
    changeSize(size) {
      this.limit = size;
      this.fetchData(1);
    },
    //加载用户列表
    fetchData(page = 1) {
      // 异步获取远程数据（ajax）
      this.page = page;
      userApi.getPageList(this.page, this.limit, this.searchObj).then((response) => {
        this.userList = response.data.items;
        this.total = response.data.total;
        // 数据加载并绑定成功
        this.listLoading = false;
      });
    },
    // 重置查询表单
    resetData() {
      this.searchObj = {};
      this.fetchData();
    },
    // 用户状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        return userApi.changeUserStatus(row.userId, row.status);
      }).then(() => {
        this.$message({
          type: "success",
          message: text + "成功!",
        });
      }).catch(() => {
        row.status = row.status === "0" ? "1" : "0";
      })
    },
    // 根据id删除数据
    removeDataById(row) {
      const userId = row.userId
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
          return userApi.removeById(userId);
      }).then((response) => {
        this.fetchData(this.page);
        if (response.success) {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        }
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除",
        });
      });
    },
    // 当表格复选框选项发生变化的时候触发
    handleSelectionChange(selection) {
      this.multipleSelection = selection;
    },
    // 批量删除
    removeRows() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: "warning",
          message: "请选择要删除的记录!",
        });
        return;
      }
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        // 遍历selection，将id取出放入id列表
        var idList = [];
        this.multipleSelection.forEach((item) => {
          idList.push(item.id);
        });
        // 调用api
        return userApi.removeRows(idList);
      })
      .then((response) => {
        this.fetchData(this.page);
        if (response.success) {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        }
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除",
        });
      });
    }
  }
}
</script>
