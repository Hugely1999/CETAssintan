FROM node:16-alpine

WORKDIR /app

# 安装依赖
COPY package.json package-lock.json ./
RUN npm install

# 复制源代码
COPY . .

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["npm", "start"] 