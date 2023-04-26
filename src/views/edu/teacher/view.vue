<template>
  <!--弹窗-->
  <el-dialog
     width="60%"
    :title="title"
    :visible.sync="visible"
    :before-close="handleClose">
     <el-form :inline="true">
      <el-card >
        <el-divider style="font-weight:bold; background-color:#f4f4f5">讲师个人信息</el-divider>
        <el-row>
          <el-col :span="8"><div>
            <el-form-item label="头像:">
              <div class="demo-image">
                <div class="block">
                  <el-image style="width: 100px; height: 100px" :src="formData.avatar"></el-image>
                </div>
              </div>
            </el-form-item>
          </div></el-col>
          <el-col :span="8"><div>
            <el-form-item label="讲师编号:">
              <span >{{formData.id}}</span>
            </el-form-item>
            <br/>
            <el-form-item label="讲师名称:">
              <span >{{formData.name}}</span>
            </el-form-item>
          </div></el-col>
          <br/><br/><br/><br/>
          <el-col :span="8"><div>
            <el-form-item label="状态:">
              <template slot-scope="scope">
                <span :class="textClass(formData.status)">{{textStatusId[formData.status]}}</span>
              </template>
            </el-form-item>
          </div></el-col>
        </el-row>
        <el-row>
          <el-col :span="8"><div>
            <el-form-item label="手机号:">
              <span >{{formData.phonenumber}}</span>
            </el-form-item>
          </div></el-col>
          <el-col :span="8"><div>
            <el-form-item label="邮箱:">
              <span >{{formData.email}}</span>
            </el-form-item>
          </div></el-col>
          <el-col :span="8"><div>
            <el-form-item label="职位:">
              <template slot-scope="scope">
                  <span :class="textClass(formData.level)">{{textLevel[formData.level]}}</span>
                </template>
              </el-form-item>
              <!-- <span >{{formData.level}}</span> -->
          </div></el-col>
        </el-row>
        <el-row>
          <el-col :span="8"><div>
            <el-form-item label="注册时间:">
              <span >{{formData.gmtCreate}}</span>
            </el-form-item>
          </div></el-col>
          <el-col :span="8"><div>
            <el-form-item label="排序:">
              <span >{{formData.sort}}</span>
            </el-form-item>
          </div></el-col>
        </el-row>
      </el-card>
      <br/>
      <el-card >
        <el-divider style="font-weight:bold; background-color:#f4f4f5">简介</el-divider>
        <el-form-item v-html="formData.intro">
        </el-form-item>
      </el-card>
    </el-form>
    <el-row style="margin-top:17px; ">
        <el-button style="float:right;margin-left:6px;" size="mini" plain @click="handleClose">取 消</el-button>
    </el-row>
  </el-dialog>
</template>
<script>
  export default {
    data() {
      return {
        textStatusId: {
          1: '启用',
          0: '停用'
        },
        textLevel: {
          1: '高级讲师',
          2: '首席讲师'
        },
        opts: {
          statusIdList: []
        }
      }
    },
    props: {
      formData: {
        type: Object,
        default: () => {}
      },
      visible: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: ''
      }
    },
    created() {
        
    },
    methods: {
      textClass(isFree) {
        return {
          c_red: isFree === 0,
          c_blue: isFree === 1
        }
      },
      handleClose(done) {
        this.$emit('close-callback')
      }
    }
  }
</script>
