<template>
  <div class="tab-control">
    <div v-for="(item,index) in titles" :key="index" class="tab-control-item" @click="itemClick(index)">
      <span>{{item}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabControl',
  props: {
    titles: {
      type:Array,
      default(){
        return []
      }
    }
  },
  data () {
    return {
      currentIndex: 0
    }
  },
  methods: {
    itemClick(index){
      this.$emit('tabClick',index)
    }
  }
}
</script>

<style>
  .tab-control {
    display: flex;
    text-align: center;
    font-size: 15px;
    height: 40px;
    line-height: 44px;
  }
  .tab-control-item {
    flex: 1;

  }
  .tab-control-item span:hover {
    color: #ff5777;
    border-bottom: 2px solid #ff5777;
    padding: 0 2px 5px 2px;
  }
</style>