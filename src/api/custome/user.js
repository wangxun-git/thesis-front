import request from '@/utils/request'

export default {

  //查询用户信息
  getUserInfoList(page) {
    return request({
      url: '/user/getList/' + page,
      method: 'post'
    })
  },

  //删除用户信息
  removeUserInfoByUserId(userId) {
    return request({
      url: '/user/deleteOne/' + userId,
      method: 'delete'
    })
  },

  //条件获取用户
  getUserInfoListByCond(page, user) {
    return request({
      url: '/user/getUser/' + page,
      method: 'post',
      data: user
    })
  }

}
