<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">用户名：{{ name }}</div>
    <div class="dashboard-text">用户角色：<span v-for="role in roles" :key="role">{{ role }}</span></div> -->
    <el-row :gutter="20">
      <el-col :sm="24" style="padding-left: 20px">
        <h2>品葱学院
          <el-tag type="danger">开源项目</el-tag>
        </h2>
        <p>
          The bridge to possible
          <br/>The project adopts B3C model, divided into front-end user system and back-end operation platform.
        </p>
        <p></p>
        <!--        <p>-->
        <!--          <el-button type="primary" size="mini" icon="el-icon-cloudy" plain>-->
        <!--            <a-->
        <!--              href="https://github.com/Jansson8964/OnlineEducation_parent"-->
        <!--              target="_blank"-->
        <!--              style="text-decoration: none"-->
        <!--              >访问github后端</a-->
        <!--            >-->
        <!--          </el-button>-->
        <!--          <el-button type="primary" size="mini" icon="el-icon-cloudy" plain>-->
        <!--            <a-->
        <!--              href="https://gitee.com/StarSea007/vscode2020"-->
        <!--              target="_blank"-->
        <!--              style="text-decoration: none"-->
        <!--              >访问github用户前端</a-->
        <!--            >-->
        <!--          </el-button>-->
        <!--          <el-button type="primary" size="mini" icon="el-icon-cloudy" plain>-->
        <!--            <a-->
        <!--              href="https://gitee.com/StarSea007/vscode2020"-->
        <!--              target="_blank"-->
        <!--              style="text-decoration: none"-->
        <!--              >访问github后台前端</a-->
        <!--            >-->
        <!--          </el-button>-->
        <!--        </p>-->
      </el-col>
    </el-row>
    <div style="background: #f5f5f5">
      <div class="text">
        <el-alert title="项目介绍" type="info" :closable="false">
          <li>后台工程的核心框架：Spring Cloud</li>
          <li>education-vue-web 是前端门户工程，核心框架：Vuejs + Nuxt.js</li>
          <li>
            education-vue-admin 是后台管理工程，核心框架：vue-element-admin
          </li>

        </el-alert>
      </div>
    </div>
    <div style="background: #f5f5f5; margin-top: 20px">
      <div class="text">
        <el-alert title="激励自己" type="info" :closable="false">
          <li>一个人的价值, 在于他贡献了什么, 而不在于他获得了什么。 ——爱因斯坦</li>
          <li>我从来不把安逸和快乐看作是生活目的本身, 对这种伦理基础, 我称之为'猪栏的理想'。 ——爱因斯坦</li>
          <li>未经反思自省的人生不值得去过 The unexamined life is not worth living. ——苏格拉底 (哲学之父)</li>
          <li>大多数人在20到30岁就已经过完自己的一生。过了这个年龄段, 他们就变成自己的影子,
            以后的生命只是在不断重复自己。——《约翰.克里斯朵夫》罗曼.罗兰
          </li>
          <li>活着, 如同生命最后一天般活着;学习, 如同永远活着般学习。 ——圣雄甘地 (印度国父)</li>
          <li>人生中最大的两个财富是: 你的才华和你的时间。才华越来越多而时间越来越少。我们的一生就是用时间来换取才华。</li>
          <!-- 项目视频：<el-link
            type="primary"
            href="https://www.bilibili.com/video/BV1dQ4y1A75e"
            target="_blank"
            :underline="false"
            >https://www.bilibili.com/video/BV1dQ4y1A75e</el-link
          >
          <br />
          学习笔记：<el-link
            type="primary"
            href="https://blog.csdn.net/weixin_45606067/category_10427871.html"
            target="_blank"
            :underline="false"
            >https://blog.csdn.net/weixin_45606067/category_10427871.html</el-link
          > -->
        </el-alert>
      </div>
    </div>
    <br/>
    <div>
      <el-alert
        title="提示：本项目适用于学习前后分离端项目、微服务架构、Vue组件的使用等，可进行二次开发。"
        type="warning"
      >
      </el-alert>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters(['name', 'roles'])
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.text {
  font-size: 25px;
  line-height: 46px;
}
</style>
