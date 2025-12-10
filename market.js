let markersData = []; // now loaded from JSON

async function loadMarketData() {
  try {
    const res = await fetch('market.json');
    markersData = await res.json();
    initMarkers(); 
  } catch (err) {
    console.error('Failed to load market data:', err);
  }
}

    // localStorage 
    const STORAGE_KEY = 'savorykit_market_user_data_v1';
    function loadSaved() {
      try{
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
      } catch(e){ console.warn(e); return {} }
    }
    function saveSaved(data){ localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
    function getMergedPlace(id){
      const base = markersData.find(m=>m.id===id);
      if(!base) return null;
      const saved = loadSaved()[id] || { added: [], tried: {} };
      const mergedMenu = Array.from(new Set([...(base.menu||[]), ...(saved.added||[])]));
      return { ...base, menu: mergedMenu, _saved: saved };
    }
    const map = L.map('map').setView([8.366484,124.865488], 16);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom:19 }).addTo(map);

    // Create markers and bind simple popup with name only
    function initMarkers() {
  markersData.forEach((place) => {
    const marker = L.marker([place.lat, place.lng]).addTo(map);
    marker.bindPopup(`<b>${place.name}</b>`);
    marker.on('click', () => {
      openPanelFor(place.id);
    });
  });
}

    // Panel DOM 
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
      renderMenu(p);
      panel.classList.add('open');
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

    //  EDIT BUTTON 
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

    //  DELETE BUTTON 
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
      if(!all[activePlaceId].added.includes(text)) all[activePlaceId].added.push(text);
      saveSaved(all);
      newItemInput.value = '';
      addForm.classList.add('hide');
      openPanelFor(activePlaceId);
    });

    // close panel when clicking map background on desktop
    map.on('click', ()=>{ panel.classList.remove('open'); activePlaceId = null; });
    async function initFromUrl(url){
      try{
        const r = await fetch(url);
        const data = await r.json();
        console.log('Loaded external data', data);
      }catch(e){console.error(e)}
    }
    loadMarketData();
