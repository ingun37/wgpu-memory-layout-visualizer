import type { StructInfo } from "wgsl_reflect";

export interface LayoutItem {
  offset: number;
  size: number;
  name: string;
  type: string;
  isPadding: boolean;
}

export function getLayoutItems(struct: StructInfo): LayoutItem[] {
  const items: LayoutItem[] = [];
  let currentOffset = 0;

  for (const member of struct.members) {
    if (member.offset > currentOffset) {
      items.push({
        offset: currentOffset,
        size: member.offset - currentOffset,
        name: `_pad${items.filter((i) => i.isPadding).length}`,
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
  if (struct.size > currentOffset) {
    items.push({
      offset: currentOffset,
      size: struct.size - currentOffset,
      name: `_pad${items.filter((i) => i.isPadding).length}`,
      type: "",
      isPadding: true,
    });
  }

  return items;
}

export function mapWgslToRust(wgslType: string): string {
  // Common types mapping
  const mapping: Record<string, string> = {
    f32: "f32",
    i32: "i32",
    u32: "u32",
    f16: "u16", // Half-precision float not native in Rust core
    vec2f: "[f32; 2]",
    vec3f: "[f32; 3]",
    vec4f: "[f32; 4]",
    vec2i: "[i32; 2]",
    vec3i: "[i32; 3]",
    vec4i: "[i32; 4]",
    vec2u: "[u32; 2]",
    vec3u: "[u32; 3]",
    vec4u: "[u32; 4]",
    vec2h: "[u16; 2]",
    vec3h: "[u16; 3]",
    vec4h: "[u16; 4]",
    mat2x2f: "[[f32; 2]; 2]",
    mat2x3f: "[[f32; 3]; 2]",
    mat2x4f: "[[f32; 4]; 2]",
    mat3x2f: "[[f32; 2]; 3]",
    mat3x3f: "[[f32; 3]; 3]",
    mat3x4f: "[[f32; 4]; 3]",
    mat4x2f: "[[f32; 2]; 4]",
    mat4x3f: "[[f32; 3]; 4]",
    mat4x4f: "[[f32; 4]; 4]",
  };

  // Handle vec2<f32> format as well
  if (wgslType.startsWith("vec") || wgslType.startsWith("mat")) {
    const match = wgslType.match(/^(vec|mat)(\d)x?(\d)?<(.+)>$/);
    if (match) {
      const [, kind, n, m, type] = match;
      const innerType = mapping[type] || type;
      if (kind === "vec") {
        return `[${innerType}; ${n}]`;
      } else if (kind === "mat") {
        return `[[${innerType}; ${m}]; ${n}]`;
      }
    }
  }

  return mapping[wgslType] || wgslType;
}

export function generateRustStruct(struct: StructInfo): string {
  const layoutItems = getLayoutItems(struct);
  let code = `#[repr(C)]\n`;
  code += `#[derive(NoUninit, bytemuck::Zeroable, Copy, Clone)]\n`;
  code += `struct ${struct.name} {\n`;

  for (const item of layoutItems) {
    if (item.isPadding) {
      code += `    ${item.name}: [u8; ${item.size}],\n`;
    } else {
      let rustType = mapWgslToRust(item.type);
      code += `    ${item.name}: ${rustType}, // size: ${item.size}, offset: ${item.offset}\n`;
    }
  }

  code += `}`;
  return code;
}
