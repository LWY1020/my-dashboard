document.addEventListener('DOMContentLoaded', () => {
    const updateTime = () => {
    const birthDate = new Date('2008-10-20T00:00:00'); 
    const now = new Date();
    const diffMs = Math.abs(now - birthDate);
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60)); 
    
    const timeEl = document.getElementById('update-time');
    if (timeEl) {
        timeEl.textContent = `Link Start: 2008.10.20 (Uptime: ${diffHours.toLocaleString()} Hours)`;
    }
};
setInterval(updateTime, 1000);
    updateTime();

    const panels = document.querySelectorAll('.glass-card, .sao-panel');
    setTimeout(() => {
        panels.forEach((panel, index) => {
            setTimeout(() => {
                panel.classList.add('visible');
            }, 150 * (index + 1));
        });
    }, 100);

    const initTerminal = () => {
        const terminalBody = document.querySelector('.terminal-body');
        if (!terminalBody) return;

        const logs = [
            "[INFO] Initializing LWY Core Systems...",
            "[INFO] Password: 20081020",
            "[INFO] Syncing Robotics Database (FRC/FTC)...",
            "[SUCCESS] Status: Data stream running stable.",
            ">> Welcome to LWY's personal website."
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
                    setTimeout(typeChar, Math.random() * 30 + 20); // 打字速度
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

    const navLinks = document.querySelectorAll('.nav-links li');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const text = link.textContent;
            let targetElement = text.includes("關於我") ? document.querySelector('.sidebar') : 
                                text.includes("首頁") ? document.querySelector('.main-post') : null;

            if (targetElement) {
                const offsetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 100;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });

                targetElement.animate([
                    { boxShadow: '0 0 0px var(--intp-main)', transform: 'scale(1)' },
                    { boxShadow: '0 0 30px var(--intp-main)', transform: 'scale(1.01)' },
                    { boxShadow: '0 0 0px var(--intp-main)', transform: 'scale(1)' }
                ], { duration: 1000, easing: 'ease-in-out' });
            }
        });
    });

    panels.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(96, 165, 250, 0.15), transparent 40%), var(--intp-glass-bg)`;
            card.style.borderColor = 'rgba(96, 165, 250, 0.5)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.background = `var(--intp-glass-bg)`;
            card.style.borderColor = 'var(--intp-glass-border)';
        });
    });
});