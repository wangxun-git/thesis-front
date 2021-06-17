import request from '@/utils/request'

export default {

  //获取全部类型信息
  getAllType(page) {
    return request({
      url: '/stu_type/getAllList/' + page,
      method: 'get'
    })
  },

  getStudentStuType() {
    return request({
      url: '/stu_type/getList',
      method: 'get'
    })
  },

  //条件获取类型信息
  getStuType(page, stuType) {
    return request ({
      url: '/stu_type/getStutypeByCond/' + page,
      method: 'post',
      data: stuType
    })
  },

  removeStuType(stutypeId) {
    return request({
      url: '/stu_type/delete_stutype/' + stutypeId,
      method: 'delete'
    })
  },

  updateStuType(stuType) {
    return request({
      url: '/stu_type/update_stutype',
      method: 'put',
      data: stuType
    })
  },

  saveStuType(stuType) {
    return request({
      url: '/stu_type/save_stutype',
      method: 'post',
      data: stuType
    })

  }

}
