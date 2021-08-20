import { GET, POST, PUT, DELETE } from "../_methods"

export function addAlertingRule(params){
    return POST(`/api/portal/alarm/alerting/rule`, params)
}

export function editAlertingRule(id, params){
    return PUT(`/api/portal/alarm/alerting/rule/${id}`, params)
}

export function deleteAlertingRule(id, params){
    return DELETE(`/api/portal/alarm/alerting/rule/${id}`, params)
}

export function getAlertingRulePage(params){
    return GET(`api/portal/alarm/alerting/rule/page`, params)
}
