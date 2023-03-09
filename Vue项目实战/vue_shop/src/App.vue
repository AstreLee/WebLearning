<template>
    <div id="app">
        <!-- 路由占位符, 当路由匹配规则符合时(也就是指定的URL地址), 就会将components放在着了-->
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: 'app'
}
</script>

<style scoped>

</style>
