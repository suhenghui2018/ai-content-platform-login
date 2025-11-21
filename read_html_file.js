import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

// 读取本地HTML文件
const htmlFilePath = '/Users/kerwinsu/Downloads/Godiva 2025 方形朱古力 _ 會員尊享預購.html';

try {
  const data = readFileSync(htmlFilePath, 'utf8');
  
  // 转义字符串中的特殊字符，使其可以在JavaScript字符串中使用
  const escapedHtml = data
    .replace(/\\/g, '\\\\')  // 转义反斜杠
    .replace(/\n/g, '\\n')     // 转义换行符
    .replace(/"/g, '\\"');    // 转义双引号
  
  console.log('HTML内容已读取，长度:', data.length, '字符');
  console.log('\n请将以下内容复制到ABTestCreationPage.tsx文件中的defaultCards定义部分:');
  console.log('-------------------------------------------------------------------');
  console.log('content: `' + escapedHtml + '`,');
  console.log('-------------------------------------------------------------------');
  
  // 直接修改ABTestCreationPage.tsx文件
  const targetFilePath = '/Users/kerwinsu/Desktop/IDE/Mema demo/src/components/ABTestCreationPage.tsx';
  
  const fileContent = readFileSync(targetFilePath, 'utf8');
  
  // 替换文件中的content值
  const updatedContent = fileContent.replace(
    /content: `[^`]*`/, 
    `content: \`${escapedHtml}\``
  );
  
  writeFileSync(targetFilePath, updatedContent, 'utf8');
  console.log('\n已成功更新ABTestCreationPage.tsx文件中的HTML内容！');
} catch (err) {
  console.error('发生错误:', err);
  process.exit(1);
}