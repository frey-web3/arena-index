// main.js

// Initialize favorites from local storage
// IMPORTANT: This 'favorites' variable will now directly be part of the window object
window.favorites = JSON.parse(localStorage.getItem('dashboardFavorites')) || {};

// Ensure all expected favorite categories are arrays in window.favorites
const defaultFavoritesStructure = {
    tokens: [],
    apps: [],
    users: [],
    nfts: [],
    news: [],
    projects: [],
    videos: [],
    games: [] // Added games category
};

for (const key in defaultFavoritesStructure) {
    if (!window.favorites[key] || !Array.isArray(window.favorites[key])) {
        window.favorites[key] = defaultFavoritesStructure[key];
    }
}

// Global variables to store data from main.json
// These variables will be populated after data is fetched from main.json
window.indexTrendingTokens = []; // Now populated from main.json
window.indexTrendingApps = [];
window.indexTrendingNfts = [];
window.indexTrendingGames = []; // Added for games
window.indexTrendingUsers = [];
window.indexLatestNews = []; // Changed from indexTrendingNews
window.indexLatestVideos = []; // Changed from indexTrendingVideos

window.discoverFeaturedTokens = [];
window.discoverFeaturedApps = [];
window.discoverFeaturedNfts = [];
window.discoverFeaturedGames = []; // Added for games
window.discoverFeaturedUsers = [];
window.discoverFeaturedNews = [];
window.discoverFeaturedVideos = [];

// New global variables for specific page data (existing pages, not affected by this update)
window.appsTrendingApps = [];
window.appsFeaturedApps = [];
window.appsPopularApps = [];
window.appsAllApps = [];
window.appsProjectUpdates = [];
window.appsFeaturedVideos = [];

window.nftsTrendingNfts = [];
window.nftsFeaturedNfts = [];
window.nftsPopularNfts = [];
window.nftsAllNfts = [];
window.nftsProjectUpdates = [];
window.nftsFeaturedVideos = [];

window.usersTopArenaUsers = [];
window.usersTopInfluencers = [];
window.usersPopularFounders = [];
window.usersPopularArenaYappers = [];
window.usersProjectUpdates = [];
window.usersFeaturedVideos = [];

window.newsBreakingNews = [];
window.newsFeaturedNews = [];
window.newsTrendingNews = [];
window.newsLatestNews = [];
window.newsLatestVideos = [];

// Function to fetch dummy data from main.json
async function fetchDummyData() {
    try {
        const response = await fetch('./main.json'); // Adjust path if necessary
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Assign data for index.html
        const indexData = data['index.html'] || {};
        window.indexTrendingTokens = indexData['trending tokens'] || [];
        window.indexTrendingApps = indexData['trending apps'] || [];
        window.indexTrendingNfts = indexData['trending nfts'] || [];
        window.indexTrendingGames = indexData['trending games'] || []; // Added for games
        window.indexTrendingUsers = indexData['trending users'] || [];
        window.indexLatestNews = indexData['latest news'] || []; // Changed from trending news
        window.indexLatestVideos = indexData['latest videos'] || []; // Changed from trending videos

        // Assign data for discover.html
        const discoverData = data['discover.html'] || {};
        window.discoverFeaturedTokens = discoverData['featured tokens'] || [];
        window.discoverFeaturedApps = discoverData['featured apps'] || [];
        window.discoverFeaturedNfts = discoverData['featured nfts'] || [];
        window.discoverFeaturedGames = discoverData['featured games'] || []; // Added for games
        window.discoverFeaturedUsers = discoverData['featured users'] || [];
        window.discoverFeaturedNews = discoverData['featured news'] || [];
        window.discoverFeaturedVideos = discoverData['featured videos'] || [];

        // Log data to confirm
        console.log('Dummy data loaded:', {
            indexTrendingTokens: window.indexTrendingTokens,
            indexTrendingApps: window.indexTrendingApps,
            indexTrendingNfts: window.indexTrendingNfts,
            indexTrendingGames: window.indexTrendingGames,
            indexTrendingUsers: window.indexTrendingUsers,
            indexLatestNews: window.indexLatestNews,
            indexLatestVideos: window.indexLatestVideos,
            discoverFeaturedTokens: window.discoverFeaturedTokens,
            discoverFeaturedApps: window.discoverFeaturedApps,
            discoverFeaturedNfts: window.discoverFeaturedNfts,
            discoverFeaturedGames: window.discoverFeaturedGames,
            discoverFeaturedUsers: window.discoverFeaturedUsers,
            discoverFeaturedNews: window.discoverFeaturedNews,
            discoverFeaturedVideos: window.discoverFeaturedVideos
        });

    } catch (error) {
        console.error('Error fetching dummy data:', error);
    }
}

// Function to save favorites to local storage
function saveFavorites() {
    try {
        localStorage.setItem('dashboardFavorites', JSON.stringify(window.favorites)); // Use window.favorites
        // Call updateFavoriteCount from navigation.js if available
        if (typeof window.updateFavoriteCount === 'function') {
            window.updateFavoriteCount();
        }
        console.log('Favorites saved to local storage:', JSON.parse(localStorage.getItem('dashboardFavorites')));
    } catch (e) {
        console.error('Error saving favorites to local storage:', e);
        // Consider displaying a message to the user if local storage is full
    }
}

// Function to enable/disable favorite status for individual item cards
function toggleFavorite(itemType, itemId, event) {
    event.stopPropagation(); // Stop event bubbling so it doesn't spread to card click event
    console.log('toggleFavorite called for:', itemType, itemId); // Debugging: Log function call

    // Get the star icon element inside the clicked favorite wrapper
    const iconElement = event.currentTarget.querySelector('.fa-star');

    // Ensure itemType is a valid category and initialized as an array
    if (!window.favorites[itemType] || !Array.isArray(window.favorites[itemType])) {
        console.warn(`Category "${itemType}" not found or is not an array in window.favorites. Initializing.`);
        window.favorites[itemType] = [];
    }

    const index = window.favorites[itemType].indexOf(itemId);

    if (index > -1) {
        // If item is already favorited, remove it
        window.favorites[itemType].splice(index, 1);
        iconElement.classList.remove('fa-solid');
        iconElement.classList.add('fa-regular');
        iconElement.classList.remove('text-yellow-400'); // Remove yellow color
        console.log('Removed from favorites:', itemType, itemId, window.favorites[itemType]); // Debugging: Log removal
    } else {
        // If item is not favorited, add it
        window.favorites[itemType].push(itemId);
        iconElement.classList.remove('fa-regular');
        iconElement.classList.add('fa-solid');
        iconElement.classList.add('text-yellow-400'); // Add yellow color
        console.log('Added to favorites:', itemType, itemId, window.favorites[itemType]); // Debugging: Log addition
    }
    saveFavorites();

    // Trigger sparkle animation on the clicked favorite icon (on the card)
    // Ensure animation is not already running to prevent stacking
    if (!iconElement.classList.contains('favorite-spark-active')) {
        iconElement.classList.add('favorite-spark-active');
        iconElement.addEventListener('animationend', () => {
            iconElement.classList.remove('favorite-spark-active');
        }, { once: true }); // Remove listener after one run
    }
}

// Function to create card elements for tokens, apps, users, games, and NFTs
function createCard(id, title, description, imageUrl = 'https://placehold.co/100x100/374151/d1d5db?text=IMG', itemType, additionalData = {}) {
    // Ensure window.favorites[itemType] is an array before calling .includes()
    const isFavorited = window.favorites[itemType] && Array.isArray(window.favorites[itemType]) ? window.favorites[itemType].includes(id) : false;
    // Determine initial class for the star icon (solid if favorited, regular if not)
    const favoriteClass = isFavorited ? 'fa-solid text-yellow-400' : 'fa-regular text-gray-300';

    let detailsHtml = ''; // Changed from contentHtml to detailsHtml for clarity
    let cardLink = additionalData.url || '#'; // Use the URL from additionalData, fallback to #

    if (itemType === 'tokens') {
        // Token: price, percentage change, Mcap: (market capitalization)
        const priceChangeClass = additionalData.priceChange && additionalData.priceChange > 0 ? 'text-green-500' : (additionalData.priceChange && additionalData.priceChange < 0 ? 'text-red-500' : 'text-gray-400');
        const priceChangeText = additionalData.priceChange ? `${additionalData.priceChange.toFixed(2)}%` : 'N/A';
        detailsHtml = `
            <p class="text-sm text-slate-300">$${formatNumberConcise(additionalData.price, 4)} <span class="${priceChangeClass}">(${priceChangeText})</span></p>
            <p class="text-sm text-slate-300">Mcap: $${formatNumberConcise(additionalData.marketCap, 2)}</p>
        `;
        cardLink = additionalData.dexscreenerUrl || '#'; // Link to DexScreener
    } else if (itemType === 'apps') { // Only apps use Mcap now
        // App: category, Mcap: (market capitalization)
        detailsHtml = `
            <p class="text-sm text-slate-300">${additionalData.category || 'N/A'}</p>
            <p class="text-sm text-slate-300">Mcap: $${formatNumberConcise(additionalData.marketCap, 2)}</p>
        `;
    } else if (itemType === 'games') { // Games now use Platforms
        // Game: category, Platforms
        detailsHtml = `
            <p class="text-sm text-slate-300">${additionalData.category || 'N/A'}</p>
            <p class="text-sm text-slate-300">Platforms: ${additionalData.platforms || 'N/A'}</p>
        `;
    } else if (itemType === 'users') {
        // User: role, Followers: (Followers)
        let roleLine = '';
        if (additionalData.role) {
            roleLine = `<p class="text-sm text-slate-300">${additionalData.role}</p>`;
        }
        detailsHtml = `
            ${roleLine}
            <p class="text-sm text-slate-300">Followers: ${additionalData.followers}</p>
        `;
    } else if (itemType === 'nfts') {
        // NFT: Item count, Floor price
        const itemCount = additionalData.items !== undefined && additionalData.items !== null ? additionalData.items : 'N/A';
        cardLink = additionalData.url || '#';

        return `
            <div class="relative flex-shrink-0 w-64 h-auto min-h-[280px] p-2 bg-black bg-opacity-70 rounded-lg shadow-lg hover:bg-opacity-90 hover:border-[#e84142] transition-colors duration-200 ease-in-out cursor-pointer border border-gray-700 group flex flex-col items-center overflow-hidden" data-card-link="${cardLink}">
                <div class="red-gradient-overlay"></div>
                <div class="relative w-full aspect-square overflow-hidden rounded-md mb-2 z-10">
                    <img src="${imageUrl}" alt="${title}" class="absolute top-0 left-0 w-full h-full object-cover rounded-md border border-gray-600">
                </div>
                <div class="flex flex-col flex-grow w-full text-left z-10">
                    <h3 class="text-base font-semibold text-slate-50 line-clamp-2 w-full mb-1">${title || 'N/A'}</h3>
                    <div class="flex justify-between items-end w-full mt-auto">
                        <p class="text-sm text-slate-300">Floor: <img src="https://arena.social/images/avax.png" alt="AVAX icon" class="inline-block w-3 h-3 rounded-full mr-1">${description || 'N/A'}</p>
                        <p class="text-sm text-slate-300">Items: ${itemCount}</p>
                    </div>
                </div>
                <div class="absolute top-2 right-2 w-7 h-7 border border-gray-700 rounded-md flex items-center justify-center hover:border-yellow-400 transition-colors opacity-0 group-hover:opacity-100 z-20" onclick="window.toggleFavorite('${itemType}', '${id}', event)">
                    <i class="fa-star ${favoriteClass} text-base cursor-pointer transition-colors"></i>
                </div>
            </div>
        `;
    }

    // Return for other item types (tokens, apps, users, games) - now with smaller, side-by-side image and with mr-2 for spacing
    return `
        <div class="relative flex-shrink-0 w-72 h-auto p-2 bg-black bg-opacity-70 rounded-lg shadow-lg hover:bg-opacity-90 hover:border-[#e84142] transition-colors duration-200 ease-in-out cursor-pointer border border-gray-700 group flex items-center overflow-hidden" data-card-link="${cardLink}">
            <div class="red-gradient-overlay"></div>
            <img src="${imageUrl}" alt="${title}" class="w-16 h-16 object-cover rounded-md flex-shrink-0 border border-gray-600 mr-2 z-10">
            <div class="flex flex-col flex-grow text-left z-10">
                <h3 class="text-base font-semibold text-slate-50 line-clamp-2">${title || 'N/A'}</h3>
                ${detailsHtml}
            </div>
            <div class="absolute top-2 right-2 w-7 h-7 border border-gray-700 rounded-md flex items-center justify-center hover:border-yellow-400 transition-colors opacity-0 group-hover:opacity-100 z-20" onclick="window.toggleFavorite('${itemType}', '${id}', event)">
                <i class="fa-star ${favoriteClass} text-base cursor-pointer transition-colors"></i>
            </div>
        </div>
    `;
}

// Function to create a news item
function createNewsItem(id, title, publicationDate, readDuration, url, imageUrl, itemType = 'news') {
    const isFavorited = window.favorites[itemType] && Array.isArray(window.favorites[itemType]) ? window.favorites[itemType].includes(id) : false;
    const favoriteClass = isFavorited ? 'fa-solid text-yellow-400' : 'fa-regular text-gray-300';

    // Format publication date and read duration
    const formattedDate = publicationDate ? new Date(publicationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';
    const formattedReadDuration = readDuration ? `(${readDuration} min read)` : '';

    const finalUrl = url || '#';

    return `
        <div class="relative flex-shrink-0 w-72 p-2 bg-black bg-opacity-70 rounded-lg shadow-lg hover:bg-opacity-90 hover:border-[#e84142] transition-colors duration-200 ease-in-out cursor-pointer border border-gray-700 group overflow-hidden" data-card-link="${finalUrl}">
            <div class="red-gradient-overlay"></div>
            <div class="relative w-full overflow-hidden rounded-md mb-2 z-10" style="padding-top: 56.25%;">
                <img src="${imageUrl}" alt="${title}" class="absolute top-0 left-0 w-full h-full object-cover rounded-md border border-gray-600">
            </div>
            <h3 class="text-base font-semibold text-slate-50 mb-1 z-10">${title || 'N/A'}</h3>
            <p class="text-sm text-slate-300 flex items-center z-10">
                <i class="fa-regular fa-calendar-alt mr-1 text-gray-400" style="font-size: 0.875rem;"></i> ${formattedDate} <i class="fa-regular fa-clock ml-2 mr-1 text-gray-400" style="font-size: 0.875rem;"></i> ${formattedReadDuration}
            </p>
            <div class="absolute top-2 right-2 w-7 h-7 border border-gray-700 rounded-md flex items-center justify-center hover:border-yellow-400 transition-colors opacity-0 group-hover:opacity-100 z-20" onclick="window.toggleFavorite('${itemType}', '${id}', event)">
                <i class="fa-star ${favoriteClass} text-base cursor-pointer transition-colors"></i>
            </div>
        </div>
    `;
}

// Function to create a video item
function createVideoItem(id, title, publicationDate, videoDuration, url, thumbnailUrl, itemType = 'videos') {
    const isFavorited = window.favorites[itemType] && Array.isArray(window.favorites[itemType]) ? window.favorites[itemType].includes(id) : false;
    const favoriteClass = isFavorited ? 'fa-solid text-yellow-400' : 'fa-regular text-gray-300';

    // Format publication date and video duration
    const formattedDate = publicationDate ? new Date(publicationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';
    const formattedVideoDuration = videoDuration ? `(${videoDuration})` : '';

    const finalUrl = url || '#';

    return `
        <div class="relative flex-shrink-0 w-72 p-2 bg-black bg-opacity-70 rounded-lg shadow-lg hover:bg-opacity-90 hover:border-[#e84142] transition-colors duration-200 ease-in-out cursor-pointer border border-gray-700 group overflow-hidden" data-card-link="${finalUrl}">
            <div class="red-gradient-overlay"></div>
            <div class="relative w-full overflow-hidden rounded-md mb-2 video-thumbnail-container z-10" style="padding-top: 56.25%;">
                <img src="${thumbnailUrl}" alt="${title}" class="absolute top-0 left-0 w-full h-full object-cover rounded-md border border-gray-600">
                <div class="play-icon-overlay absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-opacity-80 drop-shadow-lg pointer-events-none" style="font-size: 3rem !important;">
                    <i class="fas fa-play-circle"></i>
                </div>
            </div>
            <h3 class="text-base font-semibold text-slate-50 mb-1 z-10">${title || 'N/A'}</h3>
            <p class="text-sm text-slate-300 flex items-center z-10">
                <i class="fa-regular fa-calendar-alt mr-1 text-gray-400" style="font-size: 0.875rem;"></i> ${formattedDate} <i class="fa-regular fa-clock ml-2 mr-1 text-gray-400" style="font-size: 0.875rem;"></i> ${formattedVideoDuration}
            </p>
            <div class="absolute top-2 right-2 w-7 h-7 border border-gray-700 rounded-md flex items-center justify-center hover:border-yellow-400 transition-colors opacity-0 group-hover:opacity-100 z-20" onclick="window.toggleFavorite('${itemType}', '${id}', event)">
                <i class="fa-star ${favoriteClass} text-base cursor-pointer transition-colors"></i>
            </div>
        </div>
    `;
}

// Function to attach click listeners to cards
function attachCardClickListeners() {
    document.querySelectorAll('[data-card-link]').forEach(card => {
        card.addEventListener('click', (event) => {
            // Only open the link if the click did not originate from the favorite icon wrapper
            if (!event.target.closest('.absolute.top-2.right-2')) {
                window.open(card.dataset.cardLink, '_blank');
            }
        });
    });
}

/**
 * Formats a number into a more concise string (K, M, B) with English-style comma separators.
 * Handles very small numbers by displaying leading zero count in parentheses, then significant digits.
 * @param {number} num The number to format.
 * @param {number} decimalPlaces The preferred maximum number of decimal places for standard formatting (e.g., 4 for prices).
 * This also acts as a threshold: if leading zeros exceeds this, custom formatting is used.
 * @returns {string} The formatted number.
 */
function formatNumberConcise(num, decimalPlaces = 2) {
    if (num === null || isNaN(num) || typeof num === 'undefined') {
        return 'N/A'; // Return 'N/A' if the number is invalid
    }

    // Ensure num is a float
    num = parseFloat(num);

    if (num === 0) {
        return '0'; // Explicitly return '0' for zero
    }

    const absNum = Math.abs(num); // Use absolute value for abbreviation determination

    if (absNum >= 1_000_000_000) { // Billion (B)
        return (num / 1_000_000_000).toLocaleString('en-US', { maximumFractionDigits: decimalPlaces, minimumFractionDigits: 0 }) + 'B';
    } else if (absNum >= 1_000_000) { // Million (M)
        return (num / 1_000_000).toLocaleString('en-US', { maximumFractionDigits: decimalPlaces, minimumFractionDigits: 0 }) + 'M';
    } else if (absNum >= 1_000) { // Thousand (K)
        return (num / 1_000).toLocaleString('en-US', { maximumFractionDigits: decimalPlaces, minimumFractionDigits: 0 }) + 'K';
    } else {
        // For numbers less than 1000.
        if (absNum > 0 && absNum < 1) { // Only apply custom format for numbers between 0 and 1
            const numString = absNum.toString();
            const decimalPointIndex = numString.indexOf('.');

            if (decimalPointIndex !== -1) {
                const fractionPart = numString.substring(decimalPointIndex + 1);
                let leadingZeros = 0;
                for (let i = 0; i < fractionPart.length; i++) {
                    if (fractionPart[i] === '0') {
                        leadingZeros++;
                    } else {
                        break;
                    }
                }

                // If the number of leading zeros is greater than or equal to the desired decimalPlaces,
                // apply the custom "0.0(zero_count)significant_digits" format.
                // This means the number is so small that 'decimalPlaces' would round it to 0.0000...
                if (leadingZeros >= decimalPlaces) {
                    // Extract significant digits
                    // Use toFixed with enough precision to capture the needed digits
                    // Add 4 to leadingZeros to capture up to 4 significant digits after the zeros
                    let preciseString = absNum.toFixed(leadingZeros + 4); 
                    
                    // Find the part after the leading zeros
                    let significantPart = preciseString.substring(preciseString.indexOf('.') + 1 + leadingZeros);
                    
                    // Remove any trailing zeros that might result from toFixed
                    significantPart = significantPart.replace(/0+$/, '');

                    // Ensure we take only the first 4 significant digits
                    const finalSignificantDigits = significantPart.substring(0, 1);

                    return `0.0(${leadingZeros})${finalSignificantDigits}`;
                }
            }
        }
        // For numbers between 0.0001 and 999, or if no custom format applied for very small numbers
        // use the provided decimalPlaces
        return num.toLocaleString('en-US', { maximumFractionDigits: decimalPlaces, minimumFractionDigits: 0 });
    }
}

// Helper function to create loading skeletons for tokens, apps, users, nfts, and games
function createGeneralCardSkeleton() {
    // Adjusted skeleton to match the side-by-side layout
    return `
        <div class="relative flex-shrink-0 w-72 h-auto min-h-[100px] p-2 bg-black bg-opacity-70 rounded-lg shadow-lg border border-gray-700 flex items-center overflow-hidden">
            <div class="red-gradient-overlay-skeleton"></div>
            <div class="w-16 h-16 bg-gray-700 rounded-md flex-shrink-0 border border-gray-600 mr-2 animate-pulse z-10"></div>
            <div class="flex flex-col flex-grow text-left z-10">
                <div class="h-5 bg-gray-700 rounded w-3/4 animate-pulse mb-1"></div>
                <div class="h-4 bg-gray-700 rounded w-full mb-1 animate-pulse"></div>
                <div class="h-4 bg-gray-700 rounded w-1/2 animate-pulse"></div>
            </div>
            <div class="absolute top-2 right-2 w-7 h-7 bg-gray-700 rounded-md z-20"></div>
        </div>
    `;
}


// Helper function to create news/video card loading skeletons
function createNewsVideoLoadingSkeleton() {
    return `
        <div class="relative flex-shrink-0 w-72 p-2 bg-black bg-opacity-70 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
            <div class="red-gradient-overlay-skeleton"></div>
            <div class="relative w-full overflow-hidden rounded-md mb-2 z-10" style="padding-top: 56.25%;">
                <div class="absolute top-0 left-0 w-full h-full bg-gray-700 rounded-md border border-gray-600 animate-pulse"></div>
            </div>
            <h3 class="h-4 bg-gray-700 rounded w-3/4 mb-1 animate-pulse z-10"></h3>
            <p class="h-4 bg-gray-700 rounded w-full animate-pulse z-10"></p>
            <div class="absolute top-2 right-2 w-7 h-7 bg-gray-700 rounded-md z-20"></div>
        </div>
    `;
}

// Helper function to fetch data from API and render cards
async function fetchAndRenderCardsFromAPI(containerId, apiUrl, itemType, sliceLimit = null, dummyData = null) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID ${containerId} not found!`);
        return;
    }

    // Display loading skeletons
    container.innerHTML = ''; // Clear previous content
    const numSkeletons = sliceLimit || 6; // Display a few skeletons, default to 6 if no limit

    let skeletonHtml = '';
    if (itemType === 'news' || itemType === 'videos') { // Only news and videos use their specific skeleton
        for (let i = 0; i < numSkeletons; i++) {
            skeletonHtml += createNewsVideoLoadingSkeleton();
        }
    } else { // All other types (tokens, apps, users, nfts, games) use the updated general skeleton
        for (let i = 0; i < numSkeletons; i++) {
            skeletonHtml += createGeneralCardSkeleton();
        }
    }
    container.innerHTML = skeletonHtml;


    let itemsToRender = [];
    let fetchedFromAPI = false; // Flag to indicate if data was primarily fetched from an API

    // Primary data fetching logic
    if (apiUrl) {
        try {
            const response = await fetch(apiUrl);
            if (response.ok) {
                const data = await response.json();
                console.log(`Data fetched for ${itemType} from ${apiUrl}:`, data);
                itemsToRender = data.items || data.results || data.data || data.pairs || []; // Adjust based on common API response structure
                fetchedFromAPI = true;
            } else {
                console.warn(`HTTP error! status: ${response.status} for ${apiUrl}. Falling back to dummy data.`);
            }
        } catch (error) {
            console.error(`Error fetching ${itemType} data from API (${apiUrl}):`, error);
        }
    }

    // If no data was fetched from API, or if API URL was not provided, use dummy data
    if (!fetchedFromAPI && dummyData !== null) {
        console.log(`Using dummy data for ${itemType}:`, dummyData);
        itemsToRender = dummyData;
    }

    // --- Start: Logic to fetch additional token data from DexScreener for items with tokenAddress ---
    // This loop should ONLY run if the primary data was NOT fetched from an API (i.e., it came from dummyData)
    // and the item type is one that *might* have a tokenAddress (tokens, apps, games, users, nfts).
    if (!fetchedFromAPI && (itemType === 'tokens' || itemType === 'apps' || itemType === 'games' || itemType === 'users' || itemType === 'nfts')) {
        const tokenDataPromises = itemsToRender.map(async (item) => {
            if (item.tokenAddress) { // Check if tokenAddress exists for any item
                const tokenApiUrl = `https://api.dexscreener.com/latest/dex/tokens/${item.tokenAddress}`;
                try {
                    const tokenResponse = await fetch(tokenApiUrl);
                    if (tokenResponse.ok) {
                        const tokenData = await tokenResponse.json();
                        if (tokenData.pairs && tokenData.pairs.length > 0) {
                            const firstPair = tokenData.pairs[0];
                            console.log(`API enrichment data for tokenAddress ${item.tokenAddress}:`, firstPair);

                            // Update item with data from DexScreener
                            item.image = firstPair.baseToken.logoURI || `https://dd.dexscreener.com/ds-data/tokens/${firstPair.chainId}/${firstPair.baseToken.address}.png`;
                            item.marketCap = firstPair.fdv; // Use FDV as market cap
                            item.dexscreenerUrl = `https://dexscreener.com/${firstPair.chainId}/${firstPair.pairAddress}`;

                            // ONLY update price and priceChange if itemType is 'tokens'
                            if (itemType === 'tokens') {
                                item.price = firstPair.priceUsd;
                                item.priceChange = firstPair.priceChange.h24;
                                // Also update the baseToken properties for the dummy data item
                                item.baseToken = {
                                    symbol: firstPair.baseToken.symbol,
                                    name: firstPair.baseToken.name,
                                    logoURI: firstPair.baseToken.logoURI,
                                    address: firstPair.baseToken.address
                                };
                            }
                        } else {
                            console.warn(`DexScreener API returned no pairs for tokenAddress: ${item.tokenAddress} during enrichment.`);
                        }
                    } else {
                        console.warn(`Failed to fetch token data for ${item.tokenAddress} from DexScreener during enrichment. Status: ${tokenResponse.status}`);
                    }
                } catch (error) {
                    console.error(`Error fetching token data for ${item.tokenAddress} during enrichment:`, error);
                }
            }
            return item;
        });
        itemsToRender = await Promise.all(tokenDataPromises);
    }
    // --- End: Logic to fetch additional token data ---

    console.log(`Items to render for ${containerId} after API processing:`, itemsToRender);

    if (sliceLimit !== null) {
        itemsToRender = itemsToRender.slice(0, sliceLimit);
    }
    console.log(`Final items to render for ${containerId} after slicing:`, itemsToRender);


    // Clear skeletons and render actual content
    container.innerHTML = '';
    if (itemsToRender.length > 0) {
        itemsToRender.forEach(item => {
            let title = item.name || item.title || item.symbol || 'N/A';
            let imageUrl = item.image || item.logo || item.thumbnailUrl || 'https://placehold.co/100x100/374151/d1d5db?text=IMG';
            let id = item.id || item.pairAddress || item.name || title;
            let additionalData = { url: item.url || '#' }; // Pass the URL to additionalData

            if (itemType === 'tokens') {
                // Determine title and image based on whether it's a direct API pair or enriched dummy data
                if (fetchedFromAPI && item.baseToken && item.quoteToken) {
                    // Data came directly from DexScreener search API (trending tokens)
                    title = item.baseToken.symbol || 'N/A'; // Changed to symbol
                    id = item.chainId && item.pairAddress ? `${item.chainId}-${item.pairAddress}` : item.id || title;
                    imageUrl = item.baseToken.logoURI || `https://dd.dexscreener.com/ds-data/tokens/${item.chainId}/${item.baseToken.address}.png`;
                    additionalData = {
                        price: item.priceUsd,
                        marketCap: item.fdv,
                        priceChange: item.priceChange && typeof item.priceChange === 'object' ? item.priceChange.h24 : item.priceChange,
                        dexscreenerUrl: item.chainId && item.pairAddress ? `https://dexscreener.com/${item.chainId}/${item.pairAddress}` : '#',
                        url: item.url || '#'
                    };
                } else {
                    // Data was from dummyData and potentially enriched (featured tokens)
                    additionalData = {
                        price: item.price,
                        marketCap: item.marketCap || item.mcap,
                        priceChange: item.priceChange || item['24hpricechange'],
                        dexscreenerUrl: item.dexscreenerUrl || '#',
                        url: item.url || '#'
                    };
                    if (item.baseToken && item.baseToken.symbol) { // Changed to symbol
                        title = item.baseToken.symbol;
                    } else {
                        title = item.symbol || item.name || 'N/A'; // Prioritize symbol if available
                    }
                }
                container.innerHTML += createCard(id, title, '', imageUrl, itemType, additionalData);
            } else if (itemType === 'apps') {
                additionalData = {
                    category: item.category || 'N/A',
                    marketCap: item.marketCap || item.mcap,
                    dexscreenerUrl: item.dexscreenerUrl,
                    url: item.url || '#'
                };
                container.innerHTML += createCard(id, title, '', imageUrl, itemType, additionalData);
            } else if (itemType === 'games') { // Updated to include games
                additionalData = {
                    category: item.category || 'N/A',
                    platforms: item.platform || 'N/A', // Use 'platform' from main.json
                    url: item.url || '#'
                };
                container.innerHTML += createCard(id, title, '', imageUrl, itemType, additionalData);
            } else if (itemType === 'users') {
                additionalData = {
                    role: item.role || item.bio || 'N/A',
                    followers: formatNumberConcise(item.followers, 0),
                    url: item.url || '#'
                };
                container.innerHTML += createCard(id, title, '', imageUrl, itemType, additionalData);
            } else if (itemType === 'nfts') {
                additionalData = {
                    url: item.url || '#',
                    items: item.items // Pass the 'items' property from the data
                };
                // Removed redundant px-2 from the inner text div
                container.innerHTML += createCard(id, title, formatNumberConcise(item.floor, 2), imageUrl, itemType, additionalData);
            } else if (itemType === 'news') {
                container.innerHTML += createNewsItem(item.id, item.title, item.publicationDate, item.readDuration, item.url, item.image, 'news');
            } else if (itemType === 'videos') {
                container.innerHTML += createVideoItem(id, title, item.publicationDate, item.videoDuration, item.url, item.image, 'videos');
            }
        });
    } else {
        container.innerHTML = `<p class="text-gray-400">No data found for ${itemType}.</p>`;
    }
    // Re-attach click listeners after new content is rendered
    attachCardClickListeners();
}


// DOMContentLoaded handler
document.addEventListener('DOMContentLoaded', async () => {
    // Call fetchDummyData to load data and populate window variables
    await fetchDummyData();

    // Explicitly make these functions globally available
    window.toggleFavorite = toggleFavorite;
    window.createCard = createCard;
    window.createNewsItem = createNewsItem;
    window.createVideoItem = createVideoItem;
    window.formatNumberConcise = formatNumberConcise; // Make formatNumberConcise global

    const path = window.location.pathname;

    // Logic for index.html
    if (path.includes('index.html') || path === '/') {
        // Fetch and display trending tokens from DexScreener API for card layout
        fetchAndRenderCardsFromAPI('trending-tokens-container', "https://api.dexscreener.com/latest/dex/search?q=avax+arenatrade", 'tokens', 6, null); // Reverted to API fetch
        fetchAndRenderCardsFromAPI('trending-apps-container', null, 'apps', 6, window.indexTrendingApps);
        fetchAndRenderCardsFromAPI('trending-nfts-container', null, 'nfts', 6, window.indexTrendingNfts);
        fetchAndRenderCardsFromAPI('trending-games-container', null, 'games', 6, window.indexTrendingGames); // Added for games
        fetchAndRenderCardsFromAPI('trending-users-container', null, 'users', 6, window.indexTrendingUsers);
        fetchAndRenderCardsFromAPI('latest-news-container', null, 'news', 6, window.indexLatestNews); // Changed to latest news
        fetchAndRenderCardsFromAPI('latest-videos-container', null, 'videos', 6, window.indexLatestVideos); // Changed to latest videos
    }

    // Logic for discover.html
    if (path.includes('discover.html')) {
        fetchAndRenderCardsFromAPI('featured-tokens-container', null, 'tokens', 6, window.discoverFeaturedTokens);
        fetchAndRenderCardsFromAPI('featured-apps-container', null, 'apps', 6, window.discoverFeaturedApps);
        fetchAndRenderCardsFromAPI('featured-nfts-container', null, 'nfts', 6, window.discoverFeaturedNfts);
        fetchAndRenderCardsFromAPI('featured-games-container', null, 'games', 6, window.discoverFeaturedGames); // Added for games
        fetchAndRenderCardsFromAPI('featured-users-container', null, 'users', 6, window.discoverFeaturedUsers);
        fetchAndRenderCardsFromAPI('featured-news-container', null, 'news', 6, window.discoverFeaturedNews);
        fetchAndRenderCardsFromAPI('featured-videos-container', null, 'videos', 6, window.discoverFeaturedVideos);
    }

    // Logic for other pages (apps.html, nfts.html, users.html, news.html) remains unchanged
    if (path.includes('apps.html')) {
        fetchAndRenderCardsFromAPI('trending-apps-container', null, 'apps', 6, window.appsTrendingApps);
        fetchAndRenderCardsFromAPI('featured-apps-container', null, 'apps', 6, window.appsFeaturedApps);
        fetchAndRenderCardsFromAPI('popular-apps-container', null, 'apps', 6, window.appsPopularApps);
        fetchAndRenderCardsFromAPI('all-apps-container', null, 'apps', null, window.appsAllApps);
        fetchAndRenderCardsFromAPI('project-updates-container', null, 'news', 6, window.appsProjectUpdates);
        fetchAndRenderCardsFromAPI('featured-videos-container', null, 'videos', 6, window.appsFeaturedVideos);
    }

    if (path.includes('nfts.html')) {
        fetchAndRenderCardsFromAPI('trending-nfts-container', null, 'nfts', 6, window.nftsTrendingNfts);
        fetchAndRenderCardsFromAPI('featured-nfts-container', null, 'nfts', 6, window.nftsFeaturedNfts);
        fetchAndRenderCardsFromAPI('popular-nfts-container', null, 'nfts', 6, window.nftsPopularNfts);
        fetchAndRenderCardsFromAPI('all-nfts-container', null, 'nfts', null, window.nftsAllNfts);
        fetchAndRenderCardsFromAPI('project-updates-container', null, 'news', 6, window.nftsProjectUpdates);
        fetchAndRenderCardsFromAPI('featured-videos-container', null, 'videos', 6, window.nftsFeaturedVideos);
    }

    if (path.includes('users.html')) {
        fetchAndRenderCardsFromAPI('top-arena-users-container', null, 'users', 6, window.usersTopArenaUsers);
        fetchAndRenderCardsFromAPI('top-influencers-container', null, 'users', 6, window.usersTopInfluencers);
        fetchAndRenderCardsFromAPI('popular-founders-container', null, 'users', 6, window.usersPopularFounders);
        fetchAndRenderCardsFromAPI('popular-arena-yappers-container', null, 'users', 6, window.usersPopularArenaYappers);
        fetchAndRenderCardsFromAPI('project-updates-container', null, 'news', 6, window.usersProjectUpdates);
        fetchAndRenderCardsFromAPI('featured-videos-container', null, 'videos', 6, window.usersFeaturedVideos);
    }

    if (path.includes('news.html')) {
        fetchAndRenderCardsFromAPI('breaking-news-container', null, 'news', 6, window.newsBreakingNews);
        fetchAndRenderCardsFromAPI('featured-news-container', null, 'news', 6, window.newsFeaturedNews);
        fetchAndRenderCardsFromAPI('trending-news-container', null, 'news', 6, window.newsTrendingNews);
        fetchAndRenderCardsFromAPI('latest-news-container', null, 'news', 6, window.newsLatestNews);
        fetchAndRenderCardsFromAPI('latest-videos-container', null, 'videos', 6, window.newsLatestVideos);
    }

    // Attach click listeners to cards after they are added to the DOM
    attachCardClickListeners();

    // Dispatch custom event to signal that data has been loaded
    document.dispatchEvent(new Event('dataLoaded'));
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    });
}