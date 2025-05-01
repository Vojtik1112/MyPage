// tesseract.js
let tesseractMaterial; // <-- Make material variable accessible in a wider scope

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('canvas-container');
    const canvas = document.getElementById('tesseract-canvas');

    if (!container || !canvas) {
        console.error("Canvas container or canvas element not found.");
        return;
    }

    // --- Three.js Setup ---
    let scene, camera, renderer;
    let tesseractLines;
    let rotation4D_Angle1 = 0; // XW rotation
    let rotation4D_Angle2 = 0; // YZ rotation (can be linked or independent)
    let targetRotationX = 0;
    let targetRotationY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    // --- Tesseract Constants ---
    const points4D = [];
    for (let i = 0; i < 16; i++) {
        points4D.push(new THREE.Vector4(
            (i & 1) ? 1 : -1,
            (i & 2) ? 1 : -1,
            (i & 4) ? 1 : -1,
            (i & 8) ? 1 : -1
        ));
    }

    const edges = [];
    for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 4; j++) {
            let k = i ^ (1 << j);
            if (i < k) {
                edges.push([i, k]);
            }
        }
    }

    // --- Initialization ---
    function init() {
        scene = new THREE.Scene();

        // Camera
        const fov = 60; // Adjust FOV for a better view
        const aspect = container.clientWidth / container.clientHeight;
        const near = 0.1;
        const far = 100;
        camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.z = 4; // Adjusted position

        // Renderer
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true // Transparent background
        });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        // Geometry & Material
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(edges.length * 2 * 3);
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        // Initialize with the default (light theme) color
        tesseractMaterial = new THREE.LineBasicMaterial({ // <-- Assign to the wider scope variable
            // ** Set initial color using CSS variable or default **
            // We'll set it dynamically from script.js after checking theme
            color: 0x000000, // Default light theme color
            linewidth: 1 
        });
        tesseractLines = new THREE.LineSegments(geometry, tesseractMaterial); // <-- Use the variable
        scene.add(tesseractLines);

        // Event Listeners
        window.addEventListener('resize', onWindowResize, false);
        container.addEventListener('pointerdown', onPointerDown, false); // Use pointer events for broader compatibility
        container.addEventListener('pointermove', onPointerMove, false);
        container.addEventListener('pointerup', onPointerUp, false);
        container.addEventListener('pointerout', onPointerUp, false); // Stop dragging if the pointer leaves

        animate();
    }

    // --- Function to update color --- Add this function ---
    window.updateTesseractColor = (hexColor) => {
        if (tesseractMaterial) {
            tesseractMaterial.color.setHex(hexColor);
        } else {
            // Optionally wait or queue if called before init
            console.warn("Tesseract material not initialized yet for color update.");
        }
    };

    // --- 4D Projection and Rotation ---
    function projectAndRotate4D(point4D, angleXW, angleYZ) {
        // Rotation matrices for 4D (simplified: rotating planes)
        // Rotate XW
        let cos1 = Math.cos(angleXW);
        let sin1 = Math.sin(angleXW);
        let x1 = point4D.x * cos1 - point4D.w * sin1;
        let y1 = point4D.y;
        let z1 = point4D.z;
        let w1 = point4D.x * sin1 + point4D.w * cos1;

        // Rotate YZ
        let cos2 = Math.cos(angleYZ);
        let sin2 = Math.sin(angleYZ);
        let x_final = x1;
        let y_final = y1 * cos2 - z1 * sin2;
        let z_final = y1 * sin2 + z1 * cos2;
        let w_final = w1;

        // Perspective projection into 3D
        const distance = 4; // Distance from viewpoint to 4D origin
        // Prevent division by zero or very small numbers
        const perspectiveDivisor = distance - w_final;
        if (Math.abs(perspectiveDivisor) < 0.0001) {
             return new THREE.Vector3(x_final * 10000, y_final * 10000, z_final * 10000);
        }
        const perspectiveFactor = distance / perspectiveDivisor;


        return new THREE.Vector3(
            x_final * perspectiveFactor,
            y_final * perspectiveFactor,
            z_final * perspectiveFactor
        );
    }

    // --- Animation Loop ---
    function animate() {
        requestAnimationFrame(animate);

        // Automatic 4D rotation
        rotation4D_Angle1 += 0.004; // Slow rotation in XW plane
        rotation4D_Angle2 += 0.003; // Slightly different speed in YZ plane

        // Update Tesseract geometry positions
        const positions = tesseractLines.geometry.attributes.position.array;
        let vertexIndex = 0;
        edges.forEach(edge => {
            const startPoint4D = points4D[edge[0]];
            const endPoint4D = points4D[edge[1]];

            const startPoint3D = projectAndRotate4D(startPoint4D, rotation4D_Angle1, rotation4D_Angle2);
            const endPoint3D = projectAndRotate4D(endPoint4D, rotation4D_Angle1, rotation4D_Angle2);

            positions[vertexIndex++] = startPoint3D.x;
            positions[vertexIndex++] = startPoint3D.y;
            positions[vertexIndex++] = startPoint3D.z;
            positions[vertexIndex++] = endPoint3D.x;
            positions[vertexIndex++] = endPoint3D.y;
            positions[vertexIndex++] = endPoint3D.z;
        });
        tesseractLines.geometry.attributes.position.needsUpdate = true;

        // Apply interactive 3D rotation (smoothed)
        tesseractLines.rotation.y += (targetRotationY - tesseractLines.rotation.y) * 0.1;
        tesseractLines.rotation.x += (targetRotationX - tesseractLines.rotation.x) * 0.1;


        renderer.render(scene, camera);
    }

    // --- Event Handlers ---
    function onWindowResize() {
        if (!camera || !renderer || !container) return;
        windowHalfX = container.clientWidth / 2; // Use container dimensions
        windowHalfY = container.clientHeight / 2;

        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }

    function onPointerDown(event) {
        event.preventDefault(); // Prevent default drag behavior
        isDragging = true;
        previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
         container.style.cursor = 'grabbing'; // Change cursor on drag
    }

    function onPointerMove(event) {
        if (!isDragging) return;

        const deltaMove = {
            x: event.clientX - previousMousePosition.x,
            y: event.clientY - previousMousePosition.y
        };

        // Adjust target rotation based on mouse movement
        targetRotationY += deltaMove.x * 0.005;
        targetRotationX += deltaMove.y * 0.005;


        previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }

    function onPointerUp() {
        isDragging = false;
        container.style.cursor = 'grab'; // Restore cursor
    }


    // --- Run ---
    init(); // Call init at the end of DOMContentLoaded

}); // End of DOMContentLoaded listener