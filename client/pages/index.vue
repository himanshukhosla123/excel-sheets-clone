<template>
  <div class=""> 
    <Dropzone 
      id="foo" v-if="files.length < MAX_NUMBER_OF_SHEETS" 
      class="fixed bottom-4 right-14 p-3 cursor-pointer px-4 w-64 bg-green-800 w-3/12 rounded text-white text-center" ref="el" 
      :options="options" :use-custom-slot="true" 
      :destroy-dropzone="true" 
      @vdropzone-success="onFileUpload"
      @vdropzone-sending="()=>fileUploading=true"
      @vdropzone-error="onUploadError"
      @vdropzone-canceled="onUploadError"
      
    >
      {{fileUploading ? 'Uploading your File...':'Upload new excel'}}
    </Dropzone>
    <Header></Header>
    <div class="flex w-full flex-row items-center pt-14">
      <ExcelView class="w-8/12" :files="files" :active-file-index="activeFileIndex" @onFileChange="onFileChange"/>
      <ExcelInfoSection class="w-4/12" :active-file="files[activeFileIndex]" />
    </div>
  </div>
</template>

<script>
import 'nuxt-dropzone/dropzone.css';
import Dropzone from 'nuxt-dropzone';
import Header from '~/components/Header';
import ExcelView from '~/components/ExcelView';
import ExcelInfoSection from '~/components/ExcelInfoSection';
/* eslint-disable vue/no-unused-components */
import {FILE_UPLOAD, GET_USER_FILES_LIST} from '~/constants/apiPath';
import {MAX_NUMBER_OF_SHEETS} from '~/constants';

export default {
  name: 'MainPage',

  components: {
    ExcelView,
    Header,
    Dropzone,
    ExcelInfoSection
  },

  data(){
    return {
      files:[],
      activeFileIndex:0,
      isLoadingSheets: true,
      fileUploading: false,
    };
  },

  created(){
    this.MAX_NUMBER_OF_SHEETS = MAX_NUMBER_OF_SHEETS;
    this.options = {
      acceptedFiles:".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
      disablePreviews:true,
      // uploadMultiple: false,
      // maxFilesize: {
      //   limit: 50,
      //   message: '{{ filesize }} is greater than the {{ maxFilesize }}'
      // },
      createImageThumbnails:false,
      url: FILE_UPLOAD,
      thumbnailWidth: 200,
      maxFilesize: 51200, // 50 MB
    };
  },

  mounted(){
    this.fetchUserSheets();
  },

  methods:{
    uploadNewFile(){
      const instance = this.$refs.el.dropzone;
      console.log(instance);
    },  
    fetchUserSheets(){
      fetch(GET_USER_FILES_LIST)
      .then(res=>res.json())
      .then(res=>{
        console.log(res);
        const { data } = res;
        if (Array.isArray(data) && data.length) {
          this.files = data;
        }
        else {
          alert('No Data Found! Please upload one valid excel from below button');
          throw new Error('No Data Found');
        }
      })
      .catch(err=>{
        console.error(err);
      })
      .finally(()=>{
        this.isLoadingSheets = false;
      })
    },
    onFileUpload(file, resp){
      console.log(resp);
      if (resp.status === 200){
        this.files = [...this.files, resp.data];
        this.$refs.el?.removeAllFiles();
        this.activeFileIndex = this.files.length-1;
      }
      else alert('Uploading failed');
      this.fileUploading = false;
    },
    onFileChange(index){
      this.activeFileIndex = index;
    },
    onUploadError(){
      this.$refs.el?.removeAllFiles();
      alert('Something went wrong while uploading! Please try later');
      this.fileUploading = false;
    }
  }
}
</script>

<style>
.round-loader {
  border: 0.25rem solid #f4f4f4;
  border-radius: 50%;
  border-top: 0.25rem solid #97A0BE;
  width: 2rem;
  height: 2rem;
  margin: 1.5rem auto 1rem;
  -webkit-animation: spin 1.5s linear infinite;
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
  }
}
</style>
