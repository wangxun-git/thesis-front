import request from '@/utils/request'

export function login(userInfo) {
  return request({
    url: '/pub/login',
    method: 'post',
    data: userInfo
  })
}

export function getInfo(token) {
  return request({
    url: '/user/userInfo',
    method: 'get',
    params: { token }
  })
}

export function logout(token) {
  return request({
    url: '/pub/logout',
    method: 'post',
    params: {token}
  })
}

// 获取菜单权限数据
export function getMenu(roleCode) {
  return request({
    url: '/auth/getMenu/' + roleCode,
    method: 'get'
  })
}
