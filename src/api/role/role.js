import request from '@/utils/request'

export default {
  getRoles() {
    return request({
      url: '/auth/getRoles',
      method: 'get'
    })
  },

  getRolesByCond(role) {
    return request({
      url: '/auth/getCondRoles',
      method: 'post',
      data: role
    })
  }
}

