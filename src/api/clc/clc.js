import request from '@/utils/request'

export default {

  getAllClc() {
    return request({
      url: '/clc/getAllClcs',
      method: 'get'
    })
  },

  getThesisByClcId(page, clcId) {
    return request({
      url: '/clc/getThesisByClc/' + page + '/' + clcId,
      method: 'get'
    })
  }

}
