<script setup lang="ts">
import { computed, ref } from "vue";
import type { StructInfo, MemberInfo } from "wgsl_reflect";
import {
  getLayoutItems,
  generateRustStruct,
  type LayoutItem,
} from "../utils/rust_converter";

const props = defineProps<{
  struct: StructInfo;
}>();

const showRustCode = ref(false);

const layoutItems = computed(() => getLayoutItems(props.struct));

const rustCode = computed(() => generateRustStruct(props.struct));

function copyToClipboard() {
  navigator.clipboard.writeText(rustCode.value);
}

function getMemberColor(item: LayoutItem) {
  if (item.isPadding) return "grey-lighten-2";
  return "blue-lighten-4";
}
</script>

<template>
  <v-card variant="outlined" class="pa-4 mb-4">
    <v-card-title class="d-flex align-center">
      Struct: {{ struct.name }}
      <v-chip size="small" class="ml-2">Size: {{ struct.size }}</v-chip>
      <v-chip size="small" class="ml-2">Align: {{ struct.align }}</v-chip>
      <v-spacer></v-spacer>
      <v-btn
        size="small"
        color="primary"
        variant="tonal"
        @click="showRustCode = !showRustCode"
      >
        {{ showRustCode ? "Hide Rust" : "Convert to Rust" }}
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-expand-transition>
        <div v-if="showRustCode" class="mb-4">
          <div class="d-flex justify-space-between align-center mb-1">
            <span class="text-caption">Rust Struct (bytemuck compatible)</span>
            <v-btn size="x-small" variant="text" @click="copyToClipboard">
              Copy
            </v-btn>
          </div>
          <pre
            class="rust-code pa-2 bg-grey-darken-4 text-grey-lighten-3 rounded"
            >{{ rustCode }}</pre
          >
        </div>
      </v-expand-transition>

      <div class="memory-container">
        <div
          v-for="(item, index) in layoutItems"
          :key="index"
          class="memory-item"
          :style="{
            flex: `0 0 ${(item.size / Math.max(struct.size, 1)) * 100}%`,
            backgroundColor: item.isPadding ? '#f5f5f5' : '#e3f2fd',
            border: '1px solid #90caf9',
          }"
        >
          <div class="item-info">
            <div class="item-name text-truncate" :title="item.name">
              {{ item.isPadding ? "" : item.name }}
            </div>
            <div class="item-details text-caption">
              {{ item.size }}B @ {{ item.offset }}
            </div>
          </div>
        </div>
      </div>

      <v-table density="compact" class="mt-4">
        <thead>
          <tr>
            <th>Offset</th>
            <th>Size</th>
            <th>Name</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in layoutItems"
            :key="index"
            :class="{ 'bg-grey-lighten-4': item.isPadding }"
          >
            <td>{{ item.offset }}</td>
            <td>{{ item.size }}</td>
            <td>
              <span v-if="item.isPadding" class="text-grey italic"
                >padding</span
              >
              <span v-else>{{ item.name }}</span>
            </td>
            <td>{{ item.type }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.memory-container {
  display: flex;
  width: 100%;
  height: 60px;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
}

.memory-item {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  min-width: 20px;
}

.item-info {
  text-align: center;
  padding: 2px;
  width: 100%;
}

.item-name {
  font-weight: bold;
  font-size: 0.8rem;
}

.item-details {
  font-size: 0.7rem;
}

.italic {
  font-style: italic;
}

.rust-code {
  font-family: "Fira Code", "Courier New", Courier, monospace;
  font-size: 0.8rem;
  overflow-x: auto;
  white-space: pre-wrap;
}
</style>
