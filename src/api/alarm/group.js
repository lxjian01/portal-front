import { GET, POST, PUT, DELETE } from "../_methods"

export function addGroup(params){
    return POST(`/api/portal/alarm/group`, params)
}

export function editGroup(id, params){
    return PUT(`/api/portal/alarm/group/${id}`, params)
}

export function deleteGroup(id, params){
    return DELETE(`/api/portal/alarm/group/${id}`, params)
}

export function getGroupPage(params){
    return GET(`api/portal/alarm/group/page`, params)
}

export function getGroupDetail(id, params){
    return GET(`/api/portal/alarm/group/${id}`, params)
}

export function getGroupList(params){
    return GET(`/api/portal/alarm/group/list`, params)
}


