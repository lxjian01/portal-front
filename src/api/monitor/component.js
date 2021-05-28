import { GET, POST, PUT, DELETE } from "../_methods"

export function addComponent(params){
    return POST(`/api/portal/monitor/component`, params)
}

export function editComponent(id, params){
    return PUT(`/api/portal/monitor/component/${id}`, params)
}

export function deleteComponent(id, params){
    return DELETE(`/api/portal/monitor/component/${id}`, params)
}

export function getComponentPage(params){
    return GET(`api/portal/monitor/component/page`, params)
}

export function getComponentList(params){
    return GET(`/api/portal/monitor/component/list`, params)
}
