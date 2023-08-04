import * as THREE from "three";
import { gsap } from "gsap";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const progressBarContainer = document.querySelector('.progress-bar-container');


if (navigator.userAgent.match(/Android/i)
         || navigator.userAgent.match(/webOS/i)
         || navigator.userAgent.match(/iPhone/i)
         || navigator.userAgent.match(/iPad/i)
         || navigator.userAgent.match(/iPod/i)
         || navigator.userAgent.match(/BlackBerry/i)
         || navigator.userAgent.match(/Windows Phone/i)) {
          progressBarContainer.style.display = 'none';
          const container = document.querySelector(".pageContainer")
          container.classList.add("mobile")
          container.innerHTML=`
          <h1>Desktop-only website</h1>
          <div class="social">
                <h2>Check my socials ;) </h2>
                <ul>
                    <li><a target="_blank" href="https://www.linkedin.com/in/axel-ferrufino/">linkedin -></a></li>
                    <li><a target="_blank" href="https://www.instagram.com/axel._.fer/">instagram -></a></li>
                </ul>
            </div>
          `
} else {
            
const sceneSetup = (cameraInitialPosition, cameraInitialLookAt) => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.001,
    1000
  );
  //camera.position.set(1, 1, 1.5);
  camera.position.copy(cameraInitialPosition);
  camera.lookAt(cameraInitialLookAt);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.shadowMap.enabled = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  const divContainer = document.querySelector(".background");
  divContainer.appendChild(renderer.domElement);
  scene.background = new THREE.Color(0xf1faee);

  return [renderer, scene, camera];
};

const createVideoTexture = (videoSource) => {
  const video = document.createElement("video");
  video.src = videoSource;
  video.setAttribute("style", "display: none;");
  video.setAttribute("loop", "");
  video.setAttribute("muted", "muted");
  video.setAttribute("autoplay", "true");
  document.body.appendChild(video);
  const vidTexture = new THREE.VideoTexture(video);
  return [video, vidTexture];
};

const loadModel = (modelSource) => {
  const loader = new GLTFLoader();
  loader.load(
    modelSource,
    function (gltf) {
      progressBarContainer.style.display = 'none';
      scene.add(gltf.scene);
      gltf.scene.children.forEach((child) => {
        if (
          child.userData.name === "monitor.001.screen" ||
          child.userData.name === "monitor.screen"
        ) {
          child.material.map = vidTexture;
          child.material.color = new THREE.Color("white");
        } else {
          child.castShadow = true;
          child.receiveShadow = true;
        }

        if (child instanceof THREE.Group) {
          child.children.forEach((groupchild) => {
            groupchild.castShadow = true;
            groupchild.receiveShadow = true;
          });
        }
      });
    },
    function (xhr) {
      const progressBar = document.getElementById('progress-bar');
      progressBar.value = (xhr.loaded / xhr.total) * 100;
      console.log("Background model " + (xhr.loaded / xhr.total) * 100 + "% loaded")
    },
    function (error) {
      console.error(error);
    }
  );
};

const addLight = () => {
  const sunLight = new THREE.DirectionalLight("#ffffff", 0.5);
  sunLight.castShadow = true;
  sunLight.shadow.camera.far = 20;
  sunLight.shadow.mapSize.set(4096, 4096);
  sunLight.shadow.normalBias = 0.05;
  sunLight.position.set(2, 2, 2);
  scene.add(sunLight);
  const light = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
  scene.add(light);
};

const startScene = () => {
  let stop = false;
  let fpsInterval, startTime, now, then, elapsed;

  const startAnimating = (fps) => {
    console.log("Animation starting...");
    fpsInterval = 1000 / fps;
    then = window.performance.now();
    startTime = then;
    animate();
  };

  const animate = (newtime) => {
    // stop
    if (stop) {
      return;
    }

    // request another frame

    requestAnimationFrame(animate);

    // calc elapsed time since last loop

    now = newtime;
    elapsed = now - then;

    // if enough time has elapsed, draw the next frame

    if (elapsed > fpsInterval) {
      // Get ready for next frame by setting then=now, but...
      // Also, adjust for fpsInterval not being multiple of 16.67
      then = now - (elapsed % fpsInterval);

      // draw stuff here

      //controls.update();
      renderer.render(scene, camera);
    }
  };

  startAnimating(30);
};

const cameraInitialPosition = new THREE.Vector3(1, 1, 1.5);
const cameraInitialLookAt = new THREE.Vector3(0, 1, 0.8);

const [renderer, scene, camera] = sceneSetup(
  cameraInitialPosition,
  cameraInitialLookAt
);
const [video, vidTexture] = createVideoTexture("textures/VideoNero.mp4");
video.muted = true;
video.play();
loadModel("./models/gltfFileVer6.glb");
addLight();
startScene();

//animation
const btnWho = document.querySelector("#who");
const btnWhat = document.querySelector("#what");
const btnWhere = document.querySelector("#where");
const btnHome = document.querySelector("#home");
const btnCont = document.querySelector("#contact");
const divHome = document.querySelector(".home");
const divWho = document.querySelector(".who");
const divWhat = document.querySelector(".what");
const divWhere = document.querySelector(".where");
const divCont = document.querySelector(".contact");

const title = document.querySelector(".title");
const cameraInitialRotation = new THREE.Vector3();
cameraInitialRotation.copy(camera.rotation);
console.log(cameraInitialRotation);

const showDiv =(div) =>{
  if(!divHome.classList.contains("hidden")) divHome.classList.toggle("hidden")
  if(!divWho.classList.contains("hidden")) divWho.classList.toggle("hidden")
  if(!divWhat.classList.contains("hidden")) divWhat.classList.toggle("hidden")
  if(!divWhere.classList.contains("hidden")) divWhere.classList.toggle("hidden")
  if(!divCont.classList.contains("hidden")) divCont.classList.toggle("hidden")

  if(div === divHome){
    div.classList.remove("hidden")
    if(title.classList.contains("hidden")) title.classList.toggle("hidden")
  }else {
    div.classList.toggle("hidden")
    divHome.classList.toggle("hidden")
    if(!title.classList.contains("hidden")) title.classList.toggle("hidden")
  }
}

showDiv(divHome)

btnHome.addEventListener("click", () => {
  gsap.to(camera.position, {
    x: cameraInitialPosition.x,
    y: cameraInitialPosition.y,
    z: cameraInitialPosition.z,
    ease: "power4.inOut",
    duration: 1,
    onComplete: () => showDiv(divHome)
  });
  gsap.to(camera.rotation, {
    duration: 1,
    x: cameraInitialRotation.x,
    y: cameraInitialRotation.y,
    z: cameraInitialRotation.z,
  });
});

btnWho.addEventListener("click", () => {
  gsap.to(camera.position, {
    x: 0,
    y: 2,
    z: -0.4,
    ease: "power4.inOut",
    duration: 1,
    onComplete: () => showDiv(divWho)
  });
  gsap.to(camera.rotation, {
    duration: 1,
    x: -0.1,
    y: 1,
    z: 0.1,
  });
});

btnWhat.addEventListener("click", () => {
  gsap.to(camera.position, {
    x: -1,
    y: 1.6,
    z: -0.5,
    ease: "power4.inOut",
    duration: 1,
    onComplete: () => showDiv(divWhat)
  });
  gsap.to(camera.rotation, {
    duration: 1,
    x: -0.1,
    y: -0.5,
    z: -0.1,
  });
});

btnWhere.addEventListener("click", () => {
  gsap.to(camera.position, {
    x: 0,
    y: 1.1,
    z: -0.5,
    ease: "power4.inOut",
    duration: 1,
    onComplete: () => showDiv(divWhere)
  });
  gsap.to(camera.rotation, {
    duration: 1,
    x: -0,
    y: 0.1,
    z: -0,
  });
});

btnCont.addEventListener("click", () => {
  gsap.to(camera.position, {
    x: -0.375,
    y: 0.86,
    z: -0.6,
    ease: "power4.inOut",
    duration: 1,
    onComplete: () => showDiv(divCont)
  });
  gsap.to(camera.rotation, {
    duration: 1,
    x: -1.5,
    y: 0,
    z: 0.071,
  });
});

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}
         }
