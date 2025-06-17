<template>
  <situationlist/>
</template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import useGlobalConfig from '@/composables/useGlobalConfig';
  import { useRouter } from 'vue-router';
  import MapView from '@/components/MapView.vue';
  import situationlist from '@/components/situationlist.vue';

  
  </script>
  
  <style scoped>

  </style>
  