const vertexShader = `
attribute float quality;

varying float vQuality;

uniform vec3 scale;
uniform float transform;

void main()
{
  vec3 uvPosition = scale * vec3(uv - 0.5, mix(0.0, position.z, transform));
  vec4 mvPosition = modelViewMatrix * vec4(mix(uvPosition, position, transform), 1.0);
  vQuality = quality;
  gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = `
uniform sampler2D colorMap;

varying float vQuality;

void main()
{
  gl_FragColor = vec4(texture2D(colorMap, vec2(vQuality, 0.5)).rgb, 1.0);
}
`;

const uniforms = {
  colorMap: {value: null},
  scale: {value: new THREE.Vector3(1, 1, 1)},
  transform: {value: 0.0}
};

const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms
});

var v0 = new THREE.Vector3(), v1 = new THREE.Vector3(), v2 = new THREE.Vector3();
var u0 = new THREE.Vector2(), u1 = new THREE.Vector2(), u2 = new THREE.Vector2();
function _compute_density(vx0, vx1, vx2, uv0, uv1, uv2) {
  vx1.sub(vx0);
  vx2.sub(vx0);
  var areas = vx1.cross(vx2).length();
  uv2.sub(uv0);
  uv1.sub(uv0);
  // for more percision, times 1000
  var texels = Math.abs(uv2.cross(uv1)) * 100;
  return texels / areas;
}

function varify(object) {

  if (!object.isMesh) {
    return;
  }

  var geometry = object.geometry;
  if (!geometry.isBufferGeometry)
  {
    return;
  }

  var position = geometry.getAttribute('position')
  var uv = geometry.getAttribute('uv');
  if (!uv) {
    throw new Error('geometry must have uv attribute');
  }
  
  var quality;
  var min_density = Infinity;
  var max_density = -Infinity;

  var positionData = position.array;
  var uvData = uv.array;

  if (!geometry.index) {
    var vertexCount = position.count;
    quality = new Float32Array(vertexCount);
    for (var i = 0; i < vertexCount; i += 3) {
      v0.fromArray(positionData, i * 3);
      v1.fromArray(positionData, (i + 1) * 3);
      v2.fromArray(positionData, (i + 2)  * 3);

      u0.fromArray(uvData, i * 2);
      u1.fromArray(uvData, (i + 1) * 2);
      u2.fromArray(uvData, (i + 2) * 2);

      var density = _compute_density(v0, v1, v2, u0, u1, u2);
      min_density = Math.min(density, min_density);
      max_density = Math.max(density, max_density);
      quality[i] = density;
      quality[i + 1] = density;
      quality[i + 2] = density;
    }
  } else {
    var indexCount = geometry.index.count;
    var indexData = geometry.index.array;
    quality = new Float32Array(indexCount);
    for (let i = 0; i < indexCount; i += 3) {
      var f0 = indexData[i], f1 = indexData[i + 1], f2 = indexData[i + 2];
      v0.fromArray(positionData, f0 * 3);
      v1.fromArray(positionData, f1 * 3);
      v2.fromArray(positionData, f2 * 3);

      u0.fromArray(uvData, f0 * 2);
      u1.fromArray(uvData, f1 * 2);
      u2.fromArray(uvData, f2 * 2);

      var density = _compute_density(v0, v1, v2, u0, u1, u2);
      min_density = Math.min(density, min_density);
      max_density = Math.max(density, max_density);
      quality[i] = density;
      quality[i + 1] = density;
      quality[i + 2] = density;
    }
  }

  var range = max_density - min_density;
  for (var i = 0; i < quality.length; ++i) {
    quality[i] = (quality[i] - min_density) / range;
  }

  geometry.computeBoundingBox();
  var box = geometry.boundingBox;
  box.getSize(uniforms.scale.value);

  geometry.addAttribute('quality', new THREE.BufferAttribute(quality, 1, false));

  object.material = material;
}

function setColorMap(name) {
  var texture = new THREE.TextureLoader().load(`colormap/${name}.png`);
  material.uniforms.colorMap.value = texture;
  material.needsUpdate = true;
}

var transform = document.getElementById('transform');
var onchange = function (event) {
  uniforms.transform.value = this.value;
}.bind(transform);

transform.addEventListener('mousedown', function() {
  if (control) {
    control.enabled = false;
  }
  window.addEventListener('mousemove', onchange, false);
  window.addEventListener('mouseup', function() {
    window.removeEventListener('mousemove', onchange);
    if (control) {
      control.enabled = true;
    }
  }, false);
}, false);
