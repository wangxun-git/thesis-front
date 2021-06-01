import request from '@/utils/request'

export default {

  getMajorInfo(page) {
    return request({
      url: '/major/getMajorList/' + page,
      mehtod: 'get'
    })
  },

  getMajorInfoListByCond(page, major) {
    return request({
      url: '/major/getMajorByCond/' + page,
      method: 'post',
      data: major
    })
  },

  removeMajor(majorId) {
    return request({
      url: '/major/delete_major/' + majorId,
      method: 'delete'
    })
  },

  updateMajor(major) {
    return request({
      url: '/major/updateMajor',
      method: 'post',
      data: major
    })
  },

  exportMajor(majorIdList) {
    return request({
      url: '/major/exportMajor',
      method: 'post',
      data: majorIdList,
      responseType: 'blob'
    })
  },

  saveMajor(major) {
    return request({
      url: '/major/save_major',
      method: 'post',
      data: major
    })
  }

}
