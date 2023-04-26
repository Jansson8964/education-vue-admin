<template>
  <div class="app-container">
    <el-form ref="teacher" :model="teacher" :rules="rules" label-width="120px">
      <el-alert title="提示：不上传则使用系统默认头像" type="warning" :closable="false"></el-alert><br/>
      <el-row>
        <el-col :span="12">
          <el-form-item label="讲师名称" prop="name">
            <el-input v-model="teacher.name"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="手机号" prop="phonenumber">
            <el-input v-model="teacher.phonenumber"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="teacher.email"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="teacher.status">
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

      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" :min="0"/>
      </el-form-item>

      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>

      <el-row>
        <el-col :span="12">
          <el-form-item label="讲师资历">
            <el-input v-model="teacher.career"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="讲师简介">
            <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 讲师头像：TODO -->
      <el-form-item label="讲师头像">
        <!-- 头衔缩略图 -->
        <pan-thumb :image="String(teacher.avatar)"/>
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像</el-button>
        <!--
        v-show：是否显示上传组件
        :key：类似于id，如果一个页面多个图片上传控件，可以做区分
        :url：后台上传的url地址
        @close：关闭上传组件
        @crop-upload-success：上传成功后的回调
          <input type="file" name="file"/>
        -->
        <image-cropper
                      v-show="imagecropperShow"
                      :width="300"
                      :height="300"
                      :key="imagecropperKey"
                      :url="BASE_API+'/eduoss/fileoss'"
                      field="file"
                      @close="close"
                      @crop-upload-success="cropSuccess"/>
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import teacherApi from '@/api/edu/teacher'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
  components: { ImageCropper, PanThumb },
  data() {
    return {
      teacher:{
        name:'',
        sort: 0,
        level: '',
        career: '',
        intro: '',
        phonenumber: '',
        email: '',
        status: '0',
        avatar: '/static/02.jpg'//设置默认图片
      },
      //上传弹框组件是否显示
      imagecropperShow: false,
      //上传组件key值
      imagecropperKey: 0,
      //获取dev.env.js里面地址
      BASE_API: process.env.BASE_API,
      //保存按钮是否禁用
      saveBtnDisabled: false,

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

      // 表单校验
      rules: {
        name: [
          { required: true, message: "用户名称不能为空", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "用户名称长度必须介于 2 和 20 之间",
            trigger: "blur",
          },
        ],
        phonenumber: [
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
        status: [
          { required: true, message: "状态不能为空", trigger: "change" },
        ]
      },
    }
  },
  created() {//页面渲染之前执行
    this.init()
  },
  watch: {//监听
    $route(to, from) {//路由变化方式，路由发生变化，方法就会执行
      this.init()
    }
  },
  methods:{
    //关闭上传弹框的方法
    close() {
      this.imagecropperShow = false
      //上传组件初始化
      this.imagecropperKey = this.imagecropperKey + 1
    },
    //上传成功方法
    cropSuccess(data) {
      this.imagecropperShow=false
      //上传之后接口返回图片地址
      this.teacher.avatar=data.url
      //上传组件初始化
      this.imagecropperKey = this.imagecropperKey + 1
    },
    init() {
      //判断路径有id值，做修改
      if(this.$route.params && this.$route.params.id) {
        //从路径获取id值
        const id = this.$route.params.id
        //调用根据id查询的方法
        this.getInfo(id)
      }else {//路径没有id值，做添加
        //清空表单
        this.reset()
      }
    },
    // 表单重置
    reset() {
      this.teacher = {
        name:'',
        sort: 0,
        level: '',
        career: '',
        intro: '',
        phonenumber: '',
        email: '',
        status: '0',
        avatar: '/static/02.jpg'
      }
    },
    //根据讲师id查询的方法
    getInfo(id) {
      teacherApi.getTeacherInfo(id).then(response => {
        this.teacher = response.data.teacher
      })
    },
    saveOrUpdate() {
      this.$refs["teacher"].validate((valid) => {
        if (valid) {
          //判断修改还是添加
          //根据teacher是否有id
          if(!this.teacher.id) {
            //添加
            this.saveTeacher()
          } else {
            //修改
            this.updateTeacher()
          }
        }
      });
    },
    //修改讲师方法
    updateTeacher() {
      teacherApi.updateTeacherInfo(this.teacher).then(response => {
        //提示信息
        this.$message({
          type: 'success',
          message: '修改成功!'
        });
        //回到列表页面  路由跳转
        this.$router.push({path:'/teacher/audit'})
      })
    },
    //添加讲师方法
    saveTeacher() {
      teacherApi.addTeacher(this.teacher).then(response => {//添加成功
        //提示信息
        this.$message({
          type: 'success',
          message: '添加成功!'
        });
        //回到列表页面  路由跳转
        this.$router.push({path:'/teacher/audit'})
      }).catch(error => {})
    }
  }
}
</script>
