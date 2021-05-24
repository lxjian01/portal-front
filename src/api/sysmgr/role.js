import { GET, POST, PUT, DELETE } from "../_methods"


export function addRole(params){
    return POST(`/api/portal/sysmgr/role`, params)
}

export function editRole(id, params){
    return PUT(`/api/portal/sysmgr/role/${id}`, params)
}

export function deleteRole(id, params){
    return DELETE(`/api/portal/sysmgr/role/${id}`, params)
}

export function getRolePage(params){
    return GET(`api/portal/sysmgr/role/page`, params)
}
export function getRoleList(params){
    return GET(`/api/portal/sysmgr/role/list`, params)
}
