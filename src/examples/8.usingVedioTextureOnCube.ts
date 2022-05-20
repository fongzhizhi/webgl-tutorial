import { requestAnimationFrameDraw } from "./4.drawingAAnimatingSquare";
import { drawingACube } from "./7.usingLighting";

let video: HTMLVideoElement = null;
let copyVideo = false;

/**
 * 在立方体上使用视频纹理对象
 */
export function usingVedioTextureOnCube() {
  const vedios = [
    // 'src/assets/01.mp4',
    // 'src/assets/02.mp4',
    // 'src/assets/03.mp4',
    "src/assets/04.mp4",
  ];
  loadVedio(vedios);
  requestAnimationFrameDraw((radian) => {
    // video未准备好的时候使用纯黑色过度一下
    drawingACube(
      radian,
      copyVideo ? video : new Uint8Array([255, 255, 255, 1])
    );
  }, 0.5);
}

/**加载 Video */
function loadVedio(urls: string[]) {
  if (video) {
    return;
  }
  video = document.createElement("video");
  const hasMore = urls.length > 1;
  // 自动静音循环播放
  video.muted = true;
  if (!hasMore) {
    video.autoplay = true;
    video.loop = true;
  }

  // 状态监听
  let i = 0;
  var playing = false;
  var timeupdate = false;
  // 开始播放
  video.addEventListener("playing", () => {
    playing = true;
    checkReady();
  });
  video.addEventListener("timeupdate", () => {
    timeupdate = true;
    checkReady();
  });
  // 播放结束,继续播放下一p
  hasMore &&
    video.addEventListener("ended", () => {
      copyVideo = false;
      requestAnimationFrame(() => {
        video.src = urls[i++];
        video.play();
        if (i >= urls.length) {
          i = 0;
        }
      });
    });

  video.src = urls[i++];
  video.play();

  function checkReady() {
    if (playing && timeupdate) {
      copyVideo = true;
    }
  }
}
