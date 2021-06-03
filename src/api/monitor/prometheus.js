import { GET, POST, PUT, DELETE } from "../_methods"

export function addPrometheus(params){
    return POST(`/api/portal/monitor/prometheus`, params)
}

export function editPrometheus(id, params){
    return PUT(`/api/portal/monitor/prometheus/${id}`, params)
}

export function deletePrometheus(id, params){
    return DELETE(`/api/portal/monitor/prometheus/${id}`, params)
}

export function getPrometheusPage(params){
    return GET(`api/portal/monitor/prometheus/page`, params)
}

export function getPrometheusList(params){
    return GET(`/api/portal/monitor/prometheus/list`, params)
}
