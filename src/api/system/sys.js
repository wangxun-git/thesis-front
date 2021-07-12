import request from '@/utils/request'

export default {

  //删除上传的头像
  deletefile(filename) {
    return request({
      url: '/sys/deleteAvatar/' + filename,
      method: 'delete'
    })
  },

  //获取系统中邮箱设置
  getEmailSys() {
    return request({
      url: '/sys/getEmailSys',
      method: 'get'
    })
  },

  //保存邮箱设置信息
  saveEmailSys(email) {
    return request({
      url: '/sys/saveEmailSys',
      method: 'post',
      data: email
    })
  },

  //修改邮箱设置信息
  updateEmailSys(email) {
    return request({
      url: '/sys/updateEmailSys',
      method: 'post',
      data: email
    })
  },

  //获取全部通知公告信息
  getNotice(page) {
    return request({
      url: '/sys/getAllNotice/' + page,
      method: 'get',
    })
  },

  //获取单个通知公告信息
  getOneNotice(noticeId) {
    return request({
      url: '/sys/getOneNotice/' + noticeId,
      method: 'get',
    })
  },

  //添加通知公告信息
  saveNotice(notice) {
    return request({
      url: '/sys/saveNotice',
      method: 'post',
      data: notice
    })
  },

  //修改通知公告信息
  updateNotice(notice) {
    return request({
      url: '/sys/updateNotice',
      method: 'post',
      data: notice
    })
  },

  //删除通知公告信息
  removeNotice(noticeId) {
    return request({
      url: '/sys/deleteNotice/' + noticeId,
      method: 'delete',
    })
  },

  //获取全部faq信息
  getAllFaq() {
    return request({
      url: '/faq/getAllFaq',
      method: 'get'
    })
  },

  //添加faq信息
  saveFaq(faq) {
    return request({
      url: '/faq/saveFaq',
      method: 'post',
      data: faq
    })
  },

  //修改通知公告信息
  updateFaq(faq) {
    return request({
      url: '/faq/updateFaq',
      method: 'put',
      data: faq
    })
  },

  //删除通知公告信息
  removeFaq(faqId) {
    return request({
      url: '/faq/deleteFaq/' + faqId,
      method: 'delete',
    })
  },

  getOneFaq(faqId) {
    return request({
      url: '/faq/getOneFaq/' + faqId,
      method: 'get',
    })
  }
}
