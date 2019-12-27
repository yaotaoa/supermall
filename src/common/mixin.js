import {debounce} from './utils'
export const itemListenerMixin = {
  data () {
    return {
      refresh: null
    }
  },
  mounted () {
    this.refresh = debounce(this.$refs.scroll.refresh,200)
    this.itemImgListener = () => { this.refresh() }
    this.$bus.$on('itemImageLoad', this.itemImgListener )
  }
}