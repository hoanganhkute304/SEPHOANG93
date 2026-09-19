import fs from 'fs';

let content = fs.readFileSync('src/components/DraggableTextBoxes.tsx', 'utf8');

if (!content.includes('Move')) {
    content = content.replace('Trash2, Link as LinkIcon', 'Trash2, Link as LinkIcon, Move');
}

if (!content.includes('useDragControls')) {
    content = content.replace("import { motion } from 'motion/react';", "import { motion, useDragControls } from 'motion/react';");
}

if (!content.includes('borderColor?: string')) {
    content = content.replace(
        "styleType: 'glass' | 'solid' | 'transparent' | 'neon' | 'outline';",
        "styleType: 'glass' | 'solid' | 'transparent' | 'neon' | 'outline' | 'dashed' | 'gradient' | 'glow';\n  borderColor?: string;"
    );
}

// Update getStyleObj
let getStyleObjCode = `    switch (box.styleType) {
      case 'glass': 
        base.backgroundColor = box.backgroundColor || 'rgba(255, 255, 255, 0.05)';
        base.backdropFilter = 'blur(12px)';
        base.border = \`1px solid \${box.borderColor || 'rgba(255, 255, 255, 0.2)'}\`;
        base.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
        break;
      case 'solid': 
        base.backgroundColor = box.backgroundColor || '#161320';
        base.border = \`1px solid \${box.borderColor || 'rgba(255, 255, 255, 0.1)'}\`;
        base.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.5)';
        break;
      case 'neon':
        base.backgroundColor = box.backgroundColor || '#161320';
        base.border = \`2px solid \${box.borderColor || box.color}\`;
        base.boxShadow = \`0 0 10px \${box.borderColor || box.color}40, inset 0 0 10px \${box.borderColor || box.color}20\`;
        base.textShadow = \`0 0 8px \${box.color}80\`;
        break;
      case 'outline':
        base.backgroundColor = box.backgroundColor || 'transparent';
        base.border = \`2px solid \${box.borderColor || box.color}\`;
        break;
      case 'dashed':
        base.backgroundColor = box.backgroundColor || 'transparent';
        base.border = \`2px dashed \${box.borderColor || box.color}\`;
        break;
      case 'gradient':
        base.background = \`linear-gradient(135deg, \${box.backgroundColor || '#9D4EDD'}, \${box.borderColor || '#00E5FF'})\`;
        base.border = 'none';
        base.color = box.color || '#FFF';
        break;
      case 'glow':
        base.backgroundColor = box.backgroundColor || 'rgba(0,0,0,0.5)';
        base.border = \`1px solid \${box.borderColor || box.color}\`;
        base.boxShadow = \`0 0 20px \${box.borderColor || box.color}\`;
        break;
      case 'transparent': 
      default: 
        base.backgroundColor = 'transparent';
        break;
    }`;

content = content.replace(/switch \(box\.styleType\) \{[\s\S]*?break;\s*\}/, getStyleObjCode);

// Add useDragControls and modify the motion.div return
let newTextBox = `function TextBox({ box, isAdmin, isSelected, onSelect, updateBox, onContextMenu }: { 
  key?: string;
  box: DraggableText, 
  isAdmin: boolean, 
  isSelected: boolean,
  onSelect: () => void,
  updateBox: (id: string, updates: any) => void,
  onContextMenu: (e: React.MouseEvent) => void
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  const getStyleObj = () => {
    let base: any = {
      fontSize: \`\${box.fontSize}px\`,
      color: box.color,
      fontFamily: box.fontFamily,
      borderRadius: \`\${box.borderRadius}px\`,
      fontWeight: box.fontWeight,
      textAlign: box.textAlign,
      padding: box.styleType === 'transparent' ? '0px' : \`\${box.padding}px\`,
      transition: 'all 0.2s ease',
      lineHeight: 1.2
    };

    switch (box.styleType) {
      case 'glass': 
        base.backgroundColor = box.backgroundColor || 'rgba(255, 255, 255, 0.05)';
        base.backdropFilter = 'blur(12px)';
        base.border = \`1px solid \${box.borderColor || 'rgba(255, 255, 255, 0.2)'}\`;
        base.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
        break;
      case 'solid': 
        base.backgroundColor = box.backgroundColor || '#161320';
        base.border = \`1px solid \${box.borderColor || 'rgba(255, 255, 255, 0.1)'}\`;
        base.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.5)';
        break;
      case 'neon':
        base.backgroundColor = box.backgroundColor || '#161320';
        base.border = \`2px solid \${box.borderColor || box.color}\`;
        base.boxShadow = \`0 0 10px \${box.borderColor || box.color}40, inset 0 0 10px \${box.borderColor || box.color}20\`;
        base.textShadow = \`0 0 8px \${box.color}80\`;
        break;
      case 'outline':
        base.backgroundColor = box.backgroundColor || 'transparent';
        base.border = \`2px solid \${box.borderColor || box.color}\`;
        break;
      case 'dashed':
        base.backgroundColor = box.backgroundColor || 'transparent';
        base.border = \`2px dashed \${box.borderColor || box.color}\`;
        break;
      case 'gradient':
        base.background = \`linear-gradient(135deg, \${box.backgroundColor || '#9D4EDD'}, \${box.borderColor || '#00E5FF'})\`;
        base.border = 'none';
        base.color = box.color || '#FFF';
        break;
      case 'glow':
        base.backgroundColor = box.backgroundColor || 'rgba(0,0,0,0.5)';
        base.border = \`1px solid \${box.borderColor || box.color}\`;
        base.boxShadow = \`0 0 20px \${box.borderColor || box.color}\`;
        break;
      case 'transparent': 
      default: 
        base.backgroundColor = 'transparent';
        break;
    }
    return base;
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isAdmin) {
      e.stopPropagation();
    } else if (box.linkUrl) {
      window.open(box.linkUrl, '_blank');
    }
  };

  return (
    <motion.div
      drag={isAdmin}
      dragMomentum={false}
      dragListener={false}
      dragControls={dragControls}
      onDragEnd={(_, info) => {
        if (!isAdmin) return;
        updateBox(box.id, { x: box.x + info.offset.x, y: box.y + info.offset.y });
      }}
      onPointerDown={(e) => {
        if (isAdmin) {
          e.stopPropagation();
          onSelect();
        }
      }}
      onClick={handleClick}
      onContextMenu={isAdmin ? onContextMenu : undefined}
      initial={{ x: box.x, y: box.y }}
      animate={{ x: box.x, y: box.y }}
      style={{ zIndex: box.zIndex }}
      className={\`absolute top-0 left-0 flex flex-col \${isAdmin ? 'pointer-events-auto' : box.linkUrl ? 'cursor-pointer pointer-events-auto hover:scale-105 transition-transform' : 'pointer-events-auto'} \${isSelected ? 'ring-2 ring-[#00E5FF] ring-offset-4 ring-offset-black/50 rounded-xl' : ''}\`}
    >
      {isAdmin && isSelected && (
        <div 
          className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#00E5FF] text-black rounded px-2 py-1 flex items-center gap-1 cursor-move shadow-lg z-[9999]"
          onPointerDown={(e) => {
            e.stopPropagation();
            dragControls.start(e);
          }}
        >
          <Move size={14} /> <span className="text-[10px] font-bold">KÉO</span>
        </div>
      )}
      <div 
        ref={contentRef}
        contentEditable={isAdmin}
        suppressContentEditableWarning
        onBlur={(e) => {
          updateBox(box.id, { text: e.currentTarget.innerText });
        }}
        style={getStyleObj()}
        className={\`outline-none whitespace-pre-wrap min-w-[50px] min-h-[30px] w-max max-w-[80vw] \${isAdmin ? 'cursor-text' : ''}\`}
      >
        {box.text}
      </div>
    </motion.div>
  );
}`;

content = content.replace(/function TextBox\(\{ box.*?\}\);?\s*\}/s, newTextBox);

fs.writeFileSync('src/components/DraggableTextBoxes.tsx', content);
