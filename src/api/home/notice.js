import request from '@/utils/request'

export default {

  getNoticeById(noticeId) {
    return request({
      url: '/home/getNotice/' +  noticeId,
      method: 'get',
    })
  }

}
