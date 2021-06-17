import request from '@/utils/request'

export default {

  getStuDegree(page) {
    return request({
      url: '/stu_degree/getList/' + page,
      method: 'get'
    })
  },

  removeStuDegree(degreeId) {
    return request({
      url: '/stu_degree/delete_degree/' + degreeId,
      method: 'delete'
    })
  },

  getStuDegreeByCond(page, stuDegree) {
    return request({
      url: '/stu_degree/getConList/' + page,
      method: 'post',
      data: stuDegree
    })
  },

  updateDegree(stuDegree) {
    return request({
      url: '/stu_degree/update_degree',
      method: 'put',
      data: stuDegree
    })
  },

  saveStuDegree(stuDegree) {
    return request({
      url: '/stu_degree/save_degree',
      method: 'post',
      data: stuDegree
    })
  }
}
