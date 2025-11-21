import * as fs from 'fs';
import * as path from 'path';

// 读取HTML文件
const htmlFilePath = '/Users/kerwinsu/Downloads/GODIVA 歌剧女主角方形朱古力系列新品预售.html';
// 或者尝试另一种编码格式的文件名
const altHtmlFilePath = '/Users/kerwinsu/Downloads/GODIVA%20%E6%AD%8C%E5%B8%9D%E6%A2%B5%E7%AB%8B%E6%96%B9%E5%B7%A7%E5%85%8B%E5%8A%9B%E7%B3%BB%E5%88%97%E6%96%B0%E5%93%81%E9%A0%90%E5%94%AE.html';
const emailTemplatesPath = '/Users/kerwinsu/Desktop/IDE/Mema demo/src/utils/emailTemplates.ts';

try {
  // 尝试读取HTML文件内容，先尝试原始路径，失败则尝试URL解码后的路径
  let htmlContent;
  try {
    // 首先尝试解码URL编码的路径
    const decodedAltPath = decodeURIComponent(altHtmlFilePath);
    htmlContent = fs.readFileSync(decodedAltPath, 'utf8');
    console.log(`成功读取文件: ${decodedAltPath}`);
  } catch (e) {
    try {
      htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
      console.log(`成功读取文件: ${htmlFilePath}`);
    } catch (e2) {
      throw new Error(`无法读取HTML文件，尝试了两个路径都失败`);
    }
  }
  
  // 读取当前的emailTemplates.ts文件
  let templatesContent = fs.readFileSync(emailTemplatesPath, 'utf8');
  
  // 检查是否已有template2
  if (templatesContent.includes("id: 'template2'")) {
    // 替换已有的template2内容
    const updatedContent = templatesContent.replace(
      /(\s*id: 'template2',[^]*?content: `)[^`]*(`)/s,
      `$1${htmlContent}$2`
    );
    
    // 写回文件
    fs.writeFileSync(emailTemplatesPath, updatedContent, 'utf8');
    console.log('已更新template2！');
  } else {
    // 添加新的template2
    // 找到emailTemplates数组的末尾（最后一个}后面）
    const updatedContent = templatesContent.replace(
      /export const emailTemplates: EmailTemplate\[\] = \[([\s\S]*?)\];/,
      (match, templates) => {
        const newTemplate = `\n  {\n    id: 'template2',\n    title: '营销推广模板 (模板B)',\n    preview: '适用于产品营销推广的邮件模板，包含引人注目的标题和清晰的行动号召。',\n    content: \`${htmlContent}\`,\n    thumbnail: 'https://via.placeholder.com/150\'\n  }`;
        
        // 如果templates不为空且不以逗号结尾，则添加逗号
        if (templates.trim() && !templates.trim().endsWith(',')) {
          return `export const emailTemplates: EmailTemplate[] = [${templates},${newTemplate}\n];`;
        } else {
          return `export const emailTemplates: EmailTemplate[] = [${templates}${newTemplate}\n];`;
        }
      }
    );
    
    // 写回文件
    fs.writeFileSync(emailTemplatesPath, updatedContent, 'utf8');
    console.log('已添加template2！');
  }
} catch (error) {
  console.error('更新模板时出错:', error.message);
}