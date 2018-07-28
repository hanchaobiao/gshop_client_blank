<template>
  <div class="shopcart">
    <div class="content">
      <div class="content-left" @click="toggleShow">
        <div class="logo-wrapper">
          <div class="logo" :class="{highlight: totalCount}">
            <i class="iconfont icon-shopping_cart" :class="{highlight: totalCount}"></i>
          </div>
          <div class="num" v-show="totalCount">{{totalCount}}</div>
        </div>
        <div class="price" :class="{highlight: totalCount}">￥{{totalPrice}}</div>
        <div class="desc">另需配送费￥{{seller.deliveryPrice}}元</div>
      </div>
      <div class="content-right">
        <div class="pay" :class="payClass">
          {{payText}}
        </div>
      </div>
    </div>
    <div class="ball-container">
      <div transition="drop" v-for="(ball, index) in balls" v-show="ball.show" :key="index" class="ball">
        <div class="inner inner-hook"></div>
      </div>
    </div>
    <transition name="move">
      <div class="shopcart-list" v-show="listShow">
      <div class="list-header">
        <h1 class="title">购物车</h1>
        <span class="empty" @click="clearCart">清空</span>
      </div>
      <div class="list-content">
        <ul>
          <li class="food" v-for="(food, index) in cartFoods" :key="index">
            <span class="name">{{food.name}}</span>
            <div class="price"><span>￥{{food.price}}</span></div>
            <div class="cartcontrol-wrapper">
              <cartcontrol :food="food"/>
            </div>
          </li>
        </ul>
      </div>
    </div>
    </transition>
    <!--弹层幕布 -->
    <transition name="mask">
      <div class="list-mask" v-show="listShow" @click="toggleShow"></div>
    </transition>
  </div>
</template>
<script>
import {mapState, mapGetters} from 'vuex'
import BScroll from 'better-scroll'
import {MessageBox} from 'mint-ui'
// TODO 必须引入样式
import 'mint-ui/lib/message-box/style.css'
import cartcontrol from '../../components/cartcontrol/cartcontrol'

export default {
  data () {
    return {
      isShow: false,
      balls: [
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        }
      ],
      dropBalls: [],
      fold: true
    }
  },
  computed: {
    ...mapState(['seller', 'cartFoods']),
    ...mapGetters(['totalCount', 'totalPrice']),
    // 计算商品价格是否大于起送价格
    payClass () {
      const {minPrice} = this.seller
      return this.totalPrice >= minPrice ? 'enough' : 'not-enough'
    },
    // 一些情况下购物车列表也应该关闭
    listShow () {
      // 如果总数量为0, 直接不显示
      if (this.totalCount === 0) {
        this.isShow = false
        return false
      }

      if (this.isShow) {
        // 注册滚动 $nextTick 是在下次 DOM 更新循环结束之后执行延迟回调，在修改数据之后使用 $nextTick，
        // 则可以在回调中获取更新后的 DOM，保证列表数据填充完毕再注册滚动
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll('.list-content', {
              click: true
            })
          } else {
            this.scroll.refresh() // 让滚动条刷新一下: 重新统计内容的高度
          }
        })
      }
      return this.isShow
    },
    // 计算还差多少可以配送
    payText () {
      const {minPrice} = this.seller
      const {totalPrice} = this
      if (totalPrice === 0) {
        return `￥${minPrice}起送`
      } else if (totalPrice < minPrice) {
        return `还差￥${minPrice - totalPrice}元起送`
      } else {
        return '结算'
      }
    }
  },
  methods: {
    toggleShow () {
      // 只有当总数量大于0时切换
      if (this.totalCount > 0) {
        this.isShow = !this.isShow
      }
    },
    // 清空购物车
    clearCart () {
      MessageBox.confirm('确定清空购物车吗?').then(action => {
        this.$store.dispatch('clearCart')
      }, () => {})
    },
    drop (el) {
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i]
        if (!ball.show) {
          ball.show = true
          ball.el = el
          this.dropBalls.push(ball)
          return
        }
      }
    }
  },
  transitions: {
    drop: {
      beforeEnter (el) {
        let count = this.balls.length
        while (count--) {
          let ball = this.balls[count]
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect()
            let x = rect.left - 32
            let y = -(window.innerHeight - rect.top - 22)
            el.style.display = ''
            el.style.webkitTransform = `translate3d(0,${y}px,0)`
            el.style.transform = `translate3d(0,${y}px,0)`
            let inner = el.getElementsByClassName('inner-hook')[0]
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`
            inner.style.transform = `translate3d(${x}px,0,0)`
          }
        }
      },
      enter (el) {
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)'
          el.style.transform = 'translate3d(0,0,0)'
          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = 'translate3d(0,0,0)'
          inner.style.transform = 'translate3d(0,0,0)'
        })
      },
      afterEnter (el) {
        let ball = this.dropBalls.shift()
        if (ball) {
          ball.show = false
          el.style.display = 'none'
        }
      }
    }
  },
  components: {
    cartcontrol
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin.styl"
  .shopcart
    position fixed
    left 0
    bottom 0
    z-index 50
    width 100%
    height 48px
    .content
      display flex
      position relative
      background #141d27
      font-size 0
      color rgba(255, 255, 255, 0.4)
      z-index 100
      .content-left
        flex 1
        .logo-wrapper
          position relative
          display inline-block
          width 44px
          height 44px
          vertical-align top
          padding 6px
          top -10px
          margin 0 12px
          border-radius 50%
          background #141d27
          .logo
            width 100%
            height 100%
            border-radius 50%
            background #2b343c;
            vertical-align top
            text-align center
            &.highlight
              background #02a774
            .icon-shopping_cart
              line-height 44px
              font-size 24px
              color #80858a
              &.highlight
                color #fff
          .num
            position absolute
            width 24px
            height 16px
            margin-right 0
            top 0
            right 0
            text-align center
            line-height 16px
            border-radius 16px
            font-size 9px
            font-weight 700
            color #ffffff
            background rgb(240, 20, 20)
            box-shadow 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        .price
          display inline-block
          vertical-align top
          margin-top 5px
          line-height 24px
          padding-right 12px
          box-sizing border-box
          font-size 16px
          font-weight 700
          color #fff
          &.highlight
            color #fff
        .desc
          display inline-block
          font-size 10px
          vertical-align bottom
          margin-bottom: 15px
          margin-left -45px
      .content-right
        flex 0 0 105px
        width 105px
        background rgb(43, 51, 59)
        .pay
          font-size 12px
          font-weight 700
          color #fff
          height 48px
          line-height 48px
          text-align center
          &.not-enough
            background #2b333b
          &.enough
            background #00b43c
            color #fff
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        &.drop-transition
          transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
          .inner
            width: 16px
            height: 16px
            border-radius: 50%
            background: rgb(0, 160, 220)
            transition: all 0.4s linear
    .shopcart-list
      position absolute
      width 100%
      left 0
      top 0
      z-index 50
      background #7e8c8d
      transform translateY(-100%)
      &.move-enter-active, &.move-leave-active
        transition transform .3s
      &.move-enter, &.move-leave-to
        // 隐藏时样式
        transform translateY(0)
      .list-header
        height 40px
        line-height 40px
        padding 0 18px
        background #f3f5f7
        border-bottom 1px solid rgba(7,17,27,0.1)
        .title
          float left
          display inline-block
          font-size 14px
          color rgb(7, 17, 27)
        .empty
          float right
          font-size 12px
          color rgb(0, 160, 220)
      .list-content
        max-height 217px
        padding 0 18px
        overflow hidden
        background #fff
        .food
          position relative
          height 48px
          box-sizing border-box
          border-1px(rgba(7, 17, 27, 0.1))
          .name
            display inline-block
            font-size: 14px
            color: #07111b
            height 100%
            line-height 48px
          .price
            position absolute
            display inline-block
            line-height 48px
            right 90px
            font-size 14px
            font-weight 700
            color rgb(240, 20, 20)
          .cartcontrol-wrapper
            position absolute
            right 0px
            top 6px

    .list-mask
      position fixed
      top 0
      left 0
      // bottom 48px
      width 100%
      height 100%
      // z-index -1
      background rgba(7,17,27,0.6)
      &.mask-enter-active, &.mask-leave-active
        transition opacity .3s
      &.mask-enter, &.mask-leave-to
        opacity 0

</style>
