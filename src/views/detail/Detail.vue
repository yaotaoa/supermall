<template>
<div id="detail">
  <detail-nav-bar class="nav-bar" @titleClick="titleClick" ref="navbar"></detail-nav-bar>
  <scroll class="centent" ref="scroll" @scroll="contentScroll" :probeType="3">
    <detail-swiper :topImages="topImages"></detail-swiper>
    <detail-base-info :goods="goods"></detail-base-info>
    <detail-shop-info :shop="shop"></detail-shop-info>
    <detail-goods-info :detailInfo="detailInfo" @imgLoad="imgLoad"></detail-goods-info>
    <detail-param-info :paramInfo="paramInfo" ref="param"></detail-param-info>
    <detail-comment-info :commentInfo="commentInfo" ref="comment"></detail-comment-info>
    <goods-list :goods="recommends" ref="goods"></goods-list>
  </scroll>

</div> 
</template>

<script>
// 公共组件
import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goods/GoodsList'
// 子组件
import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamInfo from './childComps/DetailParamInfo'
import DetailCommentInfo from './childComps/DetailCommentInfo'

// 方法
import {getDetail,Goods,Shop,GoodsParam,getRecommend} from 'network/detail'
import {itemListenerMixin} from 'common/mixin'
import {debounce} from 'common/utils'
export default {
  name: 'Detail',
  data () {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      itemImgListener: null,
      themeTopYs: [],
      getThemeTopYs: null,
      currentIndex: null
    }
  },
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    GoodsList,
    Scroll
  },
  mixins: [itemListenerMixin],
  created () {
    this.iid = this.$route.params.iid
    getDetail(this.iid).then(res => {
      const data = res.result
      this.topImages = data.itemInfo.topImages
      this.goods = new Goods(data.itemInfo,data.columns, data.shopInfo.services)
      this.shop = new Shop(data.shopInfo)
      this.detailInfo = data.detailInfo
      this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)
      if (data.rate.cRate != 0) {
        this.commentInfo = data.rate.list[0]
      }
    })
    getRecommend().then(res => {
      this.recommends = res.data.list
    })
    this.getThemeTopYs = debounce(() => {
      this.themeTopY = []
      this.themeTopYs.push(0)
      this.themeTopYs.push(this.$refs.param.$el.offsetTop)
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      this.themeTopYs.push(this.$refs.goods.$el.offsetTop)
      this.themeTopYs.push(Number.MAX_VALUE)
    })
  },
  mounted () { 
    
  },
  destroyed () {
    this.$bus.$off('itemImgLoad',this.itemImgListener)
  },
  methods: {
    imgLoad(){
      this.refresh()
      this.getThemeTopYs()
    },
    titleClick(index){
      this.$refs.scroll.scrollTo(0,-(this.themeTopYs[index]) ,200)
    },
    contentScroll(position){
      let positionY = -position.y
      let length = this.themeTopYs.length-1
      for (let i = 0; i < length; i++) {
        if (this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])){
          this.currentIndex = i
          this.$refs.navbar.currentIndex = this.currentIndex
        }
      }
      
    }
  }
}
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 8;
    background-color: #fff;
    height: 100vh;
  }
  .nav-bar {
    position: relative;
    z-index: 8;
    background-color: #fff;
  }
  .centent {
    position: absolute;
    overflow: hidden;
    top: 44px;
    bottom: 49px;
    right: 0;
    left: 0;
  }
</style>