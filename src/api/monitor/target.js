import { GET, POST, PUT, DELETE } from "../_methods"

export function addTarget(params){
    return POST(`/api/portal/monitor/target`, params)
}

export function editTarget(id, params){
    return PUT(`/api/portal/monitor/target/${id}`, params)
}

export function deleteTarget(id, params){
    return DELETE(`/api/portal/monitor/target/${id}`, params)
}

export function getTargetPage(params){
    return GET(`api/portal/monitor/target/page`, params)
}