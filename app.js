// Register GSAP plugins if needed
// gsap.registerPlugin(...)

function playPhishing() {
    const tl = gsap.timeline();
    // Reset
    gsap.set('.phish-email', { left: '90%', opacity: 0, scale: 1 });
    gsap.set('.phish-modal', { scale: 0, opacity: 0 });
    gsap.set('.phish-creds', { left: '10%', opacity: 0 });

    tl.to('.phish-email', { opacity: 1, duration: 0.2 })
      .to('.phish-email', { left: '10%', duration: 1.5, ease: "power1.inOut" })
      .to('.phish-email', { scale: 0, opacity: 0, duration: 0.2 })
      .to('.phish-modal', { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" })
      // Simulate typing
      .to({}, { duration: 1 }) // wait
      .to('.phish-modal', { scale: 0, opacity: 0, duration: 0.3 })
      .to('.phish-creds', { opacity: 1, duration: 0.2 })
      .to('.phish-creds', { left: '90%', duration: 1.5, ease: "power1.inOut" })
      .to('.phish-creds', { scale: 0, opacity: 0, duration: 0.5 });
}

function playDDoS() {
    const tl = gsap.timeline();
    const bots = document.querySelectorAll('.bot');
    const server = document.getElementById('ddos-server');
    
    // Reset
    server.style.color = 'var(--success)';
    gsap.set('.ddos-user-packet', { left: '15%', top: '80%', opacity: 0 });
    document.querySelectorAll('.bot-packet').forEach(p => p.remove());

    // Bot attack storm
    for(let i=0; i<15; i++) {
        bots.forEach(bot => {
            const p = document.createElement('div');
            p.className = 'packet danger-packet bot-packet';
            p.innerHTML = '<i class="fas fa-bolt"></i>';
            document.getElementById('stage-ddos').appendChild(p);
            
            const botRect = bot.getBoundingClientRect();
            const stageRect = document.getElementById('stage-ddos').getBoundingClientRect();
            
            let startX = ((botRect.left - stageRect.left) / stageRect.width) * 100;
            let startY = ((botRect.top - stageRect.top) / stageRect.height) * 100;

            gsap.set(p, { left: startX + '%', top: startY + '%', opacity: 1, scale: 0.5 });
            tl.to(p, { left: '50%', top: '50%', duration: 0.3 + Math.random()*0.3, opacity: 0 }, i * 0.1);
        });
    }

    // Server turns red
    tl.to(server, { color: 'var(--danger)', duration: 0.5 }, "-=1");

    // Valid user tries
    tl.to('.ddos-user-packet', { opacity: 1, duration: 0.2 })
      .to('.ddos-user-packet', { left: '40%', top: '55%', duration: 1 })
      .to('.ddos-user-packet', { left: '10%', top: '90%', opacity: 0, duration: 0.5, ease: "power1.out" }); // Bounced
}

function playBruteForce() {
    const term = document.getElementById('brute-text');
    const status = document.getElementById('brute-status');
    const server = document.getElementById('brute-server');
    
    // Reset
    status.innerHTML = '<i class="fas fa-lock"></i>';
    status.style.color = '#555';
    server.style.color = 'var(--success)';
    term.innerText = "Initiating Hydra...\nTarget: 192.168.1.10\nUser: admin\n";
    
    let attempts = ["admin", "password", "123456", "qwerty", "root", "admin123"];
    let i = 0;
    
    let interval = setInterval(() => {
        if(i < attempts.length) {
            term.innerHTML += `Trying '${attempts[i]}' ... <span style='color:red'>Failed</span>\n`;
            term.scrollTop = term.scrollHeight;
            i++;
        } else {
            clearInterval(interval);
            term.innerHTML += `Trying 'P@ssw0rd' ... <span style='color:#00ff88'>SUCCESS!</span>\n`;
            term.scrollTop = term.scrollHeight;
            
            gsap.to(status, { color: 'var(--success)', duration: 0.3 });
            status.innerHTML = '<i class="fas fa-lock-open"></i>';
            gsap.to(server, { color: 'var(--danger)', duration: 0.5 });
        }
    }, 400);
}

function playMitM() {
    const tl = gsap.timeline();
    // Reset
    gsap.set('.mitm-packet-1', { left: '10%', opacity: 0 });
    gsap.set('.mitm-packet-2', { left: '50%', opacity: 0 });

    tl.to('.mitm-packet-1', { opacity: 1, duration: 0.2 })
      .to('.mitm-packet-1', { left: '50%', duration: 1, ease: "power1.inOut" })
      .to('.mitm-packet-1', { scale: 0, opacity: 0, duration: 0.2 }) // intercepted
      .to('.mitm-packet-2', { scale: 1, opacity: 1, duration: 0.2 }) // altered
      .to('.mitm-packet-2', { left: '90%', duration: 1, ease: "power1.inOut" })
      .to('.mitm-packet-2', { opacity: 0, duration: 0.2 });
}

function playPassive() {
    const tl = gsap.timeline();
    gsap.set('.passive-data', { left: '10%', opacity: 0 });
    gsap.set('.clone-data', { left: '10%', top: '50%', opacity: 0 });

    tl.to('.passive-data', { opacity: 1, duration: 0.2 })
      .to('.passive-data', { left: '30%', duration: 0.5, ease: "linear" })
      .to('.clone-data', { opacity: 0.5, left: '30%', duration: 0 }, "<") // appear mid-way
      .to('.passive-data', { left: '90%', duration: 1.5, ease: "linear" })
      .to('.clone-data', { left: '50%', top: '20%', duration: 1 }, "-=1.5") // flies to hacker
      .to('.passive-data', { opacity: 0, duration: 0.2 })
      .to('.clone-data', { opacity: 0, duration: 0.2 });
}

function playActive() {
    const tl = gsap.timeline();
    const server = document.getElementById('active-server');
    
    gsap.set('.active-p1', { left: '10%', top: '50%', opacity: 0 });
    gsap.set('.active-p2', { left: '50%', top: '20%', opacity: 0 });
    server.style.color = 'var(--success)';

    tl.to('.active-p1', { opacity: 1, duration: 0.2 })
      .to('.active-p1', { left: '50%', top: '20%', duration: 1 }) // dragged to hacker
      .to('.active-p1', { scale: 0, opacity: 0, duration: 0.2 }) // destroyed
      .to('.active-p2', { opacity: 1, scale: 1, duration: 0.2 }) // injected
      .to('.active-p2', { left: '90%', top: '50%', duration: 1 })
      .to('.active-p2', { opacity: 0, duration: 0.2 })
      .to(server, { color: 'var(--danger)', duration: 0.3 }); // Infected
}

function playHashing() {
    const tl = gsap.timeline();
    const input = document.getElementById('hash-input');
    const output = document.getElementById('hash-output');
    const gear = document.getElementById('hash-gear');
    const q = document.getElementById('hash-q');

    gsap.set(input, { left: '10%', opacity: 1, innerText: '"apple"' });
    output.innerText = '';
    gsap.set(output, { right: '10%', top: '75%', opacity: 0 });
    gsap.set(q, { opacity: 0, y: 0 });

    tl.to(input, { left: '46%', duration: 1 })
      .to(input, { opacity: 0, duration: 0.2 })
      .to(gear, { rotation: 360, duration: 1 })
      .add(() => { output.innerText = '02a8b9f...'; })
      .to(output, { opacity: 1, duration: 0.2 })
      .to(q, { opacity: 1, y: -20, duration: 0.5, ease: "bounce.out" }, "+=0.5")
      .to(q, { opacity: 0, duration: 0.5 }, "+=1");
}

function playSymmetric() {
    const tl = gsap.timeline();
    const packet = document.getElementById('sym-packet');
    
    gsap.set(packet, { left: '10%', opacity: 0, backgroundColor: 'var(--primary)', color: '#000', innerText: 'Hello' });
    gsap.set('.key-alice', { top: '30%', opacity: 0 });
    gsap.set('.key-bob', { top: '30%', opacity: 0 });

    tl.to(packet, { opacity: 1, duration: 0.2 })
      .to(packet, { left: '25%', duration: 0.5 })
      .to('.key-alice', { top: '40%', opacity: 1, duration: 0.5 })
      .to('.key-alice', { top: '30%', opacity: 0, duration: 0.2 }) // key applied
      .add(() => { 
          packet.innerText = '$#X12@'; 
          packet.style.backgroundColor = '#555'; 
          packet.style.color = '#fff';
      }) // locked
      .to(packet, { left: '75%', duration: 1.5 })
      .to('.key-bob', { top: '40%', opacity: 1, duration: 0.5 })
      .to('.key-bob', { top: '30%', opacity: 0, duration: 0.2 }) // key applied
      .add(() => { 
          packet.innerText = 'Hello'; 
          packet.style.backgroundColor = 'var(--primary)'; 
          packet.style.color = '#000';
      }) // unlocked
      .to(packet, { left: '90%', duration: 0.5 })
      .to(packet, { opacity: 0, duration: 0.5 });
}

function playFirewall() {
    const tl = gsap.timeline();
    
    gsap.set('.fw-bad', { left: '10%', top: '20%', opacity: 0 });
    gsap.set('.fw-good', { left: '10%', top: '80%', opacity: 0 });
    gsap.set('.fw-block-effect', { opacity: 0, scale: 0.5, top: '20%' });

    // Bad packet
    tl.to('.fw-bad', { opacity: 1, duration: 0.2 })
      .to('.fw-bad', { left: '46%', duration: 1 })
      .to('.fw-block-effect', { opacity: 1, scale: 1, duration: 0.2 })
      .to('.fw-bad', { opacity: 0, scale: 0, top: '40%', duration: 0.5 }) // drops
      .to('.fw-block-effect', { opacity: 0, duration: 0.2 })
      
    // Good packet
      .to('.fw-good', { opacity: 1, duration: 0.2 })
      .to('.fw-good', { left: '50%', duration: 1 })
      .to('.fw-good', { left: '90%', duration: 1 }) // passes through
      .to('.fw-good', { opacity: 0, duration: 0.2 });
}

function playHTTPS() {
    const tl = gsap.timeline();
    
    gsap.set('.http-packet', { left: '10%', opacity: 0 });
    gsap.set('.https-packet', { left: '10%', opacity: 0 });

    tl.to('.http-packet', { opacity: 1, duration: 0.2 })
      .to('.http-packet', { left: '50%', duration: 1 })
      .to('.http-packet', { left: '90%', duration: 1 })
      .to('.http-packet', { opacity: 0, duration: 0.2 })
      
      .to('.https-packet', { opacity: 1, duration: 0.2 })
      .to('.https-packet', { left: '30%', duration: 0.5 }) // enter tunnel
      .to('.https-packet', { opacity: 0, duration: 0.1 }) // hidden in tunnel
      .to('.https-packet', { left: '70%', duration: 1 }) // moves in tunnel
      .to('.https-packet', { opacity: 1, left: '90%', duration: 0.5 }) // exits
      .to('.https-packet', { opacity: 0, duration: 0.2 });
}
