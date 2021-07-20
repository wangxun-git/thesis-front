import request from '@/utils/request'

export default {
  getPermissions() {
    return request({
      url: '/auth/getPerms',
      method: 'get'
    })
  },

  addPerByRole(rolePer) {
    return request({
      url: '/auth/addMenu',
      method: 'post',
      data: rolePer
    })
  }
}

