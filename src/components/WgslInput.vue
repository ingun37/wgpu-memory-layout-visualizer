<script setup lang="ts">
import { ref, computed } from "vue";
import { WgslReflect, type StructInfo } from "wgsl_reflect";
import MemoryLayout from "./MemoryLayout.vue";
import { generateRustStruct } from "../utils/rust_converter";

const wgslCode = ref(`struct _MatrixStorage_float4x4_ColMajorstd140_0
{
    @align(16) data_0 : array<vec4<f32>, i32(4)>,
};

struct surfaceshader_std140_0
{
    @align(16) color_0 : vec3<f32>,
    @align(16) transparency_0 : vec3<f32>,
};

struct displacementshader_std140_0
{
    @align(16) offset_0 : vec3<f32>,
    @align(4) scale_0 : f32,
};

struct LightData_std140_0
{
    @align(16) type_0 : i32,
};

struct _Array_std140_LightData3_0
{
    @align(16) data_1 : array<LightData_std140_0, i32(3)>,
};

struct SLANG_ParameterGroup_pixelCB_std140_0
{
    @align(16) u_envMatrix_0 : _MatrixStorage_float4x4_ColMajorstd140_0,
    @align(16) u_envLightIntensity_0 : f32,
    @align(4) u_envRadianceMips_0 : i32,
    @align(8) u_envRadianceSamples_0 : i32,
    @align(4) u_refractionTwoSided_0 : u32,
    @align(16) u_viewPosition_0 : vec3<f32>,
    @align(4) u_numActiveLightSources_0 : i32,
    @align(16) backsurfaceshader_0 : surfaceshader_std140_0,
    @align(16) displacementshader1_0 : displacementshader_std140_0,
    @align(16) geomprop_UV0_index_0 : i32,
    @align(16) image_basecolor_default_0 : vec4<f32>,
    @align(16) image_basecolor_pivot_0 : vec2<f32>,
    @align(8) image_basecolor_scale_0 : vec2<f32>,
    @align(16) image_basecolor_rotate_0 : f32,
    @align(8) image_basecolor_offset_0 : vec2<f32>,
    @align(16) image_basecolor_operationorder_0 : i32,
    @align(4) image_basecolor_uaddressmode_0 : i32,
    @align(8) image_basecolor_vaddressmode_0 : i32,
    @align(4) image_basecolor_filtertype_0 : i32,
    @align(16) image_basecolor_color_0 : vec4<f32>,
    @align(16) image_basecolor_geomcolor_0 : vec4<f32>,
    @align(16) image_orm_default_0 : vec3<f32>,
    @align(16) image_orm_pivot_0 : vec2<f32>,
    @align(8) image_orm_scale_0 : vec2<f32>,
    @align(16) image_orm_rotate_0 : f32,
    @align(8) image_orm_offset_0 : vec2<f32>,
    @align(16) image_orm_operationorder_0 : i32,
    @align(4) image_orm_uaddressmode_0 : i32,
    @align(8) image_orm_vaddressmode_0 : i32,
    @align(4) image_orm_filtertype_0 : i32,
    @align(16) image_normal_default_0 : vec3<f32>,
    @align(16) image_normal_pivot_0 : vec2<f32>,
    @align(8) image_normal_scale_0 : vec2<f32>,
    @align(16) image_normal_rotate_0 : f32,
    @align(8) image_normal_offset_0 : vec2<f32>,
    @align(16) image_normal_operationorder_0 : i32,
    @align(4) image_normal_uaddressmode_0 : i32,
    @align(8) image_normal_vaddressmode_0 : i32,
    @align(4) image_normal_filtertype_0 : i32,
    @align(16) image_emission_factor_0 : vec3<f32>,
    @align(16) image_emission_default_0 : vec3<f32>,
    @align(16) image_emission_pivot_0 : vec2<f32>,
    @align(8) image_emission_scale_0 : vec2<f32>,
    @align(16) image_emission_rotate_0 : f32,
    @align(8) image_emission_offset_0 : vec2<f32>,
    @align(16) image_emission_operationorder_0 : i32,
    @align(4) image_emission_uaddressmode_0 : i32,
    @align(8) image_emission_vaddressmode_0 : i32,
    @align(4) image_emission_filtertype_0 : i32,
    @align(16) SR_boombox_transmission_0 : f32,
    @align(4) SR_boombox_specular_0 : f32,
    @align(16) SR_boombox_specular_color_0 : vec3<f32>,
    @align(4) SR_boombox_ior_0 : f32,
    @align(16) SR_boombox_alpha_mode_0 : i32,
    @align(4) SR_boombox_alpha_cutoff_0 : f32,
    @align(8) SR_boombox_iridescence_0 : f32,
    @align(4) SR_boombox_iridescence_ior_0 : f32,
    @align(16) SR_boombox_iridescence_thickness_0 : f32,
    @align(16) SR_boombox_sheen_color_0 : vec3<f32>,
    @align(4) SR_boombox_sheen_roughness_0 : f32,
    @align(16) SR_boombox_clearcoat_0 : f32,
    @align(4) SR_boombox_clearcoat_roughness_0 : f32,
    @align(8) SR_boombox_emissive_strength_0 : f32,
    @align(4) SR_boombox_thickness_0 : f32,
    @align(16) SR_boombox_attenuation_distance_0 : f32,
    @align(16) SR_boombox_attenuation_color_0 : vec3<f32>,
    @align(4) SR_boombox_anisotropy_strength_0 : f32,
    @align(16) SR_boombox_anisotropy_rotation_0 : f32,
    @align(4) SR_boombox_dispersion_0 : f32,
    @align(16) u_lightData_0 : _Array_std140_LightData3_0,
};`);

const structs = ref<StructInfo[]>([]);
const showAllRustCode = ref(false);

const allRustCode = computed(() => {
  return structs.value.map((s) => generateRustStruct(s)).join("\n\n");
});

function compile() {
  const reflect = new WgslReflect(wgslCode.value);
  structs.value = reflect.structs;
  console.log(reflect);
}

function copyAllToClipboard() {
  navigator.clipboard.writeText(allRustCode.value);
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
        <div class="d-flex align-center">
          <v-btn color="primary" @click="compile" class="mr-2">Compile</v-btn>
          <v-btn
            v-if="structs.length > 0"
            color="secondary"
            variant="tonal"
            @click="showAllRustCode = !showAllRustCode"
          >
            {{ showAllRustCode ? "Hide All Rust" : "Convert All to Rust" }}
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-row v-if="showAllRustCode && structs.length > 0">
      <v-col cols="12">
        <v-card variant="outlined" class="pa-4 mb-4">
          <v-card-title class="d-flex justify-space-between align-center">
            All Rust Structs
            <v-btn size="small" variant="text" @click="copyAllToClipboard">
              Copy All
            </v-btn>
          </v-card-title>
          <v-card-text>
            <pre
              class="rust-code pa-2 bg-grey-darken-4 text-grey-lighten-3 rounded"
              >{{ allRustCode }}</pre
            >
          </v-card-text>
        </v-card>
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

<style scoped>
.rust-code {
  font-family: "Fira Code", "Courier New", Courier, monospace;
  font-size: 0.8rem;
  overflow-x: auto;
  white-space: pre-wrap;
}
</style>
