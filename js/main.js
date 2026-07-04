document.querySelectorAll('.dropdown-menu a').forEach((link, index) => {
    link.addEventListener('click', (e) => {
        // 彈出視窗顯示這個選項的文字，以及它是第幾個
        alert("成功抓到連結！文字內容是：" + link.innerText + "，索引是：" + index);
    });
});


document.addEventListener('DOMContentLoaded', () => {
    // --- 1. 時間與 Uptime 計算 ---
    const updateTime = () => {
        const birthDate = new Date('2008-10-20T00:00:00');
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const formattedDate = `${year}.${month}.${day}`;
        
        const diffMs = now - birthDate;
        const totalHours = Math.floor(diffMs / (1000 * 60 * 60)); 
        
        const timeEl = document.getElementById('update-time');
        if (timeEl) timeEl.textContent = `Link Start: ${formattedDate}`;

        const uptimeEl = document.getElementById('uptime-hours');
        if (uptimeEl) {
            uptimeEl.textContent = `${totalHours.toLocaleString()}h`;
        }
    };

    setInterval(updateTime, 1000);
    updateTime();

    // --- 2. 面板入場動畫 ---
    const panels = document.querySelectorAll('.glass-card, .sao-panel');
    setTimeout(() => {
        panels.forEach((panel, index) => {
            setTimeout(() => {
                panel.classList.add('visible');
            }, 150 * (index + 1));
        });
    }, 100);

    // --- 3. 終端機模擬效果 ---
    const initTerminal = () => {
        const terminalBody = document.querySelector('.terminal-body');
        if (!terminalBody) return;

        const logs = [
            "[INFO] Initializing LWY Core Systems...",
            "[INFO] Password: 19960802",
            "[INFO] Syncing Robotics Database (FRC/FTC)...",
            "[SUCCESS] Neural Link: STABLE",
            ">> Welcome to LWY's personal portal."
        ];

        const cursor = document.createElement('span');
        cursor.className = 'terminal-cursor';
        cursor.textContent = '_';
        
        terminalBody.innerHTML = '';
        terminalBody.appendChild(cursor);

        let lineIndex = 0;

        function typeLine(text, element, callback) {
            let charIndex = 0;
            function typeChar() {
                if (charIndex < text.length) {
                    element.textContent += text.charAt(charIndex);
                    charIndex++;
                    setTimeout(typeChar, Math.random() * 30 + 20);
                } else if (callback) {
                    callback();
                }
            }
            typeChar();
        }

        function processNextLog() {
            if (lineIndex < logs.length) {
                const line = document.createElement('p');
                line.className = 'log-line';
                line.style.cssText = 'margin: 4px 0; opacity: 0.9; color: var(--intp-main); font-family: monospace;';
                terminalBody.insertBefore(line, cursor);

                typeLine(logs[lineIndex], line, () => {
                    lineIndex++;
                    setTimeout(processNextLog, 600); 
                });
            }
        }
        setTimeout(processNextLog, 1500);
    };
    initTerminal();

    // --- 4. FRC/FTC 經歷天數計算與進度條 ---
    const calculateDays = (startDateStr) => {
        const start = new Date(startDateStr);
        const now = new Date();
        const diff = now - start;
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    };

    const frcRealDays = calculateDays('2024-07-17'); 
    const ftcRealDays = calculateDays('2025-07-22'); 

    const skillData = [
        { el: document.querySelector('.fill.blue-glow'), days: frcRealDays, label: "FRC" },
        { el: document.querySelector('.fill.purple-glow'), days: ftcRealDays, label: "FTC" }
    ];

    const maxDays = Math.max(frcRealDays, 730); 

    skillData.forEach(skill => {
        if (!skill.el) return;
        const percentage = (skill.days / maxDays) * 100;
        skill.el.style.width = '0%';
        
        setTimeout(() => {
            skill.el.style.transition = 'width 2.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            skill.el.style.width = `${percentage}%`;
            animateDays(skill.el.parentElement.previousElementSibling, skill.days, skill.label);
        }, 1200);
    });

    function animateDays(labelEl, targetDays, prefix) {
        let start = performance.now();
        const duration = 2500;
        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(2, -10 * progress);
            const current = Math.floor(easeProgress * targetDays);
            const teamFullName = prefix === "FRC" ? "FIRST Robotics Competition" : "FIRST Tech Challenge";
            labelEl.textContent = `${prefix} | ${teamFullName} (${current} Days)`;
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

// --- 5. 分頁與下拉選單切換邏輯 (新加入側邊欄顯示/隱藏控制) ---
    const navLinks = document.querySelectorAll('.nav-links > li'); 
    const subLinkExp = document.getElementById('sub-link-exp');  
    const subLinkSpecial = document.getElementById('sub-link-special');
    const pages = document.querySelectorAll('.page-content');
    const sidebar = document.querySelector('.sidebar');
    const pageIds = ['page-home', 'page-about', 'page-more', 'page-special'];

    // === 2. 🎯 緊接著塞入：專治 iPhone 點不到下拉選單的防禦腳本 ===
// 獲取按鈕與下拉選單元素
    const moreBtn = document.getElementById('nav-more-trigger') || 
                    document.querySelector('.dropdown-trigger');
    
    const dropdownMenu = document.querySelector('.submenu') || 
                         document.querySelector('.dropdown-menu') || 
                         document.querySelector('.more-dropdown');

    if (moreBtn && dropdownMenu) {
        function toggleDropdown(e) {
            e.preventDefault();
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
            dropdownMenu.classList.toggle('active');
        }

        // 綁定觸發按鈕的事件
        moreBtn.addEventListener('click', toggleDropdown);
        moreBtn.addEventListener('touchstart', toggleDropdown, { passive: false });

        // 點擊畫面其他處收起選單
        document.addEventListener('click', function(e) {
            if (!moreBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('show');
                dropdownMenu.classList.remove('active');
            }
        });
// === 優化後的選單連結處理 ===
        const menuLinks = dropdownMenu.querySelectorAll('li a'); 

        menuLinks.forEach(link => {
            const handleLinkClick = (e) => {
                e.preventDefault();  
                e.stopPropagation(); 
                
                console.log("子選項被點擊了：", link.innerText);
                
                // --- 這裡是你真正跳轉頁面的地方 ---
                // 假設你原本的切換函式叫做 showPage，請依實際情況填入
                // 如果是透過 ID 跳轉，請這樣寫：
                if (link.id === 'sub-link-exp') {
                    showPage('competition'); // 請確認你的函式名稱
                } else if (link.id === 'sub-link-special') {
                    showPage('special');     // 請確認你的函式名稱
                }
                
                // 點擊後收起選單
                dropdownMenu.classList.remove('show');
                dropdownMenu.classList.remove('active');
            };

            // 雙重事件綁定，確保 iPhone 靈敏度
            link.addEventListener('click', handleLinkClick);
            link.addEventListener('touchstart', handleLinkClick, { passive: false });
        });
    }

    function resetActiveState() {
        pages.forEach(p => p.classList.remove('active'));
        navLinks.forEach(l => {
            l.style.color = "white";
            l.style.opacity = "0.7";
        });
        
        if (sidebar) {
            sidebar.style.display = 'block'; 
        }
    }

    navLinks.forEach((link, index) => {
        if (index < 2) { 
            link.addEventListener('click', () => {
                resetActiveState();
                const targetPage = document.getElementById(pageIds[index]);
                if (targetPage) {
                    targetPage.classList.add('active');
                    link.style.color = "var(--intp-main)";
                    link.style.opacity = "1";
                }
            });
        }
    });

    if (subLinkExp) {
        subLinkExp.addEventListener('click', (e) => {
            e.stopPropagation(); 
            resetActiveState();
            
            const targetPage = document.getElementById('page-more');
            if (targetPage) {
                targetPage.classList.add('active');

                if (sidebar) {
                    sidebar.style.display = 'none'; 
                }

                const parentTrigger = document.getElementById('nav-more-trigger');
                if (parentTrigger) {
                    parentTrigger.style.color = "var(--intp-main)";
                    parentTrigger.style.opacity = "1";
                }
            }
        });
    }
 if (subLinkSpecial) {
        subLinkSpecial.addEventListener('click', (e) => {
            e.stopPropagation(); 
            resetActiveState();
            
            const targetPage = document.getElementById('page-special');
            if (targetPage) {
                targetPage.classList.add('active');

                if (sidebar) {
                    sidebar.style.display = 'none'; 
                }

                const parentTrigger = document.getElementById('nav-more-trigger');
                if (parentTrigger) {
                    parentTrigger.style.color = "var(--intp-main)";
                    parentTrigger.style.opacity = "1";
                }
            }
        });
    }

    // --- 6. 滑鼠微光追蹤效果 ---
panels.forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; 
        const y = e.clientY - rect.top;
        card.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(96, 165, 250, 0.15), transparent 40%), var(--intp-glass-bg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.background = `var(--intp-glass-bg)`;
    });
});
});