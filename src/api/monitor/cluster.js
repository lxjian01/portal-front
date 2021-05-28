import { GET, POST, PUT, DELETE } from "../_methods"

export function addCluster(params){
    return POST(`/api/portal/monitor/cluster`, params)
}

export function editCluster(id, params){
    return PUT(`/api/portal/monitor/cluster/${id}`, params)
}

export function deleteCluster(id, params){
    return DELETE(`/api/portal/monitor/cluster/${id}`, params)
}

export function getClusterPage(params){
    return GET(`api/portal/monitor/cluster/page`, params)
}

export function getClusterList(params){
    return GET(`/api/portal/monitor/cluster/list`, params)
}
