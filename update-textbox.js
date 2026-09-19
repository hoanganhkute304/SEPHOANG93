const fs = require('fs');

let content = fs.readFileSync('src/components/DraggableTextBoxes.tsx', 'utf8');

// 1. Add Move import if not present
if (!content.includes('Move,')) {
    content = content.replace('Trash2, Link as LinkIcon', 'Trash2, Link as LinkIcon, Move');
}

// 2. Add useDragControls import
if (!content.includes('useDragControls')) {
    content = content.replace("import { motion } from 'motion/react';", "import { motion, useDragControls } from 'motion/react';");
}

// 3. Update interface DraggableText
content = content.replace(
    "styleType: 'glass' | 'solid' | 'transparent' | 'neon' | 'outline';",
    "styleType: 'glass' | 'solid' | 'transparent' | 'neon' | 'outline' | 'dashed' | 'gradient' | 'glow';\n  borderColor?: string;"
);

// 4. Update the context menu style select options
content = content.replace(
    /<option value="transparent">Chỉ chữ<\/option>[\s\S]*?<option value="outline">Viền gạch ngang \(Outline\)<\/option>/g,
    `<option value="transparent">Chỉ chữ</option>
                <option value="glass">Kính mờ (Glass)</option>
                <option value="solid">Màu khối (Solid)</option>
                <option value="outline">Viền liền (Outline)</option>
                <option value="dashed">Viền đứt (Dashed)</option>
                <option value="neon">Neon Phát Sáng</option>
                <option value="glow">Phát Sáng Đơn Giản</option>
                <option value="gradient">Màu Gradient</option>`
);

// Also handle the case where outline is named differently
content = content.replace(
    /<option value="outline">.*?<\/option>/g,
    `<option value="outline">Viền liền (Outline)</option>
                <option value="dashed">Viền đứt (Dashed)</option>
                <option value="neon">Neon Phát Sáng</option>
                <option value="glow">Phát Sáng Đơn Giản</option>
                <option value="gradient">Màu Gradient</option>`
);

// Fix duplicated neon options if any
content = content.replace(/(<option value="neon">.*<\/option>\s*){2,}/g, '<option value="neon">Neon Phát Sáng</option>\n');

// Write back
fs.writeFileSync('src/components/DraggableTextBoxes.tsx', content);
