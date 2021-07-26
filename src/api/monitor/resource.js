import { GET, POST, PUT, DELETE } from "../_methods"

export function addResource(params){
    return POST(`/api/portal/monitor/resource`, params)
}

export function editResource(id, params){
    return PUT(`/api/portal/monitor/resource/${id}`, params)
}

export function deleteResource(id, params){
    return DELETE(`/api/portal/monitor/resource/${id}`, params)
}

export function getResourcePage(params){
    return GET(`api/portal/monitor/resource/page`, params)
}

export function getResourceList(params){
    return GET(`/api/portal/monitor/resource/list`, params)
}
