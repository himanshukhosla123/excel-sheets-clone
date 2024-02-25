<template>
    <div 
        :class="isOpened ? 'bottom-open' : 'bottom-close'"
        @click="isOpened = !isOpened"
        class="bg-grey-100 h-screen fixed smooth cursor-pointer md:cursor-auto left-0 w-full bg-white md:static  p-4 px-5 md:p-5 md:h-screen border-solid border-left border-grey">
        <div class="flex flex-row-reverse items-center justify-end md:block">
            <p class="text-2xl -mb-2 text-black block ml-auto sm:hidden">^</p>
            <h2 class="text-lg text-black md:mb-5">File Info</h2>
            <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Microsoft_Excel_2013-2019_logo.svg/2170px-Microsoft_Excel_2013-2019_logo.svg.png" 
                class="w-8 mr-4 md:w-16 object-contain"
                width="60"
            />
        </div>
        <hr class="mt-4"/>
        <template v-if="activeFile">
            <div class="mb-5 mt-4">
                <p class="text-m text-black mb-1">Name</p>
                <p class="text-sm text-grey-900">{{activeFile.originalname}}</p>
            </div>

            <div class="">
                <p class="text-m text-black mb-1">Size</p>
                <p class="text-m text-grey-900">{{getFormattedSize(activeFile.size)}}</p>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    name: 'ExcelInfoSection',

    props:{
        activeFile: {
            type:Object,
            default: null
        }
    },

    data(){
        return {
            isOpened: false,
        }
    },

    methods:{
        getFormattedSize(bytes){
            if (!bytes) return '';

            const bytesToKb = bytes/1024;
            const bytesToMb = bytesToKb/1024;

            const isKb = bytesToMb < 1;

            return parseFloat(isKb ? bytesToKb: bytesToMb).toFixed(2) + (isKb?' Kb':' Mb');        
        }
    }
}
</script>

<style>
.bottom-close{
    bottom: calc(-100vh + 65px);
}
.bottom-open{
    bottom: -50vh;
}
.smooth{
    transition: all  300ms ease;
}
</style>