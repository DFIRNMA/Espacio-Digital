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
    let acronimoVar = (variable.acronimo || variable.idPp || "").trim().toUpperCase();
    if (!acronimoVar && variable.id_a) acronimoVar = String(variable.id_a).split("-")[0].toUpperCase();
    if (!acronimoVar && variable.id_s) acronimoVar = String(variable.id_s).split("-")[0].toUpperCase();
    if (!acronimoVar && variable.idVar) acronimoVar = String(variable.idVar).split("-")[0].toUpperCase();

    const proceso = (window.procesosGlobal || []).find(p =>
      (p.acronimo || p.idPp || "").trim().toUpperCase() === acronimoVar
    );

    if (proceso && proceso.unidad) {
      const unidadStr = String(proceso.unidad).toLowerCase();
      if (unidadStr.includes("económica") || unidadStr.includes("economica")) {
        return "eco";
      }
    }
    return "socio"; 
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

      allData = variablesRaw.map(v => {
        let acr = (v.acronimo || v.procesoAcronimo || v.acronimoPp || '').trim().toUpperCase();
        if (!acr && v.id_a) acr = String(v.id_a).split("-")[0].toUpperCase();
        if (!acr && v.id_s) acr = String(v.id_s).split("-")[0].toUpperCase();

        const idVarRaw = v.id_s || v.id_a || v.acronimo || "SD";
        
        return {
          idVar: String(idVarRaw).trim(),
          acronimo: acr,
          idPp: acr,
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

      allData.forEach(v => {
        const list = window.clasifIndex.get(String(v.idVar)) || [];
        v.clasificacion = list.length ? String(list[0]) : "";
      });

      if (processSelect) {
        processSelect.innerHTML = "";
        const ppsConVars = new Set(allData.map(v => v.acronimo).filter(x => x));

        const procs = window.procesosGlobal
          .filter(p => ppsConVars.has(p.acronimo))
          .sort((a, b) => a.pp.localeCompare(b.pp));

        procs.forEach(p => {
          const opt = document.createElement("option");
          opt.value = p.acronimo;
          opt.text = `• ${p.pp} (${p.acronimo})`;
          processSelect.appendChild(opt);
        });
      }
    
      currentFilteredData = [...allData];
      currentFilteredData = sortVariablesAZ(currentFilteredData);
      
      const groupedBase = window.groupVariablesByName(currentFilteredData);
      
      renderPage(groupedBase, currentPage);
      setupPagination(groupedBase);

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
    
    const groupedFiltered = window.groupVariablesByName(currentFilteredData);
    
    renderPage(groupedFiltered, currentPage);
    setupPagination(groupedFiltered);
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

  function getClasificacionesPorVariableHighlighted(variableId, term = "") {
    const id = String(variableId || "").trim();
    const list = window.clasifIndex.get(id) || [];
    if (!list.length) return `<span class="text-muted ms-1">Sin clasificación</span>`;
    
    const htmlList = list.map(c => `<li style="margin-bottom: 2px;">${term ? highlightTerm(c, term) : c}</li>`).join("");
    return `<ul class="mb-0 ps-4 text-dark fw-normal" style="margin-top: 4px;">${htmlList}</ul>`;
  }

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

  function getOdsObjectiveNumber(val) {
    if (!val) return null;
    const match = String(val).match(/(\d{1,2})/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num >= 1 && num <= 17) return num; 
    }
    return null;
  }

  // ==========================================
  // HELPER PARA CREAR UN ID VERDADERAMENTE ÚNICO (ID + AÑO)
  // ==========================================
  window.getUniqueVarKey = function(v) {
    const baseId = String(v.id_a || v.id_s || v.idVar || "SD").trim();
    const year = String(v.anio_referencia || "NA").trim();
    return baseId + "_" + year;
  };

  // ==========================================
  // 1. AGRUPACIÓN (POR PROCESO + NOMBRE DE VARIABLE)
  // ==========================================
  window.groupVariablesByName = function(data) {
    const groups = {};
    
    data.forEach(v => {
      const rawId = String(v.id_a || v.id_s || v.idVar || "").trim();
      const idWithoutYear = rawId.replace(/-\d{4}$/, ""); 
      const groupKey = idWithoutYear || `${String(v.acronimo || "").trim().toUpperCase()}||${String(v.variable || "").trim().toLowerCase()}`;

      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(v);
    });

    return Object.values(groups).map(group => {
      const getYear = (vr) => {
        if (vr.anio_referencia && !isNaN(parseInt(vr.anio_referencia))) return parseInt(vr.anio_referencia);
        const idRaw = String(vr.id_a || vr.id_s || vr.idVar || "");
        const match = idRaw.match(/-(\d{4})$/); 
        return match ? parseInt(match[1]) : 0;
      };

      group.sort((a, b) => getYear(b) - getYear(a)); 
      
      return {
        name: group[0].variable, 
        variables: group,
        activeVar: group[0] 
      };
    });
  };

  // ==========================================
  // 2. CONSTRUCTOR DE LÍNEA DE TIEMPO
  // ==========================================
  function buildTimelineHTML(variables, activeKey, groupIndex) {
    const getYearStr = (v) => {
      if (v.anio_referencia && String(v.anio_referencia).trim() !== "No disponible") {
         return String(v.anio_referencia).trim();
      }
      const idRaw = String(v.id_a || v.id_s || v.idVar || "").trim();
      const match = idRaw.match(/-(\d{4})(?:-[A-Za-z0-9]+)?$/);
      if (match) return match[1];
      return 'N/A';
    };

    const sorted = [...variables].sort((a, b) => {
        const yA = parseInt(getYearStr(a)) || 0;
        const yB = parseInt(getYearStr(b)) || 0;
        return yA - yB; 
    });

    let html = `<div class="position-absolute" style="height: 3px; background: #cbd5e1; left: 25px; right: 25px; top: 21px; z-index: 0;"></div>`;
    
    sorted.forEach((v) => {
      // USAMOS LA LLAVE ÚNICA (ID + AÑO) PARA IDENTIFICAR EXACTAMENTE QUÉ NODO ES CUAL
      const currentKey = window.getUniqueVarKey(v);
      const isActive = (currentKey === String(activeKey));
      
      const year = getYearStr(v);
      
      const circleClass = isActive ? 'bg-success border-success text-white shadow' : 'bg-warning border-warning text-dark';
      const textColor = isActive ? '#15803d' : '#b45309';
      const iconHTML = isActive ? '<i class="bi bi-check-lg" style="font-size: 1.2rem;"></i>' : '<i class="bi bi-circle-fill" style="font-size: 0.65rem;"></i>';

      html += `
        <div class="d-flex flex-column align-items-center position-relative timeline-node" 
             style="cursor: pointer; min-width: 55px; z-index: 1; transition: transform 0.2s;" 
             onclick="window.handleTimelineClick(${groupIndex}, '${currentKey}')"
             title="Ver datos del año ${year}">
           <div class="rounded-circle d-flex align-items-center justify-content-center ${circleClass}" 
                style="width: 30px; height: 30px; border: 3px solid white; transition: all 0.2s;">
                ${iconHTML}
           </div>
           <div class="mt-2 small fw-bold" style="color: ${textColor}; font-size: 0.85rem;">${year}</div>
        </div>
      `;
    });
    return html;
  }

  // ==========================================
  // NUEVA FUNCIÓN GLOBAL PARA MANEJAR EL CLIC DE LA LÍNEA
  // ==========================================
  window.handleTimelineClick = function(groupIndex, clickedKey) {
    if (!window.currentPaginatedGroups || !window.currentPaginatedGroups[groupIndex]) return;
    
    const group = window.currentPaginatedGroups[groupIndex];
    
    // Buscamos la variable comparando la LLAVE ÚNICA
    const variable = group.variables.find(v => window.getUniqueVarKey(v) === clickedKey);
    
    if (variable) {
      group.activeVar = variable;

      const detailsContainer = document.getElementById(`variable-details-${groupIndex}`);
      if (detailsContainer) {
          detailsContainer.innerHTML = buildVariableDetailsHTML(variable, currentSearchTerm);
      }
      
      const timelineContainer = document.getElementById(`timeline-container-${groupIndex}`);
      if (timelineContainer) {
          timelineContainer.innerHTML = buildTimelineHTML(group.variables, clickedKey, groupIndex);
      }

      if (typeof initBootstrapTooltips === "function") {
         initBootstrapTooltips();
      }
    }
  };

  // ==========================================
  // 3. CONSTRUCTOR DE DETALLES DE VARIABLE
  // ==========================================
  function buildVariableDetailsHTML(variable, term) {
    const hPregLit = highlightTerm(variable.pregunta, term);
    const hDefVar = highlightTerm(variable.definicion, term);
    const hNomVar = highlightTerm(variable.variableFuente, term);
    const huniverso = highlightTerm(variable.tematica, term);
    const hTema = highlightTerm(variable.tema, term);
    const hSubtema = highlightTerm(variable.subtema, term);
    const hTema2 = highlightTerm(variable.tema2, term);
    const hSubtema2 = highlightTerm(variable.subtema2, term);

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

    let odsHTML = `<span class="badge bg-secondary disabled badge-ods" style="pointer-events:none;cursor:default;">Sin ODS</span>`;
    if (variable.ods) {
      const odsRecords = (window.odsGlobal || []).filter(o => String(o.idVar) === String(variable.idVar) || String(o.id_a) === String(variable.id_a));
      const odsNums = [...new Set(odsRecords.map(o => getOdsObjectiveNumber(o.ods || o.objetivo)).filter(n => n !== null))].sort((a,b)=>a-b);
      if (odsNums.length > 0) {
         odsHTML = odsNums.map(n => `
          <img src="/assets/ODS${String(n * 10).padStart(4, "0")}_es.jpg" alt="ODS ${n}" class="ods-thumb badge-ods" 
               data-idvar="${variable.idVar}" data-ods="${n}" data-type="ods" data-bs-toggle="modal" data-bs-target="#infoModal" title="ODS ${n}">
         `).join("");
      }
    }

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
              <button type="button" class="btn mdea-chip mdea-chip--${n}" data-idvar="${variable.idVar}" data-mdea-comp="${n}" 
                      data-bs-toggle="modal" data-bs-target="#infoModal" title="Componente ${n}">
                ${getMdeaComponentLabel(n)}
              </button>
          `).join("");
      }
    }

    // Textos de los tooltips (puedes editarlos si prefieres otra definición)
    const ttPregunta = "Pregunta literal formulada en el instrumento de captación.";
    const ttClasificacion = "Catálogos o agrupaciones con las que cuenta la variable.";
    const ttDefinicion = "Concepto o significado de la variable.";
    const ttVarFuente = "Nombre original de la variable en la base de datos fuente.";
    const ttUniverso = "Población o conjunto de elementos a los que va dirigida la variable.";
    const ttTematica = "Tema y subtema al que pertenece la variable.";

    return `
      <div class="mb-3 text-muted" style="font-size: 0.85rem;">
        <i class="bi bi-upc-scan me-1"></i> <strong style="cursor:help;" data-bs-toggle="tooltip" title="Identificador único de la variable">ID:</strong> <span class="badge bg-secondary">${variable.id_a || variable.idVar}</span>
        <span class="ms-3"><i class="bi bi-calendar3"></i> <strong style="cursor:help;" data-bs-toggle="tooltip" title="Año referenciado de la información">Año referenciado:</strong> <span class="badge bg-dark">${variable.anio_referencia || 'N/A'}</span></span>
      </div>
      <div class="row g-3">
        <div class="col-md-6">
          <div class="mb-2"><span class="fw-semibold text-secondary" style="cursor:help;" data-bs-toggle="tooltip" title="${ttPregunta}"><i class="bi bi-question-circle me-1"></i>Pregunta:</span><div class="ps-3"><p>${hPregLit}</p></div></div>
          <div class="mb-2"><span class="fw-semibold text-secondary" style="cursor:help;" data-bs-toggle="tooltip" title="${ttClasificacion}"><i class="bi bi-list-check me-1"></i>Clasificación:</span><div>${getClasificacionesPorVariableHighlighted(variable.idVar, term)}</div></div>
          <div class="mb-2"><span class="fw-semibold text-secondary" style="cursor:help;" data-bs-toggle="tooltip" title="${ttDefinicion}"><i class="bi bi-info-circle me-1"></i>Definición:</span><div class="ps-3">${hDefVar}</div></div>
          <div class="mb-2"><span class="fw-semibold text-secondary" style="cursor:help;" data-bs-toggle="tooltip" title="${ttVarFuente}"><i class="bi bi-tag me-1"></i>Variable Fuente:</span><span class="text-dark ms-1 fw-normal">${hNomVar}</span></div>
        </div>
        <div class="col-md-6">
          <div class="mb-2"><span class="fw-semibold text-secondary" style="cursor:help;" data-bs-toggle="tooltip" title="${ttUniverso}"><i class="bi bi-diagram-3 me-1"></i>Categoría:</span><span class="text-dark ms-1 fw-normal">${huniverso}</span></div>
          <div class="mb-2">
            <span class="fw-semibold text-secondary" style="cursor:help;" data-bs-toggle="tooltip" title="${ttTematica}"><i class="bi bi-layers me-1"></i>Temática:</span>
            <div class="ps-3">
              <span>Principal:</span> <span class="text-dark fw-normal">${hTema} / ${hSubtema}</span><br>
              ${variable.tema2 ? `<span>Secundaria:</span> <span class="text-dark fw-normal">${hTema2} / ${hSubtema2}</span>` : ""}
            </div>
          </div>
          <div class="mb-2"><span class="fw-semibold text-secondary"><i class="bi bi-link-45deg me-1"></i>Consulta de datos en:</span><div class="ps-3 d-flex flex-wrap gap-2 mt-1">${badgesRelacionHTML}</div></div>
          <div class="mb-2"><span class="fw-semibold text-secondary mt-2"><i class="bi bi-globe me-1"></i>Alineación con los ODS:</span><div class="ps-3 d-flex flex-wrap gap-2 mt-1">${odsHTML}</div></div>
          <div class="mb-2"><span class="fw-semibold text-secondary"><i class="bi bi-tree me-1"></i>Alineación con el MDEA:</span><div class="ps-3 d-flex flex-wrap gap-2 mt-1">${mdeaHTML}</div></div>
          ${variable.comentario ? `<div class="mb-2"><span class="fw-semibold text-secondary"><i class="bi bi-chat-left-text me-1"></i>Comentario:</span><div class="ps-3 text-dark">${variable.comentario}</div></div>` : ""}
        </div>
      </div>
    `;
  }

  // ==========================================
  // RENDERIZADO PRINCIPAL DE LA PÁGINA
  // ==========================================
  function renderPage(groupedData, page) {
    if (!container) return;
    container.innerHTML = "";
    
    if(typeof updateVariableCounter === "function") updateVariableCounter(groupedData.length);

    if (groupedData.length === 0) {
      if (paginationContainer) paginationContainer.innerHTML = "";
      container.innerHTML = `<div class="alert alert-warning text-center">No se encontraron variables con los filtros aplicados.</div>`;
      return;
    }

    const startIndex = (page - 1) * itemsPerPage;
    const paginatedGroups = groupedData.slice(startIndex, startIndex + itemsPerPage);

    window.currentPaginatedGroups = paginatedGroups;

    paginatedGroups.forEach((group, index) => {
      const v = group.activeVar; 
      
      const activeKey = window.getUniqueVarKey(v);
      
      const unitCls = (getUnidadDeVariable(v) === 'eco') ? 'acc-eco' : 'acc-socio';
      const hVarAsig = highlightTerm(group.name, currentSearchTerm);
      const textoProc = v.acronimo || '—';
      const badgeProcHTML = textoProc !== '—' ? `<span class="badge ms-2 bg-secondary">${textoProc}</span>` : '';

      const card = document.createElement('div');
      card.classList.add('accordion', 'mb-3');
      card.innerHTML = `
        <div class="accordion-item shadow-sm rounded-3 border-0 ${unitCls}">
          <h2 class="accordion-header custom-accordion-header" id="heading${index}">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}">
              <span class="var-nombre fw-bold">${hVarAsig}</span>
              ${badgeProcHTML}
            </button>
          </h2>
          <div id="collapse${index}" class="accordion-collapse collapse" data-bs-parent="#variablesContainer">
            <div class="accordion-body pb-4">
              
              <div class="timeline-container-wrapper mb-4 border-bottom pb-3">
                 <h6 class="text-muted mb-3"><i class="bi bi-clock-history me-1"></i> Línea del tiempo (Años disponibles):</h6>
                 <div id="timeline-container-${index}" class="d-flex align-items-center position-relative px-2 pt-2 pb-2" style="gap: 30px; overflow-x: auto; scrollbar-width: thin;">
                   ${buildTimelineHTML(group.variables, activeKey, index)}
                 </div>
              </div>

              <div id="variable-details-${index}">
                 ${buildVariableDetailsHTML(v, currentSearchTerm)}
              </div>

            </div>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  function initBootstrapTooltips() {
    if (typeof bootstrap === 'undefined' || !bootstrap.Tooltip) return;
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(el => new bootstrap.Tooltip(el));
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

    if (currentPage > 1) {
      paginationContainer.appendChild(createLi("Primera página", 1));
      if (currentPage >= 2) {
       paginationContainer.appendChild(createLi("«", currentPage - 1)); 
      }
    }

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);
    if (end - start < 4) start = Math.max(1, end - 4);

    for (let i = start; i <= end; i++) {
      paginationContainer.appendChild(createLi(i, i, false, i === currentPage));
    }

    if (currentPage < totalPages) {
      paginationContainer.appendChild(createLi("»", currentPage + 1));
      paginationContainer.appendChild(createLi("Última página", totalPages));
    }
  }

  // ==========================================
  // URL FILTERS / LOADERS / INIT
  // ==========================================
  let filtroURLAplicado = false;
  function aplicarFiltroDesdeURL() {
    if (filtroURLAplicado) return;
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get("search");
    const idPpParam = urlParams.get("idPp");

    if (searchParam && searchInput) {
      searchInput.value = searchParam;
      currentSearchTerm = searchParam;
    }

    if (idPpParam && processSelect) {
      processSelect.value = idPpParam.toUpperCase();
    }

    if (searchParam || idPpParam) {
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

  const currentPath = window.location.pathname.split("/").pop();
  document.querySelectorAll(".navbar-nav .nav-link").forEach(link => {
    if (link.getAttribute("href") === currentPath) link.classList.add("active");
  });

  cargarDatosIniciales();

  // ==========================================
  // LÓGICA DE MODALES (TABULADOS, MICRODATOS, ODS, MDEA)
  // ==========================================
  const ODS_COLORS = {
    "1": "#e5243b", "2": "#dda63a", "3": "#4c9f38", "4": "#c5192d", "5": "#ff3a21",
    "6": "#26bde2", "7": "#fcc30b", "8": "#a21942", "9": "#fd6925", "10": "#dd1367",
    "11": "#fd9d24", "12": "#bf8b2e", "13": "#3f7e44", "14": "#0a97d9", "15": "#56c02b",
    "16": "#00689d", "17": "#19486a"
  };

  function resetModalHeaderColor() {
    const modal = document.getElementById("infoModal");
    const header = modal?.querySelector(".modal-header");
    if (!header) return;
    modal.classList.remove("ods-active");
    header.style.backgroundColor = "";
    header.style.color = "";
  }

  function setOdsModalHeaderColor(odsNumber) {
    const modal = document.getElementById("infoModal");
    const header = modal?.querySelector(".modal-header");
    const color = ODS_COLORS[String(odsNumber)];
    if (!header || !color) return;
    modal.classList.add("ods-active");
    header.style.backgroundColor = color;
    header.style.color = "#ffffff";
  }

  document.getElementById("infoModal")?.addEventListener("hidden.bs.modal", () => {
    resetModalHeaderColor();
  });

  function getVariableByIdVar(idVar) {
    const normalizedId = String(idVar || "").trim().toUpperCase();
    if (!normalizedId) return null;
    return allData.find(v => {
      const idVariants = [v.idVar, v.id_a, v.id_s, v.idPp, v.acronimo];
      return idVariants.some(x => String(x || "").trim().toUpperCase() === normalizedId);
    });
  }

  function getVariableByAnyIdentifiers({idVar, id_a, id_s}) {
    const normalized = String(idVar || id_a || id_s || "").trim().toUpperCase();
    if (!normalized) return null;
    return allData.find(v => {
      const idVariants = [v.idVar, v.id_a, v.id_s, v.acronimo];
      return idVariants.some(x => String(x || "").trim().toUpperCase() === normalized);
    });
  }

  function ensureModalOpen() {
    const modalEl = document.getElementById("infoModal");
    if (!modalEl || typeof bootstrap === 'undefined') return;
    const instance = bootstrap.Modal.getOrCreateInstance(modalEl);
    instance.show();
  }

  const isExcelLike = v => typeof v === "string" && (v.toLowerCase().includes("xls") || v.toLowerCase().includes("xlsx"));
  const isInteractivo = v => typeof v === "string" && v.toLowerCase().includes("interactivo");
  const isVistaWeb = v => typeof v === "string" && v.toLowerCase().includes("vista web");

  function initTooltipsInModal() {
    const modal = document.getElementById('infoModal');
    if (!modal || typeof bootstrap === 'undefined') return;
    const tooltips = [].slice.call(modal.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltips.forEach(el => new bootstrap.Tooltip(el));
  }

  // ==========================================
  // EVENTO MAESTRO DE CLICS PARA ABRIR MODALES
  // ==========================================
  document.addEventListener("click", async function (e) {

    const matchIds = (id1, id2) => String(id1 || "").trim().toUpperCase() === String(id2 || "").trim().toUpperCase() && String(id1 || "").trim() !== "";

    // 1. TABULADOS
    const tabTrigger = e.target.closest(".badge-tabulado");
    if (tabTrigger && !tabTrigger.classList.contains("disabled")) {
      resetModalHeaderColor();
      document.getElementById("infoModalLabel").textContent = "Tabulado(s)";
      ensureModalOpen();
      const idVar = tabTrigger.getAttribute("data-idvar");
      const modalBody = document.getElementById("infoModalBody");
      modalBody.innerHTML = "<div class='text-center my-4'><div class='spinner-border text-primary'></div></div>";

      try {
        const variable = getVariableByIdVar(idVar);
        const raw = variable?._raw || {};

        if (Array.isArray(raw._tabuladosList) && raw._tabuladosList.length) {
          modalBody.innerHTML = raw._tabuladosList.map(t => {
            const excel = isExcelLike(t.tipo);
            const inter = isInteractivo(t.tipo);
            const metaLinea = t.hoja ? `<span class="tabulado-info text-end" data-bs-toggle="tooltip" title="Nombre de la hoja"><i class="bi bi-file-spreadsheet"></i> ${t.hoja}</span>` : "";
            const botonDerecha = t.urlDescarga ? `<a href="${t.urlDescarga}" target="_blank" class="btn-download ${excel ? 'btn-excel' : inter ? 'btn-interactivo' : 'btn-download-default'}">${excel ? '<i class="bi bi-filetype-xlsx me-1"></i> EXCEL' : '<i class="bi bi-download me-1"></i> Descargar'}</a>` : "";
            const botonAcceso = t.urlAcceso ? `<a href="${t.urlAcceso}" target="_blank" class="btn-link-inegi"><i class="bi bi-link-45deg me-1"></i> Ver en INEGI</a>` : "";

            const tipo = t.tipo || t.tipo_tab || t.tipoTab || "No especificado";
            const comentario = t.comentario_a || t.comentario || t.comentario_tab || t.comment || "";
            return `
              <div class="tabulado-card mb-2">
                <div class="tabulado-title">${t.tabulado || "Tabulado"}</div>
                <div class="tabulado-small text-muted mb-1">Tipo: ${tipo}${comentario ? ` | ${comentario}` : ""}</div>
                <div class="tabulado-actions">
                  <div class="ta-left">${botonAcceso}</div>
                  <div class="ta-right">
                    <div class="ta-right-buttons">${botonDerecha}</div>
                    <div>${metaLinea}</div>
                  </div>
                </div>
              </div>`;
          }).join("");
          initTooltipsInModal();
          return;
        }

        const resVarTab = await fetch('/api/variables_tabulados');
        const dataVarTab = await resVarTab.json();
        
        const relaciones = dataVarTab.filter(rel => {
          return matchIds(rel.id_a, variable.id_a) || matchIds(rel.idVar, variable.idVar) || matchIds(rel.idVar, idVar);
        });

        if (!relaciones.length) {
          modalBody.innerHTML = "<div class='text-danger'>No hay tabulados relacionados con esta variable en la base de datos.</div>";
          return;
        }

        const resTabulados = await fetch('/api/tabulados');
        const tabulados = await resTabulados.json();

        const contenido = relaciones.map(rel => {
          const relIdTab = rel.id_tabulado;
          const tab = tabulados.find(t => t.id_tabulado === relIdTab);

          if (!tab) return "";

          const tipo = tab.tipo || "No especificado";
          const titulo = tab.tabulado || "Tabulado";
          const ligaTab = tab.url_acceso || "";
          const ligaDesc = tab.url_descarga || "";
          const hoja = tab.hoja || "NA";
          const comentarioTab = tab.comentario_a || "";

          const excel = isExcelLike(tipo);
          const inter = isInteractivo(tipo);
          const vistaWeb = isVistaWeb(tipo);

          const metaLinea = hoja ? `<span class="tabulado-info text-end" data-bs-toggle="tooltip" title="Hoja"><i class="bi bi-file-spreadsheet"></i> ${hoja}</span>` : "";
          const botonDerecha = ligaDesc ? `<a href="${ligaDesc}" target="_blank" class="btn-download ${excel ? 'btn-excel' : inter ? 'btn-interactivo' : 'btn-download-default'}">${excel ? '<i class="bi bi-filetype-xlsx me-1"></i> EXCEL' : '<i class="bi bi-download me-1"></i> Descargar'}</a>` : "";
          const botonAcceso = ligaTab ? `<a href="${ligaTab}" target="_blank" class="btn-link-inegi"><i class="bi bi-link-45deg me-1"></i> Ver en INEGI</a>` : "";
          const botonWeb = (vistaWeb && ligaTab) ? `<a href="${ligaTab}" target="_blank" class="btn-web"><i class="bi bi-globe2 me-1"></i> Vista web</a>` : "";

          return `
            <div class="tabulado-card mb-2">
              <div class="tabulado-title">${titulo}</div>
              <div class="tabulado-small text-muted mb-1">Tipo: ${tipo} | Hoja: ${hoja}${comentarioTab ? ` | ${comentarioTab}` : ""}</div>
              <div class="tabulado-actions">
                <div class="ta-left">${botonAcceso} ${botonWeb}</div>
                <div class="ta-right">
                  <div class="ta-right-buttons">${botonDerecha}</div>
                  <div class="tabulado-info text-end">${metaLinea}</div>
                </div>
              </div>
            </div>`;
        }).join("");

        modalBody.innerHTML = contenido || "<div class='text-danger'>No hay ligas disponibles para los tabulados.</div>";
        initTooltipsInModal();

      } catch (error) {
        modalBody.innerHTML = "<div class='text-danger'>Error al cargar la información de tabulados.</div>";
      }
    }

    // 2. MICRODATOS
    const microTrigger = e.target.closest(".badge-microdatos");
    if (microTrigger && !microTrigger.classList.contains("disabled")) {
      resetModalHeaderColor();
      document.getElementById("infoModalLabel").textContent = "Microdatos";
      ensureModalOpen();
      const idVar = microTrigger.getAttribute("data-idvar");
      const modalBody = document.getElementById("infoModalBody");
      modalBody.innerHTML = "<div class='text-center my-4'><div class='spinner-border text-primary'></div></div>";

      try {
        const variable = getVariableByIdVar(idVar);
        const raw = variable?._raw || {};

        if (Array.isArray(raw._microdatosList) && raw._microdatosList.length) {
          modalBody.innerHTML = raw._microdatosList.map(m => {
            const urlAcceso = m.urlAcceso || m.url_acceso || m.ligaMicro || m.url_micro || "";
            const urlDescriptor = m.urlDescriptor || m.url_descriptor || m.ligaDesc || m.url_descriptor || "";
            const labelTabla = m.tabla || m.nom_tabla || m.tab || "Microdato";
            const labelCampo = m.campo || m.nom_campo || m.campo_nombre || "No especificado";
            const descriptor = m.descriptor || m.descripcion || "";
            const comentario = m.comentario_a || m.comentario || "";

            const btnAcceso = urlAcceso ? `<a href="${urlAcceso}" target="_blank" class="btn-link-inegi"><i class="bi bi-link-45deg me-1"></i> Abrir microdatos</a>` : "";
            const btnDescriptor = urlDescriptor ? `<a href="${urlDescriptor}" target="_blank" class="btn-download btn-zip"><i class="bi bi-file-earmark-text me-1"></i> Descriptor</a>` : "";
            const metaLinea = `<span class="tabulado-info text-end" data-bs-toggle="tooltip" title="Tabla"><i class="bi bi-table"></i> ${labelTabla}</span>`;

            return `
            <div class="tabulado-card mb-2">
              <div class="tabulado-title">${labelTabla}</div>
              <div class="tabulado-small text-muted mb-1">Campo: ${labelCampo}${descriptor ? ` | Descriptor: ${descriptor}` : ""}${comentario ? ` | ${comentario}` : ""}</div>
              <div class="tabulado-actions">
                <div class="ta-left">${btnAcceso}</div>
                <div class="ta-right">
                  <div class="ta-right-buttons">${btnDescriptor}</div>
                  <div class="tabulado-info text-end">${metaLinea}</div>
                </div>
              </div>
            </div>`;
          }).join("");
          initTooltipsInModal();
          return;
        }

        const res = await fetch(`/api/microdatos`);
        const data = await res.json();
        const arrayData = Array.isArray(data) ? data : [data];
        
        const matchingInfos = arrayData.filter(m => matchIds(m.idVar, idVar) || matchIds(m.id_a, variable.id_a));

        if (matchingInfos.length > 0) {
          modalBody.innerHTML = matchingInfos.map(info => {
            const urlAcceso = info.url_acceso ?? info.urlAcceso ?? info.liga_micro ?? info.ligaMicro ?? "";
            const urlDescriptor = info.url_descriptor ?? info.urlDescriptor ?? info.descriptor ?? "";
            const tabla = info.tabla ?? info.nom_tabla ?? info.nomTabla ?? "Microdato";
            const campo = info.campo ?? info.nom_campo ?? info.nomCampo ?? "No especificado";
            const descriptorText = info.descriptor ?? info.descripcion ?? "";
            const comentario = info.comentario_a ?? info.comentario ?? "";

            const botonAcceso = urlAcceso ? `<a href="${urlAcceso}" target="_blank" class="btn-link-inegi"><i class="bi bi-link-45deg me-1"></i> Ver en INEGI</a>` : "";
            const botonDescriptor = urlDescriptor ? `<a href="${urlDescriptor}" target="_blank" class="btn-download btn-zip"><i class="bi bi-file-earmark-text me-1"></i> Descriptor</a>` : "";
            const metaLinea = `<span class="tabulado-info text-end" data-bs-toggle="tooltip" title="Tabla"><i class="bi bi-table"></i> ${tabla}</span>`;

            return `
              <div class="tabulado-card mb-2">
                <div class="tabulado-title">${tabla}</div>
                <div class="tabulado-small text-muted mb-1">Campo: ${campo}${descriptorText ? ` | Descriptor: ${descriptorText}` : ""}${comentario ? ` | ${comentario}` : ""}</div>
                <div class="tabulado-actions">
                  <div class="ta-left">${botonAcceso}</div>
                  <div class="ta-right">
                    <div class="ta-right-buttons">${botonDescriptor}</div>
                    <div class="tabulado-info text-end">${metaLinea}</div>
                  </div>
                </div>
              </div>`;
          }).join("");
          initTooltipsInModal();
        } else {
          modalBody.innerHTML = "<div class='text-danger'>No hay información de microdatos disponible en la base de datos.</div>";
        }
      } catch (err) {
        modalBody.innerHTML = "<div class='text-danger'>Error al cargar la información de microdatos.</div>";
      }
    }

    // 3. DATOS ABIERTOS
    const datosTrigger = e.target.closest(".badge-datosabiertos");
    if (datosTrigger && !datosTrigger.classList.contains("disabled")) {
      resetModalHeaderColor();
      document.getElementById("infoModalLabel").textContent = "Datos Abiertos";
      ensureModalOpen();
      const idVar = datosTrigger.getAttribute("data-idvar");
      const modalBody = document.getElementById("infoModalBody");

      const variable = getVariableByIdVar(idVar);
      const raw = variable?._raw || {};

      if (Array.isArray(raw._datosAbiertosList) && raw._datosAbiertosList.length) {
        modalBody.innerHTML = raw._datosAbiertosList.map(r => `
          <div class="tabulado-card mb-2">
            <div class="tabulado-actions">
              <div class="ta-left">
                ${r.urlAcceso ? `<a href="${r.urlAcceso}" target="_blank" class="btn-link-inegi"><i class="bi bi-link-45deg me-1"></i> Ver en INEGI</a>` : ""}
              </div>
              <div class="ta-right">
                ${r.urlDescarga ? `<a href="${r.urlDescarga}" target="_blank" class="btn-download btn-web"><i class="bi bi-globe2 me-1"></i> Descargar</a>` : ""}
              </div>
            </div>
          </div>
        `).join("");
      } else {
        modalBody.innerHTML = "<div class='alert alert-info mb-0'>En proceso de captura o consulta directa en sitio.</div>";
      }
    }

    // 4. MDEA (Chips)
    const mdeaTrigger = e.target.closest(".mdea-chip");
    if (mdeaTrigger) {
      resetModalHeaderColor();
      ensureModalOpen();
      const idVar = mdeaTrigger.getAttribute("data-idvar");
      const compNum = parseInt(mdeaTrigger.getAttribute("data-mdea-comp"), 10);
      const modalBody = document.getElementById("infoModalBody");
      const modalTitle = document.getElementById("infoModalLabel");
      modalBody.innerHTML = "<div class='text-center my-4'><div class='spinner-border text-primary'></div></div>";

      try {
        const variable = getVariableByIdVar(idVar);
        
        const modal = document.getElementById("infoModal");
        if (modal) {
          modal.querySelector(".modal-header").style.background = (getUnidadDeVariable(variable) === "eco") ? "var(--eco)" : "var(--socio)";
          modal.querySelector(".modal-header").style.color = "white";
        }

        let registros = window.mdeasGlobal.filter(r => matchIds(r.idVar, idVar) || matchIds(r.id_a, variable.id_a));
        registros = registros.filter(r => {
          const val = r.componente ?? r.compo ?? r.componenteNombre ?? r.componenteId ?? r.componenteCodigo;
          const match = String(val).match(/(\d{1,2})\b/);
          return match && parseInt(match[1], 10) === compNum;
        });

        if (!registros.length) {
          modalBody.innerHTML = "<div class='text-danger'>No hay información del MDEA para esta variable.</div>";
          return;
        }

        const fmt = (s) => (s || "").toString().replace(/_/g, " ").replace(/-/g, " ").replace(/\s+/g, " ").trim();
        const compTitle = fmt(String(registros[0].componenteNombre ?? registros[0].componente ?? registros[0].compo ?? "").replace(/^\d+\s*/, "").replace(/\s*\d+$/, ""));
        
        modalTitle.textContent = `Componente ${compNum} — ${compTitle}`;

        modalBody.innerHTML = registros.map(info => {
          const sub = fmt(info.subcompo || info.subcomponente || info.subcomponenteNombre);
          const tema = fmt(info.topico || info.tema || info.temaNombre);
          const e1 = fmt(info.estAmbiental || info.estadistica1 || info.estadistica1Nombre);
          const e2 = fmt(info.estadistica2 || info.estadistica2Nombre);
          const line = (label, val) => (val && val !== "-" && val !== "null") ? `<div><strong>${label}:</strong> ${val}</div>` : "";
          
          return `
            <div class="mb-3 border-bottom pb-2">
              ${line("Subcomponente", sub)}
              ${line("Tema/Tópico", tema)}
              ${line("Estadística 1", e1)}
              ${line("Estadística 2", e2)}
            </div>
          `;
        }).join("");

      } catch (err) {
        modalBody.innerHTML = "<div class='text-danger'>Error al cargar la información del MDEA.</div>";
      }
    }

    // 5. ODS
    const odsTrigger = e.target.closest(".badge-ods");
    if (odsTrigger && !odsTrigger.classList.contains("disabled")) {
      resetModalHeaderColor();
      ensureModalOpen();
      const clickedOds = parseInt(odsTrigger.getAttribute("data-ods"), 10);
      const idVar = odsTrigger.getAttribute("data-idvar");
      
      const modalTitle = document.getElementById("infoModalLabel");
      const modalBody = document.getElementById("infoModalBody");
      
      setOdsModalHeaderColor(clickedOds);
      modalTitle.textContent = `Alineación ODS`;
      modalBody.innerHTML = "<div class='text-center my-4'><div class='spinner-border text-primary'></div></div>";

      try {
        const variable = getVariableByIdVar(idVar);

        let registros = window.odsGlobal.filter(o => matchIds(o.idVar, idVar) || matchIds(o.id_a, variable.id_a));
        registros = registros.filter(r => getOdsObjectiveNumber(r.ods || r.objetivo) === clickedOds);

        if (!registros.length) {
          modalBody.innerHTML = "<div class='text-danger'>No hay información de ODS para ese objetivo.</div>";
          return;
        }

        const cleanUnderscores = str => (str || "").toString().replace(/_/g, " ").replace(/\s+/g, " ").trim();
        const formatOdsComposite = val => {
          if (!val) return "-";
          const s = String(val).trim();
          if (s.includes(".")) return s;
          const digits = s.replace(/\D/g, "");
          if (digits.length <= 2) return String(parseInt(digits || "0", 10) || "-");
          const obj = String(parseInt(digits.slice(0, 2), 10));
          const rest = digits.slice(2).split("").join(".");
          return `${obj}.${rest}`;
        };

        const first = registros[0];
        const rawName = first.objetivo || first.objetivo || first.contribucion || "";
        const cleanName = cleanUnderscores(rawName.replace(/_\d+$/, "")); 
        modalTitle.textContent = `ODS ${clickedOds}. ${cleanName}`;

        modalBody.innerHTML = `<div class="list-group">` + registros.map(info => {
          const metaCode = cleanUnderscores(formatOdsComposite(info.meta));
          const indicatorCode = cleanUnderscores(formatOdsComposite(info.indicador));
          const metaLine = metaCode && metaCode !== "-" ? `<div class="small mb-1 text-primary fw-bold">Meta ${metaCode}</div>` : "";
          const indicadorLine = indicatorCode && indicatorCode !== "-" ? `<div class="small"><strong>Indicador ${indicatorCode}</strong></div>` : "";
          const contrib = cleanUnderscores(info.contribucion || "");
          const comentarios = cleanUnderscores(info.comentario_s || "");

          let detail = "";
          if (metaLine) detail += `<div>${metaLine}${cleanUnderscores(info.meta || "") ? `<div class='small text-dark mb-1'>${cleanUnderscores(info.meta || "")}</div>` : ""}</div>`;
          if (indicadorLine) detail += `<div>${indicadorLine}${cleanUnderscores(info.indicador || "") ? `<div class='small text-dark mb-1'>${cleanUnderscores(info.indicador || "")}</div>` : ""}</div>`;
          if (contrib) detail += `<div class='small text-secondary mt-1'><strong>Contribución:</strong> ${contrib}</div>`;
          if (comentarios) detail += `<div class='small text-secondary mt-1'><strong>Comentario:</strong> ${comentarios}</div>`;

          return `<div class="list-group-item bg-light border-0 mb-2 rounded shadow-sm">${detail || "<div class='small text-muted'>Datos ODS sin detalle.</div>"}</div>`;
        }).join("") + `</div>`;

      } catch (err) {
        modalBody.innerHTML = "<div class='text-danger'>Error al cargar la información de ODS.</div>";
      }
    }

  });
});