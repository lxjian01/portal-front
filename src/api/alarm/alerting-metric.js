import { GET, POST, PUT, DELETE } from "../_methods"

export function addAlertingMetric(params){
    return POST(`/api/portal/alarm/alerting/metric`, params)
}

export function editAlertingMetric(id, params){
    return PUT(`/api/portal/alarm/alerting/metric/${id}`, params)
}

export function deleteAlertingMetric(id, params){
    return DELETE(`/api/portal/alarm/alerting/metric/${id}`, params)
}

export function getAlertingMetricList(params){
    return GET(`api/portal/alarm/alerting/metric/list`, params)
}

export function getAlertingMetricPage(params){
    return GET(`api/portal/alarm/alerting/metric/page`, params)
}
