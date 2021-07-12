import request from '@/utils/request'

export default {

  getAllClc() {
    return request( {
      url: '/clc/getAllCLc',
      method: 'get'
    })
  },

}
