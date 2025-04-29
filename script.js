document.addEventListener('DOMContentLoaded', function() {
  // Tab navigation
  const tabButtons = document.querySelectorAll('.nav-tab');
  const pages = document.querySelectorAll('.page');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.getAttribute('data-tab');
      tabButtons.forEach(btn => btn.classList.remove('active'));
      pages.forEach(page => page.classList.remove('active'));
      button.classList.add('active');
      document.getElementById(tabId).classList.add('active');
      playRandomMemeSound();
    });
  });

  // Improved Gallery modal handling
  const galleryItems = document.querySelectorAll('.gallery-item');
  const modal = document.getElementById('gallery-modal');
  const modalImg = document.getElementById('modal-img');
  const modalVideo = document.getElementById('modal-video');
  const closeModal = document.querySelector('.close-modal');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      modal.style.display = 'flex';
      
      // Check if the item contains a video or an image
      if (item.querySelector('video')) {
        modalImg.style.display = 'none';
        modalVideo.style.display = 'block';
        modalVideo.src = item.querySelector('video').src;
        modalVideo.play();
      } else {
        modalImg.style.display = 'block';
        modalVideo.style.display = 'none';
        modalImg.src = item.querySelector('img').src;
      }
    });
  });

  // Ensure close button works and stops video playback
  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    if (modalVideo) {
      modalVideo.pause();
      modalVideo.currentTime = 0;
    }
  });

  // Also close when clicking outside the modal content
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      if (modalVideo) {
        modalVideo.pause();
        modalVideo.currentTime = 0;
      }
    }
  });

  // Close with ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      modal.style.display = 'none';
      if (modalVideo) {
        modalVideo.pause();
        modalVideo.currentTime = 0;
      }
    }
  });

  // Theme switch toggling dark/light mode
  const themeSwitch = document.getElementById('theme-switch');
  const body = document.body;

  // Start in dark theme
  body.classList.add('dark-theme');
  themeSwitch.textContent = '☀️';

  themeSwitch.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    themeSwitch.textContent = body.classList.contains('dark-theme') ? '☀️' : '🌙';
    playRandomMemeSound();
  });

  // Load all meme sounds
  const memeSounds = [
    ...Array.from({ length: 5 }, (_, i) => document.getElementById(`memeSound${i+1}`)),
    document.getElementById('soundLetMeKnow'),
    ...Array.from({ length: 7 }, (_, i) => document.getElementById(`sound${i+1}`))
  ];

  // Function to play a random meme sound
  function playRandomMemeSound() {
    if (memeSounds.some(s => !s.paused && !s.ended)) return;
    const pick = memeSounds[Math.floor(Math.random() * memeSounds.length)];
    pick.currentTime = 0;
    pick.play();
  }

  // Rickroll Easter egg on title click
  document.querySelector('h1').addEventListener('click', () => {
    const r = document.getElementById('rickroll');
    if (r.paused) { r.currentTime = 0; r.play(); }
    showMemeToast('You just got rickrolled!');
  });

  // Double-click to spawn falling memes
  document.addEventListener('dblclick', e => {
    const memes = ['😂','🤣','💀','👁️👄👁️','🗿','👌','🔥','😎','🤔','👀'];
    const emoji = memes[Math.floor(Math.random() * memes.length)];
    const el = document.createElement('div');
    el.textContent = emoji;
    el.className = 'falling-meme';
    el.style.left = `${e.pageX}px`;
    el.style.top = `${e.pageY}px`;
    el.style.animationDuration = `${Math.random() * 3 + 2}s`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 5000);
  });
// NEW
function showMemeToast(msg) {
  const toast = document.getElementById('meme-toast');
  toast.textContent = msg;
  // trigger CSS animation
  toast.classList.add('show');
  // auto–hide after 3s
  setTimeout(() => toast.classList.remove('show'), 3000);
}

  // Periodic random meme quotes
  const memeQuotes = [
    'One does not simply eat our food without making meme references',
    'Such flavor. Very wow. Much taste.',
    "It's dangerous to go alone, take this food!",
    'All your taste buds are belong to us',
    'Y U NO order more?!',
    "This isn't even my final form",
    'Shut up and take my money!',
    "That's what she said",
    "*chef's kiss* Perfectly balanced, as all things should be",
    "It's over 9000... calories"
  ];
  setInterval(() => showMemeToast(
    memeQuotes[Math.floor(Math.random() * memeQuotes.length)]
  ), 30000);

  // Order form → Discord webhook
  const orderForm = document.querySelector('.order-form');
  if (orderForm) {
    orderForm.addEventListener('submit', async e => {
      e.preventDefault();
      const data = ['name','phone','pickup-time','order-items','special-requests']
        .reduce((o,id) => (o[id] = document.getElementById(id).value || 'None', o), {});
      const payload = {
        content: null,
        embeds: [{
          title: 'New disaster (order)',
          description: 'We got a new customer yipee',
          fields: [
            { name: 'Their name:', value: data['name'] },
            { name: 'Phone number:', value: data['phone'] },
            { name: 'Pickup time:', value: data['pickup-time'] },
            { name: 'Their order:', value: data['order-items'] },
            { name: 'Special Requests:', value: data['special-requests'] }
          ]
        }]
      };
      try {
        const res = await fetch(
          'https://discord.com/api/webhooks/1366511306034905172/IGa4yGe0Z2hM4IX-gHIF6HbX8CGhb2Zw-Hw8s7OeHwV7uG4ctCCPTSw9Nxd-2sMenrzh',
          { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) }
        );
        alert(res.ok ? 'Order received and sent to Discord!' : 'Failed to send order.');
      } catch (err) {
        console.error(err);
        alert('Error sending order.');
      }
      orderForm.reset();
    });
  }

  // Konami code epic mode
  const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let idx=0;
  document.addEventListener('keydown', e => {
    if (e.key === konami[idx]) {
      idx++;
      if (idx === konami.length) {
        cookKonami();
        idx = 0;
      }
    } else {
      idx = 0;
    }
  });
  function cookKonami() {
    const r = document.getElementById('rickroll');
    if (r.paused) { r.currentTime = 0; r.play(); }
    for (let i = 0; i < 100; i++) {
      setTimeout(() => {
        const emo = ['😂','🤣','💀','👁️👄👁️','🗿','👌','🔥','😎','🤔','👀'][Math.floor(Math.random() * 10)];
        const d = document.createElement('div');
        d.textContent = emo;
        d.className = 'falling-meme';
        d.style.left = `${Math.random() * window.innerWidth}px`;
        d.style.top = '0px';
        d.style.animationDuration = `${Math.random() * 3 + 2}s`;
        document.body.appendChild(d);
        setTimeout(() => d.remove(), 5000);
      }, i * 50);
    }
    showMemeToast('KONAMI CODE ACTIVATED: Ultimate Meme Mode!');
  }

  // --- Interactive Menu Filters setup ---
  initFilters();

  // Animate menu items on scroll
  initScrollAnimations();

  // Scroll-animation initialization
  function initScrollAnimations() {
    const menuItems = document.querySelectorAll('.menu-item');
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { root: null, threshold: 0.1 });

    menuItems.forEach(item => observer.observe(item));
  }

  function initFilters() {
    function assignData(it, cat) {
      it.dataset.category = cat;
      it.dataset.price = parseFloat(
        it.querySelector('.menu-item-price').textContent.replace(/[^0-9.]/g, '')
      );
      it.dataset.bestseller = it.classList.contains('bestseller');
    }
    
    // Map items to categories, prices, bestseller flags
    const menu = document.getElementById('menu');
    menu.querySelectorAll('.menu-section').forEach(sec => {
      const cat = sec.querySelector('h2').textContent.replace(/^\W+/, '').trim();
      sec.querySelectorAll('.menu-item').forEach(it => assignData(it, cat));
    });

    // Tab clicks
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.filter-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document
          .getElementById(tab.getAttribute('data-filter') + '-panel')
          .classList.add('active');
        playRandomMemeSound();
      });
    });
    
    // Toggles
    const bestsellerToggle = document.getElementById('bestseller-only');
    const sortPriceToggle = document.getElementById('sort-price-asc');
    
    // Apply & Reset buttons
    document.getElementById('apply-filters').addEventListener('click', () => {
      filterMenu();
      
      // Bestseller filter
      if (bestsellerToggle.checked) {
        document.querySelectorAll('#menu .menu-item').forEach(item => {
          if (item.dataset.bestseller !== 'true') item.style.display = 'none';
        });
      }
      
      // Price sort
      if (sortPriceToggle.checked) {
        document.querySelectorAll('#menu .menu-section').forEach(section => {
          const items = Array.from(section.querySelectorAll('.menu-item')).filter(
            it => it.style.display === ''
          );
          items
            .sort((a, b) => parseFloat(a.dataset.price) - parseFloat(b.dataset.price))
            .forEach(item => section.appendChild(item));
        });
      }
      
      showMemeToast('Filters applied! Much filter, very wow!');
    });
    
    document.getElementById('reset-filters').addEventListener('click', () => {
      resetFilters();
      bestsellerToggle.checked = false;
      sortPriceToggle.checked = false;
      showMemeToast('Filters reset! Fresh start!');
    });
  }

  function filterMenu() {
    const selectedCats = Array.from(
      document.querySelectorAll('#categories-panel input[type="checkbox"]:checked')
    ).map(i => i.value);
    const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
    const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;
    
    document.querySelectorAll('#menu .menu-item').forEach(it => {
      const inCat = selectedCats.includes(it.dataset.category);
      const priceOK = it.dataset.price >= minPrice && it.dataset.price <= maxPrice;
      it.style.display = (inCat && priceOK) ? '' : 'none';
    });
  }

  function resetFilters() {
    document.querySelectorAll('.filter-container input').forEach(i => {
      if (i.type === 'checkbox') i.checked = true;
      if (i.type === 'number') i.value = '';
    });
    
    document.querySelectorAll('.filter-tab').forEach((t, i) =>
      t.classList.toggle('active', i === 0)
    );
    document.querySelectorAll('.filter-panel').forEach((p, i) =>
      p.classList.toggle('active', i === 0)
    );
    
    filterMenu();
  }
});