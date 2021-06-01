import request from '@/utils/request'

export default {

  getThesisList(page) {
    return request({
      url: '/thesis/getList/' + page,
      method: 'get'
    })
  },

  getThesisListByCond(page, thesis) {
    return request({
      url: '/thesis/getCondList/' + page,
      method: 'post',
      data: thesis
    })
  }

}
