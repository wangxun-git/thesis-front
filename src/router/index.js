import Vue from 'vue'
import Router, {RouteConfig} from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRoutes = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/home', component: () => import('@/views/home/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  { //通知页面 :id
    path: '/notice',
    name: '系统通知',
    meta: {title: '系统通知'},
    component: () => import('@/views/notice/index'),
    hidden: true
  },

  { //通知页面 :id
    path: '/moreNotice',
    name: '通知公告',
    meta: {title: '通知公告'},
    component: () => import('@/views/notice/moreNotice'),
    hidden: true
  },

  { //通知页面 :id
    path: '/faq',
    name: 'FAQ',
    meta: {title: 'FAQ'},
    component: () => import('@/views/faq/index'),
    hidden: true
  },

  {
    path: '/clc',
    name: '中图法导航',
    meta: {title: 'FAQ'},
    component: () => import('@/views/clc/index'),
    hidden: true
  },

  {
    path: '/xkdh',
    name: '学科导航',
    meta: {title: '学科导航'},
    component: () => import('@/views/subjectNavi/index'),
    hidden: true
  },

  {
    path: '/thesisInfo',
    name: '论文详情',
    meta: {title: '论文详情'},
    component: () => import('@/views/thesis/staticThesis/index'),
    hidden: true
  },

  //首页
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    hidden: true,
    meta: {title: '首页'},
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },

]

export const asyncRoutes = [ // 通过路由元信息meta.roles来设置访问权限，一般来说是个数组

  {
    path: '/sysMana',
    component: Layout,
    redirect: '/sysMana/emailSys',
    name: '系统管理',
    meta: {title: '系统管理', icon: 'system'},
    children: [
      {
        path: 'emailSys',
        component: () => import('@/views/sysMana/emailSys'),
        name: '邮箱管理',
        meta: {title: '邮箱管理', icon: 'emailSys'},
        nocache: true
      },
      {
        path: 'noticeSys',
        component: () => import('@/views/sysMana/noticeSys'),
        name: '通知管理',
        meta: {title: '通知管理', icon: 'noticeSys'},
        nocache: true
      },
      {
        path: 'faqSys',
        component: () => import('@/views/sysMana/faqSys'),
        name: 'FAQ管理',
        meta: {title: 'FAQ管理', icon: 'FAQ'},
        nocache: true
      },
      {
        path: 'thesisTemp',
        component: () => import('@/views/sysMana/thesisTemp'),
        name: '论文模板',
        meta: {title: '论文模板', icon: 'temp'},
        nocache: true
      },
    ]
  },

  {
    path: '/collegeTutor',
    component: Layout,
    redirect: '/collegeTutor/college',
    name: '院系导师管理',
    meta: {title: '院系导师管理', icon: 'college'},
    children: [
      {
        path: 'college',
        component: () => import('@/views/collegeTutor/college/index'),
        name: '院系管理',
        meta: {title: '院系管理', icon: 'college2'},
        children: [
          {
            path: 'info',
            component: () => import('@/views/collegeTutor/college/info'),
            name: '院系列表',
            meta: {title: '院系列表', icon: 'table', noCache: true}
          },
          {
            path: 'save',
            component: () => import('@/views/collegeTutor/college/save'),
            name: '院系添加',
            meta: {title: '院系添加', icon: 'form'}
          }
        ]
      },

      {
        path: 'major',
        component: () => import('@/views/collegeTutor/major/index'),
        name: '专业管理',
        meta: {title: '专业管理', icon: 'major'},
        children: [
          {
            path: 'info',
            component: () => import('@/views/collegeTutor/major/info'),
            name: '专业列表',
            meta: {title: '专业列表', icon: 'table'}
          },
          {
            path: 'save',
            component: () => import('@/views/collegeTutor/major/save'),
            name: '专业添加',
            meta: {title: '专业添加', icon: 'form'}
          }
        ]
      },
    ]
  },

  {
    path: '/userMana',
    component: Layout,
    redirect: '/userMana/user',
    name: '用户管理',
    meta: {title: '用户管理', icon: 'user'},
    children: [
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/userMana/user/index'),
        meta: {title: '管理者管理', icon: 'user'},
        children: [
          {
            path: 'info',
            name: '用户列表',
            component: () => import('@/views/userMana/user/info'),
            meta: { title: '用户列表', icon: 'table' }
          },
          {
            path: 'save',
            name: '添加用户',
            component: () => import('@/views/userMana/user/save/index'),
            meta: { title: '添加用户', icon: 'form' }
          },
          {
            path: 'edit/:id',
            name: '用户修改',
            component: () => import('@/views/userMana/user/update/index'),
            meta: {title: '用户修改', icon: 'form'},
            hidden: true
          },
          {
            path: 'stuType',
            name: '类型职称管理',
            component: () => import('@/views/userMana/user/stuType'),
            meta: {title: '类型职称管理', icon: 'table'}
          }
        ]
      },
      {
        path: 'student',
        name: 'student',
        component: () => import('@/views/userMana/student/index'),
        meta: {title: '学生管理', icon: 'student'},
        children: [
          {
            path: 'info',
            name: '学生列表',
            component: () => import('@/views/userMana/student/info'),
            meta: { title: '学生列表', icon: 'table' }
          },
          {
            path: 'save',
            name: '添加学生',
            component: () => import('@/views/userMana/student/save'),
            meta: { title: '添加学生', icon: 'form' }
          },
          {
            path: 'edit/:id',
            name: '学生修改',
            component: () => import('@/views/userMana/student/update'),
            meta: {title: '学生修改', icon: 'form'},
            hidden: true
          },
        ]
      },
      {
        path: 'tutor',
        component: () => import('@/views/userMana/tutor/index'),
        name: '导师管理',
        meta: {title: '导师管理', icon: 'tutor'},
        children: [
          {
            path: 'info',
            component: () => import('@/views/userMana/tutor/info'),
            name: '导师列表',
            meta: {title: '导师列表', icon: 'table'}
          },
          {
            path: 'save',
            component: () => import('@/views/userMana/tutor/save'),
            name: '导师添加',
            meta: {title: '导师添加', icon: 'form'}
          },
          {
            path: 'edit/:id',
            component: () => import('@/views/userMana/tutor/save'),
            name: '导师修改',
            meta: {title: '导师修改', icon: 'form'},
            hidden : true
          }
        ]
      }
    ]
  },

  {
    path: '/subject',
    component: Layout,
    redirect: '/subject',
    name: '学科学位管理',
    meta: {title: '学科学位管理', icon: 'degree'},
    children: [
      {
        path: 'info',
        component: () => import('@/views/subject/info/index'),
        name: '学科列表',
        meta: {title: '学科列表', icon: 'table'},
        alwaysShow: true,
        nocache: true
      },
      {
        path: 'stuDegree',
        name: '学位级别列表',
        component: () => import('@/views/subject/stuDegree/index'),
        meta: {title: '学位级别列表', icon: 'table'},
        alwaysShow: true,
        nocache: true
      }
    ]
  },

  {
    path: '/thesis',
    component: Layout,
    redirect: '/thesis',
    name: '论文管理',
    meta: {title: '论文管理', icon: 'thesis'},
    children: [
      {
        path: 'info',
        component: () => import('@/views/thesis/info/index'),
        name: '论文列表',
        meta: {title: '论文列表', icon: 'table'},
        children: [
          {
            path: 'approved',
            component: () => import('@/views/thesis/info/approved'),
            name: '审核列表',
            meta: {title: '审核列表', icon: 'table'}
          },
          {
            path: 'catalogue',
            component: () => import('@/views/thesis/info/catalogue'),
            name: '编目列表',
            meta: {title: '编目列表', icon: 'table'},
            nocache: true
          },
          {
            path: 'edit/:id',
            name: '论文修改',
            component: () => import('@/views/thesis/info/update'),
            meta: {title: '论文修改', icon: 'form'},
            hidden: true,
            nocache: true
          }
        ]
      },
      {
        path: 'submit',
        component: () => import('@/views/thesis/upload/index'),
        name: '论文提交',
        meta: {title: '论文提交', icon: 'thesis-submit'},
        nocache: true
      },
      {
        path: 'approved',
        component: () => import('@/views/thesis/approved/index'),
        name: '论文审核',
        meta: {title: '论文审核', icon: 'thesis-approved'},
        hidden: true,
        nocache: true
      },
      {
        path: 'catalogue',
        component: () => import('@/views/thesis/catalogue/index'),
        name: '论文编目',
        meta: {title: '论文编目', icon: 'catalogue'},
        hidden: true,
        nocache: true
      }
    ]
  },

  {
    path: '/statMana',
    component: Layout,
    name: '统计管理',
    meta: {title: '统计管理', icon: 'stat'},
    children: [
      {
        path: 'loginSata',
        component: () => import('@/views/statMana/index'),
        name: '登录统计',
        meta: {title: '登录统计', icon: 'loginSata'},
        nocache: true,
        children: [
          {
            path: 'loginSata',
            component: () => import('@/views/statMana/loginSata'),
            name: '登录统计',
            meta: {title: '登录统计', icon: 'loginSata'},
          }
        ]
      },
      {
        path: 'thesisSata',
        component: () => import('@/views/statMana/index'),
        name: '论文统计',
        meta: {title: '论文统计', icon: 'thesisSata'},
        children: [
          {
            path: 'thesisSata',
            component: () => import('@/views/statMana/thesisSata'),
            name: '年份论文统计',
            meta: {title: '年份论文统计', icon: 'thesisSata'}
          },
          {
            path: 'thesisCollSata',
            component: () => import('@/views/statMana/thesisCollSata'),
            name: '学院论文统计',
            meta: {title: '学院论文统计', icon: 'viewSata'}
          }
        ]
      },
    ]
  },

  {
    path: '/auth',
    component: Layout,
    name: '权限管理',
    meta: {title: '权限管理', icon: 'auth'},
    children: [
      {
        path: 'info',
        component: () => import('@/views/auth/info'),
        name: '权限列表',
        meta: {title: '权限列表', icon: 'table'}
      }
    ]
  },

  {
    path: '/userInfo',
    name: '用户信息',
    component: Layout,
    meta: {title: '用户信息', icon: 'form'},
    hidden: true,
    children: [
      {
        path: 'user',
        component: () => import('@/views/userInfo/index'),
        name: '个人中心',
        meta: {title: '个人中心', icon: 'form'},
        hidden: true
      },
      {
        path: 'student',
        component: () => import('@/views/userInfo/student'),
        name: '个人中心',
        meta: {title: '个人中心', icon: 'form'},
        hidden: true
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }

]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export default router

