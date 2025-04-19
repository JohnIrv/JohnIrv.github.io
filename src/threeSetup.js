// threeSetup.js
// Handles the initialization and basic configuration of core Three.js components
// like scene, camera, renderer, clock, and provides utility functions for updates.

import * as THREE from 'three';
// Import constants used in this module
import { orthoViewHeight } from './constants.js';

// Declare variables to hold core components.
// Export them so they can be imported and used directly by other modules (like index.js).
export let scene, camera, renderer, clock;

/**
 * Initializes the core Three.js components.
 * @param {HTMLCanvasElement} canvasElement The canvas element to render the scene onto.
 * @returns {boolean} True if initialization was successful, false otherwise.
 */
export function initThreeJS(canvasElement) {
    if (!canvasElement) {
        console.error("Canvas element not provided for Three.js init!");
        return false; // Indicate initialization failure
    }

    // Create the scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0); // Set background color

    // Create an orthographic camera suitable for 2D-like projection
    // Frustum bounds (left, right, top, bottom) are set dynamically later
    camera = new THREE.OrthographicCamera(0, 0, 0, 0, 0.1, 1000);
    camera.position.set(0, 0, 30); // Position the camera back along Z-axis

    // Create the WebGL renderer
    try {
        renderer = new THREE.WebGLRenderer({
             canvas: canvasElement, // Use the provided canvas
             antialias: true        // Enable anti-aliasing
        });
        renderer.setPixelRatio(window.devicePixelRatio); // Adjust for device pixel ratio
        renderer.setSize(window.innerWidth, window.innerHeight); // Set initial size
        console.log("Renderer initialized successfully.");
    } catch (e) {
        console.error("Error creating WebGLRenderer:", e);
        return false; // Indicate initialization failure
    }

    // Add basic lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); // Soft white light
    scene.add(ambientLight);

    // Create a clock for tracking time (used for animations)
    clock = new THREE.Clock();

    // Set initial camera bounds based on current window size
    updateCameraBounds();

    return true; // Indicate successful initialization
}

/**
 * Updates the orthographic camera's frustum bounds based on the current window size
 * and the defined orthographic view height. Ensures the aspect ratio is maintained.
 */
export function updateCameraBounds() {
    if (!camera || !renderer) {
        // This warning might appear if called very early, e.g., during initial setup races.
        // console.warn("updateCameraBounds called before camera/renderer initialized.");
        return;
    }
    const aspect = window.innerWidth / window.innerHeight;
    const orthoWidth = orthoViewHeight * aspect; // Calculate width based on fixed height and aspect ratio

    // Set the camera's view boundaries
    camera.left = -orthoWidth / 2;
    camera.right = orthoWidth / 2;
    camera.top = orthoViewHeight / 2;
    camera.bottom = -orthoViewHeight / 2;

    // Apply the changes to the camera's projection matrix
    camera.updateProjectionMatrix();
}

/**
 * Handles window resize events. Updates the camera bounds and renderer size
 * to match the new window dimensions.
 */
export function onWindowResize() {
    if (!camera || !renderer) return; // Ensure components are initialized

    // Update camera frustum to match new aspect ratio
    updateCameraBounds();

    // Update renderer size to fill the new window size
    renderer.setSize(window.innerWidth, window.innerHeight);
}