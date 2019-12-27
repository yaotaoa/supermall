<template>
  <div id="home" class="wrapper">
    <nav-bar class="home-nav"><div slot="center">yt的购物街</div></nav-bar>
    <tab-control :titles="['流行','新款','精选']" @tabClick="tabClick" ref="tabControl" class="tab-control" v-show="isTabFixed"></tab-control>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll" :pull-up-load="true" @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control :titles="['流行','新款','精选']" @tabClick="tabClick" ref="tabControl" ></tab-control>
      <goods-list :goods="goods[currentType].list"></goods-list>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
// 公共
import NavBar from 'components/common/navbar/NavBar'
import TabControl from 'components/content/tabcontrol/TabControl'
import GoodsList from 'components/content/goods/GoodsList'
import Scroll from 'components/common/scroll/Scroll'
import BackTop from 'components/content/backTop/BackTop'
// 方法
import {getHomeMultidata,getHomeGoods} from 'network/home'
import {debounce} from 'common/utils'
import {itemListenerMixin} from 'common/mixin'

// 子组件
import HomeSwiper from './childComps/HomeSwiper'
import RecommendView from './childComps/RecommendView'
import FeatureView from './childComps/FeatureView'

export default {
  name: "Home",
  components: {
    NavBar,
    HomeSwiper,
    RecommendView,
    FeatureView,
    TabControl,
    GoodsList,
    Scroll,
    BackTop
  },
  data () {
    return {
      banners: [],
      recommends: [],
      goods: {
        'pop': {page: 0, list: []   },       
        'new': {page: 0, list: []   },
        'sell': {page: 0, list: []  },
      },
      currentType: 'pop',
      isShowBackTop: false,
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0,
      itemImgListener: null
    }
  },
  mixins: [itemListenerMixin],
  created () {
    this.getHomeMultidata()
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')
  },
  mounted () {
   
  }, 
  activated () {
    this.$refs.scroll.scrollTo(0,this.saveY,0)
    this.$refs.scroll.refresh()
  } ,
  deactivated () {
    this.saveY = this.$refs.scroll.getScrollY()
    this.$bus.$off('itemImgLoad',this.itemImgListener)
  },
  methods: {
    /**
     * 网络请求相关方法
     */
    getHomeMultidata(){
      getHomeMultidata().then(res => {
        //console.log(res.data.banner.list)
        this.banners = res.data.banner.list
        this.recommends = res.data.recommend.list
      })
    },
    getHomeGoods(type){
      const page = this.goods[type].page + 1
      getHomeGoods(type,page).then(res => {
        this.goods[type].list.push(...res.data.list)
        this.goods[type].page += 1
        this.$refs.scroll.finishPullUp()
      })
    },
    /**
     * 事件监听相关方法
     */
    tabClick(index){
      switch (index) {
        case 0:
          this.currentType = 'pop'
          break;
        case 1:
          this.currentType = 'new'
          break;
        case 2: 
          this.currentType = 'sell'
          break;
      }
    },
    backClick(){
      this.$refs.scroll.scrollTo(0,0)
    },
    contentScroll(position){
      this.isShowBackTop = (-position.y) > 1000
      this.isTabFixed = (-position.y) > this.tabOffsetTop
    },
    loadMore(){
      this.getHomeGoods(this.currentType)    
    },
    swiperImageLoad(){
      this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop
    }
  },
}
</script>

<style scoped>
  #home {
    height: 100vh;
    position: relative;
  }
  .home-nav {
    background-color: #ff8198;
    color: #fff;
  }
  .content {
    position: absolute;
    overflow: hidden;
    top: 44px;
    bottom: 49px;
    right: 0;
    left: 0;
  }
  .tab-control {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
</style>