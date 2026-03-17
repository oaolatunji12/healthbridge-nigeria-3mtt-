let currentUssdPath = "start";
let ussdHistory = [];

function startUssd() {
    const input = document.getElementById('ussd-input').value;
    if (input === '*123#') {
        document.getElementById('dialer-screen').classList.remove('active');
        document.getElementById('ussd-screen').classList.add('active');
        currentUssdPath = "start";
        ussdHistory = [];
        renderUssdScreen();
    } else {
        alert("Invalid USSD code. Try *123#");
    }
}

function cancelUssd() {
    document.getElementById('dialer-screen').classList.add('active');
    document.getElementById('ussd-screen').classList.remove('active');
    document.getElementById('ussd-reply').value = '';
}

function renderUssdScreen() {
    const node = ussdMenus[currentUssdPath];
    if (node) {
        document.getElementById('ussd-text').innerText = node.text;
        if (node.sms) {
            triggerSms(node.sms);
        }
    } else {
        document.getElementById('ussd-text').innerText = "Session timeout or error.";
    }
}

function sendUssd() {
    const reply = document.getElementById('ussd-reply').value.trim();
    document.getElementById('ussd-reply').value = '';
    
    if (!reply) return;
    
    const node = ussdMenus[currentUssdPath];
    if (node && node.options) {
        let nxt = node.options[reply];
        if (nxt) {
            if (nxt === 'exit') {
                cancelUssd();
            } else if (typeof nxt === 'string') {
                ussdHistory.push(currentUssdPath);
                currentUssdPath = nxt;
                renderUssdScreen();
            } else if (typeof nxt === 'object') {
                document.getElementById('ussd-text').innerText = nxt.text;
                if (nxt.sms) {
                    triggerSms(nxt.sms);
                }
                ussdMenus['temp_node'] = {
                    text: nxt.text,
                    options: nxt.options
                };
                ussdHistory.push(currentUssdPath);
                currentUssdPath = 'temp_node';
            }
        } else {
            // Keep current menu, append error
            document.getElementById('ussd-text').innerText = node.text + "\n\nInvalid option. Try again.";
        }
    }
}

function triggerSms(message) {
    const popup = document.getElementById('sms-popup');
    document.getElementById('sms-body-text').innerText = message;
    popup.classList.add('active');
    
    // Auto close after 8 seconds
    setTimeout(() => {
        closeSms();
    }, 8000);
}

function closeSms() {
    document.getElementById('sms-popup').classList.remove('active');
}
