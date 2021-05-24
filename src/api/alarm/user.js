import { GET, POST, PUT, DELETE } from "../_methods"

export function addUser(params){
    return POST(`/api/portal/alarm/user`, params)
}

export function editUser(id, params){
    return PUT(`/api/portal/alarm/user/${id}`, params)
}

export function deleteUser(id, params){
    return DELETE(`/api/portal/alarm/user/${id}`, params)
}

export function getUserPage(params){
    return GET(`api/portal/alarm/user/page`, params)
}

export function getUserList(params){
    return GET(`/api/portal/alarm/user/list`, params)
}

