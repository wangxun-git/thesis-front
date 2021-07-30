<template>
  <div class="app-container">
    <router-view/>

    <el-button type="success" size="mini" round @click="showForm">添加学科</el-button>

    <el-tree
      :data="data"
      :props="defaultProps"
      :load="loadSubject"
      lazy>

      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="() => remove(node, data)">
            删除
          </el-button>
        </span>
      </span>

    </el-tree>

    <el-dialog title="学科信息" class="dialog" :visible.sync="dialogFormVisible">

      <el-tabs :tab-position="tabPosition" style="height: 400px;" @tab-click="handlerTabClick">
        <el-tab-pane label="学科门类" name="first">
          <el-form ref="subjectFirst">
            <el-form-item label="学科编码">
              <el-input v-model="subjectFirst.T_SUBJECT_CODE" clearable/>
            </el-form-item>

            <el-form-item label="学科名称">
              <el-input v-model="subjectFirst.T_SUBJECT_NAME" clearable/>
            </el-form-item>

            <el-form-item>
              <el-button size="mini" type="success" round @click="saveFirstSubject()">保存</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="一级学科" name="second">
          <el-form ref="subjectSecond">

            <el-form-item label="学科门类">
              <el-select v-model="subjectSecond.T_SUBJECT_PARENT_CODE" clearable placeholder="请选择">
                <el-option
                  v-for="item in firstSubjectList"
                  :key="item.T_SUBJECT_CODE"
                  :label="item.T_SUBJECT_NAME"
                  :value="item.T_SUBJECT_CODE">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="学科编码">
              <el-input v-model="subjectSecond.T_SUBJECT_CODE" clearable/>
            </el-form-item>

            <el-form-item label="学科名称">
              <el-input v-model="subjectSecond.T_SUBJECT_NAME" clearable/>
            </el-form-item>

            <el-form-item>
              <el-button size="mini" type="success" round @click="saveSecondSubject(1)">保存</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="二级学科" name="three">
          <el-form ref="subjectSecond">

            <el-form-item label="学科门类">
              <el-select v-model="firstSubCodeInThree" clearable placeholder="请选择" @change="handlerFirstSub">
                <el-option
                  v-for="item in firstSubjectList"
                  :key="item.T_SUBJECT_CODE"
                  :label="item.T_SUBJECT_NAME"
                  :value="item.T_SUBJECT_CODE">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="一级学科">
              <el-select v-model="subjectThree.T_SUBJECT_PARENT_CODE" clearable placeholder="请选择">
                <el-option
                  v-for="item in secondSubjectList"
                  :key="item.T_SUBJECT_CODE"
                  :label="item.T_SUBJECT_NAME"
                  :value="item.T_SUBJECT_CODE">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="学科编码">
              <el-input v-model="subjectThree.T_SUBJECT_CODE" clearable/>
            </el-form-item>

            <el-form-item label="学科名称">
              <el-input v-model="subjectThree.T_SUBJECT_NAME" clearable/>
            </el-form-item>

            <el-form-item>
              <el-button type="success" round @click="saveThreeSubject()">保存</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

    </el-dialog>

  </div>
</template>

<script>

  import subjectApi from '@/api/subject/subject'

  export default {

    data() {
      return {
        level: 0,
        subject: {},
        showAppend: true,
        dialogFormVisible: false,
        subjectFirst: {},
        subjectSecond: {},
        subjectThree: {},
        firstSubjectCode: {},
        firstSubjectList: {},
        secondSubjectList: {},
        firstSubCodeInThree: '',
        tempSubject: {},
        tabPosition: 'left',
        data: [{
          id: '',
          label: '',
          children: [{
            id: '',
            label: '',
            children: [{
              id: '',
              label: ''
            }]
          }]
        }],
        defaultProps: {
          id: 'T_SUBJECT_CODE',
          children: 'T_CHILDREN_SUBJECT_LIST',
          label: 'T_SUBJECT_NAME'
        }
      };
    },

    methods: {

      showForm() {
        this.dialogFormVisible = true
      },

      loadSubject(node, resolve) {
        if (node.level === 0) {
          subjectApi.getSubjectByLevel(this.level)
          .then(result => {
            this.data = result.OUT_DATA.data
          })
          //本地的数据，一个承载中国字样的数组；
          return resolve(this.data);
        }
        else if(node.level === 1){
          let id = node.id
          this.subject = {}
          this.subject.T_SUBJECT_NAME = node.label
          this.subject.T_SUBJECT_LEVEL = 0
          subjectApi.getSubjectByCond(this.subject)
          .then(result => {
            const data = result.OUT_DATA.data
            let list = []
            if (data != null) {
              list = data.T_CHILDREN_SUBJECT_LIST
            }
            this.children = list
            return resolve(this.children)
          })
        }
        else if (node.level == 2) {
          this.subject = {}
          this.subject.T_SUBJECT_NAME = node.label
          this.subject.T_SUBJECT_LEVEL = 1
          subjectApi.getSubjectByCond(this.subject)
            .then(result => {
              const data = result.OUT_DATA.data
              let list = []
              if (data != null) {
                list = data.T_CHILDREN_SUBJECT_LIST
              }
              this.children = list
              return resolve(this.children)
            })
        }
        else {
          return resolve([])
        }
      },

      saveFirstSubject() {
        this.subjectFirst.T_SUBJECT_LEVEL = 0
        subjectApi.saveSubject(this.subjectFirst)
        .then(result => {
          this.$message({
            type: "success",
            message: "添加成功"
          })
          this.subjectFirst = {}
        })
      },

      saveSecondSubject() {
        this.subjectSecond.T_SUBJECT_LEVEL = 1
        subjectApi.saveSubject(this.subjectSecond)
          .then(result => {
            this.$message({
              type: "success",
              message: "添加成功"
            })
            this.subjectSecond = {}
          })
      },

      saveThreeSubject() {
        this.subjectThree.T_SUBJECT_LEVEL = 2
        subjectApi.saveSubject(this.subjectThree)
          .then(result => {
            this.$message({
              type: "success",
              message: "添加成功"
            })
            this.subjectThree = {}
          })
      },

      handlerTabClick(tab, event) {
        if ('second' == tab.name) {
          //查询一级学科列表
          subjectApi.getSubjectByLevel(0)
          .then(result => {
            this.firstSubjectList = {}
            this.firstSubjectList = result.OUT_DATA.data
          })
        }

        //三级学科添加
        if ('three' == tab.name) {
          //查询一级学科列表
          subjectApi.getSubjectByLevel(0)
            .then(result => {
              this.firstSubjectList = {}
              this.firstSubjectList = result.OUT_DATA.data
            })
        }

      },

      handlerFirstSub() {
        if (this.firstSubCodeInThree != null && this.firstSubCodeInThree != '') {
          this.tempSubject.T_SUBJECT_CODE = this.firstSubCodeInThree
          subjectApi.getSubjectByCond(this.tempSubject)
            .then(result => {
              const data = result.OUT_DATA.data
              this.secondSubjectList = data.T_CHILDREN_SUBJECT_LIST
            })
        }else {
          return
        }
      },

      remove(node, data) {
        //删除学科信息
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let subjectCode = node.data.T_SUBJECT_CODE
          console.log(subjectCode)
          subjectApi.deleteSubject(subjectCode)
          .then(result => {

          })
          const parent = node.parent;
          const children = parent.data.children || parent.childNodes;
          const index = children.findIndex(d => d.id === data.id);
          children.splice(index, 1);
        })
      },

    }
  };

</script>

<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
