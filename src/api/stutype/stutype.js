import request from '@/utils/request'

export default {

  getStuType(stuType) {
    return request ({
      url: '/stu_type/getStutypeByCond',
      method: 'post',
      data: stuType
    })
  }

}
