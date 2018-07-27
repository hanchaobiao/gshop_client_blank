import Vue from 'vue'
import VueRouter from 'vue-router'
import Goods from '../components/goods/goods'
import Ratings from '../components/ratings/ratings'
import Seller from '../components/seller/seller'

Vue.use(VueRouter)

export default new VueRouter({
  linkActiveClass: 'active', // 配置被点击路由后添加的class名称
  routes: [
    {
      path: '/goods',
      component: Goods
    },
    {
      path: '/ratings',
      component: Ratings
    },
    {
      path: '/seller',
      component: Seller
    },
    {
      path: '/',
      redirect: '/goods'
    }
  ]
})
