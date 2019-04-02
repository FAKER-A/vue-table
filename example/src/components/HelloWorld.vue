<template>
  <div class="hello">
    <v-table
      :data="tablelist"
      border
    >
      <v-table-column
        type="expend"
        width="38"
      >
        <template slot-scope="{ row }">
          <div>name: {{ row.name }}</div>
          <div>age: {{ row.age }}</div>
          <div>work: {{ row.work }}</div>
        </template>
      </v-table-column>
      <v-table-column
        prop="name"
        label="姓名"
        sort
      >
        <v-table-column
          prop="sex"
          label="性别2"
          sort
        >
          <v-table-column
            prop="work"
            label="工作3"
            sort
          />
        </v-table-column>
        <v-table-column
          prop="age"
          label="测试年龄2"
          sort
        />
      </v-table-column>
      <v-table-column
        prop="age"
        label="年龄"
        sort
      >
        <template slot-scope="{ row }">
          {{ row.age + 5 }}
        </template>
      </v-table-column>
      <v-table-column
        prop="sex"
        label="性别"
        sort
      />
      <v-table-column
        prop="work"
        label="工作"
        sort
      />
    </v-table>
    <hr>
    <div style="width:800px">
      <v-table
        :data="tablelist"
        border
        height="200px"
      >
        <v-table-column
          prop="name"
          label="姓名"
          width="300"
        />
        <v-table-column
          prop="age"
          label="年龄"
        />
        <v-table-column
          prop="sex"
          label="男"
        />
        <v-table-column
          prop="name"
          label="姓名"
        />
      </v-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      tablelist: [
        { name: 'lisheng', age: 25, sex: '男', work: '前端工程师' },
        { name: 'wangchen', age: 30, sex: '女', work: '后端工程师' },
        { name: 'wangchen', age: 30, sex: '女', work: '后端工程师' },
        { name: 'wangchen', age: 30, sex: '女', work: '后端工程师' },
        { name: 'wangchen', age: 30, sex: '女', work: '后端工程师' },
        { name: 'wangchen', age: 30, sex: '女', work: '后端工程师' },
        { name: 'wangchen', age: 30, sex: '女', work: '后端工程师' }
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
