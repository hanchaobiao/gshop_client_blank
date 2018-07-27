<template>
    <div class="header">
      <div class="content-wrapper">
        <div class="avatar">
          <img width="64" height="64" :src="seller.avatar">
        </div>
        <div class="content">
          <div class="title">
            <span class="brand"></span>
            <span class="name">{{seller.name}}</span>
          </div>
          <div class="description">
            {{seller.description}}/{{seller.deliveryTime}}分钟送达
          </div>
          <div v-if="seller.supports" class="supports">
            <span class="icon" :class="mapClass[seller.supports[0].type]"></span>
            <span class="text">{{seller.supports[0].description}}</span>
          </div>
          <div v-if="seller.supports" class="supports-count" @click="showDetail">
            <span class="count">{{seller.supports.length}}个</span>
            <i class="icon-keyboard_arrow_right"></i>
          </div>
        </div>
      </div>
      <div class="bulletin-wrapper" @click="showDetail">
        <span class="bulletin-title"></span>
        <span class="bulletin-text">{{seller.bulletin}}</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
      <div class="background">
        <img :src="seller.avatar" width="100%" height="100%">
      </div>
      <transition name="fade">
        <div v-show="detailShow" class="detail">
          <div class="detail-wrapper clearfix">
            <div class="detail-main">
              <h1 class="name">{{seller.name}}</h1>
              <div class="star-wrapper">
                <star :size="48" :score="seller.score"/>
              </div>
              <!-- flex布局实现自适应横线 -->
              <div class="title">
                <div class="line"></div>
                <div class="text">优惠信息</div>
                <div class="line"></div>
              </div>
              <ul v-if="seller.supports" class="supports">
                <li v-for="(support, index) in seller.supports" :key="index" class="support-item">
                  <span class="icon" :class="mapClass[support.type]"></span>
                  <span class="text">{{support.description}}</span>
                </li>
              </ul>
              <div class="title">
                <div class="line"></div>
                <div class="text">商家公告</div>
                <div class="line"></div>
              </div>
              <div class="bulletin">
                <p class="content">{{seller.bulletin}}</p>
              </div>
            </div>
          </div>
          <div class="detail-close">
            <i class="icon-close" @click="closeDetail"></i>
          </div>
        </div>
      </transition>
    </div>
</template>
<script>
import {mapState} from 'vuex'
import star from '../../components/star/star'
export default {
  data () {
    return {
      detailShow: false
    }
  },
  computed: {
    ...mapState(['seller'])
  },
  methods: {
    showDetail () {
      this.detailShow = true
    },
    closeDetail () {
      this.detailShow = false
    }
  },
  mounted () {
    this.mapClass = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  },
  components: {
    star
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin'
  .header
    position: relative
    overflow: hidden // 隐藏滤镜产生的阴影
    color: #fff
    background: rgba(7, 17, 27, 0.5) // 背景颜色半透明
    .content-wrapper
      position relative
      padding 24px 12px 18px 24px
      font-size 0px // 消除字符与图片间隔
      .avatar
        display inline-block
        vertical-align top // vertical-align垂直对齐方式
        img
          border-radius 2px
      .content
        display inline-block
        /*background red*/
        margin-left 16px
        font-size 10px
        .title
          margin 2px 0 8px 0
          .brand
            display inline-block
            vertical-align top
            width 30px
            height 18px
            bg-image('brand')
            background-size 30px 18px
            background-repeat no-repeat
          .name
            margin-left 6px
            font-size 16px
            color rgb(255,255,255)
            font-weight bold
            line-height 18px
        .description
          margin-bottom 10px
          font-size 12px
        .supports
          .icon
            display inline-block
            vertical-align top
            width 12px
            height 12px
            margin-right 4px
            background-size 12px 12px
            background-repeat no-repeat
            &.decrease
              bg-image('decrease_1')
            &.discount
              bg-image('discount_1')
            &.guarantee
              bg-image('guarantee_1')
            &.invoice
              bg-image('invoice_1')
            &.special
              bg-image('special_1')
          .text
            font-size 10px
            line-height 14px
        .supports-count
          position absolute
          bottom 18px
          right 12px
          padding 0 8px
          height 24px
          border-radius 14px
          background-color  rgba(0,0,0, 0.2)
          text-align center
          .count
            vertical-align center
            font-size 10px
          i
            margin-left 2px
            line-height 24px
    .bulletin-wrapper
      position relative
      height 28px
      padding 0 22px 0 12px
      background-color rgba(7,17,27,0.2)
      // 实现超出部分用...替代
      white-space nowrap
      overflow hidden
      text-overflow ellipsis
      .bulletin-title
        display inline-block
        vertical-align top
        margin 8px 4px 0 12px
        width 22px
        height 12px
        bg-image('bulletin')
        background-size 22px 12px
        background-repeat no-repeat
      .bulletin-text
        /*height 28px*/
        /*vertical-align top*/
        font-size 10px
        line-height 30px
      .icon-keyboard_arrow_right
        position: absolute
        font-size: 10px
        right: 12px
        /*z-index 10*/
        top: 10px
    .background
      position absolute
      top 0
      left 0
      height 100%
      width 100%
      z-index -1
      filter blur(10px) // 滤镜 背景模糊处理
    .detail
      position fixed
      z-index: 100
      top 0
      left 0
      width 100%
      height 100%
      overflow auto
      backdrop-filter blur(10) // 背景颜色模糊 ios支撑
      opacity: 1
      background rgba(7,17,27,0.8)
      &.fade-enter-active,&.fade-leave-active
        transition: all .5s;
      &.fade-enter, &.fade-leave-to /* .fade-leave-active below version 2.1.8 */
        opacity: 0 // 刚进入时的样式， 关闭后最终样式
        background rgba(7,17,27,0)
      .detail-wrapper
        width 100%
        min-height 100%
        .detail-main
          margin-top 64px
          padding-bottom 64px
          .name
            font-size 16px
            line-height 16px
            font-weight 700
            text-align center
          .star-wrapper
            width 100%
            margin-top 16px
            padding 2px 0px
            text-align center
          .title
            // 编译工具会自动添加兼容性代码
            display flex
            width 80%
            margin 28px auto 24px auto
            .line
              position relative
              margin-top 6px
              height 1px
              flex 1
              border-bottom 1px solid rgba(255,255,255,0.2)
            .text
              font-size 14px
              padding 0 12px
              font-weight 700
          .supports
            width 80%
            margin 0 auto
            .support-item
              padding 0 12px
              margin-bottom 12px
              font-size 0
              &:last-child
                margin-bottom 0
              .icon
                display inline-block
                vertical-align top
                width 16px
                height 16px
                margin-right 6px
                background-size 16px 16px
                background-repeat no-repeat
                &.decrease
                  bg-image('decrease_2')
                &.discount
                  bg-image('discount_2')
                &.guarantee
                  bg-image('guarantee_2')
                &.invoice
                  bg-image('invoice_2')
                &.special
                  bg-image('special_2')
              .text
                font-size 12px
                line-height 16px
          .bulletin
            width 80%
            margin 0 auto
            .content
              padding 0 12px
              text-align justify
              font-size 12
              font-weight 200
              line-height 24px
      .detail-close
        position relative
        width 32px
        height 32px
        font-size 32px
        margin -64px auto 0 auto
        clear both

</style>
