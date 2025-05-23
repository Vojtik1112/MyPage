// tesseract.js
// Handles the Three.js tesseract animation and responds to theme/section changes

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('canvas-container');
    const canvas = document.getElementById('tesseract-canvas');

    if (!container || !canvas) {
        console.error("Tesseract canvas container or canvas element not found.");
        return;
    }

    // --- Three.js Scope Variables ---
    let scene, camera, renderer;
    let tesseractLines;
    let tesseractMaterial; // Material needs to be accessible for color updates
    let rotation4D_Angle1 = 0; // XW rotation
    let rotation4D_Angle2 = 0; // YZ rotation
    let targetRotationX = 0;
    let targetRotationY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let tesseractIsActive = false; // Controls if animation runs (based on section visibility)

    // --- Tesseract Constants ---
    const points4D = Array.from({length: 16}, (_, i) => new THREE.Vector4(
        (i & 1) ? 1 : -1, (i & 2) ? 1 : -1, (i & 4) ? 1 : -1, (i & 8) ? 1 : -1
    ));
    const edges = [];
    for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 4; j++) {
            let k = i ^ (1 << j);
            if (i < k) edges.push([i, k]);
        }
    }

    // --- Initialization ---
    function init() {
        scene = new THREE.Scene();

        // Camera
        const fov = 70; // Slightly wider FOV might look good
        const aspect = container.clientWidth / container.clientHeight;
        camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 100);
        camera.position.z = 3.5; // Camera closer for bigger tesseract

        // Renderer
        renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true, alpha: true});
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        // Geometry & Material
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(edges.length * 2 * 3);
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        // Determine initial color based on current theme (matches JS theme logic)
        const initialIsDark = document.body.classList.contains('dark-mode');
        const lightTesseractColor = 0x34495e; // Match new text color
        const darkTesseractColor = 0xbdc3c7;  // Match new dark mode line color
        const initialColor = initialIsDark ? darkTesseractColor : lightTesseractColor;


        tesseractMaterial = new THREE.LineBasicMaterial({
            color: initialColor,
            linewidth: 1 // Note: linewidth > 1 might not work on all systems/drivers
        });
        tesseractLines = new THREE.LineSegments(geometry, tesseractMaterial);
        scene.add(tesseractLines);

        // Event Listeners
        window.addEventListener('resize', onWindowResize, false);
        container.addEventListener('pointerdown', onPointerDown, false);
        container.addEventListener('pointermove', onPointerMove, false);
        container.addEventListener('pointerup', onPointerUp, false);
        container.addEventListener('pointerout', onPointerUp, false); // Stop drag if pointer leaves

        // Listen for custom events from script.js
        window.addEventListener('themeChange', handleThemeChange);
        window.addEventListener('sectionChange', handleSectionChange);

        console.log("Tesseract initialized. Initial color:", initialColor.toString(16));

        animate(); // Start animation loop
    }

    // --- Event Handlers for Custom Events ---
    function handleThemeChange(event) {
        if (tesseractMaterial && event.detail?.color !== undefined) {
            tesseractMaterial.color.setHex(event.detail.color);
            // console.log("Tesseract color updated:", event.detail.color.toString(16));
        }
    }

    function handleSectionChange(event) {
        if (event.detail?.isHomeActive !== undefined) {
            tesseractIsActive = event.detail.isHomeActive;
            // console.log("Tesseract active state updated:", tesseractIsActive);
        }
    }

    // --- 4D Projection and Rotation ---
    function projectAndRotate4D(point4D, angleXW, angleYZ) {
        // Rotate XW
        const cos1 = Math.cos(angleXW);
        const sin1 = Math.sin(angleXW);
        const x1 = point4D.x * cos1 - point4D.w * sin1;
        const y1 = point4D.y;
        const z1 = point4D.z;
        const w1 = point4D.x * sin1 + point4D.w * cos1;
        // Rotate YZ
        const cos2 = Math.cos(angleYZ);
        const sin2 = Math.sin(angleYZ);
        const x_final = x1;
        const y_final = y1 * cos2 - z1 * sin2;
        const z_final = y1 * sin2 + z1 * cos2;
        const w_final = w1;
        // Perspective projection
        const distance = 4; // Viewpoint distance (keep this consistent for projection math)
        const perspectiveDivisor = distance - w_final;
        // Avoid division by zero/tiny numbers -> push point far away
        if (Math.abs(perspectiveDivisor) < 0.0001) {
            return new THREE.Vector3(x_final * 10000, y_final * 10000, z_final * 10000);
        }
        const perspectiveFactor = 1 / perspectiveDivisor; // Simpler projection factor

        return new THREE.Vector3(
            x_final * perspectiveFactor * distance, // Scale by distance
            y_final * perspectiveFactor * distance,
            z_final * perspectiveFactor * distance
        );
    }

    // --- Animation Loop ---
    function animate() {
        requestAnimationFrame(animate); // Always request next frame

        // Only perform updates if the home section is active
        if (!tesseractIsActive) {
            return; // Skip updates if not active
        }

        // Automatic 4D rotation
        rotation4D_Angle1 += 0.004;
        rotation4D_Angle2 += 0.003;

        // Update Tesseract geometry
        const positions = tesseractLines.geometry.attributes.position.array;
        let vertexIndex = 0;
        edges.forEach(edge => {
            const startPoint3D = projectAndRotate4D(points4D[edge[0]], rotation4D_Angle1, rotation4D_Angle2);
            const endPoint3D = projectAndRotate4D(points4D[edge[1]], rotation4D_Angle1, rotation4D_Angle2);
            positions[vertexIndex++] = startPoint3D.x;
            positions[vertexIndex++] = startPoint3D.y;
            positions[vertexIndex++] = startPoint3D.z;
            positions[vertexIndex++] = endPoint3D.x;
            positions[vertexIndex++] = endPoint3D.y;
            positions[vertexIndex++] = endPoint3D.z;
        });
        tesseractLines.geometry.attributes.position.needsUpdate = true;

        // Apply smoothed interactive 3D rotation
        tesseractLines.rotation.y += (targetRotationY - tesseractLines.rotation.y) * 0.1;
        tesseractLines.rotation.x += (targetRotationX - tesseractLines.rotation.x) * 0.1;

        renderer.render(scene, camera);
    }

    // --- Standard Event Handlers ---
    function onWindowResize() {
        if (!camera || !renderer || !container) return;
        const width = container.clientWidth;
        const height = container.clientHeight;

        if (width === 0 || height === 0) return; // Avoid division by zero if container is hidden/resized to zero

        windowHalfX = width / 2;
        windowHalfY = height / 2;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    function onPointerDown(event) {
        if (!tesseractIsActive) return; // Only allow dragging if active
        // Check if the event target is the canvas or its container
        if (event.target !== canvas && event.target !== container) return;
        event.preventDefault(); // Prevent text selection etc.
        isDragging = true;
        previousMousePosition = {x: event.clientX, y: event.clientY};
        container.style.cursor = 'grabbing';
    }

    function onPointerMove(event) {
        if (!isDragging || !tesseractIsActive) return;
        const deltaMove = {
            x: event.clientX - previousMousePosition.x,
            y: event.clientY - previousMousePosition.y
        };
        // Adjust target rotation (adjust sensitivity as needed)
        targetRotationY += deltaMove.x * 0.006;
        targetRotationX += deltaMove.y * 0.006;
        previousMousePosition = {x: event.clientX, y: event.clientY};
    }

    function onPointerUp() {
        if (isDragging) {
            isDragging = false;
            container.style.cursor = 'grab';
        }
    }

    // --- Run Initialization ---
    // Use requestAnimationFrame to wait for initial layout calculation
    requestAnimationFrame(init);


}); // End of DOMContentLoaded listener