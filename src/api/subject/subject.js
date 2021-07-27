import request from '@/utils/request'

export default {

  getAllSub() {
    return request({
      url: '/subject/getAllSub',
      method: 'get'
    })
  },

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
  },

  //学科导航页面论文查询
  selectThesis(page, param) {
    return request({
      url: '/subject/getThesisXkdh/' + page,
      method: 'post',
      data: param,
    })
  }

}
