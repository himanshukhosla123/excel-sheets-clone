<template>
  <div class="h-screen bg-gray-100 flex flex-col justify-center items-center ">
      <!-- Phone -->
      <main class="relative overflow-hidden w-96 h-[640px] rounded-2xl bg-black shadow-lg shadow-black/40 p-2 text-white">
        <!-- Screen -->
        <div class="relative  w-full h-full bg-white rounded-lg flex flex-col">

          <!-- Content Section -->
          <main 
            style="min-height: 480px;"
            class="mt-5 relative mb-14 flex flex-col bg-gray-800 h-full w-full pt-3 w-full text-sm gap-2 text-gray-400 gap-3">
            <!-- Searchbar -->
            <div class="flex flex-row justify-center px-2">
              <input v-model="searchQuery" @input="onSearch" type="text" class="rounded-md w-full pl-2 py-1 border border-gray-600 bg-white" placeholder="Search here"></input>
            </div>
 
            <virtual-list 
              style="max-height: 420px; overflow-y: auto;"
              :data-key="'_id'"
              :data-sources="items"
              :data-component="itemRowComponent"
              :bottom-threshold="200"
              v-on:tobottom="()=>onScrollToBottom()"
              :extra-props="extraProps"
              ref="viruallist"
              >
                <div v-if="isLoading || !dataPagination || dataPagination.total_page > dataPagination.current_page" slot="footer" class="round-loader"></div>
              </virtual-list>

            <p v-if="searchQuery && noResultsFound && !isLoading" class="px-3 text-m font-bold">No results found for "{{searchQuery}}"</p>

          </main>

          <!-- Fixed Bottom Navbar -->
          <nav 
            style="box-shadow: 0 2px 6px -2px rgb(0 106 194 / 20%)"
            class="absolute fixed bottom-0 left-0 w-full h-15 rounded-b-lg flex flex-row justify-between items-center text-gray-400 border-t bg-gray-800">
            <template v-for="(file,index) in files">
              <button :class="`flex-1 overflow-hidden flex flex-col p-2 text-black border border-gray border-solid ${index == activeFileIndex ? ' bg-white' : 'bg-gray-200'}`" 
                :key="file._id" @click="()=>selectFile(file, index)">
                <p class="text- break-words">File {{index+1}}</p>
                <p class="w-full text-left text-xs break-words text-ellipsis overflow-hidden whitespace-nowrap max-h-4">{{file.originalname}}</p>
              </button>
            </template>
          </nav>


          <div class="absolute w-full h-full overflow-auto bg-white top-0 py-5 left-0 z-4" :style="`transition-duration: 400ms; ${!activeRowData ? 'transform: translateX(110%)':''}`">
              <button @click="activeRowData = null" class="p-4 w-full bg-gray-800 text-white text-left">🔙 Go Back</button>
              <hr class="mb-4"/>
              <h3 class="text-lg text-black pl-5">Detailed data view</h3>
              <div v-if="activeRowData" class="p-5">
                <template v-for="key in Object.keys(activeRowData)">
                  <ItemInfoRow :key="key" :source="{ key: key, value:activeRowData[key] }"/>
                </template>
              </div>
            </div>

        </div>
        
        <!-- Punch hole Camera -->
        <div class="absolute fixed top-3 left-0 w-full z-10">
          <div class="bg-black mx-auto h-3 w-3 rounded-full"></div>
        </div>

        <!-- Screen end -->
      </main>
    </div>
</template>

<script>
import VirtualList from 'vue-virtual-scroll-list';
/* eslint-disable vue/no-unused-components */
import itemRowComponent from './Row';
import ItemInfoRow from './RowWithInfo';
import {GET_SHEET_DATA} from '~/constants/apiPath';
import {debounceTime} from '~/utils';


export default {
  name: 'ExcelView',

  components: {
    'virtual-list': VirtualList,
    ItemInfoRow
  },

  props:{
    files:{
      type:Array,
      default:() => []
    },
    activeFileIndex:{
      type: Number,
      default:0
    }
  },

  data() {
    return {
      items: [],
      isLoading:false,
      dataPagination:null,
      noResultsFound: false,
      itemRowComponent,
      searchQuery: '',
      activeRowData: null
    };
  },

  created(){
    this.fileContentMap = {};
    this.abortController = null;
    this.extraProps = { onSelect: this.onRowSelect };
  },

  mounted(){
    this.fetchSheetData();
  },

  methods:{
    fetchSheetData(reset = false, onFileTabChange = false) {
      const { files, activeFileIndex, searchQuery } = this;

      if (!(files && files.length)) return;
      const currentFile = files[activeFileIndex];

      if (!currentFile) return;

      if (reset) {
        this.isLoading = true;
        this.noResultsFound = false;
        // this.searchQuery = '';
        this.items = [];
        this.dataPagination = null;
        // if (!searchQuery) delete this.fileContentMap[currentFile.filename]; 
      }

      // prefill from cache
      if (!searchQuery && onFileTabChange && this.fileContentMap[currentFile.filename]?.data) {
        console.log('prefill from cache');
        const record = this.fileContentMap[currentFile.filename];
        this.items = record.data;
        this.dataPagination = record.pagination;
      } 

      let url = GET_SHEET_DATA+`?fileId=${currentFile.filename}`;

      if (this.dataPagination) {
        if (this.dataPagination.total_page > this.dataPagination.current_page) {
          url += `&page=${this.dataPagination.current_page + 1}`;
        }
        else return;
      }

      if (searchQuery){
        url += `&query=${searchQuery}`
      }

      if (this.abortController) this.abortController?.abort();

      const controller = new AbortController();
      this.abortController = controller;
      const signal = controller.signal;
      
      return fetch(url,{ signal })
      .then(res=>res.json())
      .then(res=>{
        console.log(res);
        const { data, pagination } = res;
        if (Array.isArray(data) && data.length) {
          this.items = [...this.items , ...data];
          this.dataPagination = pagination;

          const record = this.fileContentMap[currentFile.filename];

          if (!searchQuery) {
            if (!record) {
              this.fileContentMap[currentFile.filename] = {
                data,
                pagination
              }
            }
            else {
              if (record.data) record.data = [...record.data, ...data];
              if (record.pagination) record.pagination = pagination;
             
              this.fileContentMap[currentFile.filename] = record;
            }
          }

          // const listRef = this.$refs.viruallist;
          // if (pagination && pagination.current_page ) {
            // if ( listRef && listRef.getOffset) {
            //   listRef.scrollToOffset(listRef.getOffset() + 1);
            // }
          // }
          // console.log(data, pagination, this.fileContentMap);
        }
        else {
          this.noResultsFound = true;
          throw new Error('No Data Found');
        }
      })
      .catch(err=>{
        console.error(err);
      })
      .finally(()=>{
        this.isLoading = false;
      })
    },
    selectFile(file, index){
      this.$emit('onFileChange', index);
    },
    onScrollToBottom(){
      console.log('at bottom');

      const {dataPagination} = this;
    
      if (!dataPagination || dataPagination.total_page === dataPagination.current_page) {
        console.warn('reached section end');
        return; 
      }

      if (this.isLoading) return;
  
      this.isLoading = true;
      this.fetchSheetData();
    },

    onSearch:debounceTime(function(){
      this.fetchSheetData(true, false);
    }, 100),

    onRowSelect(rowData){
      console.log('on row select', rowData);
      this.activeRowData = rowData;
    }
  },

  watch:{
    files(){
      this.fetchSheetData();
    },
    activeFileIndex() {
      this.searchQuery = '';
      this.fetchSheetData(true, true);
    }
  }
}
</script>
