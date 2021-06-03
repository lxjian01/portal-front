import { GET, POST, PUT, DELETE } from "../_methods"

export function addExporter(params){
    return POST(`/api/portal/monitor/exporter`, params)
}

export function editExporter(id, params){
    return PUT(`/api/portal/monitor/exporter/${id}`, params)
}

export function deleteExporter(id, params){
    return DELETE(`/api/portal/monitor/exporter/${id}`, params)
}

export function getExporterPage(params){
    return GET(`api/portal/monitor/exporter/page`, params)
}

export function getExporterList(params){
    return GET(`/api/portal/monitor/exporter/list`, params)
}
