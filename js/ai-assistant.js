// AI助手组件
// 注意：请将您的AI助手图标PNG图片放置在images/ai-assistant-icon.png
// 图标将显示为方形圆角(4px)的图片，无需添加任何文字
class AIAssistant {
  constructor() {
    this.isOpen = false;
    this.isDragging = false;
    this.isRecording = false;
    this.messages = [];
    this.position = { x: 0, y: 0 };
    
    // DeepSeek API配置
    this.apiKey = 'sk-930d7f953a8440d98a2c652661de05b4';
    this.apiEndpoint = 'https://api.deepseek.com/v1/chat/completions';
    this.useAI = true; // 控制是否使用真实AI API
    this.isProcessing = false; // 控制是否正在处理请求
    
    // 初始化语音识别
    this.initSpeechRecognition();

    // 初始化组件
    this.init();
  }

  init() {
    // 创建主容器
    this.container = document.createElement('div');
    this.container.className = 'ai-assistant-container';
    document.body.appendChild(this.container);

    // 创建AI图标 - 使用图片替换原来的内联SVG
    this.icon = document.createElement('div');
    this.icon.className = 'ai-icon';
    
    // 使用图片元素
    const iconImg = document.createElement('img');
    iconImg.src = 'images/ai-assistant-icon.caf3479d.jpg';
    iconImg.alt = 'AI助手';
    iconImg.style.width = '100%';
    iconImg.style.height = '100%';
    iconImg.style.borderRadius = '4px';
    iconImg.style.objectFit = 'cover';
    iconImg.style.background = 'transparent'; // 设置透明背景
    
    this.icon.appendChild(iconImg);
    
    this.container.appendChild(this.icon);

    // 从localStorage恢复位置
    const savedX = localStorage.getItem('aiAssistantPositionX');
    const savedY = localStorage.getItem('aiAssistantPositionY');
    
    if (savedX !== null && savedY !== null) {
      this.container.style.position = 'fixed';
      this.container.style.left = savedX + 'px';
      this.container.style.top = savedY + 'px';
      this.container.style.right = 'auto';
      this.container.style.bottom = 'auto';
    }

    // 尝试从localStorage恢复消息记录
    const savedMessages = localStorage.getItem('aiAssistantMessages');
    if (savedMessages) {
      try {
        this.messages = JSON.parse(savedMessages);
      } catch (e) {
        console.error('恢复消息记录失败:', e);
        // 创建初始消息
        this.messages = [{
          type: 'ai',
          content: '您好，我可以回答问题、提供电力数据分析，或者帮您导航到系统不同功能区。请问有什么可以帮您？'
        }];
      }
    } else {
      // 创建初始消息
      this.messages = [{
        type: 'ai',
        content: '您好，我可以回答问题、提供电力数据分析，或者帮您导航到系统不同功能区。请问有什么可以帮您？'
      }];
    }

    // 绑定事件
    this.bindEvents();
    
    // 如果URL中包含aiopen=true参数或localStorage中有打开标记，则自动打开面板
    const urlParams = new URLSearchParams(window.location.search);
    const shouldOpen = urlParams.get('aiopen') === 'true' || localStorage.getItem('aiAssistantOpen') === 'true';
    
    if (shouldOpen) {
      // 延迟执行以确保DOM完全加载
      setTimeout(() => {
        this.openPanel();
        // 打开后清除localStorage中的标记
        localStorage.removeItem('aiAssistantOpen');
        // 从URL中移除aiopen参数
        if (urlParams.get('aiopen') === 'true') {
          urlParams.delete('aiopen');
          const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
          window.history.replaceState({}, document.title, newUrl);
        }
      }, 300);
    }
  }

  bindEvents() {
    // 图标点击事件
    this.icon.addEventListener('click', (e) => {
      if (!this.isDragging) {
        this.togglePanel();
      }
    });

    // 拖拽开始
    this.icon.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      this.startDrag(e);
    });

    // 点击外部关闭面板
    document.addEventListener('mousedown', (e) => {
      if (this.panel && this.isOpen && 
          !this.panel.contains(e.target) && 
          !this.icon.contains(e.target)) {
        this.closePanel();
      }
    });
  }

  togglePanel() {
    if (this.isOpen) {
      this.closePanel();
    } else {
      this.openPanel();
    }
  }

  openPanel() {
    // 创建面板
    this.panel = document.createElement('div');
    this.panel.className = 'ai-panel';
    this.panel.style.position = 'fixed';
    // 不预设位置，通过updatePanelPosition设置
    this.container.appendChild(this.panel);

    // 输入区域 - 顶部
    const inputContainer = document.createElement('div');
    inputContainer.className = 'input-container';
    inputContainer.innerHTML = `
      <input type="text" class="text-input" placeholder="输入问题或点击麦克风">
      <button class="voice-btn"></button>
      <button class="send-btn"></button>
    `;
    this.panel.appendChild(inputContainer);

    // 输入框事件
    this.input = inputContainer.querySelector('.text-input');
    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.sendMessage();
      }
    });

    // 发送按钮事件
    const sendBtn = inputContainer.querySelector('.send-btn');
    sendBtn.addEventListener('click', () => this.sendMessage());

    // 语音按钮事件 - 改为点击切换录音状态
    const voiceBtn = inputContainer.querySelector('.voice-btn');
    voiceBtn.addEventListener('click', (e) => {
      e.preventDefault(); // 防止冒泡
      if (this.isRecording) {
        this.stopVoiceRecording();
      } else {
        this.startVoiceRecording();
      }
    });

    // 历史查询区域 - 放在输入框下方
    this.historyContainer = document.createElement('div');
    this.historyContainer.className = 'history-container';
    this.panel.appendChild(this.historyContainer);
    
    // 渲染历史查询
    this.renderSearchHistory();

    // 添加操作按钮容器 - 现在放在历史查询下方
    const actionContainer = document.createElement('div');
    actionContainer.className = 'action-container';
    actionContainer.innerHTML = `
      <div style="flex: 1"></div>
      <button class="download-btn" title="下载对话记录"></button>
      <button class="clear-btn" title="清空对话记录"></button>
      <button class="toggle-btn" title="隐藏对话框"></button>
    `;
    this.panel.appendChild(actionContainer);

    // 下载按钮事件
    const downloadBtn = actionContainer.querySelector('.download-btn');
    downloadBtn.addEventListener('click', () => this.downloadConversation());

    // 清空按钮事件
    const clearBtn = actionContainer.querySelector('.clear-btn');
    clearBtn.addEventListener('click', () => this.clearConversation());

    // 隐藏对话框按钮事件
    const toggleBtn = actionContainer.querySelector('.toggle-btn');
    toggleBtn.addEventListener('click', () => {
      const conversationContainer = this.panel.querySelector('.conversation-container');
      if (conversationContainer.style.display === 'none') {
        conversationContainer.style.display = 'flex';
        toggleBtn.title = '隐藏对话框';
        toggleBtn.classList.remove('toggle-collapsed');
      } else {
        conversationContainer.style.display = 'none';
        toggleBtn.title = '展开对话框';
        toggleBtn.classList.add('toggle-collapsed');
      }
    });

    // 对话内容区域 - 放在底部
    this.conversationContainer = document.createElement('div');
    this.conversationContainer.className = 'conversation-container';
    this.panel.appendChild(this.conversationContainer);

    // 渲染消息
    this.renderMessages();

    // 聚焦到输入框
    setTimeout(() => {
      this.input.focus();
    }, 100);

    this.isOpen = true;
    
    // 更新面板位置，与图标对齐
    this.updatePanelPosition();
  }

  // 更新面板位置
  updatePanelPosition() {
    if (!this.panel || !this.isOpen) return;
    
    const iconRect = this.icon.getBoundingClientRect();
    
    // 图标左侧12px固定间距，底部对齐
    this.panel.style.position = 'fixed';
    this.panel.style.right = (window.innerWidth - iconRect.left + 12) + 'px';
    this.panel.style.bottom = (window.innerHeight - iconRect.bottom) + 'px';
    this.panel.style.left = 'auto';
    this.panel.style.top = 'auto';
  }

  closePanel() {
    if (this.panel) {
      this.container.removeChild(this.panel);
      this.panel = null;
    }
    this.isOpen = false;
  }

  startDrag(e) {
    this.isDragging = true;
    const startX = e.clientX - this.container.offsetLeft;
    const startY = e.clientY - this.container.offsetTop;

    const moveHandler = (e) => {
      if (this.isDragging) {
        const x = e.clientX - startX;
        const y = e.clientY - startY;
        
        // 限制图标在窗口内
        const maxX = window.innerWidth - this.container.offsetWidth;
        const maxY = window.innerHeight - this.container.offsetHeight;
        
        const boundedX = Math.max(0, Math.min(x, maxX));
        const boundedY = Math.max(0, Math.min(y, maxY));
        
        // 应用新位置 - 确保可以在任意方向移动
        this.container.style.position = 'fixed';
        this.container.style.left = `${boundedX}px`;
        this.container.style.top = `${boundedY}px`;
        this.container.style.right = 'auto';
        this.container.style.bottom = 'auto';
        
        // 保存位置到localStorage，确保刷新页面后位置保持不变
        localStorage.setItem('aiAssistantPositionX', boundedX);
        localStorage.setItem('aiAssistantPositionY', boundedY);
        
        // 更新面板位置，跟随图标移动
        this.updatePanelPosition();
      }
    };

    const upHandler = () => {
      this.isDragging = false;
      document.removeEventListener('mousemove', moveHandler);
      document.removeEventListener('mouseup', upHandler);
      
      // 防止拖拽结束后立即触发点击
      setTimeout(() => {
        this.isDragging = false;
      }, 100);
    };

    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', upHandler);
  }

  renderMessages() {
    if (!this.conversationContainer) return;
    
    this.conversationContainer.innerHTML = '';
    
    // 直接遍历消息数组，顺序已经是反向的（最新的在前面）
    this.messages.forEach(msg => {
      const msgElement = document.createElement('div');
      msgElement.className = `message ${msg.type}-message`;
      msgElement.textContent = msg.content;
      this.conversationContainer.appendChild(msgElement);
    });
  }

  renderSearchHistory() {
    if (!this.historyContainer) return;

    // 移除标题，直接创建历史查询列表
    this.historyContainer.innerHTML = '';
    
    // 创建历史查询列表
    const historyList = document.createElement('div');
    historyList.className = 'history-list';
    
    // 获取用户查询（每两条消息中的用户消息）
    const userQueries = [];
    for (let i = 0; i < this.messages.length; i++) {
      if (this.messages[i].type === 'user') {
        // 检查是否已经包含相同查询，避免重复
        if (!userQueries.includes(this.messages[i].content)) {
          userQueries.push(this.messages[i].content);
        }
      }
    }
    
    // 限制最多显示8条
    const limitedQueries = userQueries.slice(0, 8);
    
    // 如果没有历史查询，显示提示信息
    if (limitedQueries.length === 0) {
      const emptyMsg = document.createElement('div');
      emptyMsg.className = 'history-empty';
      emptyMsg.textContent = '暂无查询历史';
      historyList.appendChild(emptyMsg);
    } else {
      // 创建历史查询项
      limitedQueries.forEach(query => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.textContent = query;
        
        // 点击历史记录项自动填充到输入框
        historyItem.addEventListener('click', () => {
          if (this.input) {
            this.input.value = query;
            this.input.focus();
          }
        });
        
        historyList.appendChild(historyItem);
      });
    }
    
    this.historyContainer.appendChild(historyList);
  }

  sendMessage() {
    if (!this.input || !this.input.value.trim()) return;
    
    const message = this.input.value.trim();
    
    // 添加用户消息到消息数组开头，适应反向布局
    this.messages.unshift({ type: 'user', content: message });
    
    // 限制历史记录最多保留8条消息（4对对话，每对包含用户问题和AI回答）
    if (this.messages.length > 16) {
      this.messages = this.messages.slice(0, 16);
    }
    
    // 更新对话区域和历史查询区域
    this.renderMessages();
    this.renderSearchHistory();
    
    // 清空输入框
    this.input.value = '';
    
    // 模拟AI回复
    setTimeout(() => {
      this.processUserInput(message);
    }, 500);
  }

  processUserInput(input) {
    console.log('处理用户输入:', input);
    console.log('isMeterBillingQuery测试结果:', this.isMeterBillingQuery(input));
    console.log('isMeterBillingCommand测试结果:', this.isMeterBillingCommand(input));
    
    // 如果输入为空，直接返回
    if (!input || input.trim() === '') {
      return;
    }
    
    let response = '';
    let shouldNavigate = false;
    let targetPage = '';
    let queryParams = {};
    
    // 判断是否是查询指令
    const isQueryCommand = input.includes('查询') || input.includes('查看') || 
                         input.includes('显示') || input.includes('获取');
    
    console.log('======== 抄表计费导航调试信息 ========');
    console.log('输入内容:', input);
    console.log('是否包含抄表:', input.includes('抄表'));
    console.log('是否包含计费:', input.includes('计费'));
    console.log('是否等于抄表计费:', input === '抄表计费');
    
    // 优先处理简单的抄表计费指令，添加更多日志
    if (input === '抄表计费' || input === '抄表录入' || input === '录入表计') {
      console.log('直接处理抄表计费简单指令');
      response = '正在为您跳转到抄表计费页面...';
      targetPage = 'chaobiaojifei.html';
      shouldNavigate = true;
      this.handleLocalResponse(response, shouldNavigate, targetPage);
      return;
    }
    // 处理功能名称跳转指令
    else if (input.match(/打开(工作台|仪表盘)/i) || input.match(/(进入|跳转到|前往|转到)(工作台|仪表盘)/i) || input.includes('工作台')) {
      response = '正在为您跳转到工作台...';
      targetPage = 'index.html';
      shouldNavigate = true;
      this.handleLocalResponse(response, shouldNavigate, targetPage, queryParams);
    } 
    else if (input.match(/打开(电力监控|能源监控)/i) || input.match(/(进入|跳转到|前往|转到)(电力监控|能源监控)/i) || input.includes('电力监控')) {
      response = '正在为您跳转到电力监控页面...';
      targetPage = 'power-monitoring.html';
      shouldNavigate = true;
      this.handleLocalResponse(response, shouldNavigate, targetPage, queryParams);
    }
    else if (input.match(/打开(电能分析|能源分析|用电分析)/i) || input.match(/(进入|跳转到|前往|转到)(电能分析|能源分析|用电分析)/i) || input.includes('电能分析')) {
      response = '正在为您跳转到电能分析页面...';
      targetPage = 'power-analysis.html';
      shouldNavigate = true;
      this.handleLocalResponse(response, shouldNavigate, targetPage, queryParams);
    }
    else if (input.match(/打开(安全用电|能耗趋势|能耗分析)/i) || input.match(/(进入|跳转到|前往|转到)(安全用电|能耗趋势|能耗分析)/i) || input.includes('能耗趋势')) {
      response = '正在为您跳转到能耗趋势分析页面...';
      targetPage = 'energy-trend.html';
      shouldNavigate = true;
      this.handleLocalResponse(response, shouldNavigate, targetPage, queryParams);
    }
    else if (input.match(/打开(月度账单|账单|账单查询)/i) || input.match(/(进入|跳转到|前往|转到)(月度账单|账单|账单查询)/i) || 
             input === '月度账单' || input === '账单' || input.match(/^(月度账单|账单查询)$/i)) {
      response = '正在为您跳转到月度账单页面...';
      targetPage = 'monthly-bill.html';
      shouldNavigate = true;
      this.handleLocalResponse(response, shouldNavigate, targetPage, queryParams);
    }
    else if (input.match(/打开(首页|主页)/i) || input.match(/(进入|跳转到|前往|转到)(首页|主页)/i) || input.includes('首页')) {
      response = '正在为您跳转到首页...';
      targetPage = 'home.html';
      shouldNavigate = true;
      this.handleLocalResponse(response, shouldNavigate, targetPage);
    }
    else if (input.match(/返回|后退|上一页/i)) {
      response = '正在返回上一页...';
      shouldNavigate = 'back';
      this.handleLocalResponse(response, shouldNavigate, targetPage, queryParams);
    }
    else {
      // 其他类型的问题，显示一个固定的响应
      response = '抱歉，我不理解您的问题。请尝试以下指令：\n1. 打开电力监控\n2. 查看月度账单\n3. 打开抄表计费\n4. 查看能耗趋势';
      this.messages.unshift({ type: 'ai', content: response });
      this.renderMessages();
      this.renderSearchHistory();
    }
    
    // 将消息保存到localStorage
    localStorage.setItem('aiAssistantMessages', JSON.stringify(this.messages));
  }
  
  // 判断是否是抄表计费查询
  isMeterBillingQuery(input) {
    console.log('检查是否是抄表计费查询:', input);
    
    // 如果直接输入"抄表计费"、"抄表录入"或相关简单词汇，直接返回true
    if (input === '抄表计费' || input === '抄表录入' || input === '录入表计') {
      console.log('直接匹配：输入为抄表计费关键词');
      return true;
    }
    
    // 如果明确包含"查询"+"抄表"相关关键词，直接返回true
    if (input.includes('查询') && (
        input.includes('抄表') || 
        input.includes('表计') || 
        input.includes('电表'))) {
      console.log('直接匹配：包含查询+抄表关键词');
      return true;
    }
    
    // 定义更全面的抄表计费查询模式
    const meterBillingQueryPatterns = [
      // 常见查询模式
      /(查询|查看|显示|展示|获取|录入|添加|更新)(.*?)(抄表|表计|电表|读数|表记|计量表)/i,
      /(恒和园|恒和园一层|恒和园二层|知春园南区|知春园东区|锦秋园|租户)(.*?)(抄表|表计|电表|读数)/i,
      /(抄表|表计|电表)(.*?)(记录|信息|数据|情况|读数|示数)/i,
      /(\d{4}[-\/年]\d{1,2}[-\/月]|\d{1,2}月份?|[一二三四五六七八九十]月份?|本月|上月|当月)(.*?)(抄表|表计|电表)/i,
      /(抄表|表计|电表)(.*?)(\d{4}[-\/年]\d{1,2}[-\/月]|\d{1,2}月份?|[一二三四五六七八九十]月份?|本月|上月|当月)/i,
      
      // 更宽松的识别模式
      /(抄表计费|表计录入|录入表计)/i,
      /(录入|添加|更新|输入)(.*?)(电表|表计|抄表|读数)/i,
      /(想要|需要|请给|请帮|我要)(.*?)(录入|添加|查询)(.*?)(抄表|表计|电表)/i
    ];
    
    // 测试每一个模式
    for (const pattern of meterBillingQueryPatterns) {
      if (pattern.test(input)) {
        console.log('匹配成功的抄表计费查询模式:', pattern);
        return true;
      }
    }
    
    console.log('不是抄表计费查询');
    return false;
  }
  
  // 检查是否是抄表计费导航命令
  isMeterBillingCommand(text) {
    return (text.includes('抄表') && text.includes('计费')) || 
           (text.includes('抄表') && text.includes('录入')) ||
           text.includes('chaobiaojifei') ||
           text.includes('抄表计费') ||
           text.includes('录入表计') ||
           text.includes('电表录入') ||
           text.includes('表计录入');
  }

  // 处理本地响应，主要用于导航和API不可用的备选处理
  handleLocalResponse(response, shouldNavigate, targetPage, queryParams = {}) {
    console.log('handleLocalResponse调用:', { response, shouldNavigate, targetPage, queryParams });
    
    // 添加AI回复到消息数组开头
    this.messages.unshift({ type: 'ai', content: response });
    
    // 更新对话区域和历史查询区域
    this.renderMessages();
    this.renderSearchHistory();
    
    // 处理导航
    if (shouldNavigate) {
      console.log('需要导航到:', targetPage);
      
      // 在导航前将AI助手状态保存到localStorage
      localStorage.setItem('aiAssistantMessages', JSON.stringify(this.messages));
      
      // 延迟一秒执行导航，让用户有时间看到提示
      setTimeout(() => {
        try {
          const currentUrl = window.location.href;
          console.log('当前URL:', currentUrl);
          
          if (shouldNavigate === 'back') {
            console.log('执行返回上一页');
            window.history.back();
          } else if (targetPage) {
            // 构建URL
            let finalUrl = targetPage;
            console.log('目标页面:', finalUrl);
            
            // 添加参数
            if (Object.keys(queryParams).length > 0) {
              console.log('添加查询参数:', queryParams);
              const urlObj = new URL(finalUrl, window.location.origin);
              for (const [key, value] of Object.entries(queryParams)) {
                if (value !== undefined && value !== null && value !== '') {
                  urlObj.searchParams.append(key, value);
                }
              }
              finalUrl = urlObj.pathname + urlObj.search;
              console.log('添加参数后的URL:', finalUrl);
            }
            
            // 将目标页面信息添加到URL中，确保AI助手在新页面自动打开
            finalUrl += (finalUrl.includes('?') ? '&' : '?') + 'aiopen=true';
            console.log('最终导航URL:', finalUrl);
            console.log('完整URL:', new URL(finalUrl, window.location.origin).href);
            
            // 执行跳转
            console.log('即将执行跳转...');
            window.location.href = finalUrl;
          }
        } catch (error) {
          console.error('执行跳转时出错:', error);
        }
      }, 1000);
    }
    
    // 将消息保存到localStorage
    localStorage.setItem('aiAssistantMessages', JSON.stringify(this.messages));
  }
}

// 页面加载完成后初始化AI助手
document.addEventListener('DOMContentLoaded', () => {
  console.log('初始化AI助手...');
  window.aiAssistant = new AIAssistant();
});