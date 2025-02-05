// Dynamically load the YouTube IFrame API
function loadYoutubeAPI() {
  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}
loadYoutubeAPI();

let player;

// This function must be in the global scope so the YouTube API can call it
window.onYouTubeIframeAPIReady = function() {
  player = new YT.Player('player', {
    height: '360',
    width: '640',
    videoId: 'dQw4w9WgXcQ',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
};

// Extract video ID from a YouTube URL
function getVideoId(url) {
  try {
    const videoUrl = new URL(url);
    const urlParams = new URLSearchParams(videoUrl.search);
    return urlParams.get('v');
  } catch (error) {
    return null;
  }
}

// Called when the player is ready
function onPlayerReady(event) {
  updateVideoInfo();
}

// Log state changes (for debugging or future enhancements)
function onPlayerStateChange(event) {
  console.log('Player state changed:', event.data);
}

// Loads a new video when the user enters a URL
window.loadVideo = function() {
  const url = document.getElementById('videoUrl').value;
  const videoId = getVideoId(url);
  if (videoId) {
    player.loadVideoById(videoId);
    setTimeout(updateVideoInfo, 1000); // Wait briefly to load the new video data
  } else {
    alert('Invalid YouTube URL');
  }
};

// Updates the video information on the page
function updateVideoInfo() {
  const info = {
    title: player.getVideoData().title,
    duration: formatDuration(player.getDuration()),
    current: formatDuration(player.getCurrentTime()),
    state: getPlayerState(player.getPlayerState()),
    url: player.getVideoUrl(),
    playbackRate: player.getPlaybackRate(),
    volume: player.getVolume()
  };

  document.getElementById('videoInfo').innerHTML = `
    <h3>Video Information:</h3>
    <p><strong>Title:</strong> ${info.title}</p>
    <p><strong>Duration:</strong> ${info.duration}</p>
    <p><strong>Current Time:</strong> ${info.current}</p>
    <p><strong>Player State:</strong> ${info.state}</p>
    <p><strong>Playback Rate:</strong> ${info.playbackRate}x</p>
    <p><strong>Volume:</strong> ${info.volume}%</p>
  `;
}

// Format seconds into HH:MM:SS
function formatDuration(seconds) {
  seconds = Math.floor(seconds);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// Convert player state number to a descriptive string
function getPlayerState(state) {
  const states = {
    '-1': 'unstarted',
    '0': 'ended',
    '1': 'playing',
    '2': 'paused',
    '3': 'buffering',
    '5': 'video cued'
  };
  return states[state] || 'unknown';
}

// Update video info every second while the video is playing
setInterval(() => {
  if (player && player.getPlayerState() === 1) {
    updateVideoInfo();
  }
}, 1000);