/**
 * AI助手导航调试脚本
 * 用于测试抄表计费导航功能
 */

// 模拟AI助手中的导航功能
function testNavigation(pageName) {
  console.log('测试导航到:', pageName);
  
  // 创建导航URL
  let finalUrl = '';
  
  switch(pageName) {
    case '抄表计费':
      finalUrl = 'chaobiaojifei.html';
      break;
    case '首页':
      finalUrl = 'home.html';
      break;
    case '工作台':
      finalUrl = 'index.html';
      break;
    default:
      console.error('未知页面名称:', pageName);
      return;
  }
  
  // 添加aiopen参数
  finalUrl += (finalUrl.includes('?') ? '&' : '?') + 'aiopen=true';
  
  console.log('生成的导航URL:', finalUrl);
  console.log('当前URL:', window.location.href);
  console.log('完整导航URL:', new URL(finalUrl, window.location.origin).href);
  
  // 显示导航按钮供用户点击
  const debugContainer = document.createElement('div');
  debugContainer.style.position = 'fixed';
  debugContainer.style.top = '10px';
  debugContainer.style.right = '10px';
  debugContainer.style.zIndex = '10001';
  debugContainer.style.backgroundColor = '#fff';
  debugContainer.style.border = '1px solid #ccc';
  debugContainer.style.padding = '10px';
  debugContainer.style.borderRadius = '4px';
  debugContainer.style.boxShadow = '0 2px 12px 0 rgba(0,0,0,.1)';
  
  const title = document.createElement('div');
  title.textContent = '导航调试工具';
  title.style.fontWeight = 'bold';
  title.style.marginBottom = '10px';
  
  const urlText = document.createElement('div');
  urlText.textContent = '目标URL: ' + finalUrl;
  urlText.style.marginBottom = '10px';
  urlText.style.fontSize = '12px';
  
  const button = document.createElement('button');
  button.textContent = '点击跳转到' + pageName;
  button.style.padding = '5px 10px';
  button.style.backgroundColor = '#00B45E';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.borderRadius = '4px';
  button.style.cursor = 'pointer';
  
  button.addEventListener('click', () => {
    console.log('用户点击跳转按钮');
    window.location.href = finalUrl;
  });
  
  debugContainer.appendChild(title);
  debugContainer.appendChild(urlText);
  debugContainer.appendChild(button);
  document.body.appendChild(debugContainer);
}

// 页面加载完成后初始化调试工具
document.addEventListener('DOMContentLoaded', () => {
  console.log('导航调试工具已加载');
  
  // 创建调试按钮
  const testButton = document.createElement('button');
  testButton.textContent = '测试抄表计费导航';
  testButton.style.position = 'fixed';
  testButton.style.top = '10px';
  testButton.style.left = '10px';
  testButton.style.zIndex = '10001';
  testButton.style.padding = '5px 10px';
  testButton.style.backgroundColor = '#1976d2';
  testButton.style.color = 'white';
  testButton.style.border = 'none';
  testButton.style.borderRadius = '4px';
  testButton.style.cursor = 'pointer';
  
  testButton.addEventListener('click', () => {
    testNavigation('抄表计费');
  });
  
  document.body.appendChild(testButton);
}); 