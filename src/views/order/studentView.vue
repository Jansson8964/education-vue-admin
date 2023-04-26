<template>
  <!--弹窗-->
  <el-dialog
    width="60%"
    :title="title"
    :visible.sync="visible"
    :before-close="handleClose"
  >
    <el-form :inline="true">
      <el-card>
        <el-divider style="font-weight: bold; background-color: #f4f4f5"
          >学员个人信息</el-divider
        >
        <el-row>
          <el-col :span="8"
            ><div>
              <el-form-item label="头像:">
                <div class="demo-image">
                  <div class="block">
                    <el-image
                      style="width: 100px; height: 100px"
                      :src="studentData.avatar"
                    ></el-image>
                  </div>
                </div>
              </el-form-item></div
          ></el-col>
          <el-col :span="8"
            ><div>
              <el-form-item label="学员编号:">
                <span>{{ studentData.id }}</span>
              </el-form-item>
              <br />
              <el-form-item label="学员昵称:">
                <span>{{ studentData.nickname }}</span>
              </el-form-item>
            </div></el-col
          >
          <br /><br /><br /><br />
          <el-col :span="8"
            ><div>
              <el-form-item label="手机号:">
                <span>{{ studentData.mobile }}</span>
              </el-form-item>
            </div></el-col
          >
        </el-row>
        <el-row>
          <el-col :span="8"
            ><div>
              <el-form-item label="学员状态:">
                <span>{{ textStatusId[studentData.isDisabled] }}</span>
              </el-form-item>
            </div></el-col
          >
          <el-col :span="8"
            ><div>
              <el-form-item label="年龄:">
                <span>{{ studentData.age }}</span>
              </el-form-item>
            </div></el-col
          >
          <el-col :span="8"
            ><div>
              <el-form-item label="性别:">
                <span>{{ studentData.sex }}</span>
              </el-form-item>
            </div></el-col
          >
        </el-row>
        <el-row>
          <el-col :span="8"
            ><div>
              <el-form-item label="注册时间:">
                <span>{{ studentData.gmtCreate }}</span>
              </el-form-item>
            </div></el-col
          >
        </el-row>
      </el-card>
    </el-form>
    <el-row style="margin-top: 17px">
      <el-button
        style="float: right; margin-left: 6px"
        size="mini"
        plain
        @click="handleClose"
        >取 消</el-button
      >
    </el-row>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      textStatusId: {
        false: "禁用",
        true: "启动",
      },
    };
  },
  props: {
    studentData: {
      type: Object,
      default: () => {},
    },
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
  },
  methods: {
    textClass(isFree) {
      return {
        c_red: isFree === 0,
        c_blue: isFree === 1,
      };
    },
    handleClose(done) {
      this.$emit("close-callback");
    },
  },
};
</script>
