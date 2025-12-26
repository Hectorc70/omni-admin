
export const basePaths = {
    init: '/',
    home: '/home',
    login: '/login',
    register: '/register',
    stock:'/stock',
    chats:'/chats'
};

export const routeNames = {
  initPage: basePaths.init,
  loginPage: basePaths.login,
  registerPage: basePaths.register,
  homePage: basePaths.home,
  stockPage: basePaths.stock,
  productsPage:basePaths.home + '/products',
  chatsPage:basePaths.chats,
}