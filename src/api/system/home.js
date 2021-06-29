import request from '@/utils/request'

export default {
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

  getThesisTimeLine() {
    return request({
      url: '/home/getThesisTimeLine',
      method: 'get',
    })
  }

}
