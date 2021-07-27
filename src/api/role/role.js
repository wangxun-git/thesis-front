import request from '@/utils/request'

export default {
  getRoles() {
    return request({
      url: '/auth/getRoles',
      method: 'get'
    })
  },

  getRolesByUser(user) {
    return request({
      url: '/auth/getCondMenu',
      method: 'post',
      data: user
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

