import { GET, POST, PUT, DELETE } from "../_methods"

export function getUserList(params){
    return GET(`/api/portal/sysmgr/user/list`, params)
}

export function getUserPage(params){
    return GET(`api/portal/sysmgr/user/page`, params)
}

export function getUserDetail(id, params){
    return GET(`/api/portal/sysmgr/user/${id}`, params)
}

export function addUser(params){
    return POST(`/api/portal/sysmgr/user`, params)
}

export function editUser(id, params){
    return PUT(`/api/portal/sysmgr/user/${id}`, params)
}

export function deleteUser(id, params){
    return DELETE(`/api/portal/sysmgr/user/${id}`, params)
}