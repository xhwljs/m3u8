# M3U8播放器技术架构文档

## 1. 技术栈概览

### 核心框架
- **React 18**: UI框架,使用函数式组件和Hooks
- **TypeScript**: 类型安全
- **Vite**: 快速构建工具

### 样式方案
- **Tailwind CSS**: 工具类CSS
- **自定义CSS**: 新拟态效果实现

### 路由管理
- **React Router DOM v6**: 页面路由

### 流媒体处理
- **HLS.js**: M3U8流解析(非Safari浏览器)
- **原生HLS支持**: Safari浏览器直接使用video标签

## 2. 项目结构

```
m3u8-player/
├── src/
│   ├── components/          # 组件目录
│   │   ├── neumorphic/       # 新拟态组件
│   │   │   ├── NeumorphicInput.tsx
│   │   │   ├── NeumorphicButton.tsx
│   │   │   └── NeumorphicCard.tsx
│   │   ├── VideoPlayer.tsx
│   │   ├── PlaybackControls.tsx
│   │   └── HistoryList.tsx
│   ├── pages/                # 页面目录
│   │   ├── HomePage.tsx
│   │   └── PlayerPage.tsx
│   ├── hooks/                # 自定义Hooks
│   │   ├── useHlsPlayer.ts   # HLS播放逻辑
│   │   ├── useFullscreen.ts  # 全屏控制
│   │   └── useHistory.ts     # 历史记录管理
│   ├── utils/                # 工具函数
│   │   └── timeFormat.ts     # 时间格式化
│   ├── App.tsx               # 主应用
│   ├── main.tsx              # 入口文件
│   └── index.css             # 全局样式
├── public/                   # 静态资源
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

## 3. 核心组件架构

### 3.1 NeumorphicInput组件

```typescript
interface NeumorphicInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}
```

**功能**:
- 凹陷效果的新拟态输入框
- 支持value和onChange双向绑定
- 自定义placeholder文字
- 圆角16px
- 内阴影效果

**样式实现**:
```css
.neumorphic-input {
  background: #e8ecf1;
  border-radius: 16px;
  box-shadow: inset 3px 3px 8px #c4c9d0, 
              inset -3px -3px 8px #ffffff;
}
```

### 3.2 NeumorphicButton组件

```typescript
interface NeumorphicButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  className?: string;
}
```

**功能**:
- 凸起效果的新拟态按钮
- 按压时凹陷动画
- 支持禁用状态
- 支持主次要样式

**样式实现**:
```css
.neumorphic-button {
  background: linear-gradient(145deg, #7c6ff7, #6c63ff);
  border-radius: 16px;
  box-shadow: 5px 5px 15px #c4c9d0, 
              -5px -5px 15px #ffffff;
  transition: all 200ms ease;
}

.neumorphic-button:active {
  box-shadow: inset 3px 3px 8px #c4c9d0, 
              inset -3px -3px 8px #ffffff;
}
```

### 3.3 NeumorphicCard组件

```typescript
interface NeumorphicCardProps {
  children: React.ReactNode;
  variant?: 'raised' | 'inset';
  className?: string;
}
```

**功能**:
- 凸起或凹陷的卡片容器
- 可定制的圆角和阴影
- 灵活的内容插槽

### 3.4 VideoPlayer组件

```typescript
interface VideoPlayerProps {
  src: string;
  onError?: (error: Error) => void;
  onLoadStart?: () => void;
  onCanPlay?: () => void;
}
```

**功能**:
- HLS流媒体播放核心
- 浏览器能力检测
- HLS.js初始化和管理
- 视频事件处理

**HLS加载逻辑**:
```typescript
// 检测浏览器原生HLS支持
const isNativeHls = 'canPlayType' in videoElement && 
                    videoElement.canPlayType('application/vnd.apple.mpegurl');

// Safari使用原生支持
if (isNativeHls) {
  videoElement.src = m3u8Url;
} else if (Hls.isSupported()) {
  // 其他浏览器使用hls.js
  const hls = new Hls();
  hls.loadSource(m3u8Url);
  hls.attachMedia(videoElement);
}
```

### 3.5 PlaybackControls组件

```typescript
interface PlaybackControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onFullscreen: () => void;
}
```

**功能**:
- 播放/暂停控制
- 进度条显示和跳转
- 时间显示
- 全屏按钮

**进度条样式**:
- 凹槽效果(凹陷阴影)
- 凸起滑块(凸起阴影)
- 新拟态风格

### 3.6 HistoryList组件

```typescript
interface HistoryItem {
  url: string;
  timestamp: number;
}

// localStorage key: 'm3u8-player-history'
```

**功能**:
- 读取localStorage历史记录
- 展示最近播放链接
- 点击快速播放
- 删除单条记录

## 4. 页面架构

### 4.1 HomePage

**路由**: `/`

**组件结构**:
```
HomePage
├── NeumorphicCard (主容器)
│   ├── 标题区
│   ├── NeumorphicInput (URL输入框)
│   ├── NeumorphicButton (播放按钮)
│   └── HistoryList (历史记录)
```

**功能流程**:
1. 用户输入M3U8链接
2. 点击播放按钮
3. 验证链接格式(可选)
4. 保存到历史记录
5. 跳转到PlayerPage

### 4.2 PlayerPage

**路由**: `/player?url=<m3u8_url>`

**组件结构**:
```
PlayerPage
├── 返回按钮 (NeumorphicButton圆形)
├── VideoPlayer (视频播放器)
├── PlaybackControls (控制栏)
└── NeumorphicCard (播放信息区)
```

**功能流程**:
1. 从URL参数获取m3u8链接
2. 初始化VideoPlayer
3. 显示播放信息
4. 提供播放控制
5. 处理全屏切换

## 5. Hooks设计

### 5.1 useHlsPlayer

```typescript
interface UseHlsPlayerReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  isLoading: boolean;
  error: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  loadVideo: (url: string) => void;
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
}
```

**功能**:
- HLS实例管理
- 视频状态追踪
- 播放控制

### 5.2 useFullscreen

```typescript
interface UseFullscreenReturn {
  isFullscreen: boolean;
  enterFullscreen: () => void;
  exitFullscreen: () => void;
  toggleFullscreen: () => void;
}
```

**功能**:
- Fullscreen API封装
- 横竖屏检测
- 状态同步

### 5.3 useHistory

```typescript
interface UseHistoryReturn {
  history: HistoryItem[];
  addToHistory: (url: string) => void;
  removeFromHistory: (url: string) => void;
  clearHistory: () => void;
}
```

**功能**:
- localStorage读写
- 历史记录CRUD
- 重复链接去重

## 6. 样式系统

### 6.1 Tailwind配置

```javascript
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'neu-bg': '#e8ecf1',
        'neu-light': '#ffffff',
        'neu-dark': '#c4c9d0',
        'neu-primary': '#7c6ff7',
        'neu-secondary': '#6c63ff',
      },
      boxShadow: {
        'neu-raised': '5px 5px 15px #c4c9d0, -5px -5px 15px #ffffff',
        'neu-inset': 'inset 3px 3px 8px #c4c9d0, inset -3px -3px 8px #ffffff',
      },
    },
  },
  plugins: [],
};
```

### 6.2 自定义CSS类

```css
/* 新拟态凸起效果 */
.neu-raised {
  background: #e8ecf1;
  box-shadow: 5px 5px 15px #c4c9d0, 
              -5px -5px 15px #ffffff;
  border-radius: 16px;
}

/* 新拟态凹陷效果 */
.neu-inset {
  background: #e8ecf1;
  box-shadow: inset 3px 3px 8px #c4c9d0, 
              inset -3px -3px 8px #ffffff;
  border-radius: 16px;
}

/* 过渡动画 */
.neu-transition {
  transition: all 200ms ease;
}
```

## 7. 横竖屏适配

### 7.1 CSS媒体查询

```css
/* 竖屏样式 */
@media (orientation: portrait) {
  .video-container {
    width: 100%;
    height: 40vh;
  }
  
  .info-section {
    display: block;
  }
}

/* 横屏样式 */
@media (orientation: landscape) {
  .video-container {
    width: 100%;
    height: 100vh;
  }
  
  .info-section {
    display: none;
  }
}
```

### 7.2 JavaScript监听

```typescript
const mediaQuery = window.matchMedia('(orientation: landscape)');

mediaQuery.addEventListener('change', (e) => {
  if (e.matches) {
    // 横屏模式
  } else {
    // 竖屏模式
  }
});
```

## 8. 全屏API实现

### 8.1 进入全屏

```typescript
const enterFullscreen = (element: HTMLElement) => {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  }
};
```

### 8.2 退出全屏

```typescript
const exitFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
};
```

## 9. 页面可见性处理

### 9.1 Visibility API

```typescript
useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.hidden) {
      videoRef.current?.pause();
    }
  };
  
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}, []);
```

## 10. 依赖配置

### 10.1 package.json

```json
{
  "name": "m3u8-player",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "hls.js": "^1.4.12"
  },
  "devDependencies": {
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.2.2",
    "vite": "^5.0.0",
    "tailwindcss": "^3.3.5",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31"
  }
}
```

## 11. 开发规范

### 11.1 组件规范
- 每个组件文件不超过300行
- 组件职责单一
- Props接口清晰
- 合理使用Hooks

### 11.2 命名规范
- 组件文件: PascalCase (如: HomePage.tsx)
- 工具函数: camelCase (如: timeFormat.ts)
- CSS类名: kebab-case (如: neu-raised)
- 接口命名: PascalCase, 以I开头或使用Type后缀

### 11.3 路径别名
```typescript
// vite.config.ts
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

## 12. 性能优化

### 12.1 代码分割
- 使用React.lazy进行路由级别代码分割
- 播放页组件懒加载

### 12.2 资源优化
- 使用SVG图标而非图片
- 避免大型第三方库
- Tailwind CSS purge未使用样式

### 12.3 播放优化
- HLS.js配置缓存
- 合理的缓冲策略
- 错误重试机制

## 13. 兼容性处理

### 13.1 浏览器支持
- iOS Safari (原生HLS)
- Android Chrome (HLS.js)
- 其他现代浏览器

### 13.2 视频属性
```html
<video
  playsInline
  webkit-playsInline
  x5-video-player-type="h5"
  x5-video-player-fullscreen="true"
/>
```

## 14. 错误处理

### 14.1 错误类型
- 链接无效
- 网络错误
- 播放失败
- 解码错误

### 14.2 用户提示
- 新拟态风格提示卡片
- 友好的错误文案
- 明确的操作指引
