// procesos.js

// ---- Estado global ----
let isCargandoUnidad = false;
let contadorAnimFrame = null;
let contadorTimeoutId = null;
let unidadToken = 0;

// === Valores iniciales (Resumen Global) ===
const GLOBAL_DEFAULTS = {
  unidades: 5,
  procesosTotales: 144,        // Ajusta según tus datos reales
  procesosAmbientales: 49,     // Ajusta según tus datos reales
  variablesAmbientales: 4842   // Ajusta según tus datos reales
};

// === Formateo de números ===
function formatNumberWithSpace(num) {
  const n = Number(String(num).replace(/\s+/g, '').replace(/,/g, ''));
  if (!Number.isFinite(n)) return String(num);
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

// === Helpers de UI ===
function showCounterSpinner(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = '<div class="spinner-border spinner-border-sm" role="status"></div>';
}

function hideAllSummarySpinners() {
  // Restaurar si es necesario, o dejar que el animateCountTo sobreescriba
}

function renderLoader(container, text) {
  container.innerHTML = `
    <div class="d-flex flex-column align-items-center justify-content-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <div class="mt-3 text-muted">${text}</div>
    </div>`;
}

function removeLoader() {
  // El renderProcesos limpia el container, así que no es estrictamente necesario,
  // pero lo dejamos por compatibilidad.
}

// === Animación de Contadores ===
function animateCountTo(selector, toValue, ms = 500) {
  const el = document.querySelector(selector);
  if (!el) return;
  
  const to = parseInt(toValue) || 0;
  el.textContent = formatNumberWithSpace(to); 
  // Nota: Simplifiqué la animación para asegurar que el número se pinte rápido.
  // Si quieres la animación progresiva, puedes restaurar la función anterior.
}

function updateSummaryCounters({ procesosTotales, procesosAmbientales, totalVariables }) {
  animateCountTo('#scProcesosTotales', procesosTotales);
  animateCountTo('#scProcesosAmbientales', procesosAmbientales);
  animateCountTo('#scVariablesAmbientales', totalVariables);
}

function actualizarEtiquetaUnidades() {
  const label = document.querySelector("#scUnidades")?.nextElementSibling;
  if (label && label.classList.contains("scard-label")) {
    const val = parseInt(document.querySelector("#scUnidades").textContent.replace(/\s/g,'')) || 0;
    label.textContent = val === 1 ? "Unidad Administrativa" : "Unidades Administrativas";
  }
}

// === NORMALIZADOR: Convierte API -> Objeto Visual ===
function normalizarProceso(item) {
  // 1. Mapeo seguro de campos
  const id = item.acronimo || item.idPp || "S/I"; // S/I = Sin Identificador
  const nombre = item.proceso || item.nombre || "Proceso sin nombre";
  
  // 2. Descripción (Objetivo o Pobjeto)
  const desc = (item.objetivo || item.pobjeto || "Sin descripción disponible").trim();

  // 3. Fechas
  const inicio = item.inicio ? String(item.inicio).substring(0, 4) : "ND";
  const fin = item.fin ? String(item.fin).substring(0, 4) : "ND";

  return {
    idPp: id,
    pp: nombre,
    unidadOrigen: item.unidad || "Desconocida", // Guardamos para debug
    estatus: item.estatus || "Desconocido",
    periodicidad: item.periodicidad || "No disponible",
    vigencia: `${inicio} - ${fin}`,
    descPp: desc,
    objetivo: item.objetivo,
    gradoMadur: (item.iin && item.iin.toLowerCase().includes('s')) ? "Información de Interés Nacional" : null,
    
    // Identificador interno
    _source: 'api'
  };
}

// === LÓGICA CORE: Cargar Datos ===
async function cargarDatosUnidad(tipoUnidad, container) {
  /* tipoUnidad: 'socio' o 'eco' */
  
  console.log(`--- INICIANDO CARGA PARA: ${tipoUnidad.toUpperCase()} ---`);
  
  renderLoader(container, "Consultando base de datos y verificando recursos...");

  try {
    // 1. Fetch Procesos
    const resProcesos = await fetch("/api/procesos");
    if (!resProcesos.ok) throw new Error("Error al conectar con API Procesos");
    const dataProcesos = await resProcesos.json();

    // 2. Filtrar por Unidad (Usando includes y toLowerCase para ser flexibles)
    const keywords = tipoUnidad === 'socio' ? ['sociodemográ', 'sociodemogra'] : ['económica', 'economica'];
    const procesosFiltrados = dataProcesos.filter(p => {
      const u = String(p.unidad || '').toLowerCase();
      return keywords.some(k => u.includes(k));
    });

    // 3. Normalizar a formato visual
    let procesosListos = procesosFiltrados.map(normalizarProceso);
    
    // Guardar el total de procesos de la unidad ANTES de filtrar
    const totalProcesosUnidad = procesosListos.length;

    // 4. Fetch Variables (para el conteo)
    let conteoGlobal = {};
    try {
      const resVars = await fetch("/api/variables");
      const dataVars = await resVars.json();
      dataVars.forEach(v => {
        const key = (v.idPp || v.acronimo || v.proceso?.acronimo || "").trim(); 
        if (key) conteoGlobal[key] = (conteoGlobal[key] || 0) + 1;
      });
    } catch (e) {
      console.error("No se pudieron cargar variables, contadores estarán en 0", e);
    }

    // ========================================================
    // 5. APLICAR REGLAS ESPECÍFICAS SEGÚN LA UNIDAD
    // ========================================================
    let procesosMostrados = procesosListos; // Los que realmente se mostrarán
    
    if (tipoUnidad === 'eco') {
      // Regla Económicas: Ocultar si NO tienen variables (> 0)
      procesosMostrados = procesosListos.filter(p => (conteoGlobal[p.idPp] || 0) > 0);
      
    } else if (tipoUnidad === 'socio') {
      // Regla Sociodemográficas: Ocultar si NO tienen imagen (.png)
      const comprobaciones = procesosListos.map(async (p) => {
        try {
          const res = await fetch(`/assets/${p.idPp}.png`, { method: 'HEAD' });
          return res.ok ? p : null; // Conserva solo si existe
        } catch (e) {
          return null; // Descarta si hay error de red
        }
      });
      // Esperamos a que revise todas las imágenes
      const resultados = await Promise.all(comprobaciones);
      procesosMostrados = resultados.filter(p => p !== null);
    }
    // ========================================================

    // 6. Calcular Estadísticas Visuales
    // - totalProcesos: TODOS los procesos de la unidad (incluso los filtrados)
    // - conVariables: procesos que se muestran y tienen variables
    const totalProcesos = totalProcesosUnidad; // Todos de la unidad
    const conVariables = procesosMostrados.filter(p => (conteoGlobal[p.idPp] || 0) > 0).length; // Solo los mostrados
    let sumaVariables = 0;
    procesosMostrados.forEach(p => { sumaVariables += (conteoGlobal[p.idPp] || 0); });

    // 7. Actualizar UI Global
    animateCountTo('#scUnidades', 1);
    actualizarEtiquetaUnidades();
    updateSummaryCounters({
      procesosTotales: totalProcesos,
      procesosAmbientales: conVariables,
      totalVariables: sumaVariables
    });

    // 8. Renderizar Tarjetas (usa procesosMostrados, no procesosListos)
    wireFiltrosYOrden({ 
      procesosGlobal: procesosMostrados, 
      conteoGlobal, 
      container 
    });

    // 9. Contador de variables animado (el grande abajo si existe)
    const elContadorVars = document.getElementById("contadorVariablesUnidad");
    if(elContadorVars) elContadorVars.textContent = formatNumberWithSpace(sumaVariables);

  } catch (err) {
    console.error("Error crítico en carga:", err);
    container.innerHTML = `<div class="alert alert-danger">Error al cargar datos: ${err.message}</div>`;
  }
}

// === RENDERIZADO VISUAL (Cards) ===
function renderProcesos(procesos, conteo, container) {
  const counterSmall = document.getElementById("procesosCounter");
  if (counterSmall) counterSmall.textContent = formatNumberWithSpace(procesos.length);

  container.innerHTML = "";

  if (procesos.length === 0) {
    container.innerHTML = `
      <div class="col-12">
        <div class="alert alert-warning text-center">
          No se encontraron procesos para esta unidad con los filtros actuales.
          <br><small>(O bien no tienen variables, o bien no reportan imagen, según la unidad seleccionada)</small>
        </div>
      </div>`;
    return;
  }

  procesos.forEach(p => {
    const numVars = conteo[p.idPp] || 0; 
    
    const imgPath = `/assets/${p.idPp}.png`; 
    const imgFallback = `/assets/no_disponible.png`;

    const backText = p.objetivo || p.descPp;
    const canFlip = backText && backText.length > 5;

    const html = `
      <div class="col-md-4 mb-4">
      <div class="flip-wrap">
        <div class="flip-card">
        
        <div class="flip-side flip-front">
          <div class="card h-100 shadow-sm rounded-3 position-relative proceso-card">
          ${p.gradoMadur ? `<span class="badge bg-secondary position-absolute top-0 start-0 m-2">IIN</span>` : ''}
          
          <div class="card-body">
            <h5 class="card-title fw-bold" title="${p.pp}">${p.pp}</h5>
            
            <div class="row g-0 align-items-center mt-3">
            <div class="col-4 text-center">
               <img src="${imgPath}" class="img-fluid" style="max-height: 60px;" onerror="this.src='${imgFallback}'">
            </div>
            <div class="col-8 ps-2 small">
               <div><strong>ID:</strong> ${p.idPp}</div>
               <div><strong>Estatus:</strong> ${p.estatus}</div>
               <div><strong>Periodicidad:</strong> ${p.periodicidad}</div>
               <div><strong>Vigencia:</strong> ${p.vigencia}</div>
               <div class="mt-1">
               <strong>Variables: </strong>
               <span class="badge bg-info text-dark" style="font-size:0.9em; cursor:pointer;" onclick="window.open('variables.html?idPp=${p.idPp}')">
                 ${formatNumberWithSpace(numVars)}
               </span>
               </div>
            </div>
            </div>
          </div>

          ${canFlip ? `
          <button class="btn btn-sm btn-outline-primary btn-flip position-absolute bottom-0 end-0 m-2" data-flip="1">
            <i class="bi bi-arrow-repeat"></i>
          </button>` : ''}
          </div>
        </div>

        <div class="flip-side flip-back">
          <div class="card h-100 shadow-sm p-3">
          <h6 class="fw-bold">${p.pp}</h6>
          <div class="small text-muted overflow-auto" style="max-height: 150px;">
            ${backText}
          </div>
          <button class="btn btn-sm btn-outline-secondary btn-unflip position-absolute bottom-0 start-0 m-2" data-unflip="1">
            <i class="bi bi-arrow-counterclockwise"></i> 
          </button>
          </div>
        </div>

        </div>
      </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
  });
}

// === FILTROS ===
function wireFiltrosYOrden({ procesosGlobal, conteoGlobal, container }) {
  const selectPerio = document.getElementById("filtrarPeriodicidad");
  if (selectPerio) {
    const periodos = [...new Set(procesosGlobal.map(p => p.periodicidad))].sort();
    selectPerio.innerHTML = '<option value="">Filtrar por periodicidad...</option>' + 
      periodos.map(p => `<option value="${p}">${p}</option>`).join('');
  }

  const aplicar = () => {
    const estatusVal = document.getElementById("filtrarEstatus")?.value.toLowerCase();
    const periodVal = document.getElementById("filtrarPeriodicidad")?.value;
    const iinCheck = document.getElementById("iinCheck")?.checked;
    const ordenVal = document.getElementById("ordenarProcesos")?.value || 'az';

    let resultado = procesosGlobal.filter(p => {
      if (estatusVal && (p.estatus || '').toLowerCase() !== estatusVal) return false;
      if (periodVal && p.periodicidad !== periodVal) return false;
      if (iinCheck && !p.gradoMadur) return false;
      return true;
    });

    resultado.sort((a, b) => {
      if (ordenVal === 'az') return a.pp.localeCompare(b.pp);
      if (ordenVal === 'za') return b.pp.localeCompare(a.pp);
      const ca = conteoGlobal[a.idPp] || 0;
      const cb = conteoGlobal[b.idPp] || 0;
      return ordenVal === 'mayor-menor' ? (cb - ca) : (ca - cb);
    });

    renderProcesos(resultado, conteoGlobal, container);
  };

  ['filtrarEstatus', 'filtrarPeriodicidad', 'ordenarProcesos'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', aplicar);
  });
  document.getElementById('iinCheck')?.addEventListener('change', aplicar);

  // botón para resetear filtros
  const resetBtn = document.getElementById('resetFiltrosBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      const est = document.getElementById('filtrarEstatus');
      const per = document.getElementById('filtrarPeriodicidad');
      const ord = document.getElementById('ordenarProcesos');
      const iin = document.getElementById('iinCheck');
      if (est) est.selectedIndex = 0;
      if (per) per.selectedIndex = 0;
      if (ord) ord.selectedIndex = 0;
      if (iin) iin.checked = false;
      aplicar();
    });
  }
  
  aplicar();
}

// === INICIALIZACIÓN (DOM Ready) ===
// Función para inicializar los contadores globales con los valores por defecto
function initializeGlobalCounters() {
  animateCountTo('#scUnidades', GLOBAL_DEFAULTS.unidades);
  animateCountTo('#scProcesosTotales', GLOBAL_DEFAULTS.procesosTotales);
  animateCountTo('#scProcesosAmbientales', GLOBAL_DEFAULTS.procesosAmbientales);
  animateCountTo('#scVariablesAmbientales', GLOBAL_DEFAULTS.variablesAmbientales);
  actualizarEtiquetaUnidades();
}

document.addEventListener("DOMContentLoaded", () => {
  const btnSocio = document.getElementById("btnDireccionSociodemograficas");
  const btnEco = document.getElementById("btnDireccionEconomicas");
  const seccion = document.getElementById("procesosSection");
  const container = document.getElementById("procesosContainer");
  const title = document.getElementById("procesosTitle");

  // Inicializar contadores globales por defecto
  initializeGlobalCounters();

  if(seccion) seccion.hidden = true;
  
  btnSocio?.addEventListener("click", () => {
    // si ya está seleccionada, la deseleccionamos
    if (btnSocio.classList.contains('card-selected')) {
      btnSocio.classList.remove('card-selected');
      if (seccion) seccion.hidden = true;
      if (container) container.innerHTML = '';
      // restaurar contadores globales a valores por defecto
      initializeGlobalCounters();
    } else {
      prepararVista(btnSocio, "Sociodemográficas");
      cargarDatosUnidad('socio', container);
    }
  });

  btnEco?.addEventListener("click", () => {
    if (btnEco.classList.contains('card-selected')) {
      btnEco.classList.remove('card-selected');
      if (seccion) seccion.hidden = true;
      if (container) container.innerHTML = '';
      initializeGlobalCounters();
    } else {
      prepararVista(btnEco, "Económicas");
      cargarDatosUnidad('eco', container);
    }
  });

  document.querySelectorAll('.mostrarGrupoBtn').forEach(btn => {
    if (btn !== btnSocio && btn !== btnEco) {
      btn.addEventListener("click", () => alert("Información no disponible por el momento."));
    }
  });

  document.addEventListener('click', (e) => {
    const flip = e.target.closest('[data-flip]');
    const unflip = e.target.closest('[data-unflip]');
    if (flip) flip.closest('.flip-card').classList.add('flipped');
    if (unflip) unflip.closest('.flip-card').classList.remove('flipped');
  });

  function prepararVista(boton, nombreUnidad) {
    document.querySelectorAll('.card-unidad').forEach(c => c.classList.remove('card-selected'));
    boton.classList.add('card-selected');

    if(seccion) {
      seccion.hidden = false;
      seccion.scrollIntoView({ behavior: 'smooth' });
    }
    
    if(title) title.textContent = `Procesos de Producción de la Unidad de Estadísticas ${nombreUnidad}`;
  }
});