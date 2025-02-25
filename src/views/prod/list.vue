<script lang="ts" setup>
import { useUserStore } from '@/pinia/user';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);

// 现在可以使用 userInfo 了
console.log('当前用户:', userInfo.value);
</script> 