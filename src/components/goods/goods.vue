<template>
    <div class="goods">
      <div class="menu-wrapper">
        <ul class="menu">
          <!--QQ游览器不兼容-->
          <li v-for="(item, index) in goods" class="menu-item" :key="index" :class="{current:currentIndex===index}" @click="clickMenuItem(index)">
            <span class="text border-1px">
              <span class="icon" v-show="item.type>0" :class="mapClass[item.type]"></span>{{item.name}}
            </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper">
        <ul ref="foodsUl">
          <li v-for="(item, index) in goods" class="food-list-hook" :key="index">
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <li v-for="(food, index2) in item.foods" class="food-item border-1px" :key="index2" @click="showFood(food)">
                <div class="icon">
                  <img width="57" height="57" :src="food.icon"/>
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="sell-count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span>￥{{food.price}}</span>
                    <span v-show="food.oldPrice" class="old-price">￥{{food.oldPrice}}</span>
                  </div>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <shopcart/>
      <food :food="food" ref="food"></food>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import cartcontrol from '../cartcontrol/cartcontrol'
import shopcart from '../shopcart/shapcart'
import food from '../food/food'
import BScroll from 'better-scroll'
// 滚动

export default {
  data () {
    return {
      scrollY: 0, // 右侧滑动的Y轴坐标 (滑动过程时实时变化)
      tops: [], // 所有右侧分类li的top组成的数组  (列表第一次显示后就不再变化)
      food: {} // 需要显示的food
    }
  },
  computed: {
    ...mapState(['goods']),
    // 计算得到当前分类的下标
    currentIndex () { // 初始和相关数据发生了变化时执行
      // 得到条件数据
      const {scrollY, tops} = this
      // 根据条件计算产生一个结果
      const index = tops.findIndex((top, index) => {
        // scrollY>=当前top && scrollY<下一个top
        return scrollY >= top && scrollY < tops[index + 1]
      })
      return index
    }
  },
  mounted () {
    this.mapClass = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    this.$store.dispatch('getShopGoods', () => { // 数据更新后执行
      this.$nextTick(() => { // 列表数据更新显示后执行
        this._initScroll()
        this._initTops()
      })
    })
  },
  methods: {
    // 初始化滚动条
    _initScroll () {
      // 列表显示之后创建
      new BScroll('.menu-wrapper', {
        click: true
      })
      // http://ustbhuangyi.github.io/better-scroll/doc/events.html#scroll
      this.foodsScroll = new BScroll('.foods-wrapper', {
        probeType: 2, // 因为惯性滑动不会触发
        click: true
      })
      // 给右侧列表绑定scroll监听
      this.foodsScroll.on('scroll', ({x, y}) => {
        console.log(x, y)
        this.scrollY = Math.abs(y)
      })
      // 给右侧列表绑定scroll结束的监听
      this.foodsScroll.on('scrollEnd', ({x, y}) => {
        console.log('scrollEnd', x, y)
        this.scrollY = Math.abs(y)
      })
    },
    // 初始化tops
    _initTops () {
      // 1. 初始化tops
      const tops = []
      let top = 0
      tops.push(top)
      // 2. 收集
      // 找到所有分类的li
      const lis = this.$refs.foodsUl.getElementsByClassName('food-list-hook')
      // 将伪数组转为真数组
      Array.prototype.slice.call(lis).forEach(li => {
        top += li.clientHeight
        tops.push(top)
      })

      // 3. 更新数据
      this.tops = tops
    },
    clickMenuItem (index) {
      // 使用右侧列表滑动到对应的位置

      // 得到目标位置的scrollY
      const scrollY = this.tops[index]
      // 立即更新scrollY(让点击的分类项成为当前分类)
      this.scrollY = scrollY
      // 平滑滑动右侧列表
      this.foodsScroll.scrollTo(0, -scrollY, 300)
    },
    // 显示点击的food
    showFood (food) {
      // 设置food
      this.food = food
      // 显示food组件 (在父组件中调用子组件对象的方法)
      this.$refs.food.toggleShow()
    }
  },
  components: {
    cartcontrol,
    shopcart,
    food
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'
  .goods
    display flex // 设置bottom top 就能决定其高度
    position absolute
    top 174px
    bottom 48px
    width 100%
    overflow hidden
    .menu-wrapper
      flex 0 0 80px // 均分空间 缩放 所占宽度， 固定死px 不会随手机变化
      width 80px
      background #f3f5f7
      .menu-item
        display table
        height 54px
        width 56px
        line-height 14px
        padding 0 12px
        color rgb(240,20,20)
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          color: $green
          font-weight: 700
          .text
            border-none()
        .text
          display: table-cell
          width: 56px
          vertical-align: middle // table-cell 垂直居中
          border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
          .icon
            display: inline-block
            vertical-align: top
            width: 12px
            height: 12px
            margin-right: 2px
            background-size: 12px 12px
            background-repeat: no-repeat
            &.decrease
              bg-image('decrease_3')
            &.discount
              bg-image('discount_3')
            &.guarantee
              bg-image('guarantee_3')
            &.invoice
              bg-image('invoice_3')
            &.special
              bg-image('special_3')
    .foods-wrapper
      flex 1 // 除了menu的80px 剩下的全是它的宽度
      .title
        height 26px
        font-size 12px
        background #f3f5f7
        color rgb(147,153,159)
        line-height 26px
        padding-left 14px
        border-left 2px solid #d9dde1
      .food-item
        display flex
        padding 18px
        border-1px(rgba(7,17,27,0.1))
        &:last-child
          border-none()
          margin-bottom 0
        .icon
          flex 0 0 57px
          margin-right 10px
        .content
          flex 1
          .name
            margin 2px 0px 8px 0px
            font-size 14px
            color rgb(7,17,27)
            line-height 14px
          .desc
            font-size 10px
            color rgb(147,153,159)
            line-height 10px
            margin-bottom 8px
          .extra
            font-size 10px
            color rgb(147,153,159)
            line-height 10px
            margin-bottom 8px
            .sell-count
              margin-right 12px
          .price
            font-size 14px
            font-weight normal/700
            color red
            line-height 14px
            .old-price
              font-size 10px
              font-weight normal/700
              color rgb(147,153,159)
              line-height 14px
              text-decoration line-through // 贯穿线
      .cartcontrol-wrapper
        position: absolute
        right: 18px
        bottom: 12px
</style>
