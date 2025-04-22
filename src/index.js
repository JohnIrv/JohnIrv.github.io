// src/index.js
// Main application file for the portfolio.
// Displays a masonry-like column layout of randomly ordered images via CSS.
// Adds dynamic name tickers on all four edges using JS DOM manipulation (Counter-Clockwise Crawl).
// Clicking grid images attempts to open the corresponding project modal.
// Handles modal display and lightbox functionality (modal images only).
// VERSION: CSS Columns Background + Four JS DOM Tickers (Crawl) + Random Grid Order

import './style.css'; // Import CSS
import { PROJECTS } from './constants.js';

// --- Image List for Background Grid ---
const allImagePaths = [ /* Ensure your full list is here */
  'images/Beak1.jpg', 'images/beak2.jpg', 'images/cecile b evans1.gif', 'images/cecile b evans2.png',
  'images/cecile b evans3.gif', 'images/elena velez1.png', 'images/elena velez2.gif', 'images/elena velez3.gif',
  'images/elena velez4.gif', 'images/futureperfect1.png', 'images/futureperfect2.png', 'images/futureperfect3.png',
  'images/hammy1.gif', 'images/lakings1.png', 'images/lakings2.png', 'images/lakings3.gif',
  'images/maiden home1.jpg', 'images/maiden home2.jpg', 'images/maiden home3.jpg', 'images/maiden home4.jpg',
  'images/me1.jpg', 'images/me3.png', 'images/me5.png',
  'images/megan1.png', 'images/megan2.jpg', 'images/megan3.png', 'images/miu miu1.png', 'images/miu miu2.gif',
  'images/miu miu3.gif', 'images/miu miu4.webp', 'images/miu miu5.webp', 'images/moncler1.jpg', 'images/moncler2.jpg',
  'images/moncler3.jpg', 'images/moncler4.jpg', 'images/moncler5.jpg', 'images/moncler6.jpg', 'images/uzi1.png',
  'images/uzi2.gif', 'images/uzi3.png',
];
// --- END Image List ---

// DOM Element References
let modalContainerElement = null, modalContentElement = null, modalCloseBtnElement = null, modalHeaderElement = null;
let projectListContainerElement = null, projectListHeaderElement = null, projectListContentElement = null;
let lightboxOverlay = null, lightboxImage = null, lightboxClose = null;
let imageContainer = null; // Reference for main content area
let isDragging = false;
let currentLightboxImages = [];
let currentLightboxIndex = 0;
let currentlyDisplayedProjectIndex = -1;

// --- Ticker Variables ---
const nameUnit = "JOHN IRVING\u00A0\u00A0\u00A0"; // Text unit with non-breaking spaces
const tickerSpeed = 50; // Speed in pixels per second
let tickerAnimationId = null; // To store requestAnimationFrame ID
let lastTimestamp = 0;

// Structure to hold data for each ticker
const tickers = {
    // Moves Left: direction -1
    top: { bandElement: null, textElement: null, spans: [], unitDimension: 0, containerDimension: 0, orientation: 'horizontal', direction: -1 }, 
    // Moves Up: direction -1
    left: { bandElement: null, textElement: null, spans: [], unitDimension: 0, containerDimension: 0, orientation: 'vertical', direction: -1 }, 
    // Moves Right: direction 1
    bottom: { bandElement: null, textElement: null, spans: [], unitDimension: 0, containerDimension: 0, orientation: 'horizontal', direction: 1 }, 
    // Moves Down: direction 1
    right: { bandElement: null, textElement: null, spans: [], unitDimension: 0, containerDimension: 0, orientation: 'vertical', direction: 1 } 
};

// --- Helper function to shuffle an array in place (Fisher-Yates) ---
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// --- Draggable Modal Functions ---
// (Keep as is)
function attachDragHandlers(headerElement, modalElement) { /* ... */ }

// --- Lightbox Functions ---
// (Keep as is)
function hideLightbox() { /* ... */ }
function showLightboxImage(index) { /* ... */ }
function navigateLightbox(direction) { /* ... */ }
function handleLightboxKeys(event) { /* ... */ }
function openLightbox(projectIndex, imageIndex, sourceType) { /* ... */ }
// --- END Lightbox Functions ---

// --- Helper function to find project index for a given image src ---
// (Keep as is)
function findProjectIndexForImage(imageSrc) { /* ... */ }


// --- NEW Ticker Initialization Logic ---
function measureTickerUnitDimension(tickerData) {
    if (!tickerData || !tickerData.bandElement) return 0;

    const tempSpan = document.createElement('span');
    tempSpan.style.visibility = 'hidden';
    tempSpan.style.position = 'absolute';
    tempSpan.style.whiteSpace = 'nowrap'; 
    tempSpan.style.fontFamily = getComputedStyle(tickerData.bandElement).fontFamily;
    tempSpan.style.fontSize = getComputedStyle(tickerData.bandElement).fontSize;
    tempSpan.style.lineHeight = getComputedStyle(tickerData.bandElement).lineHeight;
    tempSpan.style.padding = '0'; 
    tempSpan.textContent = nameUnit;

    if (tickerData.orientation === 'vertical') {
        tempSpan.style.writingMode = 'vertical-rl'; 
        tempSpan.style.textOrientation = 'mixed';
        tempSpan.style.display = 'block'; 
    }

    document.body.appendChild(tempSpan); 
    
    let dimension = 0;
    if (tickerData.orientation === 'horizontal') {
        dimension = tempSpan.offsetWidth;
    } else { // vertical
        dimension = tempSpan.offsetHeight;
    }

    document.body.removeChild(tempSpan); 
    // console.log(`Measured unit ${tickerData.orientation === 'horizontal' ? 'width' : 'height'} for ${tickerData.bandElement.id}: ${dimension}px`);
    return dimension;
}

function initializeSingleTicker(tickerKey) {
    const tickerData = tickers[tickerKey];
    if (!tickerData || !tickerData.bandElement || !tickerData.textElement) {
        console.error(`Ticker elements not found for key: ${tickerKey}`);
        return;
    }

    tickerData.textElement.textContent = ''; 
    tickerData.bandElement.querySelectorAll('.dynamic-ticker-span').forEach(span => span.remove());
    tickerData.spans = []; 

    tickerData.unitDimension = measureTickerUnitDimension(tickerData);
    if (tickerData.unitDimension <= 0) {
        console.error(`Could not measure ticker unit dimension for ${tickerKey}. Aborting init.`);
        return;
    }

    let numSpansNeeded;
    if (tickerData.orientation === 'horizontal') {
        tickerData.containerDimension = tickerData.bandElement.offsetWidth; 
        numSpansNeeded = Math.ceil(tickerData.containerDimension / tickerData.unitDimension) + 2;
    } else { // vertical
        tickerData.containerDimension = tickerData.bandElement.offsetHeight; 
        numSpansNeeded = Math.ceil(tickerData.containerDimension / tickerData.unitDimension) + 2;
    }

    // console.log(`${tickerKey} Ticker: Container Dim ${tickerData.containerDimension}, Unit Dim ${tickerData.unitDimension}, Spans Needed ${numSpansNeeded}`);

    // Create and position the spans
    for (let i = 0; i < numSpansNeeded; i++) {
        const span = document.createElement('span');
        span.className = 'ticker-text-content dynamic-ticker-span'; 
        span.textContent = nameUnit;
        span.style.position = 'absolute'; 
        
        let initialPos;
        if (tickerData.orientation === 'horizontal') {
            initialPos = i * tickerData.unitDimension;
            span.style.top = '0'; 
            span.style.left = '0'; 
            span.style.transform = `translateX(${initialPos}px)`;
        } else { // vertical
            initialPos = i * tickerData.unitDimension;
            span.style.left = '0'; 
            span.style.top = '0'; 
            span.style.transform = `translateY(${initialPos}px)`;
            span.style.writingMode = 'vertical-rl';
            span.style.textOrientation = 'mixed';
            span.style.display = 'block'; 
            span.style.width = 'auto'; 
            span.style.height = `${tickerData.unitDimension}px`; 
        }
        
        tickerData.bandElement.appendChild(span);
        tickerData.spans.push({ element: span, pos: initialPos }); 
    }
}

// --- Ticker Animation Loop (Handles all four crawls) ---
function animateTickers(timestamp) {
    if (!lastTimestamp) {
        lastTimestamp = timestamp; 
    }
    const deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;
    const movement = tickerSpeed * (deltaTime / 1000); 

    // Loop through each ticker configuration
    for (const key in tickers) {
        const tickerData = tickers[key];
        if (!tickerData || tickerData.unitDimension <= 0 || tickerData.spans.length === 0) {
            continue; 
        }

        let primaryAxisMostNegativeSpanIndex = -1; // Index of span furthest left/top
        let primaryAxisMostPositiveSpanIndex = -1; // Index of span furthest right/bottom
        let primaryAxisMostNegativePos = Infinity;
        let primaryAxisMostPositivePos = -Infinity;

        // Update positions and find boundaries
        for (let i = 0; i < tickerData.spans.length; i++) {
            const spanData = tickerData.spans[i];
            
            // Always move in the specified direction
            spanData.pos += movement * tickerData.direction; 
            
            // Apply transform based on orientation
            const transformValue = tickerData.orientation === 'horizontal' ? `translateX(${spanData.pos}px)` : `translateY(${spanData.pos}px)`;
            spanData.element.style.transform = transformValue;

            // Track boundaries
            if (spanData.pos < primaryAxisMostNegativePos) {
                primaryAxisMostNegativePos = spanData.pos;
                primaryAxisMostNegativeSpanIndex = i;
            }
            if (spanData.pos > primaryAxisMostPositivePos) {
                primaryAxisMostPositivePos = spanData.pos;
                primaryAxisMostPositiveSpanIndex = i;
            }
        }

        // --- Seamless Looping Logic ---
        // Check if a span needs recycling and calculate its new position
        let spanToMoveIndex = -1;
        let newPos = 0;

        if (tickerData.direction === -1) { // Moving Left or Up
            // Recycle the span that has moved furthest left/top (most negative position)
            // if its *leading* edge (pos) is past the recycling point (-unitDimension)
            if (primaryAxisMostNegativeSpanIndex !== -1 && primaryAxisMostNegativePos <= -tickerData.unitDimension) {
                spanToMoveIndex = primaryAxisMostNegativeSpanIndex;
                // Place it immediately after the span furthest right/bottom
                newPos = primaryAxisMostPositivePos + tickerData.unitDimension;
            }
        } else { // Moving Right or Down (direction === 1)
            // Recycle the span that has moved furthest right/bottom (most positive position)
            // if its *trailing* edge (pos) is past the container dimension
            if (primaryAxisMostPositiveSpanIndex !== -1 && primaryAxisMostPositivePos >= tickerData.containerDimension) {
                 spanToMoveIndex = primaryAxisMostPositiveSpanIndex;
                 // Place it immediately before the span furthest left/top
                 newPos = primaryAxisMostNegativePos - tickerData.unitDimension;
            }
        }

        // Apply the recycling repositioning if needed
        if (spanToMoveIndex !== -1) {
            const spanToMove = tickerData.spans[spanToMoveIndex];
            spanToMove.pos = newPos;
            const transformValue = tickerData.orientation === 'horizontal' ? `translateX(${newPos}px)` : `translateY(${newPos}px)`;
            spanToMove.element.style.transform = transformValue;
            // console.log(`Recycling span ${spanToMoveIndex} for ${key} to position ${newPos}`);
        }

    } // End loop through tickers

    // Continue the loop
    tickerAnimationId = requestAnimationFrame(animateTickers);
}

function startTickerAnimation() {
    if (tickerAnimationId) {
        cancelAnimationFrame(tickerAnimationId); 
    }
    lastTimestamp = 0; 
    tickerAnimationId = requestAnimationFrame(animateTickers);
    console.log("Ticker animation started.");
}

function stopTickerAnimation() {
    if (tickerAnimationId) {
        cancelAnimationFrame(tickerAnimationId);
        tickerAnimationId = null;
        console.log("Ticker animation stopped.");
    }
}

// --- Adjust Layout for Four Tickers ---
// (Keep as is)
function adjustLayout() {
    let topTickerHeight = 0;
    let rightTickerWidth = 0;
    let bottomTickerHeight = 0;
    let leftTickerWidth = 0;

    if (tickers.top.bandElement) topTickerHeight = tickers.top.bandElement.offsetHeight;
    if (tickers.right.bandElement) rightTickerWidth = tickers.right.bandElement.offsetWidth;
    if (tickers.bottom.bandElement) bottomTickerHeight = tickers.bottom.bandElement.offsetHeight;
    if (tickers.left.bandElement) leftTickerWidth = tickers.left.bandElement.offsetWidth;

    if (imageContainer) {
        const desiredGap = 10; // Optional gap between ticker and content
        imageContainer.style.paddingTop = `${topTickerHeight + desiredGap}px`;
        imageContainer.style.paddingRight = `${rightTickerWidth + desiredGap}px`;
        imageContainer.style.paddingBottom = `${bottomTickerHeight + desiredGap}px`;
        imageContainer.style.paddingLeft = `${leftTickerWidth + desiredGap}px`;
        // console.log(`Layout adjusted: T${topTickerHeight}, R${rightTickerWidth}, B${bottomTickerHeight}, L${leftTickerWidth}`);
    } else {
        console.warn("Image container not found for layout adjustments.");
    }

    if (projectListContainerElement) {
        const listGap = 10; 
        projectListContainerElement.style.left = `${leftTickerWidth + listGap}px`;
        projectListContainerElement.style.bottom = `${bottomTickerHeight + listGap}px`;
        projectListContainerElement.style.removeProperty('top'); 
    }
}


// --- Initialization and Event Listeners ---
// (Keep as is)
window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Loaded - Getting elements...');
    // Get all needed elements
    modalContainerElement = document.getElementById('modal-container');
    modalContentElement = document.getElementById('modal-content');
    modalCloseBtnElement = document.getElementById('modal-close-btn');
    modalHeaderElement = document.getElementById('modal-header');
    projectListContainerElement = document.getElementById('project-list-modal-container');
    projectListHeaderElement = document.getElementById('project-list-header');
    projectListContentElement = document.getElementById('project-list-content');
    lightboxOverlay = document.getElementById('lightbox-overlay');
    lightboxImage = document.getElementById('lightbox-image');
    lightboxClose = document.getElementById('lightbox-close');
    imageContainer = document.getElementById('image-grid-background'); 

    // Get ticker elements
    tickers.top.bandElement = document.getElementById('name-ticker-band-top');
    tickers.top.textElement = document.getElementById('ticker-text-content-top');
    tickers.right.bandElement = document.getElementById('name-ticker-band-right');
    tickers.right.textElement = document.getElementById('ticker-text-content-right');
    tickers.bottom.bandElement = document.getElementById('name-ticker-band-bottom');
    tickers.bottom.textElement = document.getElementById('ticker-text-content-bottom');
    tickers.left.bandElement = document.getElementById('name-ticker-band-left');
    tickers.left.textElement = document.getElementById('ticker-text-content-left');


    // --- Initialize All Tickers ---
    for (const key in tickers) {
        initializeSingleTicker(key);
    }
    if (Object.values(tickers).some(t => t.spans.length > 0)) {
         startTickerAnimation();
    }
    // --- End Ticker Init ---


    // --- Initial Layout Adjustment ---
    setTimeout(adjustLayout, 150); 

    // --- Add Resize Listener ---
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            console.log("Window resized, re-initializing tickers and adjusting layout...");
            stopTickerAnimation(); 
            for (const key in tickers) {
                initializeSingleTicker(key);
            }
            adjustLayout();
            if (Object.values(tickers).some(t => t.spans.length > 0)) {
                 startTickerAnimation();
            }
        }, 250); 
    });
    // --- End Resize Listener ---


    // --- Populate Image Container for CSS Columns ---
    // (Keep as is)
    if (imageContainer) { /* ... */ } else { console.error("Image container '#image-grid-background' not found!"); }
    // --- End Image Population ---

    // --- Modal Setup --- 
    // (Keep as is)
     if (modalContainerElement) { /* ... */ } else { console.warn("Detail modal container not found."); }
     if (projectListContainerElement) { /* ... */ } else { console.error("Project List Container Element NOT FOUND!"); }
     if (modalContainerElement && modalContentElement && modalCloseBtnElement) { /* ... */ } else { console.warn("Detail modal elements not found! Cannot attach listeners.");}
     if (projectListContainerElement && projectListHeaderElement && projectListContentElement) { /* ... */ } else { console.warn("Skipping list modal setup - elements not found."); }
     if (lightboxOverlay && lightboxImage && lightboxClose) { /* ... */ } else { console.error("Lightbox elements not found! Cannot attach listeners."); }
     window.addEventListener('keydown', handleLightboxKeys);
    console.log('DOM setup complete.');

}); // End DOMContentLoaded

// --- Project List Population --- 
// (Keep as is)
function populateProjectList() { /* ... */ }

// --- Detail Modal Logic --- 
// (Keep as is)
function openOrUpdateDetailModal(projectIndex) { /* ... */ }

// --- Background Click Logic --- 
// (Keep as is)
document.addEventListener('click', (event) => { /* ... */ });

