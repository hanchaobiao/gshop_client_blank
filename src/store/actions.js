/*
通过mutation间接更新state的多个方法的对象
 */

import {RECEIVE_GOODS, RECEIVE_SELLERS, INCREMENT_FOOD_COUNT, DECREMENT_FOOD_COUNT} from './mutations-types'
import {reqShopInfo, reqShopGoods} from '../api/index'

const ERR_OK = 0

export default {
  async getShopInfo ({commit}) { // 异步获取商户信息
    // 发送异步ajax请求
    const result = await reqShopInfo()
    // 提交一个mutation
    if (result.code === ERR_OK) {
      const seller = result.data
      commit(RECEIVE_SELLERS, {seller})
    }
  },
  async getShopGoods ({commit}, callback) { // 异步获取商户商品信息
    const result = await reqShopGoods()
    // 提交一个mutation
    if (result.code === ERR_OK) {
      const goods = result.data
      commit(RECEIVE_GOODS, {goods})
      // 传入的回调函数
      callback()
    }
  },
  // 同步更新food中的count值
  updateFoodCount ({commit}, {isAdd, food}) {
    if (isAdd) {
      commit(INCREMENT_FOOD_COUNT, {food})
    } else {
      commit(DECREMENT_FOOD_COUNT, {food})
    }
  }
}
