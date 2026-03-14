<template>
  <v-app>
    <v-app-bar title="WGPU Memory Layout Visualizer"></v-app-bar>
    <v-main>
      <WgslInput />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import WgslInput from "@/components/WgslInput.vue";
</script>
