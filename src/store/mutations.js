/*
直接更新state的多个方法的对象
 */
import {RECEIVE_GOODS, RECEIVE_SELLERS, INCREMENT_FOOD_COUNT, DECREMENT_FOOD_COUNT} from './mutations-types'
import Vue from 'vue'
export default {
  [RECEIVE_SELLERS] (state, {seller}) {
    state.seller = seller
  },
  [RECEIVE_GOODS] (state, {goods}) {
    state.goods = goods
  },
  [INCREMENT_FOOD_COUNT] (state, {food}) {
    if (!food.count) { // 第一次增加
      // food.count = 1  // 新增属性(没有数据绑定)
      /*
      对象
      属性名
      属性值
       */
      Vue.set(food, 'count', 1) // 让新增的属性也有数据绑定
    } else {
      food.count += 1
    }
    // 将food添加到cartFoods中
    state.cartFoods.push(food)
  },
  [DECREMENT_FOOD_COUNT] (state, {food}) {
    if (food.count) { // 只有有值才去减
      food.count--
      if (food.count === 0) {
        // 将food从cartFoods中移除
        state.cartFoods.splice(state.cartFoods.indexOf(food), 1)
      }
    }
  }
}
