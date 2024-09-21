window.onload = function() {
    setTimeout(function() {
        document.getElementById('overlay').style.display = 'none';
    }, 3000); // 3000 milliseconds = 3 seconds
};

// Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(400, 400); // Set the size of the 3D model container
document.getElementById('model-container').appendChild(renderer.domElement);

const loader = new THREE.GLTFLoader();
loader.load('path/to/your/model.glb', function (gltf) {
    scene.add(gltf.scene);
    gltf.scene.position.set(0, 0, 0); // Center the model
}, undefined, function (error) {
    console.error(error);
});

camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);
    if (scene.children.length > 0) {
        scene.children[0].rotation.y += 0.01; // Rotate the model
    }
    renderer.render(scene, camera);
}

animate();

// Position the model container
const modelContainer = document.getElementById('model-container');
modelContainer.style.position = 'fixed';
modelContainer.style.top = '50%';
modelContainer.style.right = '20px'; // Adjust as needed
modelContainer.style.transform = 'translateY(-50%)'; // Center vertically
modelContainer.style.width = '400px'; // Adjust width as needed
modelContainer.style.height = '400px'; // Adjust height as needed