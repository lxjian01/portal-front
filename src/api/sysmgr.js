import { GET, POST } from "./_methods"

export function getMenuList(params){
    return GET(`/api/portal/sysmgr/menu/list`, params)
}

export function getParentMenuList(params){
    return GET(`/api/portal/sysmgr/menu/parent_list`, params)
}

export function getMenuPage(params){
    return GET(`api/portal/sysmgr/menu/page`, params)
}

export function addMenu(params){
    return POST(`/api/portal/sysmgr/menu`, params)
}

export function editMenu(id, params){
    return POST(`/api/portal/sysmgr/menu/${id}`, params)
}