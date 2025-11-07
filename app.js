(function () {
	const STORAGE_KEY = 'portfolio.gallery.items.v1';
	const enableCrud = !!document.getElementById('addItemBtn');

	function getStoredItems() {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (!raw) return [];
			const items = JSON.parse(raw);
			return Array.isArray(items) ? items : [];
		} catch (e) {
			return [];
		}
	}

	function setStoredItems(items) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
	}

	function seedDemoData() {
		const demo = [
			{ id: crypto.randomUUID(), title: 'Landing Page', image: 'https://images.unsplash.com/photo-1522199710521-72d69614c702?q=80&w=1200&auto=format&fit=crop', desc: 'Fast static site for a marketing campaign.' },
			{ id: crypto.randomUUID(), title: 'Restaurant Site', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop', desc: 'Menu, reservations, and gallery.' },
			{ id: crypto.randomUUID(), title: 'Shop Front', image: 'https://images.unsplash.com/photo-1557825835-70d97c4aa2d7?q=80&w=1200&auto=format&fit=crop', desc: 'E‑commerce storefront with cart & checkout.' }
		];
		setStoredItems(demo);
	}

	function renderGallery() {
		const grid = document.getElementById('galleryGrid');
		if (!grid) return;
		const items = getStoredItems();
		grid.innerHTML = '';
		if (!items.length) {
			const empty = document.createElement('div');
			empty.className = 'card';
			empty.textContent = 'No items yet. Click "Add Item" to create your first project.';
			grid.appendChild(empty);
			return;
		}
		for (const item of items) {
			const card = document.createElement('div');
			card.className = 'gallery-card';
			card.innerHTML = `
				<img src="${item.image}" alt="${escapeHtml(item.title)}" onerror="this.src='https://via.placeholder.com/800x500?text=Image'" />
				<div class="content">
					<h4>${escapeHtml(item.title)}</h4>
					<p>${escapeHtml(item.desc)}</p>
					${enableCrud ? '<div class="card-actions"><button class="btn light" data-delete="' + item.id + '">Delete</button></div>' : ''}
				</div>
			`;
			grid.appendChild(card);
		}
	}

	function escapeHtml(str) {
		return String(str)
			.replaceAll('&', '&amp;')
			.replaceAll('<', '&lt;')
			.replaceAll('>', '&gt;')
			.replaceAll('"', '&quot;')
			.replaceAll("'", '&#039;');
	}

	// Modal helpers
	const modal = document.getElementById('itemModal');
	const modalTitle = document.getElementById('modalTitle');
	const itemForm = document.getElementById('itemForm');
	const itemId = document.getElementById('itemId');
	const itemTitle = document.getElementById('itemTitle');
	const itemImage = document.getElementById('itemImage');
	const itemDesc = document.getElementById('itemDesc');

	function openModal(mode, existing) {
		modal.classList.add('open');
		modal.setAttribute('aria-hidden', 'false');
		if (mode === 'edit' && existing) {
			modalTitle.textContent = 'Edit Item';
			itemId.value = existing.id;
			itemTitle.value = existing.title;
			itemImage.value = existing.image;
			itemDesc.value = existing.desc;
		} else {
			modalTitle.textContent = 'Add Item';
			itemId.value = '';
			itemTitle.value = '';
			itemImage.value = '';
			itemDesc.value = '';
		}
	}

	function closeModal() {
		modal.classList.remove('open');
		modal.setAttribute('aria-hidden', 'true');
	}

	// Event bindings
	document.addEventListener('click', (e) => {
		const t = e.target;
		if (!(t instanceof HTMLElement)) return;
		if (t.matches('[data-close]')) {
			closeModal();
		}
		if (t.id === 'addItemBtn') {
			openModal('add');
		}
		if (t.dataset && t.dataset.edit) {
			const items = getStoredItems();
			const found = items.find(x => x.id === t.dataset.edit);
			if (found) openModal('edit', found);
		}
		if (t.dataset && t.dataset.delete) {
			const id = t.dataset.delete;
			const items = getStoredItems().filter(x => x.id !== id);
			setStoredItems(items);
			renderGallery();
		}
		if (t.id === 'resetDemoBtn') {
			seedDemoData();
			renderGallery();
		}
		if (t.closest('.nav') && t.tagName === 'A') {
			// Close mobile nav on click
			const list = document.querySelector('.nav-list');
			list && list.classList.remove('open');
		}
	});

	if (itemForm) itemForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const id = itemId.value || crypto.randomUUID();
		const payload = {
			id,
			title: itemTitle.value.trim(),
			image: itemImage.value.trim(),
			desc: itemDesc.value.trim()
		};
		const items = getStoredItems();
		const existingIdx = items.findIndex(x => x.id === id);
		if (existingIdx >= 0) {
			items[existingIdx] = payload;
		} else {
			items.unshift(payload);
		}
		setStoredItems(items);
		closeModal();
		renderGallery();
	});

	// Contact form (demo only)
	const contactForm = document.getElementById('contactForm');
	const contactStatus = document.getElementById('contactStatus');
	if (contactForm) contactForm.addEventListener('submit', (e) => {
		e.preventDefault();
		contactStatus.textContent = 'Thanks! We will get back to you shortly.';
		contactForm.reset();
	});

	// Career form (demo only)
	const careerForm = document.getElementById('careerForm');
	const careerStatus = document.getElementById('careerStatus');
	if (careerForm) careerForm.addEventListener('submit', (e) => {
		e.preventDefault();
		careerStatus.textContent = 'Thank you for your application! We will review it and get back to you soon.';
		careerForm.reset();
	});

	// Mobile nav toggle
	const navToggle = document.querySelector('.nav-toggle');
	const navList = document.querySelector('.nav-list');
	if (navToggle && navList) navToggle.addEventListener('click', () => {
		navList.classList.toggle('open');
	});

	// Init
	document.getElementById('year').textContent = String(new Date().getFullYear());
	if (getStoredItems().length === 0) {
		seedDemoData();
	}
	renderGallery();

	// Preloader removed
})();


