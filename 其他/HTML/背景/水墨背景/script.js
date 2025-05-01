const { createApp, ref, onMounted, computed, watch } = Vue;

const app = createApp({
    setup() {
        // 状态管理
        const cursor = ref(null);
        const isMouseDown = ref(false);
        const isTouchActive = ref(false);
        const mouseX = ref(0);
        const mouseY = ref(0);
        const lastMouseX = ref(0);
        const lastMouseY = ref(0);
        const mouseSpeed = ref(0);
        let trailTimer = null;
        let rippleInterval = null;
        let isPageVisible = true;
        let isLongPressing = false; // 用于跟踪长按状态
        let longPressTimer = null; // 用于触摸长按检测
        
        // 设备检测
        const isMobile = ref(false);
        const checkMobile = () => {
            isMobile.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
            
            // 移动设备上性能调整
            if (isMobile.value) {
                document.documentElement.style.setProperty('--ink-spread-speed', '0.8s');
                document.documentElement.style.setProperty('--ink-transform-speed', '0.5s');
            }
        };
        
        // 时间相关
        const currentTime = ref(new Date());
        const timeDetail = computed(() => {
            const hours = currentTime.value.getHours().toString().padStart(2, '0');
            const minutes = currentTime.value.getMinutes().toString().padStart(2, '0');
            return `北京时间 ${hours}:${minutes}`;
        });
        
        // 时间因子（0-1之间的值，表示一天中的时间进度）
        const timeFactor = computed(() => {
            const hours = currentTime.value.getHours();
            const minutes = currentTime.value.getMinutes();
            // 将时间转换为0-1之间的值，表示一天的进度
            return (hours * 60 + minutes) / (24 * 60);
        });
        
        // 获取当前时辰和上一时辰的颜色
        const getShichenColors = () => {
            const hours = currentTime.value.getHours();
            const minutes = currentTime.value.getMinutes();
            const totalMinutes = hours * 60 + minutes;
            
            // 十二时辰对应的时间范围（分钟计算，从0开始）
            const shichenRanges = [
                { name: 'zishi', start: 23*60, end: 25*60 }, // 子时 23:00-01:00
                { name: 'choushi', start: 1*60, end: 3*60 }, // 丑时 01:00-03:00
                { name: 'yinshi', start: 3*60, end: 5*60 },  // 寅时 03:00-05:00
                { name: 'maoshi', start: 5*60, end: 7*60 },  // 卯时 05:00-07:00
                { name: 'chenshi', start: 7*60, end: 9*60 }, // 辰时 07:00-09:00
                { name: 'sishi', start: 9*60, end: 11*60 },  // 巳时 09:00-11:00
                { name: 'wushi', start: 11*60, end: 13*60 }, // 午时 11:00-13:00
                { name: 'weishi', start: 13*60, end: 15*60 },// 未时 13:00-15:00
                { name: 'shenshi', start: 15*60, end: 17*60 },// 申时 15:00-17:00
                { name: 'youshi', start: 17*60, end: 19*60 },// 酉时 17:00-19:00
                { name: 'xushi', start: 19*60, end: 21*60 }, // 戌时 19:00-21:00
                { name: 'haishi', start: 21*60, end: 23*60 } // 亥时 21:00-23:00
            ];
            
            // 处理子时跨天的特殊情况
            let adjustedMinutes = totalMinutes;
            if (hours >= 0 && hours < 1) {
                adjustedMinutes = totalMinutes + 24*60; // 将0:00-1:00视为24:00-25:00
            }
            
            // 找到当前时辰
            let currentShichen = shichenRanges[11]; // 默认亥时
            let prevShichen = shichenRanges[10];    // 默认戌时
            
            for (let i = 0; i < shichenRanges.length; i++) {
                const range = shichenRanges[i];
                if (adjustedMinutes >= range.start && adjustedMinutes < range.end) {
                    currentShichen = range;
                    // 计算上一个时辰（循环处理）
                    const prevIndex = (i - 1 + shichenRanges.length) % shichenRanges.length;
                    prevShichen = shichenRanges[prevIndex];
                    break;
                }
            }
            
            // 计算当前时辰内的进度（0-1）
            const shichenProgress = (adjustedMinutes - currentShichen.start) / (currentShichen.end - currentShichen.start);
            
            return {
                current: `--${currentShichen.name}-color`,
                prev: `--${prevShichen.name}-color`,
                progress: shichenProgress
            };
        };
        
        // 更新轨迹颜色
        const updateTrailColors = () => {
            const { current, prev } = getShichenColors();
            document.documentElement.style.setProperty('--trail-color', `var(${current})`);
            document.documentElement.style.setProperty('--prev-trail-color', `var(${prev})`);
        };
        
        // 色彩关键帧定义 - 每一天的色彩周期
        const colorKeyframes = [
            { time: 0.0, bgColor: '#e5e0dc', textColor: '#161823', accentColor: '#40aad1', shadowColor: 'rgba(22,24,35,0.1)', skyTop: '#28346b', name: '深夜' },  // 深夜 (00:00)
            { time: 0.21, bgColor: '#e8d3c7', textColor: '#3c3c3c', accentColor: '#cca583', shadowColor: 'rgba(22,24,35,0.1)', skyTop: '#f29b76', name: '黎明' },  // 黎明 (05:00)
            { time: 0.29, bgColor: '#f8f4e9', textColor: '#3a5169', accentColor: '#a8c9e6', shadowColor: 'rgba(22,24,35,0.15)', skyTop: '#a8c9e6', name: '晨曦' },  // 早晨 (07:00)
            { time: 0.42, bgColor: '#f8f4e9', textColor: '#1c7349', accentColor: '#bea672', shadowColor: 'rgba(28,115,73,0.1)', skyTop: '#c5e7f1', name: '春翠' },  // 上午 (10:00)
            { time: 0.5, bgColor: '#f8f4e9', textColor: '#c02c38', accentColor: '#f9d367', shadowColor: 'rgba(192,44,56,0.1)', skyTop: '#e5e0ba', name: '正阳' },  // 中午 (12:00)
            { time: 0.63, bgColor: '#d4c9ab', textColor: '#f86b1d', accentColor: '#e9c9a5', shadowColor: 'rgba(248,107,29,0.1)', skyTop: '#f0c088', name: '橘暖' },  // 下午 (15:00)
            { time: 0.71, bgColor: '#cca583', textColor: '#5d3f51', accentColor: '#d6a692', shadowColor: 'rgba(93,63,81,0.1)', skyTop: '#e07b79', name: '斜阳' },  // 傍晚 (17:00)
            { time: 0.79, bgColor: '#6a4c3d', textColor: '#e5e0dc', accentColor: '#b6afc5', shadowColor: 'rgba(229,224,220,0.1)', skyTop: '#734d65', name: '暮色' },  // 晚上 (19:00)
            { time: 0.92, bgColor: '#e5e0dc', textColor: '#161823', accentColor: '#40aad1', shadowColor: 'rgba(22,24,35,0.1)', skyTop: '#28346b', name: '月夜' },  // 深夜 (22:00)
            { time: 1.0, bgColor: '#e5e0dc', textColor: '#161823', accentColor: '#40aad1', shadowColor: 'rgba(22,24,35,0.1)', skyTop: '#28346b', name: '深夜' }   // 深夜 (24:00 -> 循环到00:00)
        ];
        
        // 线性插值函数
        const lerp = (a, b, t) => {
            return a + (b - a) * t;
        };
        
        // 颜色插值函数
        const lerpColor = (color1, color2, t) => {
            // 解析颜色为RGB
            const parseColor = (color) => {
                if (color.startsWith('#')) {
                    const r = parseInt(color.substring(1, 3), 16);
                    const g = parseInt(color.substring(3, 5), 16);
                    const b = parseInt(color.substring(5, 7), 16);
                    return [r, g, b];
                } else if (color.startsWith('rgba')) {
                    return color.substring(5, color.length - 1).split(',').map(num => parseFloat(num));
                }
                return [0, 0, 0, 1]; // 默认黑色
            };
            
            // 解析两个颜色
            const rgb1 = parseColor(color1);
            const rgb2 = parseColor(color2);
            
            // 线性插值每个通道
            if (color1.startsWith('rgba') && color2.startsWith('rgba')) {
                const r = Math.round(lerp(rgb1[0], rgb2[0], t));
                const g = Math.round(lerp(rgb1[1], rgb2[1], t));
                const b = Math.round(lerp(rgb1[2], rgb2[2], t));
                const a = lerp(rgb1[3], rgb2[3], t);
                return `rgba(${r},${g},${b},${a})`;
            } else {
                const r = Math.round(lerp(rgb1[0], rgb2[0], t));
                const g = Math.round(lerp(rgb1[1], rgb2[1], t));
                const b = Math.round(lerp(rgb1[2], rgb2[2], t));
                return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
            }
        };
        
        // 基于时间因子获取当前主题色
        const getCurrentTheme = (factor) => {
            // 找到当前时间应该在哪两个关键帧之间
            let startFrame = colorKeyframes[0];
            let endFrame = colorKeyframes[1];
            let t = 0;
            
            for (let i = 0; i < colorKeyframes.length - 1; i++) {
                if (factor >= colorKeyframes[i].time && factor < colorKeyframes[i + 1].time) {
                    startFrame = colorKeyframes[i];
                    endFrame = colorKeyframes[i + 1];
                    // 计算在两个关键帧之间的插值因子
                    t = (factor - startFrame.time) / (endFrame.time - startFrame.time);
                    break;
                }
            }
            
            // 插值计算当前颜色
            return {
                bgColor: lerpColor(startFrame.bgColor, endFrame.bgColor, t),
                textColor: lerpColor(startFrame.textColor, endFrame.textColor, t),
                accentColor: lerpColor(startFrame.accentColor, endFrame.accentColor, t),
                shadowColor: lerpColor(startFrame.shadowColor, endFrame.shadowColor, t),
                skyTop: lerpColor(startFrame.skyTop, endFrame.skyTop, t),
                name: factor < 0.5 ? 
                      (startFrame.name === endFrame.name ? startFrame.name : `${startFrame.name} · ${endFrame.name}`) : 
                      (startFrame.name === endFrame.name ? startFrame.name : `${endFrame.name} · ${startFrame.name}`)
            };
        };
        
        // 计算当前主题
        const currentTheme = computed(() => {
            return getCurrentTheme(timeFactor.value);
        });
        
        // 主题名称
        const currentThemeName = computed(() => {
            return currentTheme.value.name;
        });
        
        // 根据时间计算背景元素的不透明度
        const mountainOpacity = computed(() => {
            const factor = timeFactor.value;
            // 深夜时分山的不透明度降低
            if (factor < 0.21 || factor > 0.92) {
                return 0.7;
            }
            return 0.9;
        });
        
        const treeOpacity = computed(() => {
            const factor = timeFactor.value;
            // 树在傍晚时分更明显
            if (factor > 0.63 && factor < 0.79) {
                return 0.95;
            }
            return 0.85;
        });
        
        const pavilionOpacity = computed(() => {
            const factor = timeFactor.value;
            // 亭子在上午和夜晚更明显
            if ((factor > 0.29 && factor < 0.5) || (factor > 0.79)) {
                return 0.95;
            }
            return 0.85;
        });
        
        const riverOpacity = computed(() => {
            const factor = timeFactor.value;
            // 河流在白天更透明，晚上更明显
            return factor < 0.21 || factor > 0.79 ? 0.7 : 0.5;
        });
        
        // 天空样式
        const skyStyle = computed(() => {
            return {
                background: `linear-gradient(to bottom, ${currentTheme.value.skyTop}, transparent)`,
                opacity: timeFactor.value < 0.21 || timeFactor.value > 0.92 ? 0.4 : 0.25
            };
        });
        
        // 光标滤镜，夜间模式使用反色
        const cursorFilter = computed(() => {
            return timeFactor.value < 0.21 || timeFactor.value > 0.79 ? 'invert(1)' : 'none';
        });
        
        // 鼠标相关参数
        const timeIndicator = ref(null);
        const welcomeContainer = ref(null);
        const welcomeVisible = ref(false);
        const welcomeTimeout = ref(null);
        
        // 墨滴效果计数器
        let dropletCount = 0;
        
        // 诗句数组
        const poems = [
            '落花人独立，微雨燕双飞',
            '春风又绿江南岸，明月何时照我还',
            '会当凌绝顶，一览众山小',
            '海内存知己，天涯若比邻',
            '停车坐爱枫林晚，霜叶红于二月花',
            '飞流直下三千尺，疑是银河落九天',
            '孤帆远影碧空尽，唯见长江天际流',
            '人闲桂花落，夜静春山空',
            '月落乌啼霜满天，江枫渔火对愁眠',
            '千山鸟飞绝，万径人踪灭',
            '山重水复疑无路，柳暗花明又一村',
            '空山新雨后，天气晚来秋',
            '春水碧于天，画船听雨眠',
            '春眠不觉晓，处处闻啼鸟',
            '春江潮水连海平，海上明月共潮生',
            '春城无处不飞烟，寒食东风御柳斜',
            '春来江水绿如蓝，能不忆江南',
            '春色满园关不住，一枝红杏出墙来',
            '春宵一刻值千金，花有清香月有阴',
            '行到水穷处，坐看云起时'
        ];
        
        // 检查鼠标是否接近欢迎容器
        const checkWelcomeProximity = (x, y) => {
            if (!welcomeContainer.value) return;
            
            const threshold = isMobile.value ? 200 : 300; // 移动设备上减小触发距离
            const containerRight = window.innerWidth;
            const distanceFromRight = containerRight - x;
            
            if (distanceFromRight < threshold && !welcomeVisible.value) {
                welcomeVisible.value = true;
                welcomeContainer.value.style.right = isMobile.value ? '20px' : '30px';
                welcomeContainer.value.style.opacity = '1';
                
                // 清除之前的超时
                if (welcomeTimeout.value) {
                    clearTimeout(welcomeTimeout.value);
                }
            } else if (distanceFromRight >= threshold && welcomeVisible.value) {
                welcomeTimeout.value = setTimeout(() => {
                    welcomeContainer.value.style.right = `-${welcomeContainer.value.offsetWidth}px`;
                    welcomeContainer.value.style.opacity = '0';
                    welcomeVisible.value = false;
                }, 500);
            }
        };
        
        // 创建点击水波涟漪效果 - 优化版
        const createClickRipple = (x, y, size = 100) => {
            // 移动设备上减少效果复杂度
            const complexity = isMobile.value ? 0.7 : 1;
            
            // 创建主要墨水晕染效果
            const inkDiffusion = document.createElement('div');
            inkDiffusion.classList.add('ink-diffusion');
            
            // 根据大小随机调整，营造自然感
            const finalSize = size * (0.85 + Math.random() * 0.3) * complexity;
            inkDiffusion.style.width = finalSize + 'px';
            inkDiffusion.style.height = finalSize + 'px';
            inkDiffusion.style.left = x + 'px';
            inkDiffusion.style.top = y + 'px';
            
            // 轻微随机旋转，增加自然性
            const rotation = Math.random() * 360;
            inkDiffusion.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
            
            document.body.appendChild(inkDiffusion);
            
            // 移动设备上减少次要效果
            if (!isMobile.value || Math.random() > 0.5) {
                // 创建次要墨水晕染层 - 外围晕染
                const inkDiffusionSecondary = document.createElement('div');
                inkDiffusionSecondary.classList.add('ink-diffusion', 'ink-diffusion-secondary');
                inkDiffusionSecondary.style.width = (finalSize * 1.3) + 'px';
                inkDiffusionSecondary.style.height = (finalSize * 1.3) + 'px';
                inkDiffusionSecondary.style.left = x + 'px';
                inkDiffusionSecondary.style.top = y + 'px';
                
                // 轻微随机旋转，与主层方向不同
                const rotationSecondary = Math.random() * 360;
                inkDiffusionSecondary.style.transform = `translate(-50%, -50%) rotate(${rotationSecondary}deg)`;
                
                document.body.appendChild(inkDiffusionSecondary);
                
                // 事件监听器清理
                inkDiffusionSecondary.addEventListener('animationend', () => {
                    if (document.body.contains(inkDiffusionSecondary)) {
                        document.body.removeChild(inkDiffusionSecondary);
                    }
                });
            }
            
            // 创建光亮层，增加水墨的光泽质感
            const inkDiffusionLight = document.createElement('div');
            inkDiffusionLight.classList.add('ink-diffusion', 'ink-diffusion-light');
            inkDiffusionLight.style.width = (finalSize * 0.65) + 'px';
            inkDiffusionLight.style.height = (finalSize * 0.65) + 'px';
            inkDiffusionLight.style.left = x + 'px';
            inkDiffusionLight.style.top = y + 'px';
            
            // 轻微随机旋转
            const rotationLight = Math.random() * 360;
            inkDiffusionLight.style.transform = `translate(-50%, -50%) rotate(${rotationLight}deg)`;
            
            document.body.appendChild(inkDiffusionLight);
            
            // 在非移动设备上或随机情况下添加更多细节
            if (!isMobile.value || Math.random() > 0.7) {
                // 创建墨晕边缘细节（墨水沿纹理扩散的细节）
                const featherCount = isMobile.value ? 2 : (3 + Math.floor(Math.random() * 4)); // 移动设备减少羽化效果
                for (let i = 0; i < featherCount; i++) {
                    createInkFeather(x, y, finalSize);
                }
                
                // 创建墨点飞溅效果，与墨水晕染融为一体
                const dropletCount = isMobile.value ? 2 : (3 + Math.floor(Math.random() * 3));
                createInkDroplets(x, y, dropletCount);
            }
            
            // 事件监听器清理
            inkDiffusion.addEventListener('animationend', () => {
                if (document.body.contains(inkDiffusion)) {
                    document.body.removeChild(inkDiffusion);
                }
            });
            
            inkDiffusionLight.addEventListener('animationend', () => {
                if (document.body.contains(inkDiffusionLight)) {
                    document.body.removeChild(inkDiffusionLight);
                }
            });
        };
        
        // 创建墨水边缘细节，模拟墨水沿着宣纸纹理扩散的效果
        const createInkFeather = (x, y, parentSize) => {
            const feather = document.createElement('div');
            feather.classList.add('ink-diffusion-feather');
            
            // 随机大小
            const size = 3 + Math.random() * 6;
            feather.style.width = size + 'px';
            feather.style.height = size + 'px';
            
            // 随机位置，在墨水扩散的边缘
            const angle = Math.random() * Math.PI * 2;
            const distance = parentSize * 0.1 * (0.15 + Math.random() * 0.25);
            const featherX = x + Math.cos(angle) * distance;
            const featherY = y + Math.sin(angle) * distance;
            
            feather.style.left = featherX + 'px';
            feather.style.top = featherY + 'px';
            
            // 设置扩散方向
            const featherDistance = 8 + Math.random() * 20;
            const outwardX = Math.cos(angle) * featherDistance;
            const outwardY = Math.sin(angle) * featherDistance;
            feather.style.setProperty('--feather-x', `${outwardX}px`);
            feather.style.setProperty('--feather-y', `${outwardY}px`);
            
            document.body.appendChild(feather);
            
            feather.addEventListener('animationend', () => {
                if (document.body.contains(feather)) {
                    document.body.removeChild(feather);
                }
            });
        };
        
        // 创建墨点飞溅效果
        const createInkDroplets = (x, y, count = 5) => {
            for (let i = 0; i < count; i++) {
                const droplet = document.createElement('div');
                droplet.classList.add('ink-droplet');
                
                // 随机大小
                const size = 2 + Math.random() * 6;
                droplet.style.width = `${size}px`;
                droplet.style.height = `${size}px`;
                
                // 随机透明度
                const opacity = 0.3 + Math.random() * 0.5;
                droplet.style.opacity = opacity;
                
                // 放在点击位置
                droplet.style.left = `${x}px`;
                droplet.style.top = `${y}px`;
                
                // 使用当前轨迹颜色
                droplet.style.backgroundColor = `var(--trail-color)`;
                
                // 随机飞溅方向和距离
                const angle = Math.random() * Math.PI * 2;
                const distance = 30 + Math.random() * 100;
                const flyX = Math.cos(angle) * distance;
                const flyY = Math.sin(angle) * distance;
                
                droplet.style.setProperty('--fly-x', `${flyX}px`);
                droplet.style.setProperty('--fly-y', `${flyY}px`);
                
                document.body.appendChild(droplet);
                
                droplet.addEventListener('animationend', () => {
                    document.body.removeChild(droplet);
                });
            }
        };
        
        // 创建随机水墨涟漪
        const createRandomRipple = () => {
            if (!isPageVisible) return;
            
            // 随机位置
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            
            // 随机大小
            const size = 50 + Math.random() * 150;
            
            // 复用点击涟漪函数创建随机涟漪
            createClickRipple(x, y, size);
        };
        
        // 创建下落诗词效果
        const createFallingPoem = (x, y) => {
            const poem = document.createElement('div');
            poem.classList.add('falling-poem');
            poem.textContent = poems[Math.floor(Math.random() * poems.length)];
            poem.style.left = x + 'px';
            poem.style.top = y + 'px';
            
            document.body.appendChild(poem);
            
            poem.addEventListener('animationend', () => {
                if (document.body.contains(poem)) {
                    document.body.removeChild(poem);
                }
            });
        };
        
        // 创建锋利轨迹效果（长按时）
        const createSharpTrail = (x, y, angle) => {
            const trail = document.createElement('div');
            trail.classList.add('sharp-trail');
            trail.style.left = x + 'px';
            trail.style.top = y + 'px';
            
            // 设置旋转角度
            trail.style.transform = `rotate(${angle}deg)`;
            
            // 使用当前轨迹颜色的渐变
            const gradient = `linear-gradient(90deg, var(--trail-color) 0%, rgba(255,255,255,0.7) 100%)`;
            trail.style.background = gradient;
            
            // 随机变化轨迹高度，增加绵延感
            const heightVariation = 1 + Math.random() * 1.5;
            trail.style.height = `${heightVariation}px`;
            
            document.body.appendChild(trail);
            
            // 创建连带的较小轨迹，增强绵延感
            if (Math.random() > 0.3) {
                const smallTrail = document.createElement('div');
                smallTrail.classList.add('sharp-trail');
                
                // 稍微偏移位置
                const offsetAngle = angle + (Math.random() * 20 - 10);
                const offsetDistance = 10 + Math.random() * 15;
                const offsetX = x + Math.cos(offsetAngle * Math.PI / 180) * offsetDistance;
                const offsetY = y + Math.sin(offsetAngle * Math.PI / 180) * offsetDistance;
                
                smallTrail.style.left = offsetX + 'px';
                smallTrail.style.top = offsetY + 'px';
                smallTrail.style.transform = `rotate(${offsetAngle}deg)`;
                smallTrail.style.width = '8px';
                smallTrail.style.height = '1px';
                smallTrail.style.opacity = '0.85';
                
                document.body.appendChild(smallTrail);
                
                smallTrail.addEventListener('animationend', () => {
                    if (document.body.contains(smallTrail)) {
                        document.body.removeChild(smallTrail);
                    }
                });
            }
            
            trail.addEventListener('animationend', () => {
                if (document.body.contains(trail)) {
                    document.body.removeChild(trail);
                }
            });
        };
        
        // 创建粒子效果
        const createParticles = (x, y, count = 3) => {
            for (let i = 0; i < count; i++) {
                const particle = document.createElement('div');
                particle.classList.add('mouse-particle');
                
                // 随机位置偏移
                const offsetX = (Math.random() - 0.5) * 10;
                const offsetY = (Math.random() - 0.5) * 10;
                
                particle.style.left = (x + offsetX) + 'px';
                particle.style.top = (y + offsetY) + 'px';
                
                // 随机扩散方向
                const angle = Math.random() * Math.PI * 2;
                const distance = 20 + Math.random() * 30;
                const particleX = Math.cos(angle) * distance;
                const particleY = Math.sin(angle) * distance;
                
                particle.style.setProperty('--particle-x', `${particleX}px`);
                particle.style.setProperty('--particle-y', `${particleY}px`);
                
                document.body.appendChild(particle);
                
                particle.addEventListener('animationend', () => {
                    if (document.body.contains(particle)) {
                        document.body.removeChild(particle);
                    }
                });
            }
        };
        
        // 创建墨渍积累效果
        const createInkStain = (x, y, size = 8) => {
            const stain = document.createElement('div');
            stain.classList.add('ink-stain');
            stain.style.width = `${size}px`;
            stain.style.height = `${size}px`;
            stain.style.left = `${x}px`;
            stain.style.top = `${y}px`;
            
            document.body.appendChild(stain);
            
            stain.addEventListener('animationend', () => {
                if (document.body.contains(stain)) {
                    document.body.removeChild(stain);
                }
            });
        };
        
        // 更新鼠标位置 - 修改为同时支持鼠标和触摸
        const updateCursorPosition = (e) => {
            if (!isPageVisible) return;
            
            const prevX = mouseX.value;
            const prevY = mouseY.value;
            
            mouseX.value = e.clientX;
            mouseY.value = e.clientY;
            
            // 计算鼠标速度
            const dx = mouseX.value - prevX;
            const dy = mouseY.value - prevY;
            mouseSpeed.value = Math.sqrt(dx * dx + dy * dy);
            
            // 计算角度
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            
            // 根据鼠标速度创建效果
            if (mouseSpeed.value > 8) {
                // 创建速度涟漪（限制频率）
                clearTimeout(trailTimer);
                trailTimer = setTimeout(() => {
                    createSpeedRipple(mouseX.value, mouseY.value, mouseSpeed.value);
                    
                    // 速度非常快时创建墨滴效果
                    if (mouseSpeed.value > 25 && dropletCount % 3 === 0) {
                        createInkDroplets(mouseX.value, mouseY.value, isMobile.value ? 2 : 3);
                        createParticles(mouseX.value, mouseY.value, isMobile.value ? 3 : 5);
                    }
                    dropletCount++;
                    
                    // 更新上一次位置
                    lastMouseX.value = mouseX.value;
                    lastMouseY.value = mouseY.value;
                }, isMobile.value ? 60 : 40);
            }
            
            // 创建轨迹效果（限制频率，防止过多DOM操作）
            if (mouseSpeed.value > 3) {
                setTimeout(() => {
                    // 常规鼠标轨迹总是创建
                    createMouseTrail(mouseX.value, mouseY.value, mouseSpeed.value);
                    
                    // 如果是长按状态，则同时创建锋利轨迹
                    if (isMouseDown.value && isLongPressing) {
                        createSharpTrail(mouseX.value, mouseY.value, angle);
                        
                        // 随机添加墨渍积累效果
                        if (Math.random() < 0.1) {
                            createInkStain(mouseX.value, mouseY.value);
                            createParticles(mouseX.value, mouseY.value, isMobile.value ? 1 : 2);
                        }
                    }
                }, isMobile.value ? 25 : 15);
            }
            
            // 检查鼠标是否靠近时间指示器
            checkTimeIndicatorProximity(e);
            
            // 检查鼠标是否靠近欢迎容器
            checkWelcomeProximity(e.clientX, e.clientY);
        };
        
        // 容器点击效果
        const handleContainerClick = (e) => {
            createInkSplash(e.clientX, e.clientY, 100);
            createInkDroplets(e.clientX, e.clientY, 8);
        };
        
        // 创建鼠标轨迹
        const createMouseTrail = (x, y, speed) => {
            const trail = document.createElement('div');
            trail.classList.add('mouse-trail');
            trail.style.left = x + 'px';
            trail.style.top = y + 'px';
            
            // 根据鼠标速度调整轨迹长度
            const length = Math.min(30, Math.max(10, speed * 1));
            
            // 计算轨迹角度
            const dx = x - lastMouseX.value;
            const dy = y - lastMouseY.value;
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            
            trail.style.transform = `rotate(${angle}deg)`;
            trail.style.width = `${length}px`;
            
            // 使用单一色系微小渐变
            const gradient = `linear-gradient(90deg, var(--trail-color) 0%, rgba(255, 255, 255, 0.6) 100%)`;
            trail.style.background = gradient;
            
            document.body.appendChild(trail);
            
            trail.addEventListener('animationend', () => {
                if (document.body.contains(trail)) {
                    document.body.removeChild(trail);
                }
            });
        };
        
        // 检查鼠标是否靠近时间指示器
        const checkTimeIndicatorProximity = (e) => {
            if (!timeIndicator.value) return;
            
            const rect = timeIndicator.value.getBoundingClientRect();
            const threshold = 150; // 触发距离
            
            const distanceX = Math.min(
                Math.abs(e.clientX - rect.left),
                Math.abs(e.clientX - rect.right)
            );
            const distanceY = Math.min(
                Math.abs(e.clientY - rect.top),
                Math.abs(e.clientY - rect.bottom)
            );
            
            const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            
            // 根据距离计算不透明度
            if (distance < threshold) {
                const opacity = 1 - (distance / threshold);
                timeIndicator.value.style.opacity = opacity.toFixed(2);
            } else {
                timeIndicator.value.style.opacity = '0';
            }
        };
        
        // 元素移动效果
        const moveElement = (e) => {
            const element = e.target;
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const moveX = (e.clientX - centerX) / 20;
            const moveY = (e.clientY - centerY) / 20;
            
            element.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.03)`;
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = '';
            }, { once: true });
        };
        
        // 水墨效果
        const createInkSplash = (x, y, size = 50) => {
            const splash = document.createElement('div');
            splash.classList.add('ink-splash');
            splash.style.width = size + 'px';
            splash.style.height = size + 'px';
            splash.style.left = x + 'px';
            splash.style.top = y + 'px';
            
            // 使用当前轨迹颜色
            const gradient = `radial-gradient(circle, var(--trail-color) 0%, transparent 70%)`;
            splash.style.background = gradient;
        
            document.body.appendChild(splash);
        
            splash.addEventListener('animationend', () => {
                document.body.removeChild(splash);
            });
        };
        
        // 创建速度涟漪效果
        const createSpeedRipple = (x, y, speed) => {
            if (speed < 8) return; // 速度太小不创建涟漪
            
            const ripple = document.createElement('div');
            ripple.classList.add('click-ripple'); // 使用click-ripple类
            
            // 根据速度决定大小和不透明度
            const size = Math.min(250, Math.max(80, speed * 3));
            
            ripple.style.width = `${size}px`;
            ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            // 使用当前轨迹颜色
            const gradient = `radial-gradient(circle, var(--trail-color) 0%, transparent 70%)`;
            ripple.style.background = gradient;
            
            // 根据速度方向拉伸涟漪
            const dx = x - lastMouseX.value;
            const dy = y - lastMouseY.value;
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            
            const speedFactor = Math.min(2.5, Math.max(1, speed * 0.06));
            ripple.style.transform = `translate(-50%, -50%) rotate(${angle}deg) scale(${speedFactor}, 1)`;
            
            document.body.appendChild(ripple);
            
            ripple.addEventListener('animationend', () => {
                if (document.body.contains(ripple)) {
                    document.body.removeChild(ripple);
                }
            });
        };
        
        // 监听时间变化
        watch(currentTheme, (newTheme) => {
            // 更新CSS变量
            document.documentElement.style.setProperty('--current-bg-color', newTheme.bgColor);
            document.documentElement.style.setProperty('--current-text-color', newTheme.textColor);
            document.documentElement.style.setProperty('--current-accent-color', newTheme.accentColor);
            document.documentElement.style.setProperty('--current-shadow-color', newTheme.shadowColor);
        }, { immediate: true });
        
        // 页面可见性变化处理
        const handleVisibilityChange = () => {
            isPageVisible = document.visibilityState === 'visible';
            
            // 如果页面不可见时，应该停止必要的计算
            if (!isPageVisible) {
                // 清除可能的定时器
                clearInterval(rippleInterval);
            } 
            // 不再自动启动随机涟漪效果
        };
        
        // 鼠标按下事件处理
        const handleMouseDown = () => {
            isMouseDown.value = true;
            // 立即启用锋利效果，不需要等待
            isLongPressing = true;
        };
        
        // 鼠标释放事件处理
        const handleMouseUp = () => {
            isMouseDown.value = false;
            isLongPressing = false;
        };
        
        // 触摸事件 - 移动端适配
        // 触摸开始事件
        const handleTouchStart = (e) => {
            if (!isPageVisible) return;
            
            isTouchActive.value = true;
            isMouseDown.value = true; // 触摸相当于鼠标按下
            
            const touch = e.touches[0];
            mouseX.value = touch.clientX;
            mouseY.value = touch.clientY;
            lastMouseX.value = touch.clientX;
            lastMouseY.value = touch.clientY;
            
            // 长按检测
            clearTimeout(longPressTimer);
            longPressTimer = setTimeout(() => {
                isLongPressing = true;
                // 触发长按效果
                createInkStain(mouseX.value, mouseY.value, 12);
                createFallingPoem(mouseX.value, mouseY.value);
            }, 500);
        };
        
        // 触摸移动事件
        const handleTouchMove = (e) => {
            if (!isPageVisible || !isTouchActive.value) return;
            
            e.preventDefault(); // 防止页面滚动
            
            const touch = e.touches[0];
            const prevX = mouseX.value;
            const prevY = mouseY.value;
            
            mouseX.value = touch.clientX;
            mouseY.value = touch.clientY;
            
            // 计算触摸速度
            const dx = mouseX.value - prevX;
            const dy = mouseY.value - prevY;
            mouseSpeed.value = Math.sqrt(dx * dx + dy * dy);
            
            // 计算角度
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            
            // 创建轨迹效果
            if (mouseSpeed.value > 2) {
                createMouseTrail(mouseX.value, mouseY.value, mouseSpeed.value);
                
                // 检查是否为长按状态
                if (isLongPressing) {
                    createSharpTrail(mouseX.value, mouseY.value, angle);
                    
                    if (Math.random() < 0.1) {
                        createInkStain(mouseX.value, mouseY.value);
                    }
                }
                
                // 速度很快时创建涟漪
                if (mouseSpeed.value > 10) {
                    clearTimeout(trailTimer);
                    trailTimer = setTimeout(() => {
                        createSpeedRipple(mouseX.value, mouseY.value, mouseSpeed.value);
                        lastMouseX.value = mouseX.value;
                        lastMouseY.value = mouseY.value;
                    }, 50);
                }
            }
            
            // 检查触摸是否靠近时间指示器和欢迎容器
            checkTimeIndicatorProximity({clientX: touch.clientX, clientY: touch.clientY});
            checkWelcomeProximity(touch.clientX, touch.clientY);
        };
        
        // 触摸结束事件
        const handleTouchEnd = (e) => {
            isTouchActive.value = false;
            isMouseDown.value = false;
            isLongPressing = false;
            clearTimeout(longPressTimer);
            
            // 如果不是长按，则创建点击效果
            if (!isLongPressing) {
                const touch = e.changedTouches[0];
                createClickRipple(touch.clientX, touch.clientY, 120);
                createParticles(touch.clientX, touch.clientY, isMobile.value ? 4 : 8);
            }
        };
        
        // 触摸取消事件
        const handleTouchCancel = () => {
            isTouchActive.value = false;
            isMouseDown.value = false;
            isLongPressing = false;
            clearTimeout(longPressTimer);
        };
        
        // 触摸元素移动效果
        const touchMoveElement = (e) => {
            if (e.touches.length === 0) return;
            
            const touch = e.touches[0];
            const element = e.target;
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const moveX = (touch.clientX - centerX) / 20;
            const moveY = (touch.clientY - centerY) / 20;
            
            element.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.03)`;
            
            element.addEventListener('touchend', () => {
                element.style.transform = '';
            }, { once: true });
            
            e.preventDefault(); // 防止滚动
        };
        
        // 确保性能优化 - 定期清理所有动画元素
        setInterval(() => {
            if (!isPageVisible) return;
            
            // 获取所有动画元素
            const animations = document.querySelectorAll('.mouse-trail, .sharp-trail, .ink-droplet, .mouse-particle, .ink-stain');
            
            // 移动设备上更积极地清理
            const maxElements = isMobile.value ? 150 : 300;
            const targetCount = isMobile.value ? 100 : 200;
            
            // 如果太多动画元素，移除最早的一些
            if (animations.length > maxElements) {
                const elementsToRemove = animations.length - targetCount;
                for (let i = 0; i < elementsToRemove; i++) {
                    if (document.body.contains(animations[i])) {
                        document.body.removeChild(animations[i]);
                    }
                }
            }
        }, isMobile.value ? 3000 : 5000);
        
        onMounted(() => {
            // 检测设备类型
            checkMobile();
            window.addEventListener('resize', checkMobile);
            
            // 获取DOM引用
            timeIndicator.value = document.querySelector('.time-indicator');
            welcomeContainer.value = document.querySelector('.welcome-container');
            
            // 更新时间
            setInterval(() => {
                if (isPageVisible) {
                    currentTime.value = new Date();
                    updateTrailColors(); // 更新轨迹颜色
                }
            }, 1000);
            
            // 鼠标事件
            document.addEventListener('mousemove', updateCursorPosition);
            document.addEventListener('mousedown', handleMouseDown);
            document.addEventListener('mouseup', handleMouseUp);
            
            // 添加触摸事件
            document.addEventListener('touchstart', handleTouchStart, {passive: false});
            document.addEventListener('touchmove', handleTouchMove, {passive: false});
            document.addEventListener('touchend', handleTouchEnd);
            document.addEventListener('touchcancel', handleTouchCancel);
            
            // 点击事件 - 水波涟漪效果
            document.addEventListener('click', (e) => {
                if (!isPageVisible) return;
                
                // 跳过触摸触发的点击
                if (isTouchActive.value) return;
                
                // 创建水墨晕染效果
                createClickRipple(e.clientX, e.clientY, 150);
                
                // 创建粒子效果
                createParticles(e.clientX, e.clientY, isMobile.value ? 5 : 8);
            });
            
            // 右键点击事件 - 下落诗词
            document.addEventListener('contextmenu', (e) => {
                if (!isPageVisible) return;
                e.preventDefault();
                
                // 创建下落诗词效果
                createFallingPoem(e.clientX, e.clientY);
                
                // 创建水墨效果
                createInkSplash(e.clientX, e.clientY, 80);
                
                // 创建粒子效果
                createParticles(e.clientX, e.clientY, isMobile.value ? 6 : 10);
                
                return false;
            });
            
            // 确保鼠标隐藏 - 在非触摸设备上
            if (!isMobile.value) {
                document.body.style.cursor = 'none';
            }
            
            // 页面可见性变化监听
            document.addEventListener('visibilitychange', handleVisibilityChange);
            
            // 初始化轨迹颜色
            updateTrailColors();
            
            // 防止移动端上的默认行为
            document.addEventListener('gesturestart', function(e) {
                e.preventDefault();
            });
            
            // 禁用双指缩放
            document.addEventListener('touchmove', function(e) {
                if (e.touches.length > 1) {
                    e.preventDefault();
                }
            }, { passive: false });
        });
        
        return {
            isMouseDown,
            currentThemeName,
            timeIndicator,
            moveElement,
            touchMoveElement,
            handleContainerClick,
            mountainOpacity,
            treeOpacity,
            pavilionOpacity,
            riverOpacity,
            skyStyle,
            cursorFilter
        };
    }
});

app.mount('#app');