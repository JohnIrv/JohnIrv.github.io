// src/index.js
// Main application file for the portfolio.
// ... (Version comment updated) ...
// VERSION: ... + Lightbox Buttons Below Image

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
  'images/uzi2.gif', 'images/uzi3.png', 'images/TSM1.jpg', 'images/TSM2.jpg', 'images/TSM3.jpg', 'images/TSM4.jpg', 'images/Step6.png', 'images/Rice 5 Gallon Bucket.png', 
];
// --- END Image List ---

// DOM Element References
let modalContainerElement = null, modalContentElement = null, modalCloseBtnElement = null, modalHeaderElement = null;
let projectListContainerElement = null, projectListHeaderElement = null, projectListContentElement = null, projectListMinimizeBtnElement = null;
let lightboxOverlay = null, lightboxImage = null, lightboxClose = null;
let lightboxPrevBtn = null, lightboxNextBtn = null; // Lightbox Button Vars
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

// --- Draggable Modal Functions (Keep definition for Detail Modal use) ---
function attachDragHandlers(headerElement, modalElement) {
    if (!headerElement || !modalElement) { console.error("attachDragHandlers: Header or Modal element missing."); return; }
    let specificDragOffsetX, specificDragOffsetY; let elementBeingDragged = null;

    const onDragStart = (e) => {
        if (e.target.id === 'modal-close-btn') return;
        if (e.target.closest('#lightbox-overlay')) return;

        elementBeingDragged = modalElement;
        elementBeingDragged.style.cursor = 'grabbing';
        try { elementBeingDragged.offsetHeight; } catch(e) {}

        const rect = elementBeingDragged.getBoundingClientRect();
        specificDragOffsetX = e.clientX - rect.left; specificDragOffsetY = e.clientY - rect.top;

        // Reset transform only if using top/left positioning for drag
        elementBeingDragged.style.transform = 'none';
        elementBeingDragged.style.left = `${rect.left}px`;
        elementBeingDragged.style.top = `${rect.top}px`;

        window.addEventListener('mousemove', specificOnDragMove); window.addEventListener('mouseup', specificOnDragEnd);
        e.preventDefault(); e.stopPropagation();
    };

    const specificOnDragMove = (e) => {
        if (!elementBeingDragged) return;
        const newX = e.clientX - specificDragOffsetX; const newY = e.clientY - specificDragOffsetY;
        elementBeingDragged.style.left = `${newX}px`; elementBeingDragged.style.top = `${newY}px`;
    };
    const specificOnDragEnd = () => {
        if (!elementBeingDragged) return;
        elementBeingDragged.style.cursor = '';
        elementBeingDragged = null;
        window.removeEventListener('mousemove', specificOnDragMove); window.removeEventListener('mouseup', specificOnDragEnd);
    };
    headerElement.addEventListener('mousedown', onDragStart);
}
// --- END Draggable Modal Functions ---


// --- Lightbox Functions ---
function hideLightbox() {
    if (lightboxOverlay) { lightboxOverlay.style.display = 'none'; lightboxImage.src = ''; }
    if(lightboxPrevBtn) lightboxPrevBtn.style.display = 'none'; // Ensure buttons hidden
    if(lightboxNextBtn) lightboxNextBtn.style.display = 'none'; // Ensure buttons hidden
    currentLightboxImages = []; currentLightboxIndex = 0; console.log("Lightbox hidden");
}

function showLightboxImage(index) {
    if (!lightboxOverlay || !lightboxImage || !lightboxPrevBtn || !lightboxNextBtn) {
         console.error("Lightbox elements missing.");
         hideLightbox(); return;
     }
    if (!currentLightboxImages || !Array.isArray(currentLightboxImages) || currentLightboxImages.length === 0) {
         console.error(`Lightbox: currentLightboxImages invalid or empty.`);
         hideLightbox(); return;
     }

    currentLightboxIndex = Math.max(0, Math.min(currentLightboxImages.length - 1, index));
    lightboxImage.src = currentLightboxImages[currentLightboxIndex];
    console.log(`Showing lightbox image index: ${currentLightboxIndex}, src: ${lightboxImage.src}`);
    lightboxOverlay.style.display = 'flex';

    // Show/hide navigation buttons
    if (currentLightboxImages.length > 1) {
        lightboxPrevBtn.style.display = 'inline-block';
        lightboxNextBtn.style.display = 'inline-block';
    } else {
        lightboxPrevBtn.style.display = 'none';
        lightboxNextBtn.style.display = 'none';
    }
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
         if (imageUrl && imageUrl === relativeClickedPath) { matchFound = true; }
         const centerpieceImages = project.centerpieceImages?.map(normalize);
         if (!matchFound && centerpieceImages) { matchFound = centerpieceImages.some(p => p === relativeClickedPath); }
         const additionalImages = project.additionalImages?.map(normalize);
         if (!matchFound && additionalImages) { matchFound = additionalImages.some(p => p === relativeClickedPath); }
         return matchFound;
    });
    return projectIndex;
}


// --- Ticker Text Population (Single Span) ---
function populateTickerText() {
    const tickerBandElement = document.getElementById('name-ticker-band');
    const tickerTextElement = document.getElementById('ticker-text-content');

    if (tickerBandElement && tickerTextElement) {
        const nameUnit = "John Irving is an artist and animator who lives and works in NYC. He is a cofounder of <a href='https://incworks.studio' target='_blank' rel='noopener noreferrer' class='ticker-link'><span class='ticker-link-i'>I</span><span class='ticker-link-n'>N</span><span class='ticker-link-c'>C</span><span class='ticker-link-works'>works</span></a> studio. He can be reached at: johnlmirving@gmail.com OR <a href='https://www.instagram.com/__johnirving/' target='_blank' rel='noopener noreferrer' class='ticker-link'>@__johnirving</a>\u00A0\u00A0\u00A0";
        const nameUnitTextOnly = "John Irving is an artist and animator who lives and works in NYC. He is a cofounder of INCworks studio. He can be reached at: johnlmirving@gmail.com OR @__johnirving\u00A0\u00A0\u00A0";
        let unitWidth = 0;
        const tempSpan = document.createElement('span');
        try {
            tempSpan.style.visibility = 'hidden'; tempSpan.style.position = 'absolute'; tempSpan.style.whiteSpace = 'nowrap';
            const tickerStyle = window.getComputedStyle(tickerBandElement); const textStyle = window.getComputedStyle(tickerTextElement);
            tempSpan.style.fontFamily = textStyle.fontFamily || tickerStyle.fontFamily; tempSpan.style.fontSize = textStyle.fontSize || tickerStyle.fontSize; tempSpan.style.letterSpacing = textStyle.letterSpacing || '1px';
            tempSpan.textContent = nameUnitTextOnly;
            document.body.appendChild(tempSpan); unitWidth = tempSpan.offsetWidth;
        } catch (e) { console.error("Error measuring text width:", e);
        } finally { if (tempSpan.parentNode === document.body) { document.body.removeChild(tempSpan); } }

        if (unitWidth > 0) {
            const screenWidth = window.innerWidth;
            const repeatsNeeded = Math.ceil(screenWidth / unitWidth) + 2;
            const singleTextSegment = nameUnit.repeat(repeatsNeeded);
            const fullTextForAnimation = singleTextSegment + singleTextSegment;
            if (tickerTextElement.innerHTML !== fullTextForAnimation) {
                 tickerTextElement.innerHTML = fullTextForAnimation;
                 console.log(`Ticker Text Updated: Unit width ${unitWidth}px, needed ${repeatsNeeded} repeats per segment.`);
            }
        } else {
            console.error("Ticker Text: Could not calculate unit width. Using fallback.");
            const fallbackSegment = (nameUnit).repeat(30);
            if (!tickerTextElement.innerHTML.startsWith(fallbackSegment)) {
                 tickerTextElement.innerHTML = fallbackSegment + fallbackSegment;
            }
        }
    } else {
        console.warn("Ticker elements (#name-ticker-band, #ticker-text-content) not found.");
    }
}
// --- End Ticker Text Population ---

// --- Function to Toggle Project List Minimize State ---
function toggleProjectListMinimize() {
    if (!projectListContainerElement || !projectListMinimizeBtnElement || !projectListHeaderElement) {
        console.error("Cannot toggle minimize: required elements missing."); return;
    }
    projectListContainerElement.style.height = '';
    const isMinimized = projectListContainerElement.classList.toggle('minimized');
    projectListMinimizeBtnElement.textContent = isMinimized ? '+' : '-';
    console.log(`Project list ${isMinimized ? 'minimized' : 'maximized'}.`);
}
// --- End Toggle Project List Minimize State ---


// --- Initialization and Event Listeners ---
window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Loaded - Getting elements...');
    // Get elements
    modalContainerElement = document.getElementById('modal-container');
    modalContentElement = document.getElementById('modal-content');
    modalCloseBtnElement = document.getElementById('modal-close-btn');
    modalHeaderElement = document.getElementById('modal-header');
    projectListContainerElement = document.getElementById('project-list-modal-container');
    projectListHeaderElement = document.getElementById('project-list-header');
    projectListContentElement = document.getElementById('project-list-content');
    projectListMinimizeBtnElement = document.getElementById('project-list-minimize-btn');
    lightboxOverlay = document.getElementById('lightbox-overlay');
    lightboxImage = document.getElementById('lightbox-image');
    lightboxClose = document.getElementById('lightbox-close');
    lightboxPrevBtn = document.getElementById('lightbox-prev'); // Get Prev Button
    lightboxNextBtn = document.getElementById('lightbox-next'); // Get Next Button
    const imageContainer = document.getElementById('image-grid-background');
    const tickerBandElement = document.getElementById('name-ticker-band');

    // Ticker setup
    populateTickerText();
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            console.log("Window resized, repopulating ticker text...");
            populateTickerText();
            if (tickerBandElement) adjustLayout(tickerBandElement, imageContainer, projectListContainerElement);
        }, 250);
    });

    // Layout Adjustment
    const adjustLayout = (tickerBand, imgContainer, listContainer) => {
         if (!tickerBand) { console.warn("Ticker band not found for layout adjustments."); return; }
         const tickerHeight = tickerBand.offsetHeight;
         if (tickerHeight > 0) {
             const desiredGap = 10;
             if (imgContainer) { imgContainer.style.paddingTop = `${tickerHeight + desiredGap}px`; }
             else { console.warn("Image container not found for padding adjustment."); }
             if (!listContainer) { console.warn("Project list container not found during layout adjustment."); }
         } else { console.warn("Ticker band height is 0, layout not adjusted."); }
    };
    setTimeout(() => adjustLayout(tickerBandElement, imageContainer, projectListContainerElement), 150);

    // Populate Image Grid
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
                 img.alt = `Portfolio image: ${imgPath.substring(imgPath.lastIndexOf('/') + 1)}`;
                 img.loading = 'lazy';
                 img.dataset.index = index;
                 imageContainer.appendChild(img);
            });
            console.log(`Appended ${allImagePaths.length} images in random order.`);
            imageContainer.addEventListener('click', (event) => {
                if (event.target.tagName === 'IMG' && event.target.src) {
                    const projectIndex = findProjectIndexForImage(event.target.src);
                    if (projectIndex !== -1) {
                        console.log(`Grid Click: Opening modal for project index ${projectIndex}.`);
                        openOrUpdateDetailModal(projectIndex);
                        event.stopPropagation();
                    } else { console.log("Grid Click: No project found."); }
                }
            });
        }
    } else { console.error("Image container '#image-grid-background' not found!"); }

    // Modal Setup (Detail)
    if (modalContainerElement && modalContentElement && modalCloseBtnElement) {
        modalCloseBtnElement.addEventListener('click', () => {
            if (modalContainerElement) {
                modalContainerElement.style.display = 'none';
                document.body.classList.remove('modal-open-no-scroll');
            }
        });
        if(modalHeaderElement) {
            attachDragHandlers(modalHeaderElement, modalContainerElement);
        } else { console.warn("Detail modal header not found for dragging!");}
        modalContentElement.addEventListener('click', (event) => { // Listener for clicks inside modal content
            let imageIndex = -1; let sourceType = null;
            const addImgItem = event.target.closest('.additional-image-item');
            if (addImgItem) {
                 const imgEl = addImgItem.querySelector('img');
                 if(imgEl?.dataset.index) { imageIndex = parseInt(imgEl.dataset.index, 10); sourceType = 'additional'; }
            } else {
                 const centerImgEl = event.target.closest('.centerpiece-images-container img.lightbox-trigger');
                 if(centerImgEl?.dataset.index) { imageIndex = parseInt(centerImgEl.dataset.index, 10); sourceType = 'centerpiece'; }
            }
            if (sourceType !== null && !isNaN(imageIndex) && currentlyDisplayedProjectIndex !== -1) {
                openLightbox(currentlyDisplayedProjectIndex, imageIndex, sourceType);
            } else if (sourceType !== null) { console.warn("Lightbox trigger click: Invalid index or project."); }
        });
    } else { console.warn("Detail modal elements missing!");}

    // Modal Setup (Project List)
    if (projectListContainerElement && projectListHeaderElement && projectListContentElement) {
        populateProjectList();
        console.log("Drag handler NOT attached to Project List Modal");
        projectListContentElement.addEventListener('click', (event) => {
            const link = event.target.closest('a.project-list-link');
            if (link?.dataset.index) {
                event.preventDefault();
                const projectIndex = parseInt(link.dataset.index, 10);
                if (!isNaN(projectIndex)) { openOrUpdateDetailModal(projectIndex); }
            }
        });
        if (projectListMinimizeBtnElement) {
             projectListMinimizeBtnElement.addEventListener('click', (event) => {
                 event.stopPropagation(); toggleProjectListMinimize();
             });
        } else { console.warn("Minimize button for project list not found!"); }
    } else { console.warn("Project list modal elements missing!"); }

    // Initial Modal States
    if (modalContainerElement) modalContainerElement.style.display = 'none';
    if (projectListContainerElement) {
        try { projectListContainerElement.style.display = 'flex'; projectListContainerElement.style.visibility = 'visible'; projectListContainerElement.style.opacity = '1'; } catch(e) { console.error("Error setting initial list modal styles:", e); }
    } else { console.error("Project List Container NOT FOUND!"); }

    // Lightbox Setup
    if (lightboxOverlay && lightboxImage && lightboxClose && lightboxPrevBtn && lightboxNextBtn) {
        lightboxClose.addEventListener('click', (event) => { hideLightbox(); event.stopPropagation(); });
        lightboxOverlay.addEventListener('click', (event) => { if (event.target === lightboxOverlay) { hideLightbox(); event.stopPropagation(); }});
        lightboxPrevBtn.addEventListener('click', (event) => { navigateLightbox(-1); event.stopPropagation(); }); // Added listener
        lightboxNextBtn.addEventListener('click', (event) => { navigateLightbox(1); event.stopPropagation(); }); // Added listener
    } else { console.error("Lightbox elements (incl. nav buttons) not found!"); }
    window.addEventListener('keydown', handleLightboxKeys); // Keyboard listener

    console.log('DOM setup complete.');
}); // End DOMContentLoaded

// --- Project List Population ---
function populateProjectList() {
    if (!projectListContentElement || !PROJECTS) return;
    let listHtml = '<ul>';
    PROJECTS.forEach((project, index) => {
        listHtml += `<li><a href="#" class="project-list-link" data-index="${index}">${project.title}</a></li>`;
    });
    listHtml += '</ul>';
    projectListContentElement.innerHTML = listHtml;
}

// --- Detail Modal Logic ---
function openOrUpdateDetailModal(projectIndex) {
    if (!modalContainerElement || !modalContentElement) { console.error("Detail modal elements missing."); return; }
    if (projectIndex !== undefined && projectIndex >= 0 && projectIndex < PROJECTS.length) {
        currentlyDisplayedProjectIndex = projectIndex;
        const projectData = PROJECTS[projectIndex];
        modalContentElement.innerHTML = `
            <h2>${projectData.title}</h2>
            ${projectData.subtitle ? `<p class="modal-subtitle">${projectData.subtitle}</p>` : ''}
            ${projectData.imageUrl ? `<div class="modal-image-container"><img src="${projectData.imageUrl}" alt="${projectData.title} preview"></div>` : ''}
            ${projectData.youtubeEmbedUrl ? `<div class="video-wrapper"><iframe src="${projectData.youtubeEmbedUrl}" title="Video for ${projectData.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>` : ''}
            ${projectData.localVideoPath ? `<div class="video-wrapper"><video controls preload="metadata"><source src="${projectData.localVideoPath}" type="video/mp4">Your browser does not support the video tag.</video></div>` : ''}
            ${projectData.centerpieceImages?.length ? `<div class="centerpiece-images-container">${projectData.centerpieceImages.map((imgUrl, imageIndex) => `<img src="${imgUrl}" alt="${projectData.title} centerpiece image ${imageIndex + 1}" class="lightbox-trigger" data-index="${imageIndex}">`).join('')}</div>` : ''}
            ${projectData.additionalImages?.length ? `<div class="additional-images-container">${projectData.additionalImages.map((imgUrl, originalIndex) => `<div class="additional-image-item"><img src="${imgUrl}" alt="Project detail image thumbnail" data-index="${originalIndex}"></div>`).slice(0, 3).join('')}</div>` : ''}
            ${projectData.description ? `${projectData.description}` : ''}
            ${projectData.details?.length ? `<table class="details-table"><tbody>${projectData.details.map(detail => `<tr><th>${detail.label}:</th><td>${detail.value}</td></tr>`).join('')}</tbody></table>` : ''}
            ${projectData.technologies?.length ? `<div class="modal-tech"><strong>Technologies:</strong><ul>${projectData.technologies.map(tech => `<li>${tech}</li>`).join('')}</ul></div>` : ''}
            ${projectData.url && projectData.url !== '#' ? `<p class="modal-link"><strong>Link:</strong> <a href="${projectData.url}" target="_blank" rel="noopener noreferrer">View Project</a></p>` : ''}
        `;
        modalContainerElement.style.width = ''; modalContainerElement.style.height = '';
        modalContainerElement.style.top = '50%'; modalContainerElement.style.left = '50%';
        modalContainerElement.style.transform = 'translate(-50%, -50%)';
        modalContentElement.scrollTop = 0;
        document.body.classList.add('modal-open-no-scroll');
        modalContainerElement.style.display = 'block';
    } else {
        console.warn("Invalid projectIndex for detail modal:", projectIndex);
        currentlyDisplayedProjectIndex = -1;
        document.body.classList.remove('modal-open-no-scroll');
    }
}

// --- Background Click Logic ---
document.addEventListener('click', (event) => {
    const clickedDetailModal = event.target.closest('#modal-container');
    const clickedProjectList = event.target.closest('#project-list-modal-container');
    const clickedLightbox = event.target.closest('#lightbox-overlay');
    const isLightboxVisible = lightboxOverlay && lightboxOverlay.style.display !== 'none';

    if (!clickedDetailModal && !clickedProjectList && (!isLightboxVisible || !clickedLightbox)) {
        if (modalContainerElement && modalContainerElement.style.display !== 'none') {
            console.log("Background click detected, closing detail modal.");
            modalContainerElement.style.display = 'none';
            document.body.classList.remove('modal-open-no-scroll');
        }
    }
});