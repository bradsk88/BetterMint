function toggleTip(checked) {
    document.getElementById('tip-percent').hidden = !checked;
}

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get('tipPercent', (v) => {
        if (v['tipPercent'] && v['tipPercent'] !== "") {
            document.getElementById('tip-percent-input').value = v['tipPercent'];
            document.getElementById('tip-enable-checkbox').checked = true;
            document.getElementById('tip-percent').hidden = false;
        } else {
            document.getElementById('tip-percent-input').value = 20;
            document.getElementById('tip-enable-checkbox').checked = false;
        }
    });
    document.getElementById('tip-enable-checkbox')
        .addEventListener('change', (event) => {
            toggleTip(event.target.checked);
        })
    document.getElementById('save').addEventListener('click', () => {
        let tipPercent = "";
        if (document.getElementById('tip-enable-checkbox').checked) {
            tipPercent = document.getElementById('tip-percent-input').value;
        }
        const settings = {
            'tipPercent': tipPercent,
        };
        console.log('saving', settings);
        chrome.storage.sync.set(settings);
    });
})