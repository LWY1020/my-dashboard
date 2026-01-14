document.addEventListener('DOMContentLoaded', () => {
    // --- 1. 自動計算時間與 UPTIME 邏輯 ---
    const updateTime = () => {
        const birthDate = new Date('2008-10-20T00:00:00'); // 生日
        const now = new Date();
        
        // A. 格式化今天的日期 (YYYY.MM.DD)
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const formattedDate = `${year}.${month}.${day}`;
        
        // B. 計算總小時數 (UPTIME)
        const diffMs = now - birthDate;
        const totalHours = Math.floor(diffMs / (1000 * 60 * 60)); 
        
        // 更新大標題 (Link Start: 今日日期)
        const timeEl = document.getElementById('update-time');
        if (timeEl) timeEl.textContent = `Link Start: ${formattedDate}`;

        // 更新 UPTIME 數據卡片 (顯示累計小時)
        const uptimeEl = document.getElementById('uptime-hours');
        if (uptimeEl) {
            uptimeEl.textContent = `${totalHours.toLocaleString()}h`;
        }
    };

    // 每秒更新一次，確保數據即時
    setInterval(updateTime, 1000);
    updateTime();

    // --- 2. 面板進場動畫 (維持原樣) ---
    const panels = document.querySelectorAll('.glass-card, .sao-panel');
    setTimeout(() => {
        panels.forEach((panel, index) => {
            setTimeout(() => {
                panel.classList.add('visible');
            }, 150 * (index + 1));
        });
    }, 100);

    // --- 3. 終端機打字效果 (優化內容) ---
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

    // --- 4. 技能條進度動畫 (維持原樣) ---
    const skillData = [
        { el: document.querySelector('.fill.blue-glow'), days: 545, label: "FRC" },
        { el: document.querySelector('.fill.purple-glow'), days: 174, label: "FTC" }
    ];

    const maxDays = 545; 

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

    // --- 5. 滑鼠互動效果 (維持原樣) ---
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