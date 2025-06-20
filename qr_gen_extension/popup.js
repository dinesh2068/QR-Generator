// let qr;

// document.getElementById('generate').onclick = function () {
//   const url = document.getElementById('url').value.trim();
//   if (!url) {
//     alert('Please enter a valid URL');
//     return;
//   }

//   const container = document.getElementById('qr-container');
//   container.innerHTML = '';

//   qr = new QRious({
//     value: url,
//     size: 200
//   });

//   const img = document.createElement('img');
//   img.src = qr.toDataURL();
//   img.id = 'qr-img';
//   container.appendChild(img);

//   document.getElementById('actions').style.display = 'block';
// };

// document.getElementById('copy').onclick = function () {
//   const img = document.getElementById('qr-img');
//   fetch(img.src)
//     .then(res => res.blob())
//     .then(blob => {
//       const item = new ClipboardItem({ 'image/png': blob });
//       navigator.clipboard.write([item]);
//       alert('QR image copied to clipboard');
//     });
// };

// document.getElementById('download').onclick = function () {
//   const img = document.getElementById('qr-img');
//   const a = document.createElement('a');
//   a.href = img.src;
//   let filename = document.getElementById('url').value.trim().replace(/[^a-z0-9]/gi, '_').toLowerCase();
//   a.download = filename + '_qr.png';
//   a.click();
// };

function showNotification(message) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.style.display = 'block';
  notification.style.opacity = '1';

  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      notification.style.display = 'none';
    }, 500);
  }, 3000);
}

document.getElementById('generate').onclick = function () {
  const url = document.getElementById('url').value.trim();
  if (!url) {
    showNotification('Please enter a valid URL');
    return;
  }

  const container = document.getElementById('qr-container');
  container.innerHTML = '';

  qr = new QRious({
    value: url,
    size: 200
  });

  const img = document.createElement('img');
  img.src = qr.toDataURL();
  img.id = 'qr-img';
  container.appendChild(img);

  document.getElementById('actions').style.display = 'block';
};

document.getElementById('copy').onclick = function () {
  const img = document.getElementById('qr-img');
  fetch(img.src)
    .then(res => res.blob())
    .then(blob => {
      const item = new ClipboardItem({ 'image/png': blob });
      navigator.clipboard.write([item]);
      showNotification('QR image copied to clipboard');
    });
};

document.getElementById('download').onclick = function () {
  const img = document.getElementById('qr-img');
  const a = document.createElement('a');
  a.href = img.src;
  let filename = document.getElementById('url').value.trim().replace(/[^a-z0-9]/gi, '_').toLowerCase();
  a.download = filename + '_qr.png';
  a.click();
};
