<template>
  <userlist/>
</template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import useGlobalConfig from '@/composables/useGlobalConfig';
  import { useRouter } from 'vue-router';
  import MapView from '@/components/MapView.vue';
  import userlist from '@/components/userlist.vue';

  
  </script>
  
  <style scoped>

  </style>
  