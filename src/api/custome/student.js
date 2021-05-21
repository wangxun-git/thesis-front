import request from '@/utils/request'

export default {
  getStudentInfos(page) {
    return request({
      url: '/student/getList/' + page,
      method: 'get'
    })
  },

  removeStudentInfoById(stuId) {
    return request({
      url: '/student/delete_stu/' + stuId,
      method: 'delete'
    })
  },

  getStudentInfoByCond(page, student) {
    return request({
      url: '/student/getCondList/' + page,
      method: 'post',
      data: student
    })
  },

  //获取学位类型信息
  getStuTypeInfo() {
    return request({
      url: '/stu_type/getList',
      method: 'get'
    })
  },

  saveStudentInfo(student) {
    return request({
      url: '/student/saveStu',
      method: 'post',
      data: student
    })
  },

  //导出学生信息
  exportStudentBySelect(stuIdList) {
    return request({
      url: '/student/exportSelectStu',
      method: 'post',
      data: {
        "stuIdList" : stuIdList
      }
    })
  }
}

