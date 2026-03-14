<script setup lang="ts">
import { computed } from "vue";
import type { StructInfo, MemberInfo } from "wgsl_reflect";

const props = defineProps<{
  struct: StructInfo;
}>();

interface LayoutItem {
  offset: number;
  size: number;
  name: string;
  type: string;
  isPadding: boolean;
}

const layoutItems = computed(() => {
  const items: LayoutItem[] = [];
  let currentOffset = 0;

  for (const member of props.struct.members) {
    if (member.offset > currentOffset) {
      items.push({
        offset: currentOffset,
        size: member.offset - currentOffset,
        name: "padding",
        type: "",
        isPadding: true,
      });
    }
    items.push({
      offset: member.offset,
      size: member.size,
      name: member.name,
      type: member.type.name,
      isPadding: false,
    });
    currentOffset = member.offset + member.size;
  }

  // Check for trailing padding to match struct size (alignment)
  if (props.struct.size > currentOffset) {
    items.push({
      offset: currentOffset,
      size: props.struct.size - currentOffset,
      name: "padding",
      type: "",
      isPadding: true,
    });
  }

  return items;
});

function getMemberColor(item: LayoutItem) {
  if (item.isPadding) return "grey-lighten-2";
  return "blue-lighten-4";
}
</script>

<template>
  <v-card variant="outlined" class="pa-4 mb-4">
    <v-card-title>
      Struct: {{ struct.name }}
      <v-chip size="small" class="ml-2">Size: {{ struct.size }}</v-chip>
      <v-chip size="small" class="ml-2">Align: {{ struct.align }}</v-chip>
    </v-card-title>
    <v-card-text>
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
</style>
