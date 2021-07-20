// const getters = {
//   sidebar: state => state.app.sidebar,
//   device: state => state.app.device,
//   token: state => state.user.token,
//   avatar: state => state.user.avatar,
//   name: state => state.user.name,
//   roles: state => state.user.roles,
//   id: state => state.user.id
// }
// export default getters
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  buttons: state => state.user.buttons,
  roles: state => state.user.roles,
  routes: state => state.permission.routes,
  addRoutes: state => state.permission.addRoutes,
  id: state => state.user.id
}
export default getters
