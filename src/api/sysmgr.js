import request from '../utils/request';

export const getMenuList = query => {
    return request({
        url: '/api/portal/sysmgr/menu/list',
        method: 'get',
        params: query
    });
};

export const getMenuPage = query => {
    return request({
        url: '/api/portal/sysmgr/menu/page',
        method: 'get',
        params: query
    });
};
