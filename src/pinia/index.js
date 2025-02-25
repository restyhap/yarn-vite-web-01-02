import {defineStore} from 'pinia' ;
import {ref} from "vue";

export const useStore = defineStore("store",()=>{
  let storeList = ref()
  let typeList = ref()
  let goodsList = ref()

  let total = ref() ;

  return {storeList , typeList, goodsList , total}
})
