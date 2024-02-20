<template>
    <div 
      v-if="source.key != '_id' && source.key != 'fileId'"
      style="border-width:1px"
      class="flex flex-row item-center border-gray border-solid bg-white">
      <div class="text-gray-600 break-words px-3 py-2 w-4/12" style="border-right: 1px solid #ccc">{{source.key}}</div>
      <div class="break-words px-3 py-2 min-h-4 text-black w-8/12 word-break">{{ source.value }}</div>
    </div>
  </template>
  
  <script>
  export default {
      name: 'item-row-info',

      props: {
        index: { // index of current item
          type: Number
        },
        source: { // here is: {uid: 'unique_1', text: 'abc'}
          type: Object,
          default () {
            return {}
          }
        }
      },
  }
  </script>

  <style>
  
  .word-break{
    word-break: break-word;
  }
  </style>
  