import { GET, POST, PUT, DELETE } from "../_methods"

export function getAlarmNoticePage(params){
    return GET(`api/portal/alarm/notice/page`, params)
}


