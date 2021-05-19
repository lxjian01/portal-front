import request from '../utils/request';

export const getMenuList = query => {
    return request({
        url: '/api/portal/sysmgr/menu/list',
        method: 'get',
        params: query
    });
};
