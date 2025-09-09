//导入创建好的axios实例
import request from '@/utils/request.js'

//导出方法，供其它地方使用
export const queryPage = (data) => {
    return request({
        url: '/refer/manageReferPage',
        method: 'post',
        data: data
    })
}

export const edit = (data) => {
    return request({
        url: '/refer/edit',
        method: 'post',
        data: data
    })
}
