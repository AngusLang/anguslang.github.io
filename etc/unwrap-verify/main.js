var width, height;
var canvas, renderer, scene, camera, control;
var needRender = false;

function init() {
  console.log('unwrap-varify')

  canvas = document.getElementById('canvas');

  width = window.innerWidth;
  height = window.innerHeight;

  renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
  renderer.setSize(width, height);
  renderer.setPixelRatio(2);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf1f3f5);

  camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 10000.0);
  camera.position.set(0, 0, 4);
  control = new THREE.OrbitControls(camera);

  window.addEventListener('resize', function() {
    width = window.innerWidth;
    height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
  }, false);

  // green code, reduce energy consumption
  window.addEventListener('mousedown', function() {
    needRender = true;
  }, false);

  window.addEventListener('mouseup', function() {
    needRender = false;
  }, false);

  window.addEventListener('mousewheel', function() {
    frame();
  }, false);

  setColorMap('rainbow');
  frame();
  ondrop(canvas, loadModel);
}

const extension = ['obj'];
async function parseFile(file) {
  var name = file.name;
  var ext = suffix(name, '.');
  if (extension.indexOf(ext) < 0) {
    throw new Error('Unsupported extension.');
  }
  var content = await readString(file);
  var loader = new THREE.OBJLoader();
  var group = loader.parse(content);
  group.traverse(varify);
  scene.add( group );
  frame();
}

function loadModel(files) {
  var pendings = [];
  for (let i = 0; i < files.length; ++i) {
    const file = files[i];
    pendings.push(parseFile(file));
  }
  Promise.all(pendings);
}

function frame() {
  renderer.render(scene, camera);
}

function loop() {
  camera.lookAt(scene.position);
  if (needRender || control.update()) {
    frame();
  }
  requestAnimationFrame(loop);
}

init();
loop();