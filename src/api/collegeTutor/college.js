import request from '@/utils/request'

export default {

  getCollegeInfo(page) {
    return request({
      url: '/college/getList/' + page,
      method: 'get'
    })
  },

  getAllCollegeInfo() {
    return request({
      url: '/college/getAllCol',
      method: 'get'
    })
  },

  getCollegeInfoByCond(page, college) {
    return request({
      url: '/college/getCollegeByCond/' + page,
      method: 'post',
      data: college
    })
  },

  removeCollegeInfoById(collegeId) {
    return request({
      url: '/college/delete_col/' + collegeId,
      method: 'delete'
    })
  },

  updateCollegeInfoById(college) {
    return request({
      url: '/college/updateCollege',
      method: 'post',
      data: college
    })
  },

  //导出学院信息
  exportCollegeInfos(collegeIdList) {
    return request({
      url: '/college/exportCol',
      method: 'post',
      data: collegeIdList,
      responseType: 'blob'
    })
  },

  saveCollegeInfo(college) {
    return request({
      url: '/college/saveCollege',
      method: 'post',
      data: college
    })
  }

}
