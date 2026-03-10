document.addEventListener("DOMContentLoaded", function () {
  // Elementos del DOM
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  const container = document.getElementById("variablesContainer");
  const paginationContainer = document.getElementById("pagination");
  const processSelect = document.getElementById("processSelect");
  const temaSelect = document.getElementById("temaSelect");
  const clearFiltersBtn = document.getElementById("clearFiltersBtn");
  const itemsPerPageSelect = document.getElementById("itemsPerPage");
  const unidadSection = document.getElementById("unidadAdministrativaSection");
  const sortSelect = document.getElementById("sortOptions");
  const alinMdeaCheckbox = document.getElementById("alinMdeaCheckbox");
  const alinOdsCheckbox = document.getElementById("alinOdsCheckbox");
  const radioSocio = document.getElementById("infoDemografica");
  const radioEco = document.getElementById("infoEconomica");
  const relTabCheckbox = document.getElementById("relTabCheckbox");
  const relMicroCheckbox = document.getElementById("relMicroCheckbox");
  const chkRelAbiertos = document.getElementById("chkRelAbiertos");

  // URL base de la nueva API (Relativa)
  const API_BASE_URL = "/api";

  // Variables globales
  let allData = [];
  let currentFilteredData = [];
  window.clasificacionesGlobal = [];
  window.procesosGlobal = [];
  window.fuentesGlobal = [];
  window.odsGlobal = [];
  window.mdeasGlobal = [];
  window.clasifIndex = new Map();

  const params = new URLSearchParams(window.location.search);
  let itemsPerPage = parseInt(15);
  let currentPage = 1;
  let lastSubmittedTerm = null;
  let currentSearchTerm = "";

  window.renderLocked = false;
  window.initialPaintDone = false;

  // Filtro por unidad: 'todas' | 'socio' | 'eco'
  let unidadFiltro = 'todas';

  // Apartado de filtros colapsables
  const toggleBtn = document.querySelector('[data-bs-target="#procCollapse"]');
  const collapseEl = document.getElementById('procCollapse');
  const labelEl = toggleBtn?.querySelector('.collapse-label');

  if (collapseEl && toggleBtn && labelEl) {
    collapseEl.addEventListener('shown.bs.collapse', () => { labelEl.textContent = 'Ocultar'; });
    collapseEl.addEventListener('hidden.bs.collapse', () => { labelEl.textContent = 'Mostrar'; });
  }

  const toggleUnidadBtn = document.querySelector('[data-bs-target="#unidadCollapse"]');
  const unidadCollapseEl = document.getElementById('unidadCollapse');
  const unidadLabel = toggleUnidadBtn?.querySelector('.collapse-label-unidad');
  if (unidadCollapseEl && unidadLabel) {
    unidadCollapseEl.addEventListener('shown.bs.collapse', () => unidadLabel.textContent = 'Ocultar');
    unidadCollapseEl.addEventListener('hidden.bs.collapse', () => unidadLabel.textContent = 'Mostrar');
  }

  // ==========================================
  // FUNCIÓN CENTRAL: CRUCE DE VARIABLES Y PROCESOS
  // ==========================================
  function getUnidadDeVariable(variable) {
    // 1. Asegurarnos de tener el acrónimo
    let acronimoVar = (variable.acronimo || variable.idPp || "").trim().toUpperCase();
    if (!acronimoVar && variable.id_a) acronimoVar = String(variable.id_a).split("-")[0].toUpperCase();
    if (!acronimoVar && variable.id_s) acronimoVar = String(variable.id_s).split("-")[0].toUpperCase();
    if (!acronimoVar && variable.idVar) acronimoVar = String(variable.idVar).split("-")[0].toUpperCase();

    // 2. Buscar proceso por acrónimo
    const proceso = (window.procesosGlobal || []).find(p =>
      (p.acronimo || p.idPp || "").trim().toUpperCase() === acronimoVar
    );

    // 3. Revisar el campo "unidad"
    if (proceso && proceso.unidad) {
      const unidadStr = String(proceso.unidad).toLowerCase();
      if (unidadStr.includes("económica") || unidadStr.includes("economica")) {
        return "eco";
      }
    }
    return "socio"; // Por defecto, si no se encuentra o es otra unidad
  }

  function filterByUnidad(data) {
    if (!Array.isArray(data)) return [];
    if (unidadFiltro === 'todas') return data;
    return data.filter(v => getUnidadDeVariable(v) === unidadFiltro);
  }

  // ==========================================
  // CARGA DE DATOS INICIALES
  // ==========================================
  async function cargarDatosIniciales() {
    try {
      const loader = document.getElementById("loader");
      const mainContent = document.getElementById("mainContent");

      if (loader) loader.style.display = "flex";
      if (mainContent) mainContent.style.display = "none";

      const [
        variablesRes,
        clasificacionesRes,
        procesosRes,
        fuentesRes,
        odsRes,
        mdeasRes
      ] = await Promise.all([
        fetch(`${API_BASE_URL}/variables`),
        fetch(`${API_BASE_URL}/clasificaciones`),
        fetch(`${API_BASE_URL}/procesos`),
        fetch(`${API_BASE_URL}/fuentes`),
        fetch(`${API_BASE_URL}/ods`),
        fetch(`${API_BASE_URL}/mdeas`)
      ]);

      if (!variablesRes.ok) throw new Error("Fallo al cargar la API de variables");

      const variablesRaw = await variablesRes.json();
      window.clasificacionesGlobal = clasificacionesRes.ok ? await clasificacionesRes.json() : [];
      window.procesosGlobal = procesosRes.ok ? await procesosRes.json() : [];
      window.fuentesGlobal = fuentesRes.ok ? await fuentesRes.json() : [];
      window.odsGlobal = odsRes.ok ? await odsRes.json() : [];
      window.mdeasGlobal = mdeasRes.ok ? await mdeasRes.json() : [];

      console.log("Variables cargadas:", variablesRaw.length);
      console.log("Procesos cargados:", window.procesosGlobal.length);
      console.log("Clasificaciones cargadas:", window.clasificacionesGlobal.length);

      // Normalizar procesos: asegurar acrónimos en mayúsculas para el cruce
      window.procesosGlobal = (window.procesosGlobal || []).map(p => {
        const acr = p.acronimo || p.acr || p.idPp || p.id_pp || p.codigo || p.id || "";
        const idPp = acr || p.id || "";
        const pp = p.pp || p.proceso || p.nombre || acr || "No disponible";
        return {
          ...p,
          acronimo: String(acr).trim().toUpperCase(),
          idPp: String(idPp).trim().toUpperCase(),
          pp: pp
        };
      });

      rebuildClasifIndex();

      // Mapeo adaptado de variables
      allData = variablesRaw.map(v => {
        let acr = (v.acronimo || v.procesoAcronimo || v.acronimoPp || '').trim().toUpperCase();
        if (!acr && v.id_a) acr = String(v.id_a).split("-")[0].toUpperCase();
        if (!acr && v.id_s) acr = String(v.id_s).split("-")[0].toUpperCase();

        const idVarRaw = v.id_s || v.id_a || v.acronimo || "SD";
        
        return {
          idVar: String(idVarRaw).trim(),
          acronimo: acr,
          idPp: acr, // Usamos el acrónimo como ID del proceso para el cruce
          id_a: v.id_a,
          id_s: v.id_s,
          id_fuente: v.id_fuente,

          variable: v.variable_a || "Nombre no disponible",
          variableFuente: v.variable_s || "Nombre no disponible",
          pregunta: v.pregunta || v.pregunta_s || v.pregunta_a || "Sin pregunta definida",
          definicion: v.definicion || v.definicion_s || v.definicion_a || "Sin definición",
          universo: v.universo || "No especificado",

          tema: v.tema1 || v.tema_1 || v.temaPrincipal || v.tema || "-",
          subtema: v.subtema1 || v.subtema_1 || v.subtemaPrincipal || v.subtema || "-",
          tema2: v.tema2 || v.tema_2 || v.temaSecundario || v.tema_alterno || "",
          subtema2: v.subtema2 || v.subtema_2 || v.subtemaSecundario || "",
          tematica: v.tematica || v.universo || "-",

          anio_referencia: v.anio_referencia || v.anioReferencia || "No disponible",
          url: v.url || v.liga || null,

          ods: v.ods === true,
          mdea: v.mdea === true,
          tabulados: v.tabulados === true,
          datosabiertos: v.datosabiertos === true,
          microdatos: v.microdatos || v.microdato || "No",

          comentario: v.comentario_s || v.comentario_a || v.comentario || "",
          _raw: v
        };
      });

      // Anexar clasificación principal
      allData.forEach(v => {
        const list = window.clasifIndex.get(String(v.idVar)) || [];
        v.clasificacion = list.length ? String(list[0]) : "";
      });

      // Poblar el select de procesos para la UI
      if (processSelect) {
        processSelect.innerHTML = "";
        const ppsConVars = new Set(allData.map(v => v.acronimo).filter(x => x));

        const procs = window.procesosGlobal
          .filter(p => ppsConVars.has(p.acronimo))
          .sort((a, b) => a.pp.localeCompare(b.pp));

        procs.forEach(p => {
          const opt = document.createElement("option");
          opt.value = p.acronimo;
          opt.text = p.pp;
          processSelect.appendChild(opt);
        });
      }

      currentFilteredData = [...allData];
      renderPage(currentFilteredData, currentPage);
      setupPagination(currentFilteredData);

      if (loader) loader.style.display = "none";
      if (mainContent) mainContent.style.display = "";

      hideCounterSpinner();
      aplicarFiltroDesdeURL();

    } catch (error) {
      console.error("Error al cargar las APIs unificadas:", error);
      const loader = document.getElementById("loader");
      if (loader) {
        loader.innerHTML = `
           <div class="alert alert-danger m-4">
               <strong>Error de conexión:</strong> ${error.message}
           </div>`;
      }
    }
  }

  // ==========================================
  // LÓGICA DE FILTRADO Y ACTUALIZACIÓN UI
  // ==========================================
  function hasMicrodatos(v) { return v.microdatos && v.microdatos.toLowerCase() !== "no"; }
  function hasDatosAbiertos(v) { return v.datosabiertos === true; }

  function applyFilters() {
    let filteredData = filterByUnidad(allData);

    const selectedTema = temaSelect?.value;
    if (selectedTema && selectedTema !== "Seleccione una temática") {
      filteredData = filteredData.filter(v => (v.tema === selectedTema) || (v.tema2 === selectedTema));
    }

    const selectedProcesses = Array.from(processSelect?.selectedOptions || []).map(o => o.value);
    if (selectedProcesses.length > 0) {
      filteredData = filteredData.filter(v => selectedProcesses.includes(v.acronimo));
    }

    if (relTabCheckbox?.checked || relMicroCheckbox?.checked || chkRelAbiertos?.checked) {
      filteredData = filteredData.filter(v => {
        const okTab = relTabCheckbox.checked ? v.tabulados : true;
        const okMicro = relMicroCheckbox.checked ? hasMicrodatos(v) : true;
        const okAbiertos = chkRelAbiertos.checked ? hasDatosAbiertos(v) : true;
        return okTab && okMicro && okAbiertos;
      });
    }

    if (alinMdeaCheckbox?.checked || alinOdsCheckbox?.checked) {
      filteredData = filteredData.filter(v => {
        const okMdea = alinMdeaCheckbox.checked ? v.mdea : true;
        const okOds = alinOdsCheckbox.checked ? v.ods : true;
        return okMdea && okOds;
      });
    }

    currentSearchTerm = (searchInput?.value || "").trim();
    const needle = currentSearchTerm.toLowerCase();

    if (needle) {
      filteredData = filteredData.filter(v => {
        const f =
          (v.universo && v.universo.toLowerCase().includes(needle)) ||
          (v.tema && v.tema.toLowerCase().includes(needle)) ||
          (v.tema2 && v.tema2.toLowerCase().includes(needle)) ||
          (v.subtema && v.subtema.toLowerCase().includes(needle)) ||
          (v.subtema2 && v.subtema2.toLowerCase().includes(needle)) ||
          (v.pregunta && v.pregunta.toLowerCase().includes(needle)) ||
          (v.variableFuente && v.variableFuente.toLowerCase().includes(needle)) ||
          (v.definicion && v.definicion.toLowerCase().includes(needle)) ||
          (v.variable && v.variable.toLowerCase().includes(needle));

        if (f) return true;

        const list = window.clasifIndex.get(String(v.idVar)) || [];
        return list.some(c => (c || "").toLowerCase().includes(needle));
      });
    }

    filteredData = sortVariablesAZ(filteredData);
    currentFilteredData = filteredData;
    currentPage = 1;
    renderPage(currentFilteredData, currentPage);
    setupPagination(currentFilteredData);
  }

  function onUnidadChange({ preserveSearch = true, preserveTema = true } = {}) {
    const prevTerm = (searchInput.value || "").trim();
    const prevTema = temaSelect.value || "";

    unidadFiltro = radioSocio.checked ? 'socio' : (radioEco.checked ? 'eco' : 'todas');

    let allowedSet = null;
    if (unidadFiltro !== 'todas') {
      allowedSet = new Set((window.procesosGlobal || [])
        .filter(p => {
          const uStr = String(p.unidad || "").toLowerCase();
          const isEco = uStr.includes("económica") || uStr.includes("economica");
          return unidadFiltro === 'eco' ? isEco : !isEco;
        })
        .map(p => p.acronimo));
    }

    Array.from(processSelect.options).forEach(opt => {
      const allowed = (unidadFiltro === 'todas') ? true : (allowedSet ? allowedSet.has(opt.value) : true);
      opt.hidden = !allowed;
      if (!allowed && opt.selected) opt.selected = false;
    });

    if (!preserveSearch) {
      searchInput.value = "";
      currentSearchTerm = "";
      lastSubmittedTerm = null;
    } else {
      searchInput.value = prevTerm;
      currentSearchTerm = prevTerm;
    }

    repoblarTematicas();

    if (preserveTema && prevTema && Array.from(temaSelect.options).some(o => o.value === prevTema)) {
      temaSelect.value = prevTema;
    } else if (!preserveTema) {
      temaSelect.selectedIndex = 0;
    }

    renderSelectedTags(Array.from(processSelect.selectedOptions));
    applyFilters();
  }

  // ==========================================
  // EVENT LISTENERS
  // ==========================================
  radioSocio?.addEventListener('change', () => onUnidadChange());
  radioEco?.addEventListener('change', () => onUnidadChange());
  relTabCheckbox?.addEventListener("change", applyFilters);
  relMicroCheckbox?.addEventListener("change", applyFilters);
  chkRelAbiertos?.addEventListener("change", applyFilters);
  alinMdeaCheckbox?.addEventListener("change", applyFilters);
  alinOdsCheckbox?.addEventListener("change", applyFilters);
  temaSelect?.addEventListener("change", applyFilters);

  itemsPerPageSelect?.addEventListener("change", function () {
    itemsPerPage = parseInt(this.value, 10);
    applyFilters();
  });

  sortSelect?.addEventListener("change", function () {
    applyFilters();
  });

  searchForm?.addEventListener("submit", function (e) {
    e.preventDefault();
    const term = (searchInput.value || "").trim();
    if (term === lastSubmittedTerm) return;
    lastSubmittedTerm = term;
    applyFilters();
  });

  processSelect?.addEventListener("change", () => {
    renderSelectedTags(Array.from(processSelect.selectedOptions));
    applyFilters();
  });

  clearFiltersBtn?.addEventListener("click", function () {
    currentSearchTerm = "";
    searchInput.value = "";
    lastSubmittedTerm = null;
    temaSelect.selectedIndex = 0;
    itemsPerPageSelect.selectedIndex = 0;
    sortSelect.selectedIndex = 0;

    Array.from(processSelect.options).forEach(option => {
      option.selected = false;
      option.hidden = false;
    });

    document.getElementById("processSelectContainer").innerHTML = "";
    if (relTabCheckbox) relTabCheckbox.checked = false;
    if (relMicroCheckbox) relMicroCheckbox.checked = false;
    if (chkRelAbiertos) chkRelAbiertos.checked = false;
    if (alinMdeaCheckbox) alinMdeaCheckbox.checked = false;
    if (alinOdsCheckbox) alinOdsCheckbox.checked = false;
    
    if (radioSocio) radioSocio.checked = false;
    if (radioEco) radioEco.checked = false;
    unidadFiltro = "todas";

    repoblarTematicas();
    applyFilters();

    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.replaceState({}, document.title, newUrl);
  });

  // Permitir selección múltiple solo con clic (sin Ctrl)
  processSelect?.addEventListener("mousedown", function (e) {
    e.preventDefault(); 
    const option = e.target;
    if (option && option.tagName === "OPTION") {
      option.selected = !option.selected;
      processSelect.dispatchEvent(new Event("change"));
    }
  });

  // ==========================================
  // HELPERS DE RENDERIZADO UI
  // ==========================================
  function sortVariablesAZ(data) {
    const sortVal = sortSelect?.value || "az";
    return [...data].sort((a, b) => {
      const nameA = (a.variable || "").toLowerCase();
      const nameB = (b.variable || "").toLowerCase();
      if (sortVal === "az") return nameA.localeCompare(nameB);
      if (sortVal === "za") return nameB.localeCompare(nameA);
      return 0;
    });
  }

  function repoblarTematicas() {
    if (!temaSelect) return;
    const prev = temaSelect.value;
    const base = filterByUnidad(allData);
    const setTemas = new Set();

    base.forEach(v => {
      if (v.tema && v.tema !== "-") setTemas.add(v.tema);
      if (v.tema2 && v.tema2 !== "-") setTemas.add(v.tema2);
    });

    const temas = Array.from(setTemas).sort((a, b) => a.localeCompare(b));
    temaSelect.innerHTML = '<option value="">Seleccione una temática</option>';
    temas.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t;
      opt.textContent = t;
      temaSelect.appendChild(opt);
    });

    if (prev && temas.includes(prev)) temaSelect.value = prev;
  }

  function renderSelectedTags(selectedOptions) {
    const chips = document.getElementById("processSelectContainer");
    if (!chips) return;
    chips.replaceChildren(); 
    selectedOptions.forEach((opt) => {
      const tag = document.createElement("span");
      tag.className = "badge bg-primary d-inline-flex align-items-center me-2 mb-1";
      tag.style.paddingRight = "0.5rem";
      tag.append(document.createTextNode(opt.text));

      const closeBtn = document.createElement("button");
      closeBtn.type = "button";
      closeBtn.className = "btn-close btn-close-white btn-sm ms-2";
      closeBtn.addEventListener("click", () => {
        opt.selected = false;
        processSelect.dispatchEvent(new Event("change"));
      });
      tag.append(closeBtn);
      chips.appendChild(tag);
    });
  }

  function updateVariableCounter(count) {
    const el = document.getElementById('totalVariables');
    if (el) el.textContent = String(count).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  function highlightTerm(text, term) {
    if (!term) return text;
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    return text.replace(regex, '<mark class="custom-highlight">$1</mark>');
  }

  function rebuildClasifIndex() {
    window.clasifIndex.clear();
    if (!window.clasificacionesGlobal) return;
    window.clasificacionesGlobal.forEach(row => {
      const id = String(row.ida || row.id_a || row.idVar || "").trim();
      const name = String(row.clase || row.clasificacion || row.clasificaciones || "").trim();
      if (!id || !name || name === "-") return;
      if (!window.clasifIndex.has(id)) window.clasifIndex.set(id, []);
      window.clasifIndex.get(id).push(name);
    });
  }

  function getClasificacionesPorVariableHighlighted(variable, term = "") {
    const id = String(variable.id_a || variable.id_s || variable.idVar || "").trim();
    const list = window.clasifIndex.get(id) || [];
    if (!list.length) return `<span class="text-muted ms-1">Sin clasificación</span>`;
    
    const htmlList = list.map(c => `<li style="margin-bottom: 2px;">${term ? highlightTerm(c, term) : c}</li>`).join("");
    return `<ul class="mb-0 ps-4 text-dark fw-normal" style="margin-top: 4px;">${htmlList}</ul>`;
  }
// Helper para pintar el nombre del componente MDEA
  function getMdeaComponentLabel(num) {
    const MDEA_COMPONENTS = {
      1: "Condiciones y calidad ambiental",
      2: "Recursos ambientales y su uso",
      3: "Residuos y actividades humanas relacionadas",
      4: "Eventos extremos y desastres",
      5: "Asentamientos humanos y salud ambiental",
      6: "Protección ambiental y participación ciudadana"
    };
    return MDEA_COMPONENTS[num] ? `${num}. ${MDEA_COMPONENTS[num]}` : `Componente ${num}`;
  }

  // ==========================================
  // RENDERIZADO DE LAS TARJETAS HTML (LISTADO)
  // ==========================================
  function renderPage(data, page) {
    if (!container) return;
    container.innerHTML = "";
    updateVariableCounter(data.length);

    if (data.length === 0) {
      if (paginationContainer) paginationContainer.innerHTML = "";
      container.innerHTML = `<div class="alert alert-warning text-center">No se encontraron variables con los filtros aplicados.</div>`;
      return;
    }

    const startIndex = (page - 1) * itemsPerPage;
    const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

    paginatedData.forEach((variable, index) => {
      const unit = getUnidadDeVariable(variable); // 'eco' o 'socio'
      const unitCls = (unit === 'eco') ? 'acc-eco' : 'acc-socio';

      const textoProc = variable.acronimo || '—';
      const badgeProcHTML = textoProc !== '—' ? `<span class="badge ms-2 bg-secondary">${textoProc}</span>` : '';

      const term = currentSearchTerm;
      const hVarAsig = highlightTerm(variable.variable, term);
      const hPregLit = highlightTerm(variable.pregunta, term);
      const hDefVar = highlightTerm(variable.definicion, term);
      const hNomVar = highlightTerm(variable.variableFuente, term);
      const huniverso = highlightTerm(variable.tematica, term);
      const hTema = highlightTerm(variable.tema, term);
      const hSubtema = highlightTerm(variable.subtema, term);
      const hTema2 = highlightTerm(variable.tema2, term);
      const hSubtema2 = highlightTerm(variable.subtema2, term);

      // 1. Lógica para "Consulta de datos en:"
      const activeTab = variable.tabulados;
      const activeMic = hasMicrodatos(variable);
      const activeAbt = variable.datosabiertos;

      const badgesRelacionHTML = `
        <span class="badge ${activeTab ? 'bg-success badge-tabulado' : 'bg-danger disabled'}" 
              style="cursor:${activeTab ? 'pointer' : 'default'};${!activeTab ? 'pointer-events:none;' : ''}" 
              data-idvar="${variable.idVar}" ${activeTab ? 'data-bs-toggle="modal" data-bs-target="#infoModal" data-type="tabulado"' : ''}>
          ${activeTab ? 'Tabulados' : 'Sin Tabulados'}
        </span>
        <span class="badge ${activeMic ? 'bg-success badge-microdatos' : 'bg-danger disabled'}" 
              style="cursor:${activeMic ? 'pointer' : 'default'};${!activeMic ? 'pointer-events:none;' : ''}" 
              data-idvar="${variable.idVar}" ${activeMic ? 'data-bs-toggle="modal" data-bs-target="#infoModal" data-type="microdatos"' : ''}>
          ${activeMic ? 'Microdatos' : 'Sin Microdatos'}
        </span>
        <span class="badge ${activeAbt ? 'bg-success badge-datosabiertos' : 'bg-danger disabled'}" 
              style="cursor:${activeAbt ? 'pointer' : 'default'};${!activeAbt ? 'pointer-events:none;' : ''}" 
              data-idvar="${variable.idVar}" ${activeAbt ? 'data-bs-toggle="modal" data-bs-target="#infoModal" data-type="datosabiertos"' : ''}>
          ${activeAbt ? 'Datos Abiertos' : 'Sin Datos Abiertos'}
        </span>
      `;

      // 2. Lógica para "Alineación ODS" cruzando con la api precargada
      let odsHTML = `<span class="badge bg-secondary disabled badge-ods" style="pointer-events:none;cursor:default;">Sin ODS</span>`;
      if (variable.ods) {
        const odsRecords = (window.odsGlobal || []).filter(o => String(o.idVar) === String(variable.idVar) || String(o.id_a) === String(variable.id_a));
        const odsNums = [...new Set(odsRecords.map(o => o.ods || o.objetivo).filter(n => n != null))].sort((a,b)=>a-b);
        
        if (odsNums.length > 0) {
           odsHTML = odsNums.map(n => `
            <img src="/assets/ODS${String(n * 10).padStart(4, "0")}_es.jpg" 
                 alt="ODS ${n}" class="ods-thumb badge-ods" 
                 data-idvar="${variable.idVar}" data-ods="${n}" 
                 data-type="ods" data-bs-toggle="modal" data-bs-target="#infoModal" 
                 title="ODS ${n}">
           `).join("");
        }
      }

      // 3. Lógica para "Alineación MDEA" cruzando con la api precargada
      let mdeaHTML = `<span class="badge bg-secondary disabled badge-mdea" style="pointer-events:none;cursor:default;">Sin MDEA</span>`;
      if (variable.mdea) {
        const mdeaRecords = (window.mdeasGlobal || []).filter(m => String(m.idVar) === String(variable.idVar) || String(m.id_a) === String(variable.id_a));
        const compNums = [...new Set(mdeaRecords.map(m => {
             const val = m.componente ?? m.compo ?? m.componenteNombre ?? m.componenteId ?? m.componenteCodigo;
             const match = String(val).match(/(\d{1,2})\b/);
             return match ? parseInt(match[1], 10) : null;
        }).filter(n => n != null))].sort((a,b)=>a-b);

        if (compNums.length > 0) {
            mdeaHTML = compNums.map(n => `
                <button type="button" class="btn mdea-chip mdea-chip--${n}" 
                        data-idvar="${variable.idVar}" data-mdea-comp="${n}" 
                        data-bs-toggle="modal" data-bs-target="#infoModal" 
                        title="Componente ${n}">
                  ${getMdeaComponentLabel(n)}
                </button>
            `).join("");
        }
      }

      const card = document.createElement('div');
      card.classList.add('accordion', 'mb-3');
      card.innerHTML = `
        <div class="accordion-item shadow-sm rounded-3 border-0 ${unitCls}">
          <h2 class="accordion-header custom-accordion-header" id="heading${index}">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}">
              <span class="var-nombre">${hVarAsig}</span>
              ${badgeProcHTML}
            </button>
          </h2>
          <div id="collapse${index}" class="accordion-collapse collapse" data-bs-parent="#variablesContainer">
            <div class="accordion-body">
              <div class="mb-2 text-muted" style="font-size: 0.85rem;">
                <i class="bi bi-calendar3"></i> <strong>Año de Referencia:</strong> ${variable.anio_referencia}
                <span class="badge bg-secondary ms-2">${variable.idVar}</span>
              </div>
              
              <div class="row g-3 mt-1">
                <div class="col-md-6">
                  <div class="mb-2">
                    <span class="fw-semibold text-secondary"><i class="bi bi-question-circle me-1"></i>Pregunta:</span>
                    <div class="ps-3"><p>${hPregLit}</p></div>
                  </div>
                  <div class="mb-2">
                    <span class="fw-semibold text-secondary"><i class="bi bi-list-check me-1"></i>Clasificación:</span>
                    <div>${getClasificacionesPorVariableHighlighted(variable, term)}</div>
                  </div>
                  <div class="mb-2">
                    <span class="fw-semibold text-secondary"><i class="bi bi-info-circle me-1"></i>Definición:</span>
                    <div class="ps-3">${hDefVar}</div>
                  </div>
                  <div class="mb-2">
                    <span class="fw-semibold text-secondary"><i class="bi bi-tag me-1"></i>Variable Fuente:</span>
                    <span class="text-dark ms-1 fw-normal">${hNomVar}</span>
                  </div>
                </div>
                
                <div class="col-md-6">
                  <div class="mb-2">
                    <span class="fw-semibold text-secondary"><i class="bi bi-diagram-3 me-1"></i>Categoría:</span>
                    <span class="text-dark ms-1 fw-normal">${huniverso}</span>
                  </div>
                  <div class="mb-2">
                    <span class="fw-semibold text-secondary"><i class="bi bi-layers me-1"></i>Temática:</span>
                    <div class="ps-3">
                      <span>Principal:</span> <span class="text-dark fw-normal">${hTema} / ${hSubtema}</span><br>
                      ${variable.tema2 ? `<span>Secundaria:</span> <span class="text-dark fw-normal">${hTema2} / ${hSubtema2}</span>` : ""}
                    </div>
                  </div>
                  
                  <div class="mb-2">
                    <span class="fw-semibold text-secondary">
                      <i class="bi bi-link-45deg me-1"></i>Consulta de datos en:
                    </span>
                    <div class="ps-3 d-flex flex-wrap gap-2 mt-1">
                      ${badgesRelacionHTML}
                    </div>
                  </div>

                  <div class="mb-2">
                    <span class="fw-semibold text-secondary mt-2">
                      <i class="bi bi-globe me-1"></i>Alineación con los ODS:
                    </span>
                    <div class="ps-3 d-flex flex-wrap gap-2 mt-1">
                      ${odsHTML}
                    </div>
                  </div>

                  <div class="mb-2">
                    <span class="fw-semibold text-secondary">
                      <i class="bi bi-tree me-1"></i>Alineación con el MDEA:
                    </span>
                    <div class="ps-3 d-flex flex-wrap gap-2 mt-1">
                      ${mdeaHTML}
                    </div>
                  </div>

                  ${variable.comentario ? `<div class="mb-2"><span class="fw-semibold text-secondary"><i class="bi bi-chat-left-text me-1"></i>Comentario:</span><div class="ps-3 text-dark">${variable.comentario}</div></div>` : ""}
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }
  // ==========================================
  // PAGINACIÓN
  // ==========================================
  function setupPagination(data) {
    if (!paginationContainer) return;
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(data.length / itemsPerPage);
    if (totalPages <= 1) return;

    const createLi = (text, targetPage, disabled = false, active = false) => {
      const li = document.createElement("li");
      li.className = `page-item ${disabled ? 'disabled' : ''} ${active ? 'active' : ''}`;
      const a = document.createElement("a");
      a.className = "page-link";
      a.href = "#";
      a.textContent = text;
      if (!disabled && !active) {
        a.style.backgroundColor = "#003057";
        a.style.color = "#fff";
        a.addEventListener("click", (e) => {
          e.preventDefault();
          currentPage = targetPage;
          renderPage(data, currentPage);
          setupPagination(data);
        });
      }
      li.appendChild(a);
      return li;
    };

    if (currentPage > 1) paginationContainer.appendChild(createLi("«", currentPage - 1));

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);
    if (end - start < 4) start = Math.max(1, end - 4);

    for (let i = start; i <= end; i++) {
      paginationContainer.appendChild(createLi(i, i, false, i === currentPage));
    }

    if (currentPage < totalPages) paginationContainer.appendChild(createLi("»", currentPage + 1));
  }

  // ==========================================
  // URL FILTERS / LOADERS / INIT
  // ==========================================
  let filtroURLAplicado = false;
  function aplicarFiltroDesdeURL() {
    if (filtroURLAplicado) return;
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get("search");

    if (searchParam && searchInput) {
      searchInput.value = searchParam;
      currentSearchTerm = searchParam;
      applyFilters();
    }
    filtroURLAplicado = true;
  }

  function showProcessSkeleton() {} 
  function showVariablesSkeleton() {}
  function showCounterSpinner() {}
  function showListSpinner() {}
  function hideCounterSpinner() {}
  function hideListSpinner() {}

  // Script para marcar el navbar
  const currentPath = window.location.pathname.split("/").pop();
  document.querySelectorAll(".navbar-nav .nav-link").forEach(link => {
    if (link.getAttribute("href") === currentPath) link.classList.add("active");
  });

  // Ejecución de inicialización
  cargarDatosIniciales();
});