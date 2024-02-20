<template>
    <div class="bg-grey-100 p-5 h-screen border-solid border-left border-grey">
        <h2 class="text-lg text-black mb-5">File Info</h2>
        <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Microsoft_Excel_2013-2019_logo.svg/2170px-Microsoft_Excel_2013-2019_logo.svg.png" 
            class="max-w-[60px] object-contain"
            width="60"
        />
        <hr class="mt-4"/>
        <template v-if="activeFile">
            <div class="mb-5 mt-4">
                <p class="text-m text-black mb-1">Name</p>
                <p class="text-sm text-grey-900">{{activeFile.originalname}}</p>
            </div>

            <div class="mb-5">
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