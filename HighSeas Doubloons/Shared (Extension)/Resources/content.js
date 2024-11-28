// Console Helper
console.hs = (...args) => console.log("HighSeas Doubloons Extension:", ...args);

// Check if we're on the Shipyard page
const isThisShipyard = () => window.location.href.includes("shipyard");

// Convert points to votes
const pointsToVotes = (points) => Math.round(((points - 0.5) * 10) / 24.5);

// Log load start
console.hs("Loading...");

// Variables
let shippedShipsHeader = null;
let lastLoadState = false;

// Main loader loop
let loaderInterval = setInterval(() => {
	if (!isThisShipyard()) return;

	shippedShipsHeader = Array.from(document.querySelectorAll("h2")).find(
		(el) => el?.textContent === "Shipped Ships"
	);

	if (shippedShipsHeader) {
		if (!lastLoadState) {
			lastLoadState = true;
			runCode();
		} else if (
			Array.from(document.querySelectorAll('[id^="shipped-ship-"]')).some(
				(el) =>
					el.querySelector(".flex-grow > div")?.children.length <= 2
			)
		) {
			runCode();
		}
	} else {
		shippedShipsHeader = null;
		lastLoadState = false;
	}
}, 1000);

// HTML Template
const HTML_CONTENT = (avph, avpp) => `
<div id="hs-ext-features" class="rounded-lg bg-card text-card-foreground shadow-sm bg-blend-color-burn flex flex-col sm:gap-2 sm:flex-row items-start sm:items-center p-4 hover:bg-gray-100 transition-colors duration-200" style="background-size: 10rem 100%;background-repeat: repeat-x;background-color: rgba(255, 255, 255, 0.94);">
	<p id="hs-ext-title">HighSeas Doubloons Extension</p>
	<div class="flex flex-wrap items-start gap-3 text-sm items-center">
		<span class="mr-2 text-xl font-semibold">Average: </span>
		<span class="inline-flex items-center gap-1 rounded-full px-2 border text-sm leading-none text-green-600 bg-green-50 border-green-500/10">
			<img alt="doubloons" loading="lazy" width="16" height="20" decoding="async" src="/_next/static/media/doubloon.fd63888b.svg">
			<span class="inline-block py-1">${avph?.toFixed(2)} / hour</span>
		</span>
		<span class="inline-flex items-center gap-1 rounded-full px-2 border text-sm leading-none text-green-600 bg-green-50 border-green-500/10">
			<img alt="doubloons" loading="lazy" width="16" height="20" decoding="async" src="/_next/static/media/doubloon.fd63888b.svg">
			<span class="inline-block py-1">${avpp?.toFixed(2)} / project</span>
		</span>
		<span class="inline-flex items-center gap-1 rounded-full px-2 border text-sm leading-none text-green-600 bg-green-50 border-green-500/10">
			${SVG_VOTES_ICON}
			<span class="inline-block py-1">~${pointsToVotes(avph)} votes / project</span>
		</span>
	</div>
</div>
`;

// SVG Icon for Votes
const SVG_VOTES_ICON = `<svg fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="1.414" preserveAspectRatio="xMidYMid meet" fill="currentColor" width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zm64 192c17.7 0 32 14.3 32 32l0 96c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-96c0-17.7 14.3-32 32-32zm64-64c0-17.7 14.3-32 32-32s32 14.3 32 32l0 192c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-192zM320 288c17.7 0 32 14.3 32 32l0 32c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-32c0-17.7 14.3-32 32-32z"/></svg>`;

// Function to calculate averages
function getAverages() {
	const ships = Array.from(document.querySelectorAll('[id^="shipped-ship-"]'));
	console.hs("Found ships:", ships.length);

	const dhData = ships.map((ship) => {
		const doubloonsText = Array.from(ship.querySelectorAll("span"))
			?.find((sp) => sp?.textContent?.endsWith("doubloons"))
			?.textContent?.replace(" doubloons", "");
		const hoursText = Array.from(ship.querySelectorAll("span"))
			?.find((sp) => sp?.textContent?.endsWith("hrs"))
			?.textContent?.replace(" hrs", "");

	const doubloons = Number(doubloonsText ?? 0);
	const hours = Number(hoursText ?? 0);

		console.hs("Ship data - Doubloons:", doubloons, "Hours:", hours);

		return [doubloons, hours];
	});

	// Calculate averages
	const avph = dhData.reduce((sum, [ph, hrs]) => sum + (hrs > 0 ? ph / hrs : 0), 0) / ships.length || 0;
	const avpp = dhData.reduce((sum, [ph]) => sum + ph, 0) / ships.length || 0;

	return [avph, avpp];
}

// Main HTML Script
const HTML_SCRIPT = () => {
	const [avph, avpp] = getAverages();

	if (!document.getElementById("hs-ext-features")) {
		shippedShipsHeader.insertAdjacentHTML("afterend", HTML_CONTENT(avph, avpp));
	}
};

// Run the code
function runCode() {
	HTML_SCRIPT();
	console.hs("Updated values displayed!");
}
