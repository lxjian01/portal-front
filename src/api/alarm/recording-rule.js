import { GET, POST, PUT, DELETE } from "../_methods"

export function addRecordingRule(params){
    return POST(`/api/portal/alarm/recording/rule`, params)
}

export function editRecordingRule(id, params){
    return PUT(`/api/portal/alarm/recording/rule/${id}`, params)
}

export function deleteRecordingRule(id, params){
    return DELETE(`/api/portal/alarm/recording/rule/${id}`, params)
}

export function getRecordingRulePage(params){
    return GET(`api/portal/alarm/recording/rule/page`, params)
}
