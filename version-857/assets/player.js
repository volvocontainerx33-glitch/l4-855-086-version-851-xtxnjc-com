import { H as Hls } from './hls-vendor-dru42stk.js';

var dataNode = document.getElementById('player-data');
var video = document.querySelector('[data-video]');
var cover = document.querySelector('[data-play]');
var payload = null;
var prepared = false;
var hlsInstance = null;

try {
  payload = dataNode ? JSON.parse(dataNode.textContent) : null;
} catch (error) {
  payload = null;
}

function attach() {
  if (!payload || !payload.source || !video || prepared) {
    return;
  }

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = payload.source;
  } else if (Hls && Hls.isSupported()) {
    hlsInstance = new Hls({ enableWorker: true });
    hlsInstance.loadSource(payload.source);
    hlsInstance.attachMedia(video);
  } else {
    video.src = payload.source;
  }

  prepared = true;
}

function begin() {
  attach();

  if (cover) {
    cover.classList.add('is-hidden');
  }

  if (video) {
    video.setAttribute('controls', 'controls');
    var playResult = video.play();

    if (playResult && typeof playResult.catch === 'function') {
      playResult.catch(function () {});
    }
  }
}

if (cover) {
  cover.addEventListener('click', begin);
}

if (video) {
  video.addEventListener('click', function () {
    if (!prepared) {
      begin();
    }
  });
}

window.addEventListener('beforeunload', function () {
  if (hlsInstance) {
    hlsInstance.destroy();
  }
});
