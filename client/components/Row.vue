<template>
  <div>
    <template v-if="index == 0">
      <div 
        class="border-bm flex flex-row item-center cursor-pointer border-gray border-solid bg-white">
        <div class="text-gray px-1 py-2 text-center" style="min-width:47px;border-right: 1px solid #ccc">S.No</div>
        <div class="break-words px-3 py-2 min-h-4 text-black font-bold">{{ firstkey }}</div>
      </div>
    </template>
    <div 
      @click="()=>onSelect(source)"
      class="border-bm flex flex-row item-center cursor-pointer border-gray border-solid bg-white">
      <div class="text-gray px-3 py-2 text-center" style="min-width:47px;border-right: 1px solid #ccc">{{index+1}}</div>
      <div @click="()=>onSelect(source)" class="break-words px-3 py-2 min-h-4 text-black word-break">{{ source[firstkey] }}</div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'item-row',
    created() {
      const keys = Object.keys(this.source);
      if (keys.includes('_id')) keys.splice(keys.indexOf('_id'),1);
      this.firstkey = keys[0];
    },
    props: {
      onSelect:{
        type: Function,
        default: ()=>{}
      },
      index: { // index of current item
        type: Number
      },
      source: { // here is: {uid: 'unique_1', text: 'abc'}
        type: Object,
        default () {
          return {}
        }
      }
    }
}
</script>

<style>
.word-break{
  word-break: break-word;
}
.border-bm{
  border-bottom-width:1px
}
</style>
