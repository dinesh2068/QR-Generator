function showNotification(message) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.style.opacity = '1';
  notification.style.pointerEvents = 'auto';
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.pointerEvents = 'none';
  }, 2200);
}

let qr = null;

function generateQR(url) {
  if (!url) return;
  const container = document.getElementById('qr-container');
  container.innerHTML = '';

  qr = new QRious({
    value: url,
    size: 200,
    background: 'white',
    foreground: 'black',
    level: 'L'
  });

  const img = document.createElement('img');
  img.src = qr.toDataURL();
  img.id = 'qr-img';
  img.alt = 'QR code';
  container.appendChild(img);

  document.getElementById('actions').style.display = 'flex';
}

function setUrlFromActiveTab() {
  try {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (!tabs || tabs.length === 0) return;
      const tab = tabs[0];
      const urlInput = document.getElementById('url');
      const url = tab && tab.url ? tab.url : '';
      urlInput.value = url;
      if (url) generateQR(url);
    });
  } catch (err) {
    console.error('Tab fetch error:', err);
  }
}

document.getElementById('generate').onclick = function () {
  const url = document.getElementById('url').value.trim();
  if (!url) {
    showNotification('Please enter a valid URL');
    return;
  }
  generateQR(url);
};

document.getElementById('copy').onclick = async function () {
  const img = document.getElementById('qr-img');
  if (!img) {
    showNotification('No QR to copy');
    return;
  }
  try {
    const response = await fetch(img.src);
    const blob = await response.blob();
    if (navigator.clipboard && window.ClipboardItem) {
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      showNotification('QR copied to clipboard');
    } else {
      showNotification('Clipboard not supported');
    }
  } catch (e) {
    console.error(e);
    showNotification('Copy failed');
  }
};

document.getElementById('download').onclick = function () {
  const img = document.getElementById('qr-img');
  if (!img) {
    showNotification('No QR to download');
    return;
  }
  const a = document.createElement('a');
  a.href = img.src;
  let filename = document.getElementById('url').value.trim()
    .replace(/(^\w+:|^)\/\//, '')
    .replace(/[^a-z0-9]/gi, '_')
    .toLowerCase();
  if (!filename) filename = 'qr';
  a.download = filename + '_qr.png';
  document.body.appendChild(a);
  a.click();
  a.remove();
  showNotification('QR downloaded');
};

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('actions').style.display = 'none';
  setUrlFromActiveTab();
});
