<template>
  <transition name="fade">
    <div v-show="showFlag" class="food" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image"  alt="">
          <div class="back">
            <i class="icon-arrow_lift" @click="toggleShow"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span>好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now-price">￥{{food.price}}</span>
            <span v-show="food.oldPrice" class="old-price">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol :food="food"></cartcontrol>
          </div>
          <!--<transition name="btn-fade">-->
          <!--<div @click.stop.prevent="addFirst" class="buy" v-show="!food.count || food.count===0">加入购物车-->
          <!--</div>-->
          <!--</transition>-->
        </div>
        <split v-show="food.info"></split>
        <div class="info">
          <h1 class="title">商品介绍</h1>
          <div class="text">
            <p>{{food.info}}</p>
          </div>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Vue from 'vue'
import cartcontrol from '../cartcontrol/cartcontrol'
import BScroll from 'better-scroll'
import split from '../split/split'
export default {
  data () {
    return {
      showFlag: false
    }
  },
  props: {
    food: {
      type: Object
    }
  },
  methods: {
    toggleShow () {
      this.showFlag = !this.showFlag
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.food, {
            click: true
          })
        } else {
          this.scroll.refresh()
        }
      })
    },
    addFirst (event) {
      console.log(event)
      // if (!event._constructed) { // 放置多次点击
      //   return
      // }
      Vue.set(this.food, 'count', 1)
    }
  },
  components: {
    cartcontrol,
    split
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .food
    position fixed
    left 0
    top 0
    bottom 48px
    width 100%
    background #fff
    // 从右向左移入
    &.fade-enter-active, &.fade-leave-active
      transition transform .3s linear // 线性移动
      transform: translate3d(0,0,0);
    &.fade-enter, &.fade-leave-to // 开始和结束时的位置
      transform translate3d(100%, 0, 0);
    .image-header // 解决图片还未加载时的高度抖动问题
      position relative
      width 100%
      height 0
      padding-top 100% // 此时容器高度为width
      img
        position absolute
        left 0
        top 0
        width 100%
        height 100%
      .back
        position absolute
        top 10px
        left 0
        .icon-arrow_lift
          display block
          font-size 20px
          padding 10px
          color #fff
    .content
      position relative
      padding 18px
      .title
        font-size 14px
        font-weight 700
        color rgb(7, 17, 27)
        line-height 14px
      .detail
        margin-top 8px
        font-size 10px
        line-height 10px
        color rgb(147,153,159)
        .sell-count
          margin-right 12px
      .price
        margin 18px 0px
        .now-price
          font-size 14px
          font-weight normal/700
          color rgb(240,20,20)
          line-height 24px
        .old-price
          font-size 10px
          font-weight normal/700
          color rgb(147,153,159)
          line-height 24px
      .cartcontrol-wrapper
        position absolute
        right 12px
        bottom 12px
      .buy
        position absolute
        right 18px
        bottom 18px
        width 62px
        height 18px
        border-radius 12px
        background rgb(0,160,220)
        padding  6px 12px
        font-size 10px
        color rgb(255,255,255)
        line-height 18px
        text-align center
        &.btn-fade-enter-active, &.btn-fade-leave-active
          transition opacity .5s
        &.btn-fade-enter, &.btn-fade-leave-to
          opacity 0
  .info
    padding 18px
    .title
      line-height: 14px
      margin-bottom: 6px
      font-size: 14px
      color: rgb(7, 17, 27)
    .text
      font-size 12px
      font-weight 200
      color rgb(77,85,93)
      line-height 24px
      padding 0px 8px
  .rating
    padding 18px
    .title
      line-height: 14px
      margin-bottom: 6px
      font-size: 14px
      color: rgb(7, 17, 27)
</style>
