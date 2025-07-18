// navigation.js

// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, signOut as firebaseSignOut, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', async () => {
    const navigationContainer = document.getElementById('navigation-container');
    const floatingMobileSearchContainer = document.getElementById('floating-mobile-search-container');
    const searchOverlayContainer = document.getElementById('search-overlay-container');
    const floatingFavoritesContainer = document.getElementById('floating-favorites-container');
    const favoritesOverlayContainer = document.getElementById('favorites-overlay-container');
    const sidebarContainer = document.getElementById('sidebar-container');
    const sidebarOverlayContainer = document.getElementById('sidebar-overlay-container');
    const footerContainer = document.getElementById('footer-container'); // Get footer container

    // Inject navigation HTML
    if (navigationContainer) {
        navigationContainer.innerHTML = `
            <nav class="fixed top-0 left-0 w-full bg-black bg-opacity-80 backdrop-blur-sm shadow-lg z-50 border-b border-gray-700" style="padding-top: env(safe-area-inset-top); padding-left: env(safe-area-inset-left); padding-right: env(safe-area-inset-right);">
                <div class="max-w-7xl mx-auto flex items-center justify-between py-3 px-4 sm:px-6 md:px-6">
                    <button id="menu-toggle" class="lg:hidden text-gray-300 hover:text-white transition-colors order-1 mr-4">
                        <i class="fa-solid fa-bars text-2xl"></i>
                    </button>

                    <a href="/" class="flex items-center flex-shrink-0 order-2 md:order-1">
                        <img src="/icon-192x192.png" alt="Plamene Logo" class="mr-2 rounded-md w-8 h-8">
                        <span class="text-xl font-bold text-white hover:text-[#e84142] transition-colors">Arena Index</span>
                    </a>

                    <div class="hidden lg:flex items-center space-x-4 ml-4 flex-shrink-0 hide-scrollbar overflow-x-auto order-2">
                        <a href="/discover.html" class="text-gray-300 hover:text-[#e84142] transition-colors text-base whitespace-nowrap flex items-center group">
                            <div class="w-8 h-8 border border-gray-700 rounded-md flex items-center justify-center mr-2 group-hover:border-[#e84142] transition-colors">
                                <i class="fa-solid fa-compass text-base group-hover:text-[#e84142] transition-colors"></i>
                            </div>
                            Discover
                        </a>
                        <a href="#" class="text-gray-300 hover:text-[#e84142] transition-colors text-base whitespace-nowrap flex items-center group">
                            <div class="w-8 h-8 border border-gray-700 rounded-md flex items-center justify-center mr-2 group-hover:border-[#e84142] transition-colors">
                                <i class="fa-solid fa-cube text-base group-hover:text-[#e84142] transition-colors"></i>
                            </div>
                            Projects
                        </a>
                        <a href="#" class="text-gray-300 hover:text-[#e84142] transition-colors text-base whitespace-nowrap flex items-center group">
                            <div class="w-8 h-8 border border-gray-700 rounded-md flex items-center justify-center mr-2 group-hover:border-[#e84142] transition-colors">
                                <i class="fa-solid fa-coins text-base group-hover:text-[#e84142] transition-colors"></i>
                            </div>
                            Tokens
                        </a>
                        <a href="#" class="text-gray-300 hover:text-[#e84142] transition-colors text-base whitespace-nowrap flex items-center group">
                            <div class="w-8 h-8 border border-gray-700 rounded-md flex items-center justify-center mr-2 group-hover:border-[#e84142] transition-colors">
                                <i class="fa-solid fa-users text-base group-hover:text-[#e84142] transition-colors"></i>
                            </div>
                            Social
                        </a>
                        <a href="/submit-project.html" class="bg-[#e84142] hover:bg-[#d43c3c] text-white text-sm font-semibold rounded-md transition-all duration-200 whitespace-nowrap glow-on-hover flex items-center h-8 px-3">
                            <i class="fa-solid fa-plus-circle mr-1"></i>
                            Submit Project
                        </a>
                    </div>

                    <div class="flex items-center space-x-3 flex-shrink-0 ml-auto order-3 md:order-4">
                        <button id="search-toggle" class="text-gray-300 hover:text-white transition-colors relative w-8 h-8 border border-gray-700 rounded-md flex items-center justify-center hover:border-[#e84142] transition-colors group">
                            <i class="fa-solid fa-magnifying-glass text-base group-hover:text-[#e84142] transition-colors"></i>
                        </button>
                        <!-- Updated favorite icon container with 'group' class -->
                        <div class="relative w-8 h-8 border border-gray-700 rounded-md flex items-center justify-center hover:border-yellow-400 transition-colors group">
                            <!-- Added 'group-hover:text-yellow-400' to the icon -->
                            <i id="favorite-nav-icon" class="fa-solid fa-star text-base text-gray-300 group-hover:text-yellow-400 cursor-pointer transition-colors"></i>
                            <span id="favorite-count" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 hidden">0</span>
                        </div>
                        <button id="auth-nav-button" class="bg-[#e84142] hover:bg-[#d43c3c] text-white text-sm font-semibold rounded-md transition-colors duration-200 whitespace-nowrap flex items-center justify-center w-8 h-8">
                            <span id="auth-icon" class=""><i class="fa-solid fa-user text-lg"></i></span>
                        </button>
                    </div>
                </div>
            </nav>
        `;
    }


    // Inject floating mobile search HTML
    if (floatingMobileSearchContainer) {
        floatingMobileSearchContainer.innerHTML = `
            <div id="floating-mobile-search" class="fixed left-1/2 -translate-x-1/2 w-11/12 md:w-full md:max-w-xl bg-black bg-opacity-95 backdrop-blur-sm p-3 rounded-lg shadow-xl z-[60] hidden"
                 style="top: 20%;">
                <div class="relative w-full">
                    <input type="text" id="search-input-mobile" placeholder="/ Search..." class="w-full pl-4 pr-10 py-[0.5rem] rounded-md bg-transparent text-white focus:outline-none border border-gray-700">
                    <i id="search-icon-mobile-inside" class="fa-solid fa-magnifying-glass absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                </div>
                <div id="search-results-mobile" class="mt-3 max-h-80 overflow-y-auto border border-gray-700 rounded-md p-2 custom-scrollbar-red">
                    <p class="text-gray-500 text-sm">Start typing to see results...</p>
                </div>
            </div>
        `;
    }

    // Inject search overlay HTML
    if (searchOverlayContainer) {
        searchOverlayContainer.innerHTML = `
            <div id="search-overlay" class="fixed inset-0 bg-black bg-opacity-70 z-50 hidden"></div>
        `;
    }

    // Inject floating favorites HTML
    if (floatingFavoritesContainer) {
        floatingFavoritesContainer.innerHTML = `
            <div id="floating-favorites" class="fixed left-1/2 -translate-x-1/2 w-11/12 md:w-full md:max-w-xl bg-black bg-opacity-80 backdrop-blur-sm p-3 rounded-lg shadow-xl z-[60] hidden border border-gray-700" style="top: 20%;">
                <div class="p-2 max-h-80 overflow-y-auto custom-scrollbar-red">
                    <div class="flex justify-between items-center mb-2 pb-2 border-b border-gray-700">
                        <h3 class="text-lg font-bold text-white flex items-center">
                            <i class="fa-solid fa-star text-yellow-400 mr-2"></i> Your Favorites
                        </h3>
                        <button id="close-favorites-box" class="text-gray-500 hover:text-red-500 transition-colors text-lg py-1 px-2 rounded">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    <div id="favorited-items-container">
                        <p class="text-gray-500 text-sm">No favorite items.</p>
                    </div>
                </div>
            </div>
        `;
    }

    // Inject favorites overlay HTML
    if (favoritesOverlayContainer) {
        favoritesOverlayContainer.innerHTML = `
            <div id="favorites-overlay" class="fixed inset-0 bg-black bg-opacity-70 z-50 hidden"></div>
        `;
    }

    // Inject sidebar HTML
    if (sidebarContainer) {
        sidebarContainer.innerHTML = `
            <div id="sidebar" class="fixed top-0 left-0 h-screen w-full bg-black bg-opacity-80 backdrop-blur-sm shadow-xl z-50 transform -translate-x-full transition-transform duration-300 ease-in-out flex flex-col"
                 style="padding-top: env(safe-area-inset-top); padding-bottom: env(safe-area-inset-bottom);">
                <div class="flex justify-between items-center py-3 px-4">
                    <a href="/" class="flex items-center flex-shrink-0" onclick="toggleSidebar()">
                        <img src="/icon-192x192.png" alt="Plamene Logo" class="mr-2 rounded-md w-8 h-8">
                        <span class="text-xl font-bold text-white hover:text-[#e84142] transition-colors">Arena Index</span>
                    </a>
                    <button id="close-sidebar" class="text-gray-400 hover:text-white transition-colors">
                        <i class="fa-solid fa-chevron-left text-xl"></i>
                    </button>
                </div>
                <nav class="flex flex-col">
                    <a href="/discover.html" class="text-gray-300 hover:text-[#e84142] transition-colors text-lg py-3 px-4 pt-4 flex items-center group mb-2" onclick="toggleSidebar()">
                        <div class="w-8 h-8 border border-gray-700 rounded-md flex items-center justify-center mr-2 group-hover:border-[#e84142] transition-colors">
                            <i class="fa-solid fa-compass text-base group-hover:text-[#e84142] transition-colors"></i>
                        </div>
                        Discover
                    </a>
                    <a href="#" class="text-gray-300 hover:text-[#e84142] transition-colors text-lg py-3 px-4 flex items-center group mb-2" onclick="toggleSidebar()">
                        <div class="w-8 h-8 border border-gray-700 rounded-md flex items-center justify-center mr-2 group-hover:border-[#e84142] transition-colors">
                            <i class="fa-solid fa-cube text-base group-hover:text-[#e84142] transition-colors"></i>
                        </div>
                        Projects
                    </a>
                    <a href="#" class="text-gray-300 hover:text-[#e84142] transition-colors text-lg py-3 px-4 flex items-center group mb-2" onclick="toggleSidebar()">
                        <div class="w-8 h-8 border border-gray-700 rounded-md flex items-center justify-center mr-2 group-hover:border-[#e84142] transition-colors">
                            <i class="fa-solid fa-coins text-base group-hover:text-[#e84142] transition-colors"></i>
                        </div>
                        Tokens
                    </a>
                    <a href="#" class="text-gray-300 hover:text-[#e84142] transition-colors text-lg py-3 px-4 flex items-center group mb-2" onclick="toggleSidebar()">
                        <div class="w-8 h-8 border border-gray-700 rounded-md flex items-center justify-center mr-2 group-hover:border-[#e84142] transition-colors">
                            <i class="fa-solid fa-users text-base group-hover:text-[#e84142] transition-colors"></i>
                        </div>
                        Social
                    </a>
                    <a href="/submit-project.html" class="bg-[#e84142] hover:bg-[#d43c3c] text-white text-lg font-semibold py-3 px-4 rounded-md transition-colors duration-200 whitespace-nowrap glow-on-hover flex items-center group mb-2 mx-4" onclick="toggleSidebar()">
                        <div class="w-8 h-8 border border-gray-700 rounded-md flex items-center justify-center mr-2 group-hover:border-white transition-colors">
                            <i class="fa-solid fa-plus-circle text-base"></i>
                        </div>
                        Submit Project
                    </a>
                </nav>
                <div class="mt-auto py-4 text-gray-400 text-sm px-4">
                    <div class="mb-4">
                        <a href="/privacy.html" class="block hover:text-[#e84142] transition-colors mb-1" onclick="toggleSidebar()">Privacy Policy</a>
                        <a href="/terms.html" class="block hover:text-[#e84142] transition-colors" onclick="toggleSidebar()">Terms of Service</a>
                    </div>
                    <div class="flex justify-start items-center space-x-4 mt-2">
                        <a href="/projects/arena-index.html" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-[#e84142] transition-colors" title="Index Token" onclick="toggleSidebar()">
                            <i class="fa-solid fa-globe text-lg"></i>
                        </a>
                        <a href="https://twitter.com/TheArenaIndex" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-[#e84142] transition-colors" title="Twitter" onclick="toggleSidebar()">
                            <i class="fab fa-twitter text-lg"></i>
                        </a>
                        <a href="https://t.me/TheArenaIndex" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-[#e84142] transition-colors" title="Telegram" onclick="toggleSidebar()">
                            <i class="fab fa-telegram-plane text-lg"></i>
                        </a>
                        <a href="https://www.coingecko.com/en/coins/index-token" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-[#e84142] transition-colors" onclick="toggleSidebar()">
                            <img src="https://www.coingecko.com/favicon.ico" alt="CoinGecko" class="w-5 h-5 inline-block align-middle filter grayscale hover:filter-none transition-all duration-200" title="CoinGecko" />
                        </a>
                    </div>
                </div>
            </div>
        `;
    }


    // Inject sidebar overlay HTML
    if (sidebarOverlayContainer) {
        sidebarOverlayContainer.innerHTML = `
            <div id="sidebar-overlay" class="fixed inset-0 bg-black bg-opacity-70 z-40 hidden"></div>
        `;
    }

    // Inject footer HTML
    if (footerContainer) {
        footerContainer.innerHTML = `
            <footer class="w-full mt-0 py-4 border-t border-gray-700 text-gray-400 text-center text-sm">
                <div class="w-full mx-auto px-4">
                    <div class="flex flex-row justify-center items-center space-y-0 space-x-4 mb-2">
                        <a href="/contact.html" class="hover:text-[#e84142] transition-colors">Contact</a>
                        <a href="/privacy.html" class="hover:text-[#e84142] transition-colors">Privacy Policy</a>
                        <a href="/terms.html" class="hover:text-[#e84142] transition-colors">Terms of Service</a>
                    </div>
                    <p>&copy; 2025 <a href="/" class="hover:text-[#e84142] transition-colors">Arena Index</a>. All Rights Reserved.</p>
                    <div class="flex flex-row justify-center items-center space-x-4 mt-2">
                        <a href="/projects/arena-index.html" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-[#e84142] transition-colors" title="Index Token">
                            <i class="fa-solid fa-globe text-lg"></i>
                        </a>
                        <a href="https://twitter.com/TheArenaIndex" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-[#e84142] transition-colors" title="Twitter">
                            <i class="fab fa-twitter text-lg"></i>
                        </a>
                        <a href="https://t.me/TheArenaIndex" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-[#e84142] transition-colors" title="Telegram">
                            <i class="fab fa-telegram-plane text-lg"></i>
                        </a>
                        <a href="https://www.coingecko.com/en/coins/index-token" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-[#e84142] transition-colors">
                            <img src="https://www.coingecko.com/favicon.ico" alt="CoinGecko" class="w-5 h-5 inline-block align-middle filter grayscale hover:filter-none transition-all duration-200" title="CoinGecko" />
                        </a>
                    </div>
                </div>
            </footer>
        `;
    }

    // --- SMALL PROFILE BOX (now only for Sign Out) ---
    // Create and dynamically inject the small profile box HTML
    const smallProfileBox = document.createElement('div');
    smallProfileBox.id = 'small-profile-box';
    smallProfileBox.className = 'fixed bg-black bg-opacity-80 backdrop-blur-sm p-4 rounded-lg shadow-xl z-[60] hidden border border-gray-700 w-64 md:w-64';
    smallProfileBox.style.maxHeight = 'calc(90vh - 5rem - env(safe-area-inset-top) - 1rem)';
    smallProfileBox.style.overflowY = 'auto';
    smallProfileBox.innerHTML = `
        <div class="flex items-center mb-4 pb-4 border-b border-gray-700">
            <img id="small-profile-img" src="/icon-192x192.png" alt="Profile Image" class="w-10 h-10 rounded-lg mr-4 object-cover">
            <div>
                <p id="small-profile-name" class="text-white font-bold text-lg">Guest User</p>
                <p id="small-profile-email" class="text-gray-400 text-sm">Not Signed In</p>
            </div>
        </div>
        <button id="sign-out-button" class="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 rounded-md transition-colors duration-200 mt-2">
            Sign Out
        </button>
    `;
    document.body.appendChild(smallProfileBox);


    // Function to show/hide the small profile box
    function toggleSmallProfileBox() {
        if (smallProfileBox) {
            if (smallProfileBox.classList.contains('hidden')) {
                // Close other floating elements
                if (!floatingFavorites.classList.contains('hidden')) {
                    toggleFavoritesFloatingBox();
                }
                if (!sidebar.classList.contains('-translate-x-full')) {
                    window.toggleSidebar();
                }
                if (!floatingMobileSearch.classList.contains('hidden')) {
                    toggleMobileSearch();
                }

                const authNavButton = document.getElementById('auth-nav-button'); // Use new button ID
                if (authNavButton) {
                    const rect = authNavButton.getBoundingClientRect();
                    // Align the right edge of the box with the right edge of the button (opens to the left)
                    smallProfileBox.style.right = `${window.innerWidth - rect.right}px`;
                    smallProfileBox.style.left = 'auto';
                    smallProfileBox.style.top = `${rect.bottom + 8}px`; // 8px for a small gap
                }
                smallProfileBox.classList.remove('hidden');
            } else {
                smallProfileBox.classList.add('hidden');
            }
        } else {
            console.error('Small profile box element not found.');
        }
    }
    // --- END SMALL PROFILE BOX ---


    // Initialize window.favorites if it doesn't exist
    if (!window.favorites) {
        window.favorites = {
            tokens: [],
            apps: [],
            nfts: [],
            users: [],
            news: [],
            projects: [],
            daos: [],
            videos: []
        };
    }


    // Function to update the favorite count in the navigation bar
    window.updateFavoriteCount = function() {
        // Ensure window.favorites is properly initialized
        if (!window.favorites) {
            console.error("window.favorites is not initialized when updateFavoriteCount is called.");
            return;
        }

        const totalFavorites = Object.values(window.favorites).flat().length;
        const favoriteCountElement = document.getElementById('favorite-count');
        const favoriteNavIcon = document.getElementById('favorite-nav-icon'); // This is the <i> tag for the navigation star

        if (favoriteCountElement && favoriteNavIcon) {
            if (totalFavorites > 0) {
                favoriteCountElement.textContent = totalFavorites;
                favoriteCountElement.classList.remove('hidden');
                favoriteNavIcon.classList.remove('text-gray-300'); // Remove default color
                favoriteNavIcon.classList.add('text-yellow-400'); // Add active color
            } else {
                favoriteCountElement.classList.add('hidden');
                favoriteNavIcon.classList.remove('text-yellow-400'); // Remove active color
                favoriteNavIcon.classList.add('text-gray-300'); // Revert to default color
            }

            // Trigger sparkle animation on the favorite icon in the navigation bar
            // Only trigger if not already animating to prevent multiple animations stacking
            if (!favoriteNavIcon.classList.contains('favorite-spark-active')) {
                favoriteNavIcon.classList.add('favorite-spark-active');
                favoriteNavIcon.addEventListener('animationend', () => {
                    favoriteNavIcon.classList.remove('favorite-spark-active');
                }, { once: true }); // Use { once: true } to automatically remove the listener after it fires
            }
        }
    };

    // Function to remove an item from favorites
    window.removeItemFromFavorites = function(type, id) {
        if (window.favorites && window.favorites[type]) {
            const initialLength = window.favorites[type].length;
            window.favorites[type] = window.favorites[type].filter(itemId => itemId !== id);
            if (window.favorites[type].length < initialLength) {
                // Only update if an item was actually removed
                localStorage.setItem('dashboardFavorites', JSON.stringify(window.favorites)); // Save changes to local storage
                window.updateFavoriteCount();
                window.populateFavoritesFloatingBox(); // Repopulate floating box to reflect changes
            }
        }
    };

    // Function to populate the floating favorites box with favorited items
    window.populateFavoritesFloatingBox = function() {
        const container = document.getElementById('favorited-items-container');
        if (!container) return;
        container.innerHTML = ''; // Clear previous content

        let hasFavorites = false;

        // Helper to add items to the floating box
        const addItemToFloatingBox = (item, type, link) => {
            hasFavorites = true;
            container.innerHTML += `
                <div class="flex items-center p-2 border-b border-gray-800 last:border-b-0 cursor-pointer hover:bg-gray-700 rounded-md">
                    <img src="${item.image}" alt="${item.name || item.title}" class="w-8 h-8 rounded-md mr-2 object-cover">
                    <div class="flex-grow" onclick="window.open('${link}', '_blank')">
                        <p class="text-slate-50 text-sm">${item.name || item.title}</p>
                        <p class="text-gray-400 text-xs">${type.charAt(0).toUpperCase() + type.slice(1)}</p>
                    </div>
                    <button class="text-gray-500 hover:text-red-500 transition-colors ml-2" onclick="window.removeItemFromFavorites('${type}', '${item.id}')">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            `;
        };

        // Access global data variables from main.js
        // Consolidate all relevant data from main.js into one object for easier lookup
        // Pastikan semua variabel window yang digunakan di sini sudah diinisialisasi di main.js
        const allData = {
            tokens: [
                ...(window.indexTrendingTokens || []),
                ...(window.discoverFeaturedTokens || [])
            ].filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i),
            apps: [
                ...(window.indexTrendingApps || []),
                ...(window.appsTrendingApps || []),
                ...(window.appsFeaturedApps || []),
                ...(window.appsPopularApps || []),
                ...(window.appsAllApps || []),
                ...(window.discoverFeaturedApps || [])
            ].filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i),
            nfts: [
                ...(window.indexTrendingNfts || []),
                ...(window.nftsTrendingNfts || []),
                ...(window.nftsFeaturedNfts || []),
                ...(window.nftsPopularNfts || []),
                ...(window.nftsAllNfts || []),
                ...(window.discoverFeaturedNfts || [])
            ].filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i),
            users: [
                ...(window.indexTrendingUsers || []),
                ...(window.usersTopArenaUsers || []),
                ...(window.usersTopInfluencers || []),
                ...(window.usersPopularFounders || []),
                ...(window.usersPopularArenaYappers || []),
                ...(window.discoverFeaturedUsers || [])
            ].filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i),
            news: [
                ...(window.indexTrendingNews || []),
                ...(window.discoverFeaturedNews || []),
                ...(window.newsBreakingNews || []),
                ...(window.newsFeaturedNews || []),
                ...(window.newsTrendingNews || []),
                ...(window.newsLatestNews || [])
            ].filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i),
            projects: [
                ...(window.indexTrendingProjects || []),
                ...(window.discoverFeaturedProjects || []),
                ...(window.appsProjectUpdates || []),
                ...(window.nftsProjectUpdates || []),
                ...(window.usersProjectUpdates || [])
            ].filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i),
            daos: window.discoverFeaturedDAOs || [], // This correctly maps to discoverFeaturedDAOs
            videos: [
                ...(window.discoverFeaturedVideos || []),
                ...(window.appsFeaturedVideos || []),
                ...(window.nftsFeaturedVideos || []),
                ...(window.usersFeaturedVideos || []),
                ...(window.newsLatestVideos || [])
            ].filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i)
        };

        // Log favorites status and allData for debugging
        console.log('populateFavoritesFloatingBox: Current favorites:', window.favorites);
        console.log('populateFavoritesFloatingBox: All available data:', allData);


        // Iterate through each category in favorites and find corresponding items in allData
        for (const category in window.favorites) {
            if (Array.isArray(window.favorites[category])) {
                window.favorites[category].forEach(itemId => {
                    let item = null;
                    let link = '#'; // Default link

                    // Find the item in the corresponding allData category
                    if (allData[category]) {
                        item = allData[category].find(dataItem => dataItem.id === itemId);
                    }

                    if (item) {
                        // Determine the link based on item type
                        if (category === 'tokens') {
                            link = item.dexscreenerUrl || `https://arenaindex.xyz/tokens/${item.id}`; // Use dexscreenerUrl if available
                        } else if (category === 'apps') {
                            link = `https://arenaindex.xyz/apps/${item.id}`; // Placeholder link
                        } else if (category === 'nfts') {
                            link = `https://arenaindex.xyz/nfts/${item.id}`; // Placeholder link
                        } else if (category === 'users') {
                            link = `https://arenaindex.xyz/users/${item.id}`; // Placeholder link
                        } else if (category === 'news' || category === 'projects' || category === 'videos' || category === 'daos') {
                            link = item.url || `#`; // News, projects, videos, DAOs might have direct URLs
                        }
                        addItemToFloatingBox(item, category, link);
                        console.log(`populateFavoritesFloatingBox: Found item ${itemId} in category ${category}:`, item); // Debugging: Log found item
                    } else {
                        console.warn(`populateFavoritesFloatingBox: Favorite item with ID ${itemId} in category ${category} not found in available global data.`);
                    }
                });
            }
        }


        if (!hasFavorites) {
            container.innerHTML = '<p class="text-gray-500 text-sm">No favorite items.</p>';
            console.log('populateFavoritesFloatingBox: No favorite items to display.'); // Debugging: Log no favorites
        } else {
            console.log('populateFavoritesFloatingBox: Favorites displayed successfully.'); // Debugging: Log success
        }
    };

    // Function to show/hide the floating favorites box
    function toggleFavoritesFloatingBox() {
        const floatingFavorites = document.getElementById('floating-favorites');
        const favoritesOverlay = document.getElementById('favorites-overlay');

        if (floatingFavorites && favoritesOverlay) {
            if (floatingFavorites.classList.contains('hidden')) {
                // Close small profile box if open
                if (!smallProfileBox.classList.contains('hidden')) {
                    toggleSmallProfileBox();
                }
                if (!sidebar.classList.contains('-translate-x-full')) {
                    window.toggleSidebar();
                }
                if (!floatingMobileSearch.classList.contains('hidden')) {
                    toggleMobileSearch();
                }

                window.populateFavoritesFloatingBox(); // Populate before showing
                floatingFavorites.classList.remove('hidden');
                favoritesOverlay.classList.remove('hidden');
            } else {
                floatingFavorites.classList.add('hidden');
                favoritesOverlay.classList.add('hidden');
            }
        }
    }

    // Function to show/hide the sidebar
    window.toggleSidebar = function() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');

        if (sidebar && overlay) {
            if (sidebar.classList.contains('-translate-x-full')) {
                // Close small profile box if open
                if (!smallProfileBox.classList.contains('hidden')) {
                    toggleSmallProfileBox();
                }
                if (!floatingFavorites.classList.contains('hidden')) {
                    toggleFavoritesFloatingBox();
                }
                if (!floatingMobileSearch.classList.contains('hidden')) {
                    toggleMobileSearch();
                }

                sidebar.classList.remove('-translate-x-full');
                sidebar.classList.add('translate-x-0');
                overlay.classList.remove('hidden');
            } else {
                sidebar.classList.remove('translate-x-0');
                sidebar.classList.add('-translate-x-full');
                overlay.classList.add('hidden');
            }
        }
    };

    // Function to show/hide the floating mobile search
    function toggleMobileSearch() {
        const floatingSearch = document.getElementById('floating-mobile-search');
        const searchOverlay = document.getElementById('search-overlay');
        const searchInputMobile = document.getElementById('search-input-mobile');
        const searchResultsMobile = document.getElementById('search-results-mobile');


        if (floatingSearch && searchOverlay && searchInputMobile && searchResultsMobile) {
            if (floatingSearch.classList.contains('hidden')) {
                // Close other floating elements
                if (!smallProfileBox.classList.contains('hidden')) {
                    toggleSmallProfileBox();
                }
                if (!floatingFavorites.classList.contains('hidden')) {
                    toggleFavoritesFloatingBox();
                }
                if (!sidebar.classList.contains('-translate-x-full')) {
                    window.toggleSidebar();
                }

                floatingSearch.classList.remove('hidden');
                searchOverlay.classList.remove('hidden');
                searchInputMobile.focus(); // Focus on input when shown
            } else {
                floatingSearch.classList.add('hidden');
                searchOverlay.classList.add('hidden');
                searchInputMobile.value = ''; // Clear input when closed
                searchResultsMobile.classList.add('hidden'); // Hide results when closed
            }
        }
    }

    // Function to perform search and display results
    function performSearch(query) { // isMobile parameter removed as it's no longer needed
        const searchResultsContainer = document.getElementById('search-results-mobile'); // Always target mobile results container
        const parentResultsContainer = document.getElementById('search-results-mobile'); // Always target mobile results container
        const searchOverlay = document.getElementById('search-overlay'); // Get overlay element


        if (!searchResultsContainer || !parentResultsContainer || !searchOverlay) return;

        searchResultsContainer.innerHTML = ''; // Clear previous results

        if (query.length < 2) { // Requires at least 2 characters to search
            parentResultsContainer.classList.add('hidden');
            return;
        }

        parentResultsContainer.classList.remove('hidden');

        // Consolidate all data into a single array and deduplicate globally by ID
        const allUniqueItems = [];
        const seenIds = new Set();

        // Pastikan semua variabel window yang digunakan di sini sudah diinisialisasi di main.js
        const categories = [
            window.indexTrendingTokens, window.discoverFeaturedTokens,
            window.indexTrendingApps, window.appsTrendingApps, window.appsFeaturedApps,
            window.appsPopularApps, window.appsAllApps, window.discoverFeaturedApps,
            window.indexTrendingNfts, window.nftsTrendingNfts, window.nftsFeaturedNfts,
            window.nftsPopularNfts, window.nftsAllNfts, window.discoverFeaturedNfts,
            window.indexTrendingUsers, window.usersTopArenaUsers, window.usersTopInfluencers,
            window.usersPopularFounders, window.usersPopularArenaYappers || [], window.discoverFeaturedUsers,
            window.indexTrendingNews, window.discoverFeaturedNews, window.newsBreakingNews,
            window.newsFeaturedNews, window.newsTrendingNews, window.newsLatestNews,
            window.indexTrendingProjects, window.discoverFeaturedProjects,
            window.appsProjectUpdates, window.nftsProjectUpdates, window.usersProjectUpdates,
            window.discoverFeaturedDAOs,
            window.discoverFeaturedVideos, window.appsFeaturedVideos,
            window.nftsFeaturedVideos, window.usersFeaturedVideos, window.newsLatestVideos
        ];

        categories.forEach(categoryArray => {
            if (Array.isArray(categoryArray)) {
                categoryArray.forEach(item => {
                    if (item && item.id && !seenIds.has(String(item.id))) {
                        allUniqueItems.push(item);
                        seenIds.add(String(item.id));
                    }
                });
            }
        });

        console.log('[Search Debug] Total unique items available for search:', allUniqueItems.length);

        let hasResults = false;
        const addedItemIdsToResults = new Set(); // To track items actually added to the displayed results

        // Filter and display results from the global unique list
        allUniqueItems.forEach(item => {
            const queryLower = query.toLowerCase();
            const nameMatch = (item.name && item.name.toLowerCase().includes(queryLower));
            const titleMatch = (item.title && item.title.toLowerCase().includes(queryLower));
            const descriptionMatch = (item.description && item.description.toLowerCase().includes(queryLower));
            const snippetMatch = (item.snippet && item.snippet.toLowerCase().includes(queryLower));
            const categoryMatch = (item.category && item.category.toLowerCase().includes(queryLower));
            const mcapMatch = (item.mcap && String(item.mcap).toLowerCase().includes(queryLower)); // Convert to string for search
            const floorMatch = (item.floor && String(item.floor).toLowerCase().includes(queryLower)); // Convert to string for search
            const tvlMatch = (item.tvl && String(item.tvl).toLowerCase().includes(queryLower)); // Convert to string for search
            const followersMatch = (item.followers && String(item.followers).toLowerCase().includes(queryLower)); // Convert to string for search
            const bioMatch = (item.bio && item.bio.toLowerCase().includes(queryLower));
            const rankMatch = (item.rank && String(item.rank).toLowerCase().includes(queryLower)); // Convert to string for search
            const projectMatch = (item.project && item.project.toLowerCase().includes(queryLower));
            const yapsMatch = (item.yaps && String(item.yaps).toLowerCase().includes(queryLower)); // Convert to string for search

            if (nameMatch || titleMatch || descriptionMatch || snippetMatch || categoryMatch || mcapMatch || floorMatch || tvlMatch || followersMatch || bioMatch || rankMatch || projectMatch || yapsMatch) {
                // Ensure item ID hasn't already been added to the *displayed* results
                if (item.id && !addedItemIdsToResults.has(String(item.id))) {
                    let itemCategory = ''; // To determine category for display

                    // Determine the item's original category for display purposes
                    // This is a heuristic and might not be perfect if an item truly belongs to multiple logical categories
                    if (window.indexTrendingTokens?.some(t => t.id === item.id) || window.discoverFeaturedTokens?.some(t => t.id === item.id)) {
                        itemCategory = 'Token';
                    } else if (window.appsAllApps?.some(a => a.id === item.id) || window.discoverFeaturedApps?.some(a => a.id === item.id)) {
                        itemCategory = 'App';
                    } else if (window.nftsAllNfts?.some(n => n.id === item.id) || window.discoverFeaturedNfts?.some(n => n.id === item.id)) {
                        itemCategory = 'NFT';
                    } else if (window.usersTopArenaUsers?.some(u => u.id === item.id) || window.discoverFeaturedUsers?.some(u => u.id === item.id) || window.usersTopInfluencers?.some(u => u.id === item.id) || window.usersPopularFounders?.some(u => u.id === item.id) || window.usersPopularArenaYappers?.some(u => u.id === item.id)) {
                        itemCategory = 'User';
                    } else if (window.indexTrendingNews?.some(n => n.id === item.id) || window.discoverFeaturedNews?.some(n => n.id === item.id) || window.newsBreakingNews?.some(n => n.id === item.id) || window.newsFeaturedNews?.some(n => n.id === item.id) || window.newsTrendingNews?.some(n => n.id === item.id) || window.newsLatestNews?.some(n => n.id === item.id)) {
                        itemCategory = 'News';
                    } else if (window.indexTrendingProjects?.some(p => p.id === item.id) || window.discoverFeaturedProjects?.some(p => p.id === item.id) || window.appsProjectUpdates?.some(p => p.id === item.id) || window.nftsProjectUpdates?.some(p => p.id === item.id) || window.usersProjectUpdates?.some(p => p.id === item.id)) {
                        itemCategory = 'Project';
                    } else if (window.discoverFeaturedDAOs?.some(d => d.id === item.id)) {
                        itemCategory = 'DAO';
                    } else if (window.discoverFeaturedVideos?.some(v => v.id === item.id) || window.appsFeaturedVideos?.some(v => v.id === item.id) || window.nftsFeaturedVideos?.some(v => v.id === item.id) || window.usersFeaturedVideos?.some(v => v.id === item.id) || window.newsLatestVideos?.some(v => v.id === item.id)) {
                        itemCategory = 'Video';
                    }

                    let imageUrl = item.image || '/icon-192x192.png'; // Default image if none exists
                    let link = item.url || '#'; // Default link, assuming 'url' property exists for news/projects/videos/daos

                    // More specific links for other categories
                    if (itemCategory === 'Token') {
                        link = item.dexscreenerUrl || `/tokens.html`;
                    } else if (itemCategory === 'App') {
                        link = `/apps.html`;
                    } else if (itemCategory === 'NFT') {
                        link = `/nfts.html`;
                    } else if (itemCategory === 'User') {
                        link = `/users.html`;
                    } else if (itemCategory === 'Project') {
                        link = `/projects/arena-index.html`;
                    }


                    searchResultsContainer.innerHTML += `
                        <div class="flex items-center p-2 border-b border-gray-800 last:border-b-0 cursor-pointer hover:bg-gray-700 rounded-md" onclick="window.open('${link}', '_blank')">
                            <img src="${imageUrl}" alt="${item.name || item.title}" class="w-8 h-8 rounded-md mr-2 object-cover">
                            <div>
                                <p class="text-slate-50 text-sm">${item.name || item.title}</p>
                                <p class="text-gray-400 text-xs">${itemCategory}</p>
                            </div>
                        </div>
                    `;
                    addedItemIdsToResults.add(String(item.id)); // Add item ID to set
                    hasResults = true;
                    console.log(`[Search Debug] Added unique item to results: ID=${item.id}, Category=${itemCategory}, Name/Title=${item.name || item.title}`);
                } else if (item.id) {
                    console.log(`[Search Debug] Skipping duplicate item (already added to results): ID=${item.id}, Name/Title=${item.name || item.title}`);
                }
            }
        });


        if (!hasResults) {
            searchResultsContainer.innerHTML = '<p class="text-gray-500 text-sm">No results found.</p>';
        }
    }


    // Functionality for search icon changing color on typing
    const searchInputMobile = document.getElementById('search-input-mobile');
    const searchIconMobileInside = document.getElementById('search-icon-mobile-inside'); // This is the icon INSIDE the floating search bar
    const searchToggle = document.getElementById('search-toggle'); // This is the universal search button
    const searchOverlay = document.getElementById('search-overlay');


    // Universal search toggle button
    if (searchToggle) {
        searchToggle.addEventListener('click', toggleMobileSearch);
    }

    // Overlay for floating search bar
    if (searchOverlay) {
        searchOverlay.addEventListener('click', () => {
            toggleMobileSearch();
        });
    }


    // Mobile search input (inside floating bar)
    if (searchInputMobile && searchIconMobileInside) {
        searchInputMobile.addEventListener('focus', () => {
            searchIconMobileInside.classList.remove('text-gray-400');
            searchIconMobileInside.classList.add('text-[#e84142]');
        });
        searchInputMobile.addEventListener('blur', () => {
            searchIconMobileInside.classList.remove('text-[#e84142]');
            searchIconMobileInside.classList.add('text-gray-400');
        });

        searchInputMobile.addEventListener('input', (event) => {
            performSearch(event.target.value); // No longer needs isMobile parameter
        });
    }


    // Event listener for sidebar toggle
    const menuToggle = document.getElementById('menu-toggle');
    const closeSidebar = document.getElementById('close-sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    if (menuToggle) menuToggle.addEventListener('click', window.toggleSidebar);
    if (closeSidebar) closeSidebar.addEventListener('click', window.toggleSidebar);
    // Add event listener to sidebarOverlay to close sidebar when clicking outside
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', window.toggleSidebar);

    // Event listener for floating favorites box
    const favoriteNavIcon = document.getElementById('favorite-nav-icon');
    const favoritesOverlay = document.getElementById('favorites-overlay');
    const closeFavoritesBoxButton = document.getElementById('close-favorites-box');

    const floatingFavorites = document.getElementById('floating-favorites'); // Define floatingFavorites here for use in toggle function
    const sidebar = document.getElementById('sidebar'); // Define sidebar here for use in toggle function
    const floatingMobileSearch = document.getElementById('floating-mobile-search'); // Define floatingMobileSearch here for use in toggle function


    if (favoriteNavIcon) favoriteNavIcon.addEventListener('click', toggleFavoritesFloatingBox);
    if (favoritesOverlay) favoritesOverlay.addEventListener('click', toggleFavoritesFloatingBox);
    if (closeFavoritesBoxButton) closeFavoritesBoxButton.addEventListener('click', toggleFavoritesFloatingBox); // New listener for 'X' button


    // Firebase Authentication Setup
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');

    // Ensure appId is set in firebaseConfig, using __app_id as fallback
    if (!firebaseConfig.appId) {
        firebaseConfig.appId = appId;
    }

    // Log a warning if API key is missing, as this is the cause of the user's error
    if (!firebaseConfig.apiKey) {
        console.error("Firebase configuration is missing 'apiKey'. Please ensure '__firebase_config' is correctly set in your environment with a valid Firebase API Key.");
    }

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app); // Initialize Firestore as well

    const authNavButton = document.getElementById('auth-nav-button');
    const authIcon = document.getElementById('auth-icon');
    const smallProfileImg = document.getElementById('small-profile-img');
    const smallProfileName = document.getElementById('small-profile-name');
    const smallProfileEmail = document.getElementById('small-profile-email');
    const signOutButtonSmall = document.getElementById('sign-out-button');

    let currentFirebaseUser = null; // To store Firebase user data

    // Function to update UI based on Firebase login status
    function updateProfileUI() {
        if (currentFirebaseUser) {
            // User is signed in with Firebase
            authIcon.classList.add('hidden'); // Hide default user icon
            authNavButton.style.backgroundColor = 'transparent'; // Remove button background

            // Display user's profile picture if available, otherwise a default icon
            if (currentFirebaseUser.photoURL) {
                authNavButton.style.backgroundImage = `url(${currentFirebaseUser.photoURL})`;
                authNavButton.style.backgroundSize = 'cover';
                authNavButton.style.backgroundPosition = 'center';
                authNavButton.style.border = '1px solid #e84142'; // Add border for visual appeal
                smallProfileImg.src = currentFirebaseUser.photoURL;
            } else {
                authNavButton.style.backgroundImage = 'none';
                authNavButton.style.border = 'none';
                authIcon.classList.remove('hidden'); // Show default user icon if no photoURL
                smallProfileImg.src = '/icon-192x192.png'; // Default image
            }

            // Update small profile box details
            smallProfileName.textContent = currentFirebaseUser.displayName || 'Firebase User';
            smallProfileEmail.textContent = currentFirebaseUser.email || `UID: ${currentFirebaseUser.uid}`;
            signOutButtonSmall.classList.remove('hidden');

            // Set click listener for signed-in state to open small profile box
            authNavButton.onclick = toggleSmallProfileBox;

        } else {
            // User is not signed in
            authIcon.classList.remove('hidden'); // Show default user icon
            authNavButton.style.backgroundImage = 'none'; // Remove profile picture background
            authNavButton.style.border = 'none'; // Remove border
            authNavButton.style.backgroundColor = '#e84142'; // Revert button background color

            // Reset small profile box details to default
            smallProfileImg.src = '/icon-192x192.png';
            smallProfileName.textContent = 'Guest User';
            smallProfileEmail.textContent = 'Not Signed In';
            signOutButtonSmall.classList.remove('hidden'); // Keep sign out button visible for local user context

            // Set click listener for signed-out state to attempt sign-in
            authNavButton.onclick = handleSignInAttempt;
        }
    }

    // Handle Firebase sign-in attempt (Google, anonymous, or custom token)
    async function handleSignInAttempt() {
        try {
            // Attempt Google Sign-In first
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            console.log("Signed in with Google via Firebase.");
        } catch (googleError) {
            console.error("Google Sign-In via Firebase failed:", googleError);
            // Fallback to anonymous or custom token if Google Sign-In fails or is not preferred
            try {
                if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                    await signInWithCustomToken(auth, __initial_auth_token);
                    console.log("Signed in with custom token.");
                } else {
                    await signInAnonymously(auth);
                    console.log("Signed in anonymously.");
                }
            } catch (fallbackError) {
                console.error("Firebase fallback authentication (anonymous/custom token) error:", fallbackError);
                // Optionally, display an error message to the user
            }
        }
    }

    // Handle Firebase sign out
    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
            console.log("User signed out from Firebase.");
            toggleSmallProfileBox(); // Hide the small profile box after signing out
        } catch (error) {
            console.error("Error signing out from Firebase:", error);
        }
    };

    if (signOutButtonSmall) {
        signOutButtonSmall.addEventListener('click', signOut);
    }

    // Listen for Firebase auth state changes
    onAuthStateChanged(auth, (user) => {
        currentFirebaseUser = user;
        updateProfileUI();
        if (user) {
            console.log("Firebase User is signed in:", user.uid, user.displayName, user.email, user.photoURL);
            // You can fetch user-specific data here if needed
        } else {
            console.log("Firebase User is signed out.");
        }
    });

    // Listen for custom 'dataLoaded' event dispatched by main.js
    // This ensures that navigation.js waits for main.js to load all global data
    document.addEventListener('dataLoaded', () => {
        console.log('dataLoaded event received in navigation.js. Initializing favorites and search.');
        window.updateFavoriteCount();
        const searchInputMobile = document.getElementById('search-input-mobile');
        if (searchInputMobile && searchInputMobile.value.length >= 2) {
            performSearch(searchInputMobile.value);
        }
    });

    // Initial UI update on DOMContentLoaded
    // This call is crucial as it sets the initial state of the profile button.
    updateProfileUI();

    // Event listener to close the small profile box when clicking outside of it
    document.addEventListener('click', (event) => {
        const authNavButton = document.getElementById('auth-nav-button');
        // Check if the click is outside the small profile box AND not on the auth button
        if (smallProfileBox && !smallProfileBox.classList.contains('hidden') &&
            !smallProfileBox.contains(event.target) &&
            (!authNavButton || !authNavButton.contains(event.target))) {
            toggleSmallProfileBox(); // Close the box
        }
    });
});
