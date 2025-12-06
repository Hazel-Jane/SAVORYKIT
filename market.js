// --- Sample data (you can keep this in an external market.json and fetch it) ---
    const markersData = [
      {id: 'm-1', name: 'Manolo Local Market', description: 'Zone 8, Ubos sa highschool', lat: 8.365606, lng: 124.865201,
        menu: ['Fresh fish', 'Rice', 'Vegetables']},
      {id: 'm-2', name: "Sosana's Lutong Bahay", description: 'Dapit sa Water Tank og Smart Tower', lat: 8.367877, lng: 124.861258,
        menu: ['Sinigang na baboy','Pancit canton']},
      {id: 'm-3', name: 'Pitongs Pares', description: 'Dapit sa Water Tank og Smart Tower', lat: 8.367806, lng: 124.861695,
        menu: ['Pares beef','Rice']},
      {id: 'm-4', name: 'Pa-paff', description: 'Snacks & drinks', lat: 8.367424, lng: 124.866883,
        menu: ['Ramen','Iced tea','Snacks']},
      {id: 'm-5', name: "Mr. Wok", description: 'Wok-style meals', lat: 8.367899, lng: 124.861006,
        menu: ['Fried rice','Chow mein','Lumpia']}
    ];

    // localStorage key
    const STORAGE_KEY = 'savorykit_market_user_data_v1';

    // load saved user-data (added items + tried status)
    function loadSaved() {
      try{
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
      } catch(e){ console.warn(e); return {} }
    }
    function saveSaved(data){ localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }

    // Merge base menu with saved additional items & tried flags
    function getMergedPlace(id){
      const base = markersData.find(m=>m.id===id);
      if(!base) return null;
      const saved = loadSaved()[id] || { added: [], tried: {} };
      // merged menu = base.menu + saved.added
      const mergedMenu = Array.from(new Set([...(base.menu||[]), ...(saved.added||[])]));
      return { ...base, menu: mergedMenu, _saved: saved };
    }

    // initialize map
    const map = L.map('map').setView([8.366484,124.865488], 16);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom:19 }).addTo(map);

    // Create markers and bind simple popup with name only
    markersData.forEach((place)=>{
      const marker = L.marker([place.lat, place.lng]).addTo(map);
      marker.bindPopup(`<b>${place.name}</b>`);
      marker.on('click', ()=>{
        // open side panel and load the place's menu
        openPanelFor(place.id);
      });
    });

    // Panel DOM refs
    const panel = document.getElementById('panel');
    const placeNameEl = document.getElementById('place-name');
    const placeDescEl = document.getElementById('place-desc');
    const menuList = document.getElementById('menu-list');
    const openAddBtn = document.getElementById('open-add');
    const addForm = document.getElementById('add-form');
    const newItemInput = document.getElementById('new-item-input');
    const saveItemBtn = document.getElementById('save-item');

    let activePlaceId = null;

    function openPanelFor(id){
      activePlaceId = id;
      const p = getMergedPlace(id);
      if(!p) return;
      placeNameEl.textContent = p.name;
      placeDescEl.textContent = p.description || '';

      // populate menu list
      renderMenu(p);

      // show panel (mobile uses translated panel), desktop it's visible already
      panel.classList.add('open');

      // close leaflet popup if any open
      map.closePopup();
    }

    function renderMenu(place){
  menuList.innerHTML = '';
  const saved = place._saved || { added: [], tried: {} };

  place.menu.forEach((item)=>{
    const li = document.createElement('li');
    const meta = document.createElement('div'); 
    meta.className = 'meta';

    const label = document.createElement('div'); 
    label.textContent = item;

    meta.appendChild(label);

    const actions = document.createElement('div');

    const isUserAdded = saved.added && saved.added.includes(item);

    // ✏️ EDIT BUTTON (ONLY FOR USER-ADDED)
    if(isUserAdded){
      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.className = 'edit-btn';

      editBtn.onclick = ()=>{
        const newName = prompt('Edit item name:', item);
        if(!newName || !newName.trim()) return;

        const all = loadSaved();
        const index = all[place.id].added.indexOf(item);
        if(index !== -1){
          all[place.id].added[index] = newName.trim();
        }
        saveSaved(all);
        openPanelFor(place.id);
      };

      actions.appendChild(editBtn);
    }

    // 🗑️ DELETE BUTTON (ONLY FOR USER-ADDED)
    if(isUserAdded){
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.className = 'delete-btn';

      deleteBtn.onclick = ()=>{
        if(!confirm('Delete this item?')) return;

        const all = loadSaved();
        all[place.id].added = all[place.id].added.filter(i => i !== item);
        delete all[place.id].tried?.[item];

        saveSaved(all);
        openPanelFor(place.id);
      };

      actions.appendChild(deleteBtn);
    }

    li.appendChild(meta);
    li.appendChild(actions);
    menuList.appendChild(li);
  });
}


    // show add form toggle
    openAddBtn.addEventListener('click', ()=>{
      if(!activePlaceId) return alert('Tap a pin first');
      addForm.classList.toggle('hide');
      newItemInput.focus();
    });

    saveItemBtn.addEventListener('click', ()=>{
      const text = newItemInput.value && newItemInput.value.trim();
      if(!text) return;
      const all = loadSaved();
      all[activePlaceId] = all[activePlaceId] || { added: [], tried: {} };
      // push if not exists
      if(!all[activePlaceId].added.includes(text)) all[activePlaceId].added.push(text);
      saveSaved(all);
      newItemInput.value = '';
      addForm.classList.add('hide');
      // re-open to refresh view
      openPanelFor(activePlaceId);
    });

    // close panel when clicking map background on desktop
    map.on('click', ()=>{ panel.classList.remove('open'); activePlaceId = null; });

    // optional: expose a function to load external JSON instead of using markersData above
    async function initFromUrl(url){
      try{
        const r = await fetch(url);
        const data = await r.json();
        // expect each entry to have id/name/lat/lng/menu[]
        // replace markersData and re-create markers (simple approach: reload page or implement marker cleanup)
        console.log('Loaded external data', data);
      }catch(e){console.error(e)}
    }