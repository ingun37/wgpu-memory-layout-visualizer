<script setup lang="ts">
import { ref } from "vue";
import { WgslReflect, type StructInfo } from "wgsl_reflect";
import MemoryLayout from "./MemoryLayout.vue";

const wgslCode = ref(`struct MyStruct {
    a: f32,
    b: vec3<f32>,
    c: i32,
};`);

const structs = ref<StructInfo[]>([]);

function compile() {
  const reflect = new WgslReflect(wgslCode.value);
  structs.value = reflect.structs;
  console.log(reflect);
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-textarea
          v-model="wgslCode"
          label="WGSL Shader Code"
          rows="10"
          variant="outlined"
          font-family="monospace"
        ></v-textarea>
        <v-btn color="primary" @click="compile">Compile</v-btn>
      </v-col>
    </v-row>

    <v-row v-if="structs.length > 0">
      <v-col cols="12">
        <h2 class="text-h5 mb-4">Memory Layout</h2>
        <MemoryLayout
          v-for="struct in structs"
          :key="struct.name"
          :struct="struct"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped></style>
