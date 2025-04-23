// src/index.js
// Main application file for the portfolio.
// Displays a masonry-like column layout of randomly ordered images via CSS.
// Dynamically populates a static name ticker based on screen width using JS.
// Clicking grid images attempts to open the corresponding project modal.
// Handles modal display and lightbox functionality (modal images only).
// Handles minimizing/maximizing the project list modal.
// VERSION: CSS Columns Background + Static JS Ticker Population + Random Grid Order + List Modal Bottom Left + List Modal Minimize + Drag Fix

import './style.css'; // Import CSS
import { PROJECTS } from './constants.js';

// --- Image List for Background Grid ---
const allImagePaths = [ /* Ensure your full list is here */
  'images/Beak1.jpg', 'images/beak2.jpg', 'images/cecile b evans1.gif', 'images/cecile b evans2.png',
  'images/cecile b evans3.gif', 'images/cecile b evans4.png', 'images/elena velez1.png', 'images/elena velez2.gif', 'images/elena velez3.gif',
  'images/elena velez4.gif', 'images/futureperfect1.png', 'images/futureperfect2.png', 'images/futureperfect3.png',
  'images/hammy1.gif', 'images/lakings1.png', 'images/lakings2.png', 'images/lakings3.gif',
  'images/ecommerce1.jpg', 'images/ecommerce2.jpg', 'images/ecommerce3.jpg', 'images/ecommerce4.jpg',
  'images/me1.jpg', 'images/me3.png', 'images/me5.png',
  'images/megan1.png', 'images/megan2.jpg', 'images/megan3.png', 'images/miu miu1.png', 'images/miu miu2.gif',
  'images/miu miu3.gif', 'images/miu miu4.webp', 'images/miu miu5.webp', 'images/moncler1.jpg', 'images/moncler2.jpg',
  'images/moncler3.jpg', 'images/moncler4.jpg', 'images/moncler5.jpg', 'images/moncler6.jpg', 'images/uzi1.png',
  'images/uzi2.gif', 'images/uzi3.png',
];
// --- END Image List ---

// DOM Element References
let modalContainerElement = null, modalContentElement = null, modalCloseBtnElement = null, modalHeaderElement = null;
let projectListContainerElement = null, projectListHeaderElement = null, projectListContentElement = null, projectListMinimizeBtnElement = null; // <-- Added projectListMinimizeBtnElement
let lightboxOverlay = null, lightboxImage = null, lightboxClose = null;
let isDragging = false;
let currentLightboxImages = [];
let currentLightboxIndex = 0;
let currentlyDisplayedProjectIndex = -1;

// --- Ticker Variables ---
// (Keep as is)

// --- Helper function to shuffle an array in place (Fisher-Yates) ---
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// --- MODIFIED Draggable Modal Functions ---
function attachDragHandlers(headerElement, modalElement) {
    if (!headerElement || !modalElement) { console.error("attachDragHandlers: Header or Modal element missing."); return; }
    let specificDragOffsetX, specificDragOffsetY; let elementBeingDragged = null;

    const onDragStart = (e) => {
        // Prevent drag start on control buttons
        if (e.target.id === 'modal-close-btn' || e.target.id === 'project-list-minimize-btn') {
            return; // Stop if click starts on a known button
        }
        // Prevent dragging if clicking within the lightbox
        if (e.target.closest('#lightbox-overlay')) return;

        // --- If not a control button, proceed with drag logic ---
        elementBeingDragged = modalElement;
        elementBeingDragged.style.cursor = 'grabbing';
        try { elementBeingDragged.offsetHeight; } catch(e) {} // Force reflow

        const rect = elementBeingDragged.getBoundingClientRect();
        specificDragOffsetX = e.clientX - rect.left;
        specificDragOffsetY = e.clientY - rect.top;

        // --- MODIFICATION START: Conditionally set inline dimensions ---
        // For the project list modal, its height must remain dynamic (auto/max-height)
        // controlled by CSS classes (.minimized). Don't set inline height.
        // We can skip width too, as it's fixed in CSS.
        if (elementBeingDragged.id !== 'project-list-modal-container') {
            // For other modals (like the detail modal), set inline dimensions
            // based on their computed size at drag start.
            const computedStyle = window.getComputedStyle(elementBeingDragged);
            elementBeingDragged.style.width = computedStyle.width;
            elementBeingDragged.style.height = computedStyle.height;
            console.log(`Set inline dimensions for ${elementBeingDragged.id}`);
        } else {
            // For the project list modal, ensure inline height/width are cleared
            // in case they were ever set previously, allowing CSS to control size.
             elementBeingDragged.style.width = ''; // Let CSS rule (width: 250px) apply
             elementBeingDragged.style.height = ''; // Let CSS rules (height: auto, max-height) apply
             console.log(`Skipping inline dimensions for ${elementBeingDragged.id}`);
        }
        // --- MODIFICATION END ---

        elementBeingDragged.style.transform = 'none'; // Use left/top positioning
        elementBeingDragged.style.left = `${rect.left}px`; // Set initial position
        elementBeingDragged.style.top = `${rect.top}px`; // Set initial position

        window.addEventListener('mousemove', specificOnDragMove);
        window.addEventListener('mouseup', specificOnDragEnd);
        e.preventDefault();
        e.stopPropagation();
    };

    const specificOnDragMove = (e) => {
        if (!elementBeingDragged) return;
        const newX = e.clientX - specificDragOffsetX;
        const newY = e.clientY - specificDragOffsetY;
        elementBeingDragged.style.left = `${newX}px`;
        elementBeingDragged.style.top = `${newY}px`;
    };

    const specificOnDragEnd = () => {
        if (!elementBeingDragged) return;
        elementBeingDragged.style.cursor = ''; // Reset cursor
        // Note: We leave the inline left/top styles set by dragging.
        // We have ensured inline height/width are NOT set for the list modal.
        elementBeingDragged = null;
        window.removeEventListener('mousemove', specificOnDragMove);
        window.removeEventListener('mouseup', specificOnDragEnd);
    };

    headerElement.addEventListener('mousedown', onDragStart);
}
// --- END MODIFIED Draggable Modal Functions ---

// --- Lightbox Functions ---
// (Keep as is)
function hideLightbox() {
    if (lightboxOverlay) { lightboxOverlay.style.display = 'none'; lightboxImage.src = ''; }
    currentLightboxImages = []; currentLightboxIndex = 0; console.log("Lightbox hidden");
}
function showLightboxImage(index) {
    if (!lightboxOverlay || !lightboxImage) { console.error("Lightbox elements missing."); hideLightbox(); return; }
    if (!currentLightboxImages || !Array.isArray(currentLightboxImages) || currentLightboxImages.length === 0) { console.error(`Lightbox: currentLightboxImages invalid or empty.`); hideLightbox(); return; }
    currentLightboxIndex = Math.max(0, Math.min(currentLightboxImages.length - 1, index));
    lightboxImage.src = currentLightboxImages[currentLightboxIndex];
    console.log(`Showing lightbox image index: ${currentLightboxIndex}, src: ${lightboxImage.src}`);
    lightboxOverlay.style.display = 'flex';
}
function navigateLightbox(direction) {
     if (!currentLightboxImages || !Array.isArray(currentLightboxImages) || currentLightboxImages.length <= 1) return;
    let newIndex = currentLightboxIndex + direction;
    if (newIndex < 0) { newIndex = currentLightboxImages.length - 1; }
    else if (newIndex >= currentLightboxImages.length) { newIndex = 0; }
    showLightboxImage(newIndex);
}
function handleLightboxKeys(event) {
    if (!lightboxOverlay || lightboxOverlay.style.display === 'none') return;
    switch (event.key) {
        case 'ArrowRight': case 'ArrowDown': navigateLightbox(1); break;
        case 'ArrowLeft': case 'ArrowUp': navigateLightbox(-1); break;
        case 'Escape': hideLightbox(); break;
    }
}
function openLightbox(projectIndex, imageIndex, sourceType) {
     if (projectIndex < 0 || projectIndex >= PROJECTS.length) { console.error("Lightbox: Invalid project index", projectIndex); return; }
     const projectData = PROJECTS[projectIndex]; let sourceArray = null;
     if (sourceType === 'centerpiece' && projectData.centerpieceImages?.length) { sourceArray = projectData.centerpieceImages; }
     else if (sourceType === 'additional' && projectData.additionalImages?.length) { sourceArray = projectData.additionalImages; }
     else { console.warn(`Lightbox: Invalid source type "${sourceType}" or missing data for project ${projectIndex}.`); return; }
     if (sourceArray.length > 0) { console.log(`Opening lightbox for project ${projectIndex}, source ${sourceType}, index ${imageIndex}`); currentlyDisplayedProjectIndex = projectIndex; currentLightboxImages = [...sourceArray]; showLightboxImage(imageIndex); }
     else { console.warn(`Lightbox: No images found in source "${sourceType}" for project ${projectIndex}.`); }
}
// --- END Lightbox Functions ---

// --- Helper function to find project index for a given image src ---
// (Keep as is)
function findProjectIndexForImage(imageSrc) {
    if (!imageSrc) return -1;
    let clickedPathname;
    try {
        clickedPathname = decodeURIComponent(new URL(imageSrc, document.baseURI).pathname);
    } catch (e) { console.error("[Lookup] Error parsing image SRC:", imageSrc, e); return -1; }
    const relativeClickedPath = (clickedPathname.startsWith('/') ? clickedPathname.substring(1) : clickedPathname).toLowerCase();

    const projectIndex = PROJECTS.findIndex((project) => {
         const normalize = (p) => p ? p.toLowerCase() : null;
         let matchFound = false;
         const imageUrl = normalize(project.imageUrl);
         if (imageUrl) { if (imageUrl === relativeClickedPath) { matchFound = true; } }
         const centerpieceImages = project.centerpieceImages?.map(normalize);
         if (!matchFound && centerpieceImages) { matchFound = centerpieceImages.some(p => p === relativeClickedPath); }
         const additionalImages = project.additionalImages?.map(normalize);
         if (!matchFound && additionalImages) { matchFound = additionalImages.some(p => p === relativeClickedPath); }
         return matchFound;
    });
    return projectIndex;
}


// --- REVERTED: Ticker Text Population (Single Span) ---
function populateTickerText() {
    const tickerBandElement = document.getElementById('name-ticker-band');
    // IMPORTANT: Ensure your index.html has <span id="ticker-text-content"></span> inside #name-ticker-band
    const tickerTextElement = document.getElementById('ticker-text-content');

    if (tickerBandElement && tickerTextElement) {
        const nameUnit = "JOHN IRVING\u00A0\u00A0\u00A0"; // Text unit with non-breaking spaces
        let unitWidth = 0;

        // Measure width accurately using a temporary element
        const tempSpan = document.createElement('span');
        try {
            tempSpan.style.visibility = 'hidden';
            tempSpan.style.position = 'absolute';
            tempSpan.style.whiteSpace = 'nowrap';
            // Apply relevant styles from the actual ticker for accurate measurement
            const tickerStyle = window.getComputedStyle(tickerBandElement); // Get style from band
            const textStyle = window.getComputedStyle(tickerTextElement); // Get style from text span itself
            tempSpan.style.fontFamily = textStyle.fontFamily || tickerStyle.fontFamily;
            tempSpan.style.fontSize = textStyle.fontSize || tickerStyle.fontSize;
             // Use a default letter spacing for measurement if CSS animation was changing it
            tempSpan.style.letterSpacing = textStyle.letterSpacing || '1px'; // Use current or default
            tempSpan.textContent = nameUnit;
            document.body.appendChild(tempSpan);
            unitWidth = tempSpan.offsetWidth;
        } catch (e) {
            console.error("Error measuring text width:", e);
        } finally {
            // Ensure cleanup even if error occurs
            if (tempSpan.parentNode === document.body) {
                document.body.removeChild(tempSpan);
            }
        }

        if (unitWidth > 0) {
            const screenWidth = window.innerWidth;
            // Calculate repeats needed just to fill the screen width + a buffer
            // Add +2 buffer: 1 to ensure full coverage, 1 extra just in case
            const repeatsNeeded = Math.ceil(screenWidth / unitWidth) + 2;
            const fullTextSegment = nameUnit.repeat(repeatsNeeded);

            // Check if text content needs updating to avoid unnecessary DOM manipulation
            if (tickerTextElement.textContent !== fullTextSegment) {
                 tickerTextElement.textContent = fullTextSegment; // Set text on single span
                 console.log(`Ticker Text Updated: Unit width ${unitWidth}px, needed ${repeatsNeeded} repeats.`);
            }
        } else {
            console.error("Ticker Text: Could not calculate unit width. Using fallback.");
            // Avoid setting fallback repeatedly if width calculation fails consistently
            if (!tickerTextElement.textContent.startsWith(nameUnit)) {
                 tickerTextElement.textContent = (nameUnit).repeat(30); // Arbitrary fallback
            }
        }
    } else {
        console.warn("Ticker elements (#name-ticker-band, #ticker-text-content) not found for dynamic population.");
    }
}
// --- End Ticker Text Population ---

// --- ADDED: Function to Toggle Project List Minimize State ---
function toggleProjectListMinimize() {
    if (!projectListContainerElement || !projectListMinimizeBtnElement) {
        console.error("Cannot toggle minimize: required elements missing.");
        return;
    }

    // Toggle the 'minimized' class on the container
    const isMinimized = projectListContainerElement.classList.toggle('minimized');

    // Update the button text based on the new state
    if (isMinimized) {
        projectListMinimizeBtnElement.textContent = '+';
        console.log("Project list minimized.");
    } else {
        projectListMinimizeBtnElement.textContent = '-';
        console.log("Project list maximized.");
    }
}
// --- End Toggle Project List Minimize State ---


// --- Initialization and Event Listeners ---
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
    projectListMinimizeBtnElement = document.getElementById('project-list-minimize-btn'); // <-- Get minimize button
    lightboxOverlay = document.getElementById('lightbox-overlay');
    lightboxImage = document.getElementById('lightbox-image');
    lightboxClose = document.getElementById('lightbox-close');
    const imageContainer = document.getElementById('image-grid-background');
    const tickerBandElement = document.getElementById('name-ticker-band'); // Keep ref for layout adjust

    // --- REVERTED: Call static ticker population ---
    populateTickerText();

    // --- REVERTED: Add resize listener for static ticker ---
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            console.log("Window resized, repopulating static ticker text...");
            populateTickerText(); // Repopulate single span text
             // Also potentially readjust layout if needed after resize
             if (tickerBandElement) adjustLayout(tickerBandElement, imageContainer, projectListContainerElement);
        }, 250); // Debounce timer
    });
    // --- End Ticker Setup ---


    // --- Adjust Layout Below Fixed Ticker ---
    // MODIFIED: No longer positions listContainer
    // Encapsulate in a function to call on load and potentially resize
    const adjustLayout = (tickerBand, imgContainer, listContainer) => {
         if (tickerBand) {
            const tickerHeight = tickerBand.offsetHeight;
            if (tickerHeight > 0) {
                const desiredGap = 10;
                if (imgContainer) { imgContainer.style.paddingTop = `${tickerHeight + desiredGap}px`; /* console.log(`Set padding-top for image container: ${tickerHeight + desiredGap}px`); */ }
                 else { console.warn("Image container not found for padding adjustment."); }

                // --- MODIFICATION START ---
                // We removed the block that set listContainer.style.top here
                // It is now positioned via CSS
                if (listContainer) {
                    // Optional: log that it exists but we aren't touching its position here
                    // console.log("Project list container found, CSS handles positioning.");
                } else {
                    console.warn("Project list container not found during layout adjustment.");
                }
                // --- MODIFICATION END ---

            } else { console.warn("Ticker band height is 0, layout not adjusted."); }
         } else { console.warn("Ticker band not found for layout adjustments."); }
    };

    // Initial layout adjustment
    setTimeout(() => adjustLayout(tickerBandElement, imageContainer, projectListContainerElement), 150);
    // --- End Layout Adjustment ---


    // --- Populate Image Container for CSS Columns ---
    // (Keep as is)
    if (imageContainer) {
        if (allImagePaths.length === 0) {
             console.warn("The 'allImagePaths' array is empty!");
             imageContainer.innerHTML = '<p style="text-align: center; padding: 20px;">No images found.</p>';
        } else {
            console.log("Shuffling image paths...");
            shuffleArray(allImagePaths);
            allImagePaths.forEach((imgPath, index) => {
                const img = document.createElement('img');
                img.src = imgPath;
                const fileName = imgPath.substring(imgPath.lastIndexOf('/') + 1);
                img.alt = `Portfolio image: ${fileName}`;
                img.loading = 'lazy';
                img.dataset.index = index;
                imageContainer.appendChild(img);
            });
             console.log(`Appended ${allImagePaths.length} images in random order.`);
            imageContainer.addEventListener('click', (event) => {
                if (event.target.tagName === 'IMG' && event.target.src) {
                    const clickedImageSrc = event.target.src;
                    console.log("--- Grid Image Clicked ---");
                    const projectIndex = findProjectIndexForImage(clickedImageSrc);
                    if (projectIndex !== -1) {
                        console.log(`>>> Action: Opening modal for project index ${projectIndex}.`);
                        openOrUpdateDetailModal(projectIndex);
                        event.stopPropagation();
                    } else {
                        console.log(">>> Action: No project found for this image.");
                    }
                    console.log("--- End Grid Image Click ---");
                }
            });
        }
    } else { console.error("Image container '#image-grid-background' not found!"); }
    // --- End Image Population ---

    // --- Modal Setup ---
    // (Keep as is, except for adding list modal listeners)
     if (modalContainerElement) { modalContainerElement.style.display = 'none'; }
     else { console.warn("Detail modal container not found."); }
    console.log('List Modal Container Ref on Load:', projectListContainerElement);
    if (projectListContainerElement) {
        try {
             // Note: Explicit positioning (top/left/bottom/right) is now handled in CSS
             projectListContainerElement.style.display = 'flex'; // Keep this
             projectListContainerElement.style.visibility = 'visible'; // Keep this
             projectListContainerElement.style.opacity = '1'; // Keep this
             // projectListContainerElement.style.position = 'fixed'; // Handled by CSS
             // projectListContainerElement.style.transform = 'none'; // Handled by CSS
             // projectListContainerElement.style.width = '250px'; // Handled by CSS
        } catch(e) { console.error("Error setting initial list modal styles:", e); }
    } else { console.error("Project List Container Element NOT FOUND!"); }
    if (modalContainerElement && modalContentElement && modalCloseBtnElement) {
        modalCloseBtnElement.addEventListener('click', () => { if (modalContainerElement) { modalContainerElement.style.display = 'none'; } });
        if(modalHeaderElement) { attachDragHandlers(modalHeaderElement, modalContainerElement); } else { console.warn("Detail modal header not!");}
        modalContentElement.addEventListener('click', (event) => {
            let imageIndex = -1; let sourceType = null; const imageItemWrapper = event.target.closest('.additional-image-item'); if (imageItemWrapper) { const imgElement = imageItemWrapper.querySelector('img'); if (imgElement?.dataset.index !== undefined) { imageIndex = parseInt(imgElement.dataset.index, 10); sourceType = 'additional'; } } if (sourceType === null) { const centerpieceImgElement = event.target.closest('.centerpiece-images-container img.lightbox-trigger'); if (centerpieceImgElement?.dataset.index !== undefined) { imageIndex = parseInt(centerpieceImgElement.dataset.index, 10); sourceType = 'centerpiece'; } } if (sourceType !== null && !isNaN(imageIndex) && currentlyDisplayedProjectIndex !== -1) { openLightbox(currentlyDisplayedProjectIndex, imageIndex, sourceType); } else if (sourceType !== null) { console.warn("Lightbox click (modal): Could not parse image index."); }
        });
    } else { console.warn("Detail modal elements not found! Cannot attach listeners.");}

    // --- MODIFIED: Added minimize button listener ---
    if (projectListContainerElement && projectListHeaderElement && projectListContentElement) {
        console.log('Populating and attaching handlers to list modal...');
        populateProjectList();
        attachDragHandlers(projectListHeaderElement, projectListContainerElement); // Attach drag handler
        projectListContentElement.addEventListener('click', (event) => { // Attach link click listener
            const link = event.target.closest('a.project-list-link');
            if (link?.dataset.index) {
                event.preventDefault();
                const projectIndex = parseInt(link.dataset.index, 10);
                if (!isNaN(projectIndex)) { openOrUpdateDetailModal(projectIndex); }
            }
        });
        // --- Add listener for the minimize button ---
        if (projectListMinimizeBtnElement) {
             projectListMinimizeBtnElement.addEventListener('click', (event) => {
                 event.stopPropagation(); // Prevent triggering drag or other header events
                 toggleProjectListMinimize();
             });
        } else {
             console.warn("Minimize button for project list not found!");
        }
        // --- End adding listener ---
    } else { console.warn("Skipping list modal setup - elements not found."); }
    // --- End MODIFICATION ---

    if (lightboxOverlay && lightboxImage && lightboxClose) {
        lightboxClose.addEventListener('click', (event) => { hideLightbox(); event.stopPropagation(); });
        lightboxOverlay.addEventListener('click', (event) => { if (event.target === lightboxOverlay) { hideLightbox(); event.stopPropagation(); } });
    } else { console.error("Lightbox elements not found! Cannot attach listeners."); }
     window.addEventListener('keydown', handleLightboxKeys);
    console.log('DOM setup complete.');

}); // End DOMContentLoaded

// --- Project List Population ---
// (Keep as is)
function populateProjectList() {
    if (!projectListContentElement || !PROJECTS) return;
    let listHtml = '<ul>'; PROJECTS.forEach((project, index) => { listHtml += `<li><a href="#" class="project-list-link" data-index="${index}">${project.title}</a></li>`; }); listHtml += '</ul>'; projectListContentElement.innerHTML = listHtml;
}

// --- Detail Modal Logic ---
// (Keep as is)
function openOrUpdateDetailModal(projectIndex) {
    if (!modalContainerElement || !modalContentElement) { console.error("Detail modal elements missing."); return; } if (projectIndex !== undefined && projectIndex >= 0 && projectIndex < PROJECTS.length) { currentlyDisplayedProjectIndex = projectIndex; const projectData = PROJECTS[projectIndex]; modalContentElement.innerHTML = `<h2>${projectData.title}</h2> ${projectData.subtitle ? `<p class="modal-subtitle">${projectData.subtitle}</p>` : ''} ${projectData.imageUrl ? `<div class="modal-image-container"><img src="${projectData.imageUrl}" alt="${projectData.title} preview"></div>` : ''} ${projectData.youtubeEmbedUrl ? `<div class="video-wrapper"><iframe src="${projectData.youtubeEmbedUrl}" title="Video for ${projectData.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>` : ''} ${projectData.localVideoPath ? `<div class="video-wrapper"><video controls preload="metadata"><source src="${projectData.localVideoPath}" type="video/mp4">Your browser does not support the video tag.</video></div>` : ''} ${projectData.centerpieceImages?.length ? `<div class="centerpiece-images-container">${projectData.centerpieceImages.map((imgUrl, imageIndex) => `<img src="${imgUrl}" alt="${projectData.title} centerpiece image ${imageIndex + 1}" class="lightbox-trigger" data-index="${imageIndex}">`).join('')}</div>` : ''} ${projectData.additionalImages?.length ? `<div class="additional-images-container">${projectData.additionalImages.map((imgUrl, originalIndex) => `<div class="additional-image-item"><img src="${imgUrl}" alt="Project detail image thumbnail" data-index="${originalIndex}"></div>`).slice(0, 3).join('')}</div>` : ''} ${projectData.description ? `${projectData.description}` : ''} ${projectData.details?.length ? `<table class="details-table"><tbody>${projectData.details.map(detail => `<tr><th>${detail.label}:</th><td>${detail.value}</td></tr>`).join('')}</tbody></table>` : ''} ${projectData.technologies?.length ? `<div class="modal-tech"><strong>Technologies:</strong><ul>${projectData.technologies.map(tech => `<li>${tech}</li>`).join('')}</ul></div>` : ''} ${projectData.url && projectData.url !== '#' ? `<p class="modal-link"><strong>Link:</strong> <a href="${projectData.url}" target="_blank" rel="noopener noreferrer">View Project</a></p>` : ''} `; modalContainerElement.style.width = ''; modalContainerElement.style.height = ''; modalContainerElement.style.top = '50%'; modalContainerElement.style.left = '50%'; modalContainerElement.style.transform = 'translate(-50%, -50%)'; modalContentElement.scrollTop = 0; modalContainerElement.style.display = 'block'; } else { console.warn("Invalid projectIndex for detail modal:", projectIndex); currentlyDisplayedProjectIndex = -1; }
}

//TEST

// --- Background Click Logic ---
// (Keep as is)
document.addEventListener('click', (event) => {
    if (!event.target.closest('#modal-container') && !event.target.closest('#project-list-modal-container')) {
        if (lightboxOverlay && lightboxOverlay.style.display !== 'none' && event.target.closest('#lightbox-overlay')) { return; }
        if (modalContainerElement && modalContainerElement.style.display !== 'none') {
           console.log("Background click detected, closing detail modal.");
           modalContainerElement.style.display = 'none';
        }
    }
});