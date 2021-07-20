import request from '@/utils/request'

export default {

  getNoticeByPage(page) {
    return request({
      url: '/home/getPageNotice/' + page,
      method: 'get',
    })
  },

  getAllNotice() {
    return request({
      url: '/home/getNotices',
      method: 'get',
    })
  },

  downloadFile(noticeId) {
    return request({
      url: '/home/downloadNotice/' + noticeId,
      method: 'get',
      responseType: 'blob'
    })
  },

  getLoginInfo() {
    return request({
      url: '/home/getLoginInfo',
      method: 'get',
    })
  },

  getThesisInfo() {
    return request({
      url: '/home/getThesisInfo',
      method: 'get',
    })
  },

  getThesisByStatus() {
    return request({
      url: '/home/getStatusThesis',
      method: 'get',
    })
  },

  //获取提交、未提交
  getSubmitStu() {
    return request({
      url: '/home/getSubmitStus',
      method: 'get',
    })
  },

  getThesisByCollege() {
    return request({
      url: '/home/getCollegeThesis',
      method: 'get',
    })
  },

  getSevenDaysThesis() {
    return request({
      url: '/home/getSevenDays',
      method: 'get',
    })
  },

  //获取论文提交时间线
  getThesisTimeLine() {
    return request({
      url: '/home/getThesisTimeLine',
      method: 'get',
    })
  },

  //获取登录学生的论文状态
  getThesisStatusByToken() {
    return request({
      url: '/home/getThesisStatus',
      method: 'get',
    })
  },

  //获取验证码
  getCaptcha(userId, email) {
    return request({
      url: '/sys/send_emcode/' + userId + '/' + email,
      method: 'get',
    })
  },

  updatePwd(user) {
    return request({
      url: '/sys/updatePwd',
      method: 'post',
      data: user
    })
  },

  downloadThesisTemp() {
    return request({
      url: '/home/downloadThesisTemp',
      method: 'get',
      responseType: 'blob'
    })
  }

}
