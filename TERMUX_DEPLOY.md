# Android Termux 部署指南

本指南将帮助您在 Android 手机上使用 Termux 部署和运行这个 M3U8 播放器项目。

## 第一步：在 GitHub 上创建仓库

1. 访问 https://github.com 并登录您的账号
2. 点击右上角的 "+" 按钮，选择 "New repository"
3. 填写仓库名称（例如：`m3u8-player`）
4. 选择 Public 或 Private
5. 点击 "Create repository"

## 第二步：上传代码到 GitHub

在您的电脑上执行以下命令：

```bash
# 初始化 git 仓库
git init

# 添加所有文件
git add .

# 提交更改
git commit -m "Initial commit: M3U8 Player with Neumorphic design"

# 关联远程仓库
git remote add origin https://github.com/您的用户名/您的仓库名.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

## 第三步：在 Android 上安装 Termux

1. 在 Google Play 商店或 F-Droid 下载安装 **Termux**
2. 打开 Termux 应用

## 第四步：在 Termux 中安装必要工具

在 Termux 中执行以下命令：

```bash
# 更新软件包
pkg update && pkg upgrade -y

# 安装必要的工具
pkg install git nodejs-lts -y

# 验证安装
git --version
node --version
npm --version
```

## 第五步：克隆项目

```bash
# 克隆您的 GitHub 仓库
git clone https://github.com/您的用户名/您的仓库名.git

# 进入项目目录
cd 您的仓库名
```

## 第六步：安装依赖并运行

```bash
# 安装项目依赖
npm install

# 启动开发服务器
npm run dev
```

## 第七步：访问应用

启动后，您会看到类似这样的输出：

```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

在手机浏览器中打开 `http://localhost:5173/ 即可访问应用！

## 可选：使用 IP 访问（局域网共享

如果您想在同一局域网的其他设备访问，可以修改启动命令：

编辑 `package.json`，修改 dev 脚本：

```json
"dev": "vite --host 0.0.0.0"
```

然后重新运行：

```bash
npm run dev
```

在其他设备浏览器中访问：`http://您手机的IP地址:5173`

## 常见问题

### Q: 如何查看手机的 IP 地址？

在 Termux 中执行：

```bash
ip addr show wlan0
```

### Q: 如何让服务在后台运行？

可以使用 `nohup` 或 `tmux`：

```bash
# 安装 tmux
pkg install tmux -y

# 启动新会话
tmux

# 在会话中运行项目
npm run dev

# 按 Ctrl+B 然后 D 来分离会话
```

### Q: 如何构建生产版本？

```bash
npm run build
```

构建后的文件在 `dist` 目录中。
