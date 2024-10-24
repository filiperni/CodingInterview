document.addEventListener("DOMContentLoaded", () => {
	const offersList = document.getElementById("offersList");
	const cityFilter = document.getElementById("cityFilter");
	const availableOnly = document.getElementById("availableOnly");
	const automaticOnly = document.getElementById("automaticOnly");
	const sortPrice = document.getElementById("sortPrice");

	let offers = [];

	fetch("https://gx.pandora.caps.pl/zadania/api/offers2023.json")
		.then(response => response.json())
		.then(data => {
			offers = data.offers;
			renderOffers(offers);
			populateCities(offers);
			filterAndSortOffers();
		});

	function renderOffers(filteredOffers) {
		console.log(filteredOffers);

		offersList.innerHTML = ""; // Clear existing offers
		filteredOffers.forEach(offer => {
			const offerElement = document.createElement("div");
			offerElement.classList.add(
				"col-lg-3",
				"card",
				"vehicle-card",
				"text-light",
				"text-center",
				"p-5",
				"position-relative"
			);
			offerElement.innerHTML = `
			<div class="position-absolute top-0 end-0 m-4 heart"></div>
				<h4 class="mb-1">${offer.offer_details.model_details}</h4>
				<p class="fs-5 under-title mb-3">${offer.offer_details.kabina}</p>
				<p class="small">${
					offer.in_stock >= 1
						? "Dostępny od ręki!"
						: "Przewidywana data dostawy: " +
						  formatDate(offer.pdd) +
						  "*"
				}</p>

				<img
					src="${offer.offer_details.image_paths.front}"
					alt="D-Max"
					class="img-fluid vehicle-image"
				/>
				<div class="vehicle-info mt-4">
					<div class="d-flex justify-content-between">
						<p>Rok produkcji</p>
						<p><strong>${offer.offer_details.mfgYear}</strong></p>
					</div>

					<div class="d-flex justify-content-between">
						<p>Skrzynia</p>
						<p><strong>${
							offer.offer_details.skrzynia_automatyczna
								? "Automatyczna"
								: "Manualna"
						}</strong></p>
					</div>
					<div class="d-flex justify-content-between mb-3">
						<p>Miasto</p>
						<p><strong>${offer.miasto}</strong></p>
					</div>
					<div class="d-flex justify-content-between">
						<p class="pt-2">Cena netto</p>
						<p>
							 <strong class="netto-price-number">${Intl.NumberFormat("pl-PL").format(
									offer.car_price_disc
								)}</strong>
							zł
						</p>
					</div>
					<div class="d-flex justify-content-between mb-4">
						<p>Cena brutto</p>
						<p><strong>${Intl.NumberFormat("pl-PL").format(
							offer.total_gross_price
						)}</strong> zł</p>
					</div>
				</div>
				<div class="d-flex justify-content-center">
					<button
						type="button"
						class="btn call-to-action-btn rounded-0"
					>
						ZOBACZ OFERTĘ
					</button>
				</div>
        `;
			offersList.appendChild(offerElement);
		});
	}
	function formatDate(dateString) {
		const date = new Date(dateString);

		const formatter = new Intl.DateTimeFormat("pl-PL", {
			month: "long",
			year: "numeric",
		});
		const formattedDate = formatter.format(date);

		return formattedDate;
	}

	function populateCities(offers) {
		const cities = [...new Set(offers.map(offer => offer.miasto))];
		cities.forEach(city => {
			const option = document.createElement("option");
			option.value = city;
			option.textContent = city;
			cityFilter.appendChild(option);
		});
	}

	availableOnly.addEventListener("change", filterAndSortOffers);
	automaticOnly.addEventListener("change", filterAndSortOffers);
	cityFilter.addEventListener("change", filterAndSortOffers);
	sortPrice.addEventListener("change", filterAndSortOffers);

	function filterAndSortOffers() {
		let filteredOffers = [...offers];

		if (availableOnly.checked) {
			filteredOffers = filteredOffers.filter(
				offer => offer.in_stock === 1
			);
		}

		if (automaticOnly.checked) {
			filteredOffers = filteredOffers.filter(
				offer => offer.offer_details.skrzynia_automatyczna === true
			);
		}

		const selectedCity = cityFilter.value;
		if (selectedCity) {
			filteredOffers = filteredOffers.filter(
				offer => offer.miasto === selectedCity
			);
		}

		const sortOption = sortPrice.value;
		filteredOffers.sort((a, b) => {
			return sortOption === "asc"
				? a.car_price_disc - b.car_price_disc
				: b.car_price_disc - a.car_price_disc;
		});

		renderOffers(filteredOffers);
	}
});
