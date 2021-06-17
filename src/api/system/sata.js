import request from '@/utils/request'

export default {

  getLogins(flag) {
    return request({
      url: '/stat/getLoginInfos/' + flag,
      method: 'get'
    })
  },

  getLoginsByCond(loginLog) {
    return request({
      url: '/stat/getLoginInfosByCond',
      method: 'post',
      data: loginLog
    })
  },

  //根据年份获取论文提交情况
  getThesisByCond(thesis) {
    return request({
      url: '/stat/getYearThesisInfo',
      method: 'post',
      data: thesis
    })
  },

  getThesisByMonth(thesis) {
    return request({
      url: '/stat/getMonthThesisInfo',
      method: 'post',
      data: thesis
    })
  },

  getThesisByStudent(student) {
    return request({
      url: '/stat/getStudentThesisInfo',
      method: 'post',
      data: student
    })
  },

  getThesisByCollege(college) {
    return request({
      url: '/stat/getCollegeThesisInfo',
      method: 'post',
      data: college
    })
  },

  getThesisByMajor(college) {
    return request({
      url: '/stat/getMajorThesisInfo',
      method: 'post',
      data: college
    })
  }

}
