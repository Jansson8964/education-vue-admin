<template>
  <div class="app-container">
    <el-col :span="7">
      <el-alert title="提醒：目前删除功能未提交至数据库" :closable="false" type="info" />
      <br />
      <el-input
        v-model="filterText"
        placeholder="支持模糊查询"
        clearable
        size="small"
        prefix-icon="el-icon-search"
        style="margin-bottom: 30px"
      />

      <el-tree
        ref="tree2"
        :data="data2"
        :props="defaultProps"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        node-key="id"
        @node-click="handleNodeClick"
        default-expand-all
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button type="text" size="mini" @click="() => append(data)">
              添加
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="() => remove(node, data)"
            >
              删除
            </el-button>
          </span>
        </span>
      </el-tree>
    </el-col>
  </div>
</template>

<script>
import subject from "@/api/edu/subject";

export default {
  data() {
    return {
      //搜索文本框
      filterText: "",
      //返回所有分类数据
      data2: [],
      defaultProps: {
        children: "children",
        label: "title",
      },
    };
  },
  created() {
    this.getAllSubjectList();
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    },
  },
  methods: {
    // 查询所有分类列表
    getAllSubjectList() {
      subject.getSubjectList().then((response) => {
        this.data2 = response.data.list;
      });
    },
    // 对树节点进行筛选
    filterNode(value, data) {
      if (!value) return true;
      return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    },
    // 节点被点击时的回调函数
    handleNodeClick(data) {
      // console.log(data,'点击回调')
    },
    // 添加方法
    append(data) {
      // const newChild = { id: "1111111", label: "testtest", children: [] };
      // if (!data.children) {
      //   this.$set(data, "children", []);
      // }
      // data.children.push(newChild);
      // console.log(data);
      this.$message({
        message: '想啥呢，等你开发...',
        type: 'warning'
      });
    },
    // 删除方法
    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex((d) => d.id === data.id);
      children.splice(index, 1);
    },
  },
};
</script>
<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>