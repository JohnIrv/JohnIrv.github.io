// constants.js
// Stores constant data used throughout the application, such as project details and model paths.

/**
 * Project Data Array
 * Each object represents a project displayed in the portfolio.
 * This data is used to populate the detail modal window.
 */
export const PROJECTS = [
    { // index 0
        title: 'Bring Me The Horizon',
        url: '#', // URL for the project link (use '#' if no link)
        subtitle: "Ft Lil Uzi Vert, Daryl Palumbo, Glassjaw", // Subtitle displayed below the title
        description: "<p>I contributed 3D visual effects sequences to the 'AMEN!' music video, with specific attention to the sequence featuring Daryl Palumbo. My role encompassed the full development of the mouth/stomach environment (modeling, texturing, lighting, animation), fluid dynamics, and associated 3D assets.</p>", // HTML description content
        youtubeEmbedUrl: 'https://www.youtube.com/embed/2TjcPpasesA', // URL for YouTube iframe embed
        additionalImages: [ // Array of paths for additional images displayed below video as thumbnails
            'images/uzi1.png',
            'images/uzi2.gif',
            'images/uzi3.png'
        ],
        details: [ // Array of objects for the details table (Label/Value pairs)
            { label: 'Director/Editor', value: 'Weston Allen' },
            { label: 'Producer/Assistant Director:', value: ' Amanda Levensohn/Peanutt Productions' },
            { label: '3D/VFX', value: 'John Irving' },
            { label: '3D/VFX', value: 'Greg Nachmanovitch' },
            { label: '3D/VFX', value: 'Mitchell Craft' },
            { label: 'DP', value: 'Kevin Ullibari' },
            { label: 'Gaffer', value: 'Ken Shinozaki' },
            { label: 'Grip', value: 'Ben Palmer' },
            { label: 'GE Swing', value: 'Ceaser Flores' },
            { label: '1st AC', value: 'Justin L. Williams' },
            { label: 'Set Design', value: 'Dorian Electra' },
            { label: 'Art Dept', value: 'Fields' },
            { label: 'Apt Dept', value: 'Frankie Lawson' },
            { label: 'PA', value: 'Sloane Polisner' },
            { label: 'PA', value: 'Jane Getto' },
            { label: 'Makeup', value: 'Vlada Kozachyshche' },
            { label: 'SFX', value: 'Eris Deo' },
            { label: 'UK Videographer', value: 'CIRCUS HEad' },
            { label: 'UK Gaffer/1st AC', value: 'Damian Palli' },
            { label: 'UK Stylist', value: 'Luca Wowczyna' },
            { label: 'UK Style Assistant', value: 'Laurelle Bedeau-Rider' },
        ]
    },
    { // index 1
        title: 'Moncler + Salehe Bembury',
        url: '#',
        subtitle: "In partnership with Thermonuclear",
        description: "<p>I worked as part of a team of artists, designers and compositors on the ad campaign for Moncler x Salehe Bembury's SS23 collection.</p><p> My focus was on 3D asset and environment development, animation, and rendering. Final delivery was a series of high-resolution print assets for ads/billboards, and a 30 second ad spot for web and social media.</p>",
        youtubeEmbedUrl: 'https://www.youtube.com/embed/HgMMMktXVLw',
        additionalImages: [
            'images/moncler1.jpg',
            'images/moncler4.jpg',
            'images/moncler3.jpg',
            'images/moncler2.jpg',
            'images/moncler5.jpg',
            'images/moncler6.jpg'
        ],
        // No 'details' provided for this project yet
    },
    { // index 2
        title: 'LA Kings',
        url: '#',
        subtitle: "",
        description: "<p>Working closely with several other technical artists, I helped to create a series of cinematic animations in Unreal Engine. These animations showcased volumetric captures of LA Kings players, serving as unique Jumbotron intros corresponding to each team in the NHL.</p><p> I developed props, environments, liquid physics simulations, environment design and set pieces, as well as assisting in the implementation of proprietary volumetric capture technology within Unreal Engine.</p>",
        localVideoPath: 'videos/inc-lakings-Yoomxlakings-Gifcomp-2K-1-Compressed.mp4',
        additionalImages: [
            'images/lakings1.png',
            'images/lakings2.png',
            'images/lakings3.gif'
        ],
        details: [] // Empty details array
    },
    { // index 3
        title: 'Miu Miu',
        url: '#',
        subtitle: "",
        description: "<p>I created a variety of 3D assets and animations for Cecile B. Evans' film 'Reception!', starring Guslagie Malanda. The film served as the main component of Evans' video installation for Miu Miu's Fall/Winter show at Paris Fashion week 2024.</p><p>As part of a team of artists, I was parimarily focused on the modeling and secondary animation of the animatronic hamster, as well as various particle effects and elements of environmental design.",
        youtubeEmbedUrl: 'https://www.youtube.com/embed/48GofSWcSWY',
        additionalImages: [
            'images/miu miu1.png',
            'images/miu miu2.gif',
            'images/miu miu3.gif',
            'images/miu miu4.webp',
            'images/miu miu5.webp'
        ],
        details: [] // Empty details array
    },
    { // index 4 - ADDED centerpieceImages, REMOVED additionalImages
        title: 'The Beak Trio',
        url: '#',
        // subtitle: "Placeholder Subtitle", // Decide if you need subtitle/details
        description: "<p>In a collaboration with artist Gregory Nachmanovitch, I designed album covers and promotional artwork for the Beak Trio's latest full length releases, Hydrogen Horse Factory (2024), and Bezoar (2021)</p>",
        youtubeEmbedUrl: '',
        centerpieceImages: [ // <<< ADDED THIS ARRAY for large images
            'images/Beak1.jpg',
            'images/beak2.jpg'
        ],
        additionalImages: [], // <<< EMPTIED THIS (no thumbnails needed for this one)
        // details: [ { label: 'Placeholder Label', value: 'Placeholder Value' } ]
    },
    { // index 5
        title: 'Elena Velez',
        url: '#',
        subtitle: "In partnership with Ophelia and company",
        description: "<p>I created 3d visuals for the campaign video of CFDA Award Winner Elena Velez' Autumn/Winter 2023 Fashion Show 'HOWS MY DRIVING?'</p><p>The scenery was created using a combination of traditional hard surface modeling, procedural workflows, and AI generated imagery. Live footage was then composited directly into the 3D environment within Blender.</P>",
        youtubeEmbedUrl: 'https://youtube.com/embed/U36lCOp2XPQ',
        additionalImages: [
            'images/elena velez2.gif',
            'images/elena velez3.gif',
            'images/elena velez4.gif',
            'images/elena velez1.png'
        ],
        details: [
            { label: 'Director', value: 'C Prinz' },
            { label: 'Executive Producer', value: 'Jill Ferraro' },
            { label: 'Executive Producer', value: 'Emi Stewart' },
            { label: 'Production Company', value: 'Paradise Productions' },
            { label: 'Production Company', value: 'Object & Animal' },
            { label: 'Director of Photography', value: 'Kelly Jeffrey' },
            { label: 'Styled by', value: 'Joe Van O' },
            { label: 'Hair Stylist', value: 'Isaac Davidson' },
            { label: 'Makeup Artist', value: 'Nina Carelli' },
            { label: 'Nail Artist', value: 'Lake Stein' },
            { label: 'Production Designer', value: 'Laura Hughes' },
            { label: 'Art Director', value: 'Elena Velez' },
            { label: 'Junior Art Director', value: 'Andreas Farsta' },
            { label: 'B Unit Camera Operator', value: 'Jason Filmore Sondock' },
            { label: 'Composer', value: 'Jason Tibi' },
            { label: 'BTS Photographer', value: 'Mateus Porto' },
            { label: 'Editor', value: 'Jojo King' },
            { label: 'Assistant Editor', value: 'George Romo' },
            { label: 'Producer', value: 'Grace Hammerstein' },
            { label: 'Head of Production', value: 'Lisa Barnable' },
            { label: 'Executive Producer', value: 'Adam Becht' },
            { label: 'Color House', value: 'Ethos Studio' },
            { label: 'Colorist', value: 'Dante Pasquinelli' },
            { label: 'Color Producer', value: 'Nat Tereshchenko' },
            { label: 'Creative Studio', value: 'Ophelia & Company' },
            { label: 'Creative Director', value: 'Elliot Barbernell' },
            { label: 'Producer', value: 'Jeff Haskell' },
            { label: 'Vfx House', value: 'INCworks Studio' },
            { label: 'CG Artist', value: 'John Irving' },
            { label: 'CG Artist', value: 'Mitchell Craft' },
            { label: 'Rotoscoping Studio', value: 'CG Lab Producer: Murad Currawalla' },
            { label: 'Clean Up Crew', value: 'Noa Graphics Studio' },
            { label: 'Producer', value: 'Narendra kumar Moond' },
            { label: 'Clean Up Artist', value: 'Shivani Jindal' },
            { label: 'Clean Up Artist', value: 'Jatin Jindal' },
            { label: 'Production Manager', value: 'Mia Jarrett' },
            { label: 'AD', value: 'Jake Leibowitz' },
            { label: '1st AC', value: 'Ryan Nocella' },
            { label: '2nd AC', value: 'Greg Howard' },
            { label: 'Gaffer', value: 'Andrew “Tank” Rivara' },
            { label: 'Talent', value: 'Dorian Enis' },
            { label: 'Talent', value: 'Bella Newman' },
            { label: 'Talent', value: 'Eris Avera' },
            { label: 'Talent', value: 'Eden Abebe' },
            { label: 'Production Coordinator', value: 'Jansan Pierre' },
            { label: 'Production Assistant', value: 'Fernando Osorio' },
            { label: 'Production Assistant', value: 'Camey Falcone' },
            { label: 'Production Assistant', value: 'Eloy Correia' },
            { label: 'Talent', value: 'Izzy Israel' },
            { label: 'Talent', value: 'Sophia Lamar' },
            { label: 'Talent', value: 'Skylar Grey' },
            { label: 'Talent', value: 'Kay Kasparhauser' },
            { label: 'Talent', value: 'Friday Chuol' },
            { label: 'Talent', value: 'Raven Wallace' },
            { label: 'Key Grip', value: 'Matt Tomko' },
            { label: 'BBE', value: 'Tim Anderson' },
            { label: 'BBG', value: 'Garrett Cantrell' },
            { label: '3rd Electric', value: 'Sam Clegg' },
            { label: 'Grip', value: 'Balz Biellmann' },
            { label: 'Stylist Assistant', value: 'Julianne McCue' },
            { label: 'Stylist Assistant', value: 'Zenin Soul' },
            { label: 'Makeup Assistant', value: 'Cassie Lee' },
            { label: 'Design Assistant', value: 'Andrew Curwen' },
            { label: 'Art Assistant', value: 'Katan Trautman' }
          ]
          
    },
    { // index 6
        title: 'Megan Thee Stallion',
        url: '#',
        subtitle: "In partnership with Thermonuclear",
        description: "<p>As a member of the creative team for Megan Thee Stallion’s Cobra music video, I took part in the fast-paced production of virtual set extensions, asset creation and VFX. </p>",
        youtubeEmbedUrl: 'https://youtube.com/embed/DOZNRoL0310',
        additionalImages: [
            'images/megan1.png',
            'images/megan2.jpg',
            'images/megan3.png'            
        ],
    },
    { // index 7
        title: 'Product Visualization',
        url: '#',
        subtitle: "Confidential Client",
        description: "<p>I produced a suite of photorealistic 3D renderings for a luxury furniture collection, designed specifically for their online catalogue and e-commerce platform.</p><p>This necessitated close collaboration with the company's creative team to ensure that furniture, scenery and lighting adhered seamlessly to their established brand identity.</p>",
        youtubeEmbedUrl: '',
        centerpieceImages: [ // <<< ADDED THIS ARRAY for large images
            'images/ecommerce1.jpg',
            'images/ecommerce2.jpg',
            'images/ecommerce3.jpg',
            'images/ecommerce4.jpg',
        ],
        additionalImages: [],
    },
    { // index 8
        title: 'Cecile B Evans',
        url: '#',
        subtitle: "",
        description: "<p>I collaborated with artist Cecile B. Evans on a series of special effects for their 2023 film, Reality Or Not.  The film premiered at Museo d’Arte Moderna di Bologna in Italy, and has since been featured in several prominent museums and galleries in France, the UK and Singapore.</p>",
        youtubeEmbedUrl: '',
        centerpieceImages: [ // <<< ADDED THIS ARRAY for large images
            'images/cecile b evans4.png'
        ],
        additionalImages: [
            'images/cecile b evans1.gif',
            'images/cecile b evans3.gif',
            'images/cecile b evans2.png'
        ],
    },
    { // index 9
        title: 'FuturePerfect',
        url: '#',
        subtitle: "",
        description: "<p>I remastered materials, designed a new environment and rebuilt smoke simulations and camerawork from a previous piece by Futureperfect. This material was then used for a short web animation.</p>",
        localVideoPath: 'videos/Constellation Final Render.mp4',
        additionalImages: [
            'images/futureperfect1.png',
            'images/futureperfect2.png',
            'images/futureperfect3.png'
        ],
    },
    { // index 10
        title: 'A24',
        url: '#',
        subtitle: "",
        description: "<p>I provided 3D Illustrations or the 'Pain is Temporary' Zine that accompanied the release of Benny Safdie's 'The Smashing Machine'.</p><p>Zine design and AD by Kurt Woerpel.</p>",
        localVideoPath: '',
        additionalImages: [
            'images/TSM1.jpg',
            'images/TSM2.jpg',
            'images/TSM3.jpg',
            'images/TSM4.jpg'
        ],
    },
    
];

// Paths for the 3D models used in the scene, loaded via GLTFLoader
export const modelPaths = [
    'models/mouth.glb',
    'models/MonclerB.glb',
    'models/HockeyStick.glb',
    'models/Hamster.glb',
    'models/globe.glb',
    'models/rock6.glb',
    'models/rock7.glb',
    'models/rock8.glb',
    'models/rock9.glb',
    'models/rock10.glb'
];

// Constants controlling the interactive rotation animation of models
export const ROT_MAX_X = Math.PI / 16; // Max rotation angle up/down
export const ROT_MAX_Y = Math.PI / 8;  // Max rotation angle left/right
export const ROT_SENSITIVITY = 0.05;   // How much mouse movement affects rotation target
export const ROT_SLERP_FACTOR = 0.07;  // Smoothness of rotation interpolation (lower = smoother)

// Camera Settings for the orthographic view
export const orthoViewHeight = 50; // Determines the vertical size of the camera's view

// Other constants can be added here