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
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

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

  {
    path: '/userMana',
    component: Layout,
    redirect: '/userMana/user',
    name: 'userMana',
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
          {
            path: 'approved',
            name: '申请审批',
            component: () => import('@/views/userMana/student/approval'),
            meta: {title: '申请审批', icon: 'form'},
            children: [
              {
                path: 'applyDoubleDeg',
                name: '双学位申请审批',
                component: () => import('@/views/userMana/student/approval/doubleDegree'),
                meta: {title: '双学位申请审批', icon: 'form'},
              },
              {
                path: 'applyResub',
                name: '重新提交申请审批',
                component: () => import('@/views/userMana/student/approval/reSubmit'),
                meta: {title: '重新提交申请审批', icon: 'form'},
              }
            ]
          },
          {
            path: 'stuDegree',
            name: '学位级别管理',
            component: () => import('@/views/userMana/student/stuDegree'),
            meta: {title: '学位级别管理', icon: 'table'},
            children: [
              {
                path: 'info',
                name: '学位级别列表',
                component: () => import('@/views/userMana/student/stuDegree/info'),
                meta: {title: '学位级别列表', icon: 'table'}
              }
            ]
          }
        ]
      }
    ]
  },

  {
    path: '/collegeTutor',
    component: Layout,
    redirect: '/collegeTutor/college',
    name: '院系导师管理',
    meta: {title: '院系导师管理', icon: 'college', roles: ['student'], alwaysShow: true},
    children: [
      {
        path: 'college',
        component: () => import('@/views/collegeTutor/college/index'),
        name: '院系管理',
        meta: {title: '院系管理', icon: 'college2', roles: ['student']},
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

      {
        path: 'tutor',
        component: () => import('@/views/collegeTutor/major/index'),
        name: '导师管理',
        meta: {title: '导师管理', icon: 'tutor'},
        children: [
          {
            path: 'info',
            component: () => import('@/views/collegeTutor/tutor/info'),
            name: '导师列表',
            meta: {title: '导师列表', icon: 'table'}
          },
          {
            path: 'save',
            component: () => import('@/views/collegeTutor/tutor/save'),
            name: '导师添加',
            meta: {title: '导师添加', icon: 'form'}
          },
          {
            path: 'edit/:id',
            component: () => import('@/views/collegeTutor/tutor/save'),
            name: '导师修改',
            meta: {title: '导师修改', icon: 'form'},
            hidden : true
          }
        ]
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
            meta: {title: '编目列表', icon: 'table'}
          },
          {
            path: 'edit/:id',
            name: '论文修改',
            component: () => import('@/views/thesis/info/update'),
            meta: {title: '论文修改', icon: 'form'},
            hidden: true
          }
        ]
      },
      {
        path: 'submit',
        component: () => import('@/views/thesis/upload/index'),
        name: '论文提交',
        meta: {title: '论文提交', icon: 'thesis-submit'}
      },
      {
        path: 'approved',
        component: () => import('@/views/thesis/approved/index'),
        name: '论文审核',
        meta: {title: '论文审核', icon: 'thesis-approved'},
        hidden: true
      },
      {
        path: 'catalogue',
        component: () => import('@/views/thesis/catalogue/index'),
        name: '论文编目',
        meta: {title: '论文编目', icon: 'catalogue'},
        hidden: true
      }
    ]
  },

  {
    path: '/statMana',
    component: Layout,
    redirect: '/statMana/loginSata',
    name: '统计管理',
    meta: {title: '统计管理', icon: 'stat'},
    children: [
      {
        path: 'loginSata',
        component: () => import('@/views/statMana/loginSata'),
        name: '登录统计',
        meta: {title: '登录统计', icon: 'loginStat'},
        nocache: true
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
    path: '/systemMana',
    component: Layout,
    redirect: '/sysMana/emailSys',
    name: '系统管理',
    meta: {title: '系统管理', icon: 'stat'},
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
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
