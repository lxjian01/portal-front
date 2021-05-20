import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import installElementPlus from './plugins/element'
import './assets/css/icon.css'
const app = createApp(App)
installElementPlus(app)
app.use(store).use(router).mount('#app')

app.mixin({
    created() {

    },
    methods: {
        $showSuccess () {
            this.$message.success('操作成功')
            this.$refs.elAdminRef && this.$refs.elAdminRef.getList()
        },
        clearValidate (refName) {
            if (this.$refs[refName]) {
                this.$nextTick(this.$refs[refName].clearValidate)
            }
        },
        $delConfirm (fn) {
            this.$confirm('确定要删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(fn).catch(() => { })
        },
        commConfirm (alert_msg,fn) {
            this.$confirm(alert_msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(fn).catch(() => { })
        }
    }
})
