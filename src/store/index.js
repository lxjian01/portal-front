import {createStore} from 'vuex'

export default createStore({
    state: {
        activeMenu: null,
        collapse: null,
    },
    mutations: {
        setActiveMenu(state, data){
            sessionStorage.setItem('activeMenu', JSON.stringify(data));
        },
        // 侧边栏折叠
        setCollapse(state, data) {
            state.collapse = data
        }
    },
    getters: {
        activeMenu(state){
            if(state.activeMenu === null){
                let activeMenu = sessionStorage.getItem('activeMenu')
                if(activeMenu != null){
                    state.activeMenu = JSON.parse(activeMenu)
                }else{
                    state.activeMenu = ["/"]
                }
            }
            return state.activeMenu;
        },
    },
    actions: {},
    modules: {}
})