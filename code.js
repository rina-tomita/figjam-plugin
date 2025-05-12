figma.showUI(__html__, { width: 320, height: 320 });

// ハイライト用のデータを管理
let highlighted = [];

// ハイライトを全解除
function clearHighlights() {
  for (const item of highlighted) {
    try {
      if (item.strokeNode && !item.strokeNode.removed) item.strokeNode.remove();
      if (item.bgNode && !item.bgNode.removed) item.bgNode.remove();
    } catch (e) {}
  }
  highlighted = [];
}

// ノードをハイライト
async function highlightEmojiNodes(emoji) {
  clearHighlights();
  // すべてのText/ShapeWithTextノードを取得
  const nodes = figma.currentPage.findAll(n =>
    (n.type === 'TEXT' || n.type === 'SHAPE_WITH_TEXT') && typeof n.characters === 'string' && n.characters.includes(emoji)
  );
  for (const node of nodes) {
    // 背面矩形
    const bg = figma.createRectangle();
    bg.resize(node.width, node.height);
    bg.x = node.x;
    bg.y = node.y;
    bg.fills = [{ type: 'SOLID', color: { r: 1, g: 0.949, b: 0 }, opacity: 0.35 }]; // #FFF200 35%
    bg.strokes = [];
    bg.name = '🔦 EmojiHighlightBG';
    // ストローク
    const stroke = figma.createRectangle();
    stroke.resize(node.width, node.height);
    stroke.x = node.x;
    stroke.y = node.y;
    stroke.fills = [];
    stroke.strokes = [{ type: 'SOLID', color: { r: 1, g: 0.949, b: 0 } }]; // #FFF200
    stroke.strokeWeight = 4;
    stroke.name = '🔦 EmojiHighlightStroke';
    // レイヤー順序調整
    node.parent.insertChild(node.parent.children.indexOf(node), bg);
    node.parent.insertChild(node.parent.children.indexOf(node) + 1, stroke);
    highlighted.push({ bgNode: bg, strokeNode: stroke });
  }
}

figma.ui.onmessage = async msg => {
  if (msg.type === 'select-emoji') {
    await highlightEmojiNodes(msg.emoji);
  }
  if (msg.type === 'reset') {
    clearHighlights();
  }
}; 