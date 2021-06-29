import request from '@/utils/request'

export default {

  getSubjectByLevel(level){
    return request({
      url: '/subject/getSubList/' + level,
      method: 'get'
    })
  },

  getSubjectByCond(subject) {
    return request({
      url: '/subject/getConSub',
      method: 'post',
      data: subject
    })
  },

  saveSubject(subject) {
    return request({
      url: '/subject/saveSubject',
      method: 'post',
      data: subject
    })
  },

  deleteSubject(subjectCode) {
    return request({
      url: '/subject/deleteSub/' + subjectCode,
      method: 'delete'
    })
  }

}
