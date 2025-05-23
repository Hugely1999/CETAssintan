<<<<<<< Updated upstream
<<<<<<< Updated upstream
# sunny-vito.github.io
AI项目
=======
=======
>>>>>>> Stashed changes
# AI助理

![版本](https://img.shields.io/badge/版本-1.0.2-blue)
![状态](https://img.shields.io/badge/状态-开发中-yellow)

一套智能化抄表数据采集和处理系统，能够从文本、图片和文档中自动提取表计相关信息并填充到表格中。

## 核心功能

- **多源数据解析**: 支持从文本描述、图片、Excel等多种来源提取表计信息
- **智能文本解析**: 识别自然语言中的表计数据，支持多种表述方式和格式
- **OCR图像识别**: 从图片中智能提取表计信息，包括表计名称、读数等
- **文档信息抽取**: 处理结构化和半结构化文档，提取表格数据
- **自动数据填充**: 将识别的信息自动填充到抄表系统的表格中
- **交互式AI助手**: 提供对话式的用户界面，辅助用户录入和管理表计数据
- **增强图像预处理**: 自适应图像增强，提高OCR识别率

## 系统架构

系统由以下主要部分组成：

1. **前端应用**
   - 交互式表格界面
   - AI助手对话框
   - 多种数据录入方式


3. **智能识别引擎**
   - 文本语义识别
   - 图像分析和OCR
   - 表格结构识别
<<<<<<< Updated upstream

## 技术栈

- **前端**: HTML, CSS, JavaScript, Vue.js, Element UI
- **图像处理**: Canvas 图像增强和预处理
- **数据处理**: Pandas, Regex
- **OCR技术**: Tesseract.js 多语言模型

## 快速开始

### 安装依赖

```bash
# 安装Python依赖
pip install -r requirements.txt
```

### 启动后端服务

```bash
cd backend
python simple_app.py
```

默认会在 http://localhost:8000 启动服务。

### 访问前端页面

直接在浏览器中打开 `popup-meters.html` 即可使用AI抄表助手。

## 最新更新 (v1.0.2)

- **改进UI体验**:
  - 添加AI助理头像到对话框中，提升用户体验
  - 优化对话框视觉效果

- **图片上传流程优化**:
  - 修改图片处理流程，现在上传后需点击发送按钮才开始OCR识别
  - 增加图片上传状态提示，显示处理进度

- **OCR功能增强**:
  - 增强图片预处理算法，实现自适应图像增强
  - 基于图像亮度实现智能阈值调整
  - 优化Tesseract.js配置，使用多语言模型提高识别率
  - 改进错误处理和用户反馈机制

## API文档

详细的API文档请参考 [后端API文档](backend/README.md)。

## 使用示例

### 文本输入示例

用户可以输入类似以下的表述：

```
表计回路名称电表01，账户为张三，门牌号A101，变比1.5，时间2023年6月15日，读数为100.5
```

系统会自动识别并填充到表格中。

### 图片识别示例

1. 点击上传图片按钮，选择含有表计信息的图片
2. 图片将显示在对话框中
3. 点击发送按钮开始OCR识别
4. 系统自动提取文字并识别关键信息
5. 识别结果自动填充到表格中

支持的格式包括：JPG、PNG等常见图片格式。

### 文档导入示例

上传Excel表格或CSV文件，系统会自动解析其中的表计信息。支持的格式包括：XLS、XLSX、CSV等。

## 改进计划

### 近期计划

- [ ] 集成真实OCR引擎提高识别准确率
- [x] 优化图像预处理，提高OCR准确性
- [x] 改进用户交互流程，上传图片后点击发送按钮才开始处理
- [ ] 添加用户登录和权限管理
- [ ] 完善错误处理和日志记录

### 中期计划

- [ ] 增加数据校验和智能纠错功能
- [ ] 添加数据历史记录和趋势分析
- [ ] 支持手机拍照录入
- [ ] 优化AI助手对话体验，增加语音交互

### 长期计划

- [ ] 构建完整的抄表数据分析平台
- [ ] 集成物联网设备，实现自动抄表
- [ ] 添加异常用量监测和告警
- [ ] 提供API集成接口，对接其他系统

>>>>>>> Stashed changes
=======

## 技术栈

- **前端**: HTML, CSS, JavaScript, Vue.js, Element UI
- **图像处理**: Canvas 图像增强和预处理
- **数据处理**: Pandas, Regex
- **OCR技术**: Tesseract.js 多语言模型

## 快速开始

### 安装依赖

```bash
# 安装Python依赖
pip install -r requirements.txt
```

### 启动后端服务

```bash
cd backend
python simple_app.py
```

默认会在 http://localhost:8000 启动服务。

### 访问前端页面

直接在浏览器中打开 `popup-meters.html` 即可使用AI抄表助手。

## 最新更新 (v1.0.2)

- **改进UI体验**:
  - 添加AI助理头像到对话框中，提升用户体验
  - 优化对话框视觉效果

- **图片上传流程优化**:
  - 修改图片处理流程，现在上传后需点击发送按钮才开始OCR识别
  - 增加图片上传状态提示，显示处理进度

- **OCR功能增强**:
  - 增强图片预处理算法，实现自适应图像增强
  - 基于图像亮度实现智能阈值调整
  - 优化Tesseract.js配置，使用多语言模型提高识别率
  - 改进错误处理和用户反馈机制

## API文档

详细的API文档请参考 [后端API文档](backend/README.md)。

## 使用示例

### 文本输入示例

用户可以输入类似以下的表述：

```
表计回路名称电表01，账户为张三，门牌号A101，变比1.5，时间2023年6月15日，读数为100.5
```

系统会自动识别并填充到表格中。

### 图片识别示例

1. 点击上传图片按钮，选择含有表计信息的图片
2. 图片将显示在对话框中
3. 点击发送按钮开始OCR识别
4. 系统自动提取文字并识别关键信息
5. 识别结果自动填充到表格中

支持的格式包括：JPG、PNG等常见图片格式。

### 文档导入示例

上传Excel表格或CSV文件，系统会自动解析其中的表计信息。支持的格式包括：XLS、XLSX、CSV等。

## 改进计划

### 近期计划

- [ ] 集成真实OCR引擎提高识别准确率
- [x] 优化图像预处理，提高OCR准确性
- [x] 改进用户交互流程，上传图片后点击发送按钮才开始处理
- [ ] 添加用户登录和权限管理
- [ ] 完善错误处理和日志记录

### 中期计划

- [ ] 增加数据校验和智能纠错功能
- [ ] 添加数据历史记录和趋势分析
- [ ] 支持手机拍照录入
- [ ] 优化AI助手对话体验，增加语音交互

### 长期计划

- [ ] 构建完整的抄表数据分析平台
- [ ] 集成物联网设备，实现自动抄表
- [ ] 添加异常用量监测和告警
- [ ] 提供API集成接口，对接其他系统

>>>>>>> Stashed changes
