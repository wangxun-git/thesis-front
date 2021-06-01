import request from '@/utils/request'

export default {

  getTutor(page) {
    return request ({
      url: '/tutor/getList/' + page,
      method: 'get'
    })
  },

  getTutorByCond(page, tutor) {
    return request({
      url: '/tutor/getCondTutor/' + page,
      method: 'post',
      data: tutor
    })
  },

  removeTutor(tutorId) {
    return request({
      url: '/tutor/delete_tutor/' + tutorId,
      method: 'delete'
    })
  },

  exportTutor(tutorIdList) {
    return request({
      url: '/tutor/exportTutor',
      method: 'post',
      data: tutorIdList,
      responseType: 'blob'
    })
  },

  updateTutor(tutor) {
    return request({
      url: '/tutor/update_tutor',
      method: 'put',
      data: tutor
    })
  },

  saveTutor(tutor) {
    return request({
      url: '/tutor/save_tutor',
      method: 'post',
      data: tutor
    })
  }

}
