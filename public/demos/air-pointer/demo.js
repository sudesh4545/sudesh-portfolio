const $ = (id) => document.getElementById(id);
const video = $('camera'), canvas = $('landmarks'), ctx = canvas.getContext('2d');
const stage = $('playground'), cursor = $('cursor'), target = $('target');
let tracker, stream, frame, score = 0, pinched = false, lastTime = -1, position, generation = 0;
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
function hit() {
  $('score').textContent = String(++score);
  target.style.left = `${15 + Math.random() * 65}%`;
  target.style.top = `${25 + Math.random() * 45}%`;
}
target.addEventListener('click', hit);
$('reset').addEventListener('click', () => { score = 0; $('score').textContent = '0'; });
function stop() {
  generation++;
  cancelAnimationFrame(frame);
  stream?.getTracks().forEach((track) => track.stop());
  stream = undefined;
  video.srcObject = null;
  cursor.hidden = true;
  $('empty').hidden = false;
  $('empty').style.display = '';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  $('start').disabled = false; $('stop').disabled = true;
  $('status').textContent = 'Camera off';
  pinched = false; position = undefined; lastTime = -1;
}
function predict() {
  if (!stream) return;
  try {
    if (video.readyState >= 2 && video.currentTime !== lastTime) {
      lastTime = video.currentTime;
      canvas.width = video.videoWidth; canvas.height = video.videoHeight;
      const points = tracker.detectForVideo(video, performance.now()).landmarks?.[0];
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cursor.hidden = !points;
      if (points) {
        ctx.fillStyle = '#55e5ed';
        for (const p of points) { ctx.beginPath(); ctx.arc(p.x * canvas.width, p.y * canvas.height, 4, 0, Math.PI * 2); ctx.fill(); }
        const smoothing = Number($('stability').value);
        const x = Math.max(0, Math.min(1, (1 - points[8].x - .1) / .8));
        const y = Math.max(0, Math.min(1, (points[8].y - .1) / .8));
        position = position ? { x: position.x + (x - position.x) * smoothing, y: position.y + (y - position.y) * smoothing } : { x, y };
        cursor.style.left = `${position.x * 100}%`; cursor.style.top = `${position.y * 100}%`;
        const ratio = distance(points[4], points[8]) / Math.max(distance(points[0], points[9]), .06);
        const nextPinched = ratio < (pinched ? .48 : .35);
        if (nextPinched && !pinched) {
          const bounds = stage.getBoundingClientRect(), targetBounds = target.getBoundingClientRect();
          const px = bounds.left + position.x * bounds.width, py = bounds.top + position.y * bounds.height;
          if (px >= targetBounds.left && px <= targetBounds.right && py >= targetBounds.top && py <= targetBounds.bottom) hit();
        }
        pinched = nextPinched;
        cursor.style.background = pinched ? '#55e5ed' : 'transparent';
        $('status').textContent = pinched ? 'Pinch detected' : 'Hand tracked · point to move';
      } else { pinched = false; position = undefined; $('status').textContent = 'Show one hand to the camera'; }
    }
    frame = requestAnimationFrame(predict);
  } catch (error) { stop(); $('status').textContent = `Tracking stopped: ${error.message}`; }
}
$('start').addEventListener('click', async () => {
  const session = ++generation;
  $('start').disabled = true; $('stop').disabled = false;
  $('status').textContent = 'Loading tracking engine…';
  try {
    if (!tracker) {
      const { FilesetResolver, HandLandmarker } = await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/vision_bundle.mjs');
      const vision = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/wasm');
      tracker = await HandLandmarker.createFromOptions(vision, { baseOptions: { modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task' }, runningMode: 'VIDEO', numHands: 1 });
    }
    if (session !== generation) return;
    const cameraStream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 }, audio: false });
    if (session !== generation) { cameraStream.getTracks().forEach((track) => track.stop()); return; }
    stream = cameraStream; video.srcObject = stream; await video.play();
    if (session !== generation) return;
    $('empty').style.display = 'none';
    predict();
  } catch (error) {
    if (session !== generation) return;
    stop(); $('status').textContent = `Could not start: ${error.message}. Check camera access and internet connection.`;
  }
});
$('stop').addEventListener('click', stop);
window.addEventListener('pagehide', stop);
document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') stop(); });
