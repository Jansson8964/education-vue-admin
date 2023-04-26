<template>
  <div class="app-container">
    <!-- 查询表单 -->
    <el-form :inline="true" size="small">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="searchObj.roleName" placeholder="请输入角色名称" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="fetchData()"
          >查询</el-button
        >
        <el-button type="default" @click="resetData()">清空</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具条 -->

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          size="mini"
          @click="handleAdd()"
          v-if="hasPerm('role.add')"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          size="mini"
          @click="removeRows()"
          v-if="hasPerm('role.remove')"
          >批量删除</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="listLoading"
      :data="roleList"
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="roleId" label="角色编号" />
      <el-table-column prop="roleName" label="角色名称" />
      <el-table-column prop="roleCode" label="权限字符" />
      <el-table-column prop="roleSort" label="显示顺序" />
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
      <el-table-column prop="gmtCreate" label="创建时间" />
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-if="hasPerm('role.update')"
          >修改</el-button>
          <el-button
            type="text"
            size="mini"
            icon="el-icon-delete"
            @click="removeDataById(scope.row)"
            v-if="hasPerm('role.remove')"
          >删除</el-button>
          <router-link :to="'/acl/role/distribution/' + scope.row.roleId">
            <el-button
              type="text"
              size="mini"
              icon="el-icon-info"
              v-if="hasPerm('role.acl')"
            >分配菜单</el-button>
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

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item prop="roleKey">
          <span slot="label">
            <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasRole('admin')`)" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
            权限字符
          </span>
          <el-input v-model="form.roleCode" placeholder="请输入权限字符" />
        </el-form-item>
        <el-form-item label="角色顺序" prop="roleSort">
          <el-input-number v-model="form.roleSort" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusRadio"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
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
import roleApi from "@/api/acl/role";

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
      // 批量选择中选择的记录列表
      multipleSelection: [],

      //用户表格数据
      roleList: [],
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

      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 表单校验
      rules: {
        roleName: [
          { required: true, message: "角色名称不能为空", trigger: "blur" }
        ],
        roleCode: [
          { required: true, message: "权限字符不能为空", trigger: "blur" }
        ],
        roleSort: [
          { required: true, message: "角色顺序不能为空", trigger: "blur" }
        ]
      }
    };
  },
  // 生命周期函数：内存准备完毕，页面尚未渲染
  created() {
    this.fetchData();
  },
  methods: {
    // 新增按钮操作
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加角色";
    },
    // 表单重置
    reset() {
      this.form = {
        roleId: undefined,
        roleName: undefined,
        roleCode: undefined,
        roleSort: 0,
        status: "0",
        remark: undefined
      }
    },
    // 提交按钮
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.roleId != undefined) {
            roleApi.updateRole(this.form).then(response => {
              this.$message({
                message: '修改成功',
                type: 'success'
              });
              this.open = false;
              this.fetchData();
            });
          } else {
            roleApi.addRole(this.form).then(response => {
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
      const roleId = row.roleId
      roleApi.getById(roleId).then(response => {
        this.form = response.data.item;
        this.open = true;
        this.title = "修改角色";
      });
    },
    // 当页码发生改变的时候
    changeSize(size) {
      this.limit = size;
      this.fetchData(1);
    },
    // 角色状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        return roleApi.changeUserStatus(row.roleId, row.status);
      }).then(() => {
        this.$message({
          type: "success",
          message: text + "成功!",
        });
      }).catch(() => {
        row.status = row.status === "0" ? "1" : "0";
      })
    },
    // 获取角色列表
    fetchData(page = 1) {
      this.page = page;
      roleApi.getPageList(this.page, this.limit, this.searchObj).then((response) => {
        this.roleList = response.data.items;
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
    // 根据id删除数据
    removeDataById(row) {
      const roleId = row.roleId
      roleApi.getCheckRole(roleId).then(res => {
        console.log(res,'resssss')
        if(!res.success) {
          this.$message.warning(result.message);
        } else {
          this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        // 点击确定，远程调用ajax
        return roleApi.removeById(roleId);
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
        }
      })
      
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
        return roleApi.removeRows(idList);
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
    }
  }
}
</script>

