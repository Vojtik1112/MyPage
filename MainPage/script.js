window.onload = function() {
    setTimeout(function() {
        document.getElementById('overlay').style.display = 'none';
    }, 3000); // 3000 milliseconds = 3 seconds
};

// Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(400, 400);
document.getElementById('model-container').appendChild(renderer.domElement);

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const loader = new THREE.GLTFLoader();
loader.load('MainPageImages/bone.glb', function (gltf) {
    console.log('Model loaded successfully!');
    scene.add(gltf.scene);
    gltf.scene.position.set(0, 0, 0);
    gltf.scene.scale.set(0.5, 0.5, 0.5); // Adjust the scale if needed
}, undefined, function (error) {
    console.error('An error occurred while loading the model:', error);
});

camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);
    if (scene.children.length > 0) {
        scene.children[0].rotation.y += 0.01;
    }
    renderer.render(scene, camera);
}

animate();
