import request from '@/utils/request'

export default {

  //获取审核状态中论文
  getThesisList(page) {
    return request({
      url: '/thesis/getList/' + page,
      method: 'get'
    })
  },

  //获取编目状态中的论文
  getCataThesisList(page) {
    return request({
      url: '/thesis/getCataList/' + page,
      method: 'get'
    })
  },

  getThesisListByCond(page, thesis) {
    return request({
      url: '/thesis/getCondList/' + page,
      method: 'post',
      data: thesis
    })
  },

  //提交论文
  submitThesis(thesis) {
    return request({
      url: '/thesis/saveThesis',
      method: 'post',
      data: thesis
    })
  },

  //审核论文
  approvedThesis(thesis) {
    return request({
      url: '/thesis/approvedThesis',
      method: 'put',
      data: thesis
    })
  },

  //获取登录用户的论文状态信息
  getThesisStatus() {
    return request({
      url: '/thesis/getThesisStatus',
      method: 'get'
    })
  },

  //获取审核不通过的论文审核意见
  getNotPassThesisAppr(thesisId) {
    return request({
      url: '/approved/getThesisAppr/' + thesisId,
      method: 'get'
    })
  },

  updateThesis(thesis) {
    return request({
      url: '/thesis/updateThesis',
      method: 'put',
      data: thesis
    })
  },

  //批量下载文件
  downloadThesis(thesisIdList) {
    return request({
      url: '/thesis/bulk_download_thesis',
      method: 'post',
      data: thesisIdList,
      responseType: 'blob'
    })
  },

  //保存编目信息
  saveThesisColl(thesisColl) {
    return request({
      url: '/thesisColl/save',
      method: 'post',
      data: thesisColl
    })
  }

}
