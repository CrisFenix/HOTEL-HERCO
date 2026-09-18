(function(){
// ---------- ROOM DATA ----------
  var rooms = ["101","102","103","201","202","203","204","205","206","301","302","303","304","305","306","401","402","403","404","405","406"];
  function roomCard(num){
    var floor = num[0]+"er piso";
    return '<div class="room-card" tabindex="0" role="button" aria-label="Habitación '+num+'">'+
      '<div class="room-thumb" data-num="'+num+'"></div>'+
      '<div class="room-body"><h4>Habitación '+num+'</h4><p class="price">Desde consultar en recepción</p>'+
      '<div class="tags"><span>'+floor+'</span><span>2 personas</span><span>Baño privado</span></div></div></div>';
  }
  var previewHtml = rooms.slice(0,6).map(roomCard).join('');
  document.querySelector('#rooms .room-grid').innerHTML = previewHtml;
  document.getElementById('fullRoomGrid').innerHTML = rooms.map(roomCard).join('');

  // ---------- INTERNAL PAGE NAV ----------
  function openPage(id){
    document.getElementById(id).classList.add('open');
    document.body.style.overflow = 'hidden';
    document.getElementById(id).scrollTop = 0;
  }
  function closePage(id){
    document.getElementById(id).classList.remove('open');
    document.body.style.overflow = '';
  }
  document.getElementById('verHabitacionesBtn').addEventListener('click', function(e){ e.preventDefault(); openPage('pageHabitaciones'); });
  document.getElementById('verTodasBtn').addEventListener('click', function(e){ e.preventDefault(); openPage('pageHabitaciones'); });
  document.getElementById('openManualBtn').addEventListener('click', function(){ openPage('pageManual'); });
  document.getElementById('personalAccessBtn').addEventListener('click', function(e){ e.preventDefault(); openPage('pagePersonal'); });
  document.getElementById('personalAccessBtn2').addEventListener('click', function(e){ e.preventDefault(); openPage('pagePersonal'); });
  document.querySelectorAll('[data-close]').forEach(function(btn){
    btn.addEventListener('click', function(){ closePage(btn.getAttribute('data-close')); });
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){
      ['pageHabitaciones','pageManual','pagePersonal'].forEach(closePage);
    }
  });

  // ---------- EXPLORA CAUCASIA MAP ----------
  var places = [
    {name:"Hotel Herco", cat:"herco", x:50, y:52, herco:true, desc:"Su punto de partida para explorar Caucasia."},
    {name:"Restaurante El Puerto", cat:"restaurantes", x:30, y:35, desc:"Cocina local frente al río Cauca."},
    {name:"Parrilla Central", cat:"restaurantes", x:65, y:30, desc:"Carnes a la parrilla, ambiente familiar."},
    {name:"Malecón del Cauca", cat:"naturaleza", x:22, y:60, desc:"Paseo junto al río, ideal al atardecer."},
    {name:"Ciénaga cercana", cat:"naturaleza", x:78, y:68, desc:"Reserva natural a minutos del centro."},
    {name:"Centro Comercial Caucasia", cat:"compras", x:60, y:22, desc:"Tiendas, ropa y artículos varios."},
    {name:"Cine y juegos", cat:"entretenimiento", x:40, y:75, desc:"Entretenimiento familiar en el centro."},
    {name:"Parque principal", cat:"interes", x:48, y:40, desc:"El corazón histórico de la ciudad."},
    {name:"Parque infantil", cat:"familia", x:35, y:20, desc:"Espacio ideal para ir con los más pequeños."},
    {name:"Zona de bares", cat:"noche", x:70, y:55, desc:"Vida nocturna y música en vivo los fines de semana."},
    {name:"El mirador escondido", cat:"easter", x:82, y:30, desc:"Un secreto local con una de las mejores vistas de Caucasia."}
  ];

  var mapEl = document.getElementById('exploraMap');
  places.forEach(function(p, i){
    var pin = document.createElement('div');
    pin.className = 'pin' + (p.herco ? ' herco' : '');
    pin.style.left = p.x + '%';
    pin.style.top = p.y + '%';
    pin.dataset.cat = p.cat;
    pin.dataset.idx = i;
    pin.title = p.name;
    pin.setAttribute('role','button');
    pin.setAttribute('tabindex','0');
    pin.setAttribute('aria-label', p.name);
    mapEl.appendChild(pin);
  });

  var pins = mapEl.querySelectorAll('.pin');
  var placeCard = document.getElementById('placeCard');

  function showPlace(idx){
    var p = places[idx];
    document.getElementById('pcName').textContent = p.name;
    document.getElementById('pcDesc').textContent = p.desc;
    document.getElementById('pcCat').textContent = p.herco ? 'Hotel Herco' : p.cat;
    placeCard.classList.add('show');
  }
  pins.forEach(function(pin, i){
    pin.addEventListener('click', function(){ showPlace(i); });
    pin.addEventListener('keydown', function(e){ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); showPlace(i);} });
  });
  document.getElementById('placeCardClose').addEventListener('click', function(){ placeCard.classList.remove('show'); });
  document.getElementById('pcRoute').addEventListener('click', function(){ alert('La navegación en vivo requiere acceso a GPS del navegador y no está disponible en esta vista previa.'); });
  document.getElementById('pcRouteHerco').addEventListener('click', function(){ alert('La navegación en vivo requiere acceso a GPS del navegador y no está disponible en esta vista previa.'); });

  document.querySelectorAll('.cat-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      document.querySelectorAll('.cat-btn').forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      var cat = btn.dataset.cat;
      pins.forEach(function(pin){
        var show = (cat === 'todos') || (pin.dataset.cat === cat) || pin.classList.contains('herco');
        pin.classList.toggle('hidden', !show);
      });
      placeCard.classList.remove('show');
    });
  });

  // ---------- MUSIC CONTROL ----------
  var musicFab = document.getElementById('musicFab');
  var musicIcon = document.getElementById('musicIcon');
  var playing = false;
  var audioCtx = null, osc = null, gainNode = null;
  function startAmbient(){
    try{
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      osc = audioCtx.createOscillator();
      gainNode = audioCtx.createGain();
      osc.type = 'sine'; osc.frequency.value = 220;
      gainNode.gain.value = 0.0001;
      osc.connect(gainNode); gainNode.connect(audioCtx.destination);
      osc.start();
      gainNode.gain.exponentialRampToValueAtTime(0.02, audioCtx.currentTime + 1);
    }catch(e){}
  }
  function stopAmbient(){
    if(osc){ try{ osc.stop(); osc.disconnect(); }catch(e){} osc=null; }
    if(audioCtx){ try{ audioCtx.close(); }catch(e){} audioCtx=null; }
  }
  musicFab.addEventListener('click', function(){
    playing = !playing;
    musicFab.classList.toggle('playing', playing);
    musicFab.setAttribute('aria-pressed', playing ? 'true' : 'false');
    musicFab.setAttribute('aria-label', playing ? 'Pausar música ambiente' : 'Reproducir música ambiente');
    musicIcon.innerHTML = playing ? '<rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/>' : '<path d="M8 5v14l11-7z"/>';
    if(playing){ startAmbient(); localStorage.setItem('herco_music','on'); }
    else { stopAmbient(); localStorage.setItem('herco_music','off'); }
  });

  // ---------- PREFERENCES PANEL ----------
  var prefsFab = document.getElementById('prefsFab');
  var prefsPanel = document.getElementById('prefsPanel');
  prefsFab.addEventListener('click', function(e){
    e.stopPropagation();
    var open = prefsPanel.classList.toggle('open');
    prefsFab.setAttribute('aria-expanded', open ? 'true':'false');
  });
  document.addEventListener('click', function(e){
    if(!prefsPanel.contains(e.target) && e.target !== prefsFab){
      prefsPanel.classList.remove('open');
      prefsFab.setAttribute('aria-expanded','false');
    }
  });

  function applyPref(group, val){
    if(group === 'text'){ document.body.setAttribute('data-text', val); }
    if(group === 'theme'){ document.body.setAttribute('data-theme', val); }
    if(group === 'contrast'){ document.body.setAttribute('data-contrast', val); }
    if(group === 'vision'){ document.body.setAttribute('data-vision', val); }
    try{ localStorage.setItem('herco_pref_'+group, val); }catch(e){}
  }
  document.querySelectorAll('.seg').forEach(function(seg){
    var group = seg.dataset.group;
    seg.querySelectorAll('button').forEach(function(btn){
      btn.addEventListener('click', function(){
        seg.querySelectorAll('button').forEach(function(b){ b.classList.remove('active'); });
        btn.classList.add('active');
        applyPref(group, btn.dataset.val);
      });
    });
  });
  document.getElementById('prefsReset').addEventListener('click', function(){
    ['text','theme','contrast','vision'].forEach(function(g){
      var seg = document.querySelector('.seg[data-group="'+g+'"]');
      seg.querySelectorAll('button').forEach(function(b,i){ b.classList.toggle('active', i===0); });
    });
    applyPref('text','normal'); applyPref('theme','light'); applyPref('contrast','normal'); applyPref('vision','normal');
  });

  // ---------- RESTORE PREFERENCES ----------
  try{
    ['text','theme','contrast','vision'].forEach(function(g){
      var v = localStorage.getItem('herco_pref_'+g);
      if(v){
        applyPref(g, v);
        var seg = document.querySelector('.seg[data-group="'+g+'"]');
        if(seg){
          seg.querySelectorAll('button').forEach(function(b){ b.classList.toggle('active', b.dataset.val === v); });
        }
      }
    });
  }catch(e){}

  // ---------- WEB INTERNA: MÓDULOS (MODO PRUEBA) ----------
  var moduleInfo = {
    mant: {
      eyebrow: "Módulo A",
      title: "Mantenimientos",
      body: "Cada actividad (aires acondicionados, extintores, lámparas, camas, televisores, ventiladores, pintura...) tendrá una lista de ítems con barra de progreso o barra numérica según corresponda, botón REPARAR con animación de confirmación, historial y archivos de soporte."
    },
    manuales: {
      eyebrow: "Módulo B",
      title: "Manuales de procesos y procedimientos",
      body: "Documentación interna organizada por categorías, con procedimientos, archivos adjuntos, búsqueda de contenidos y control de activo/inactivo."
    },
    facturas: {
      eyebrow: "Módulo C",
      title: "Facturas y pedidos",
      body: "Registro de facturas, pedidos y proveedores con fechas, valores, estados y documentos de soporte cargados de forma segura."
    },
    insumos: {
      eyebrow: "Módulo D",
      title: "Registro de insumos",
      body: "Entradas y salidas de insumos (bolsas de cobijas, tarjetas de bienvenida, etiquetas y otros que se agreguen), con existencias, responsables e historial."
    },
    editorpublica: {
      eyebrow: "Módulo E",
      title: "Editor de web pública",
      body: "CMS propio de Hotel Herco: Home, Habitaciones, Explora Caucasia, Servicios y Manual del huésped, con borradores y publicación sin tocar código."
    },
    editorprivada: {
      eyebrow: "Módulo F",
      title: "Editor de web privada interna",
      body: "Administra únicamente lo configurable de este panel interno: textos, avisos, accesos rápidos, widgets y orden de módulos del dashboard."
    },
    usuarios: {
      eyebrow: "Módulo G",
      title: "Gestión de usuarios y accesos",
      body: "Creación de usuarios, asignación de roles (Administrador, Personal, Recepción) y permisos, restablecimiento de credenciales y consulta de actividad."
    }
  };

  var dashDetail = document.getElementById('dashDetail');
  if(dashDetail){
    var dashCards = document.querySelectorAll('.dash-card');
    dashCards.forEach(function(card){
      card.addEventListener('click', function(){
        dashCards.forEach(function(c){ c.classList.remove('active'); });
        card.classList.add('active');
        var info = moduleInfo[card.dataset.mod];
        document.getElementById('dashDetailEyebrow').textContent = info.eyebrow;
        document.getElementById('dashDetailTitle').textContent = info.title;
        document.getElementById('dashDetailBody').textContent = info.body;
        dashDetail.classList.add('show');
        dashDetail.scrollIntoView({ behavior:'smooth', block:'nearest' });
      });
    });
    document.getElementById('dashDetailClose').addEventListener('click', function(){
      dashDetail.classList.remove('show');
      dashCards.forEach(function(c){ c.classList.remove('active'); });
    });
  }
})();
