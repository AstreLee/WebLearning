<template>
  <div class="header">
    <div class="logo">
      <img src="../../assets/logo.png" alt="" />
      <span style="margin-left: 12px; font-size: 25px; font-weight: bold;">SMART BOOKS</span>
    </div>
    <div class="search">
      <el-input v-model="searchContent" type="text" placeholder="请输入内容" size="mini" class="searchInput">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OtherHeader',
  data () {
    return {
      searchContent: ''
    }
  }
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  width: 100%;
  height: 120px;
  background-color: white;
  margin-bottom: 10px;
}

.header .logo {
  position: relative;
  display: flex;
  align-items: center;
  width: 300px;
  height: 100px;
  margin-bottom: 15px;
}

.header .logo img {
  width: 60%;
  height: 100%;
}

.header .search .searchInput {
  position: absolute;
  right: 0;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 20px !important;
  border: 2px solid red;
}

.header .searchInput >>> .el-input__inner {
  border: none !important;
  box-shadow: none !important;
  border-right: 1px solid red !important;
}
</style>
