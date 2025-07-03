import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';

// Scene setup
const isMobile = window.innerWidth <= 600;
const scaleFactor = isMobile ? 0.6 : 1;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(isMobile ? 90 : 75, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(30 * scaleFactor, 5 * scaleFactor, 35 * scaleFactor);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor('#121212', 1);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// OrbitControls with touch support
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(30 * scaleFactor, 0, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.update();

// Starfield setup
const starCount = isMobile ? 2000 : 5000;
const starGeometry = new THREE.BufferGeometry();
const starPositions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount * 3; i += 3) {
  const radius = 500 + Math.random() * 500;
  const theta = Math.random() * 2 * Math.PI;
  const phi = Math.acos(2 * Math.random() - 1);
  starPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
  starPositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
  starPositions[i + 2] = radius * Math.cos(phi);
}
starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: isMobile ? 1 : 1.5,
  sizeAttenuation: true
});
const starField = new THREE.Points(starGeometry, starMaterial);
scene.add(starField);

// Texture loader
const loader = new THREE.TextureLoader();

// Materials with textures and fallback colors
const materials = {
  sun: new THREE.MeshStandardMaterial({ 
    map: loader.load('/assets/textures/sun.jpg', 
      texture => console.log('Sun texture loaded successfully'), 
      undefined, 
      () => console.error('Failed to load sun texture')
    ),
    color: 0xffff00,
    // emissive: 0xffaa00,
    // emissiveIntensity: 0.3
  }),
  mercury: new THREE.MeshStandardMaterial({ 
    map: loader.load('/assets/textures/mercury.jpg', 
      texture => console.log('Mercury texture loaded successfully'), 
      undefined, 
      () => console.error('Failed to load mercury texture')
    ),
    color: 0xb5b5b5
  }),
  venus: new THREE.MeshStandardMaterial({ 
    map: loader.load('/assets/textures/venus.jpg', 
      texture => console.log('Venus texture loaded successfully'), 
      undefined, 
      () => console.error('Failed to load venus texture')
    ),
    color: 0xe6c229
  }),
  earth: new THREE.MeshStandardMaterial({ 
    map: loader.load('/assets/textures/earth.jpg', 
      texture => console.log('Earth texture loaded successfully'), 
      undefined, 
      () => console.error('Failed to load earth texture')
    ),
    color: 0x3498db
  }),
  mars: new THREE.MeshStandardMaterial({ 
    map: loader.load('/assets/textures/mars.jpg', 
      texture => console.log('Mars texture loaded successfully'), 
      undefined, 
      () => console.error('Failed to load mars texture')
    ),
    color: 0xe74c3c
  }),
  jupiter: new THREE.MeshStandardMaterial({ 
    map: loader.load('/assets/textures/jupiter.jpg', 
      texture => console.log('Jupiter texture loaded successfully'), 
      undefined, 
      () => console.error('Failed to load jupiter texture')
    ),
    color: 0xe67e22
  }),
  saturn: new THREE.MeshStandardMaterial({ 
    map: loader.load('/assets/textures/saturn.jpg', 
      texture => console.log('Saturn texture loaded successfully'), 
      undefined, 
      () => console.error('Failed to load saturn texture')
    ),
    color: 0xf1c40f
  }),
  uranus: new THREE.MeshStandardMaterial({ 
    map: loader.load('/assets/textures/uranus.jpg', 
      texture => console.log('Uranus texture loaded successfully'), 
      undefined, 
      () => console.error('Failed to load uranus texture')
    ),
    color: 0x1abc9c
  }),
  neptune: new THREE.MeshStandardMaterial({ 
    map: loader.load('/assets/textures/neptune.jpg', 
      texture => console.log('Neptune texture loaded successfully'), 
      undefined, 
      () => console.error('Failed to load neptune texture')
    ),
    color: 0x3498db
  }),
  pluto: new THREE.MeshStandardMaterial({ 
    map: loader.load('/assets/textures/pluto.jpeg', 
      texture => console.log('Pluto texture loaded successfully'), 
      undefined, 
      () => console.error('Failed to load pluto texture')
    ),
    color: 0x95a5a6
  }),
  saturnRings: new THREE.MeshStandardMaterial({
    map: loader.load('/assets/textures/saturn_rings.png',
      texture => console.log('Saturn rings texture loaded successfully'),
      undefined,
      () => console.error('Failed to load saturn rings texture')
    ),
    color: 0xaaaaaa,
    transparent: true,
    side: THREE.DoubleSide
  })
};

// Geometry for planets and rings
const geometry = new THREE.SphereGeometry(1, 32, 32);
const ringGeometry = new THREE.RingGeometry(1.5, 3, 32, 1);

// Sun
const sunMesh = new THREE.Mesh(geometry, materials.sun);
sunMesh.position.set(0, 0, 0);
sunMesh.scale.setScalar(10 * scaleFactor);
sunMesh.name = 'sun';
scene.add(sunMesh);

// Planets with real-world orbital and rotational periods
const planets = [
  { name: 'mercury', distance: 25, scale: 0.8, orbitalPeriod: 87.97, rotationalPeriod: 58.65, retrograde: false },
  { name: 'venus', distance: 28, scale: 0.9, orbitalPeriod: 224.7, rotationalPeriod: 243.02, retrograde: true },
  { name: 'earth', distance: 31, scale: 1, orbitalPeriod: 365.25, rotationalPeriod: 1.0, retrograde: false },
  { name: 'mars', distance: 34, scale: 0.8, orbitalPeriod: 686.98, rotationalPeriod: 1.03, retrograde: false },
  { name: 'jupiter', distance: 42, scale: 3.5, orbitalPeriod: 4332.59, rotationalPeriod: 0.41, retrograde: false },
  { name: 'saturn', distance: 50, scale: 2.9, orbitalPeriod: 10759.22, rotationalPeriod: 0.45, retrograde: false, ringScale: 1 },
  { name: 'uranus', distance: 56, scale: 1.7, orbitalPeriod: 30688.5, rotationalPeriod: 0.72, retrograde: true },
  { name: 'neptune', distance: 60, scale: 1.65, orbitalPeriod: 59800.0, rotationalPeriod: 0.67, retrograde: false },
  { name: 'pluto', distance: 64, scale: 0.5, orbitalPeriod: 90560.0, rotationalPeriod: 6.39, retrograde: true }
];

// Create planet groups, meshes, and orbital paths
const planetGroups = planets.map(planet => {
  const group = new THREE.Group();
  const mesh = new THREE.Mesh(geometry, materials[planet.name]);
  mesh.position.set(planet.distance * scaleFactor, 0, 0);
  mesh.scale.setScalar(planet.scale * scaleFactor);
  mesh.name = planet.name;
  group.add(mesh);
  scene.add(group);
  console.log(`Assigned material for ${planet.name}:`, materials[planet.name]);

  // Add rings for Saturn
  let ringMesh = null;
  if (planet.name === 'saturn') {
    ringMesh = new THREE.Mesh(ringGeometry, materials.saturnRings);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.scale.setScalar((planet.ringScale || 1) * scaleFactor);
    group.add(ringMesh);
  }

  // Create orbital path
  const curve = new THREE.EllipseCurve(0, 0, planet.distance * scaleFactor, planet.distance * scaleFactor, 0, 2 * Math.PI, false, 0);
  const points = curve.getPoints(32);
  const pathGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const pathMaterial = new THREE.LineBasicMaterial({ color: 0xaaaaaa });
  const orbitPath = new THREE.Line(pathGeometry, pathMaterial);
  orbitPath.rotation.x = Math.PI / 2;
  scene.add(orbitPath);

  return { group, mesh, ringMesh, orbitalPeriod: planet.orbitalPeriod, rotationalPeriod: planet.rotationalPeriod, retrograde: planet.retrograde, scale: planet.scale, ringScale: planet.ringScale };
});

// Lighting
const pointLight = new THREE.PointLight(0xffffff, 1.25);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight("#d0cdcd", 1);
scene.add(ambientLight);

// lil-gui control panel
const gui = new GUI();
const params = {
  animationSpeed: 0.01,
  showGUI: false, // Closed by default
  sunScale: 10 * scaleFactor,
  pointLightIntensity: 1.25,
  pointLightColor: '#ffffff',
  pointLightPosX: 0,
  pointLightPosY: 0,
  pointLightPosZ: 0,
  ambientLightIntensity: 1,
  ambientLightColor: '#404040'
};

// Initialize planet scales in params
planetGroups.forEach(planet => {
  params[`${planet.mesh.name}Scale`] = planet.scale * scaleFactor;
  if (planet.mesh.name === 'saturn') {
    params.saturnRingScale = (planet.ringScale || 1) * scaleFactor;
  }
});

// Animation speed control
gui.add(params, 'animationSpeed', 0.001, 0.1, 0.001).name('Animation Speed').onChange(value => {
  params.animationSpeed = value;
});

// Planet size controls
const sizeFolder = gui.addFolder('Planet Sizes');
sizeFolder.add(params, 'sunScale', 0.1, 20 * scaleFactor, 0.1).name('Sun Scale').onChange(value => {
  sunMesh.scale.setScalar(value);
  params.sunScale = value;
});
planetGroups.forEach(planet => {
  sizeFolder.add(params, `${planet.mesh.name}Scale`, 0.1, 10 * scaleFactor, 0.1)
    .name(`${planet.mesh.name.charAt(0).toUpperCase() + planet.mesh.name.slice(1)} Scale`)
    .onChange(value => {
      planet.mesh.scale.setScalar(value);
      planet.scale = value;
    });
  if (planet.mesh.name === 'saturn') {
    sizeFolder.add(params, 'saturnRingScale', 0.5 * scaleFactor, 3 * scaleFactor, 0.1).name('Saturn Rings Scale').onChange(value => {
      planet.ringMesh.scale.setScalar(value);
      planet.ringScale = value;
    });
  }
});

// Lighting controls
const lightFolder = gui.addFolder('Lighting');
lightFolder.add(params, 'pointLightIntensity', 0, 2, 0.01).name('Point Light Intensity').onChange(value => {
  pointLight.intensity = value;
});
lightFolder.addColor(params, 'pointLightColor').name('Point Light Color').onChange(value => {
  pointLight.color.set(value);
});
lightFolder.add(params, 'pointLightPosX', -50 * scaleFactor, 50 * scaleFactor, 0.1).name('Point Light X').onChange(value => {
  pointLight.position.x = value;
});
lightFolder.add(params, 'pointLightPosY', -50 * scaleFactor, 50 * scaleFactor, 0.1).name('Point Light Y').onChange(value => {
  pointLight.position.y = value;
});
lightFolder.add(params, 'pointLightPosZ', -50 * scaleFactor, 50 * scaleFactor, 0.1).name('Point Light Z').onChange(value => {
  pointLight.position.z = value;
});
lightFolder.add(params, 'ambientLightIntensity', 0, 1, 0.01).name('Ambient Light Intensity').onChange(value => {
  ambientLight.intensity = value;
});
lightFolder.addColor(params, 'ambientLightColor').name('Ambient Light Color').onChange(value => {
  ambientLight.color.set(value);
});

// GUI toggle
gui.add(params, 'showGUI').name('Show GUI').onChange(value => {
  gui.show(value);
  document.getElementById('controls-button').textContent = value ? 'Hide Controls' : 'Controls';
});

// Close GUI by default
gui.show(false);

// Toggle GUI with button
document.getElementById('controls-button').addEventListener('click', () => {
  params.showGUI = !params.showGUI;
  gui.show(params.showGUI);
  document.getElementById('controls-button').textContent = params.showGUI ? 'Hide Controls' : 'Controls';
});

// Handle window resize
window.addEventListener('resize', () => {
  const newIsMobile = window.innerWidth <= 600;
  const newScaleFactor = newIsMobile ? 0.6 : 1;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.fov = newIsMobile ? 90 : 75;
  camera.position.set(30 * newScaleFactor, 5 * newScaleFactor, 35 * newScaleFactor);
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  // Update scales on resize
  sunMesh.scale.setScalar(params.sunScale * newScaleFactor);
  planetGroups.forEach(planet => {
    planet.mesh.scale.setScalar(params[`${planet.mesh.name}Scale`] * newScaleFactor);
    if (planet.mesh.name === 'saturn') {
      planet.ringMesh.scale.setScalar(params.saturnRingScale * newScaleFactor);
    }
  });
});

// Animation loop
function animate(time) {
  time *= params.animationSpeed;

  // Rotate sun
  sunMesh.rotation.y = (time / 25.05) * 2 * Math.PI;

  // Rotate planets
  planetGroups.forEach(planet => {
    const orbitalSpeed = (2 * Math.PI) / planet.orbitalPeriod;
    planet.group.rotation.y = time * orbitalSpeed;
    const rotationalSpeed = (2 * Math.PI) / planet.rotationalPeriod;
    const direction = planet.retrograde ? -1 : 1;
    planet.mesh.rotation.y = time * rotationalSpeed * direction;
  });

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);