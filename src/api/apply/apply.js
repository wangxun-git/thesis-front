import request from '@/utils/request'

export default {

  getDegreeApplyInfos(page, apply) {
    return request({
      url: '/apply/getDoubleDegreeList/' + page,
      method: 'post',
      data: apply
    })
  },

  approvedDoubleDegreeInfo(approved) {
    return request({
      url: '/approved/examineDegree',
      method: 'post',
      data: approved
    })
  }
}
