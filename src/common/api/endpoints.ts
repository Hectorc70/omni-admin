
export const EndpointsApp = {
  auth: {
    login: `/users/login/`,
    // createAccount: `/users/create-account/`,
    refreshToken: `/users/refresh-token/`,
    detailUser: `/users/`,
    activateUser: `/users/activate/`,
  },
  business: {
    create: `/business/`,
    update: `/business`,
    products: `/business/catalog/filter`,
    addProduct: `/business/catalog/product/`,
    addImageProduct: `/business/catalog/product/images/`,
    categories: `/business/catalog/categories/`,
    categoriesFilter: `/business/catalog/categories/filter`,
    events: `/business/events/`,
    eventsFilter: `/business/events/filter`,
  },
}
