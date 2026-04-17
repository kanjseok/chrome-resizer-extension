const DEFAULT_PRESETS = [
  { width: 1280, height: 720, label: "HD" },
  { width: 1440, height: 900, label: "" },
  { width: 1920, height: 1080, label: "FHD" },
  { width: 375, height: 667, label: "Mobile" },
  { width: 768, height: 1024, label: "Tablet" },
];

const STORAGE_KEY_PRESETS = "presets";
const STORAGE_KEY_POSITION = "windowPosition";

const presetListEl = document.getElementById("presetList");
const currentSizeEl = document.getElementById("currentSize");
const customForm = document.getElementById("customForm");
const customWidthEl = document.getElementById("customWidth");
const customHeightEl = document.getElementById("customHeight");
const saveAsPresetBtn = document.getElementById("saveAsPreset");
const posCells = document.querySelectorAll(".pos-cell");
const posNoneBtn = document.getElementById("posNoneBtn");
const resetPresetsBtn = document.getElementById("resetPresets");
const toastEl = document.getElementById("toast");

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("show");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toastEl.classList.remove("show"), 1600);
}

async function loadState() {
  const result = await chrome.storage.sync.get([
    STORAGE_KEY_PRESETS,
    STORAGE_KEY_POSITION,
  ]);
  const presets = Array.isArray(result[STORAGE_KEY_PRESETS])
    ? result[STORAGE_KEY_PRESETS]
    : DEFAULT_PRESETS;
  
  let position = result[STORAGE_KEY_POSITION];
  // Backwards compatibility with centerWindow
  if (position === undefined) {
    const legacy = await chrome.storage.sync.get("centerWindow");
    if (legacy.centerWindow) position = "center";
    else position = "none";
  }

  return { presets, position };
}

async function savePresets(presets) {
  await chrome.storage.sync.set({ [STORAGE_KEY_PRESETS]: presets });
}

async function savePosition(position) {
  await chrome.storage.sync.set({ [STORAGE_KEY_POSITION]: position });
}

async function resizeCurrentWindow(width, height) {
  const win = await chrome.windows.getCurrent();
  const update = { width, height, state: "normal" };

  const { position } = await loadState();
  if (position !== "none") {
    const displayInfo = await getPrimaryDisplayWorkArea();
    if (displayInfo) {
      switch (position) {
        case "top-left":
          update.left = displayInfo.left;
          update.top = displayInfo.top;
          break;
        case "top-right":
          update.left = Math.max(displayInfo.left, displayInfo.left + displayInfo.width - width);
          update.top = displayInfo.top;
          break;
        case "top-center":
          update.left = Math.max(displayInfo.left, displayInfo.left + Math.round((displayInfo.width - width) / 2));
          update.top = displayInfo.top;
          break;
        case "bottom-left":
          update.left = displayInfo.left;
          update.top = Math.max(displayInfo.top, displayInfo.top + displayInfo.height - height);
          break;
        case "bottom-right":
          update.left = Math.max(displayInfo.left, displayInfo.left + displayInfo.width - width);
          update.top = Math.max(displayInfo.top, displayInfo.top + displayInfo.height - height);
          break;
        case "bottom-center":
          update.left = Math.max(displayInfo.left, displayInfo.left + Math.round((displayInfo.width - width) / 2));
          update.top = Math.max(displayInfo.top, displayInfo.top + displayInfo.height - height);
          break;
        case "left-center":
          update.left = displayInfo.left;
          update.top = Math.max(displayInfo.top, displayInfo.top + Math.round((displayInfo.height - height) / 2));
          break;
        case "right-center":
          update.left = Math.max(displayInfo.left, displayInfo.left + displayInfo.width - width);
          update.top = Math.max(displayInfo.top, displayInfo.top + Math.round((displayInfo.height - height) / 2));
          break;
        case "center":
          update.left = Math.max(displayInfo.left, displayInfo.left + Math.round((displayInfo.width - width) / 2));
          update.top = Math.max(displayInfo.top, displayInfo.top + Math.round((displayInfo.height - height) / 2));
          break;
      }
    }
  }

  await chrome.windows.update(win.id, update);
  showToast(`${width} × ${height} Applied`);
  updateCurrentSize();
}

async function getPrimaryDisplayWorkArea() {
  return new Promise((resolve) => {
    try {
      if (chrome.system && chrome.system.display) {
        chrome.system.display.getInfo((displays) => {
          if (chrome.runtime.lastError || !displays || !displays.length) {
            resolve(null);
            return;
          }
          const primary = displays.find((d) => d.isPrimary) || displays[0];
          resolve(primary.workArea);
        });
      } else {
        resolve({
          left: 0,
          top: 0,
          width: screen.availWidth,
          height: screen.availHeight,
        });
      }
    } catch {
      resolve(null);
    }
  });
}

async function updateCurrentSize() {
  const win = await chrome.windows.getCurrent();
  currentSizeEl.textContent = `${win.width} × ${win.height}`;
}

let draggedIndex = -1;

function renderPresets(presets) {
  presetListEl.innerHTML = "";
  presets.forEach((preset, index) => {
    const li = document.createElement("li");
    li.className = "preset-item";
    li.draggable = true;

    li.addEventListener("dragstart", (e) => {
      draggedIndex = index;
      e.dataTransfer.effectAllowed = "move";
      setTimeout(() => li.classList.add("dragging"), 0);
    });

    li.addEventListener("dragover", (e) => {
      e.preventDefault();
      li.classList.add("drag-over");
    });

    li.addEventListener("dragleave", () => {
      li.classList.remove("drag-over");
    });

    li.addEventListener("drop", async (e) => {
      e.preventDefault();
      li.classList.remove("drag-over");
      if (draggedIndex > -1 && draggedIndex !== index) {
        const updated = [...presets];
        const [moved] = updated.splice(draggedIndex, 1);
        updated.splice(index, 0, moved);
        await savePresets(updated);
        renderPresets(updated);
      }
    });

    li.addEventListener("dragend", () => {
      li.classList.remove("dragging");
      draggedIndex = -1;
    });

    const dragHandle = document.createElement("span");
    dragHandle.className = "drag-handle";
    dragHandle.innerHTML = "☰";
    li.appendChild(dragHandle);

    const hotkey = document.createElement("span");
    hotkey.className = "preset-hotkey";
    hotkey.textContent = index < 4 ? String(index + 1) : "";
    if (index >= 4) hotkey.style.visibility = "hidden";
    li.appendChild(hotkey);

    const labelInput = document.createElement("input");
    labelInput.type = "text";
    labelInput.className = "preset-name-input";
    labelInput.value = preset.label || "";
    labelInput.placeholder = "Name...";
    labelInput.addEventListener("blur", async () => {
      if (presets[index].label !== labelInput.value) {
        presets[index].label = labelInput.value;
        await savePresets(presets);
      }
    });
    labelInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        labelInput.blur();
      }
    });
    li.appendChild(labelInput);

    const applyBtn = document.createElement("button");
    applyBtn.type = "button";
    applyBtn.className = "preset-apply";
    applyBtn.textContent = `${preset.width} × ${preset.height}`;
    applyBtn.addEventListener("click", () =>
      resizeCurrentWindow(preset.width, preset.height)
    );
    li.appendChild(applyBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "preset-delete";
    deleteBtn.title = "Delete";
    deleteBtn.textContent = "×";
    deleteBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const updated = presets.filter((_, i) => i !== index);
      await savePresets(updated);
      renderPresets(updated);
      showToast("Preset deleted");
    });
    li.appendChild(deleteBtn);

    presetListEl.appendChild(li);
  });
}

function parseCustomSize() {
  const width = parseInt(customWidthEl.value, 10);
  const height = parseInt(customHeightEl.value, 10);
  if (!Number.isFinite(width) || !Number.isFinite(height)) return null;
  if (width < 100 || height < 100 || width > 10000 || height > 10000)
    return null;
  return { width, height };
}

customForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const size = parseCustomSize();
  if (!size) {
    showToast("Please enter valid dimensions");
    return;
  }
  resizeCurrentWindow(size.width, size.height);
});

saveAsPresetBtn?.addEventListener("click", async () => {
  const size = parseCustomSize();
  if (!size) {
    showToast("Please enter valid dimensions");
    return;
  }
  const { presets } = await loadState();
  const exists = presets.some(
    (p) => p.width === size.width && p.height === size.height
  );
  if (exists) {
    showToast("Size already saved");
    return;
  }
  const updated = [...presets, { width: size.width, height: size.height, label: "" }];
  await savePresets(updated);
  renderPresets(updated);
  showToast("Preset saved");
});

function updatePositionUI(position) {
  posCells.forEach(cell => {
    if (cell.dataset.pos === position) {
      cell.classList.add("active");
    } else {
      cell.classList.remove("active");
    }
  });
}

posCells.forEach(cell => {
  cell.addEventListener("click", async () => {
    const pos = cell.dataset.pos;
    await savePosition(pos);
    updatePositionUI(pos);
    
    // Move immediately
    const win = await chrome.windows.getCurrent();
    await resizeCurrentWindow(win.width, win.height);
  });
});

posNoneBtn?.addEventListener("click", async () => {
  await savePosition("none");
  updatePositionUI("none");
  showToast("Position setting updated: No Change");
});

resetPresetsBtn?.addEventListener("click", async () => {
  await savePresets(DEFAULT_PRESETS);
  renderPresets(DEFAULT_PRESETS);
  showToast("Default presets restored");
});

document.addEventListener("DOMContentLoaded", async () => {
  if (!presetListEl) {
    console.warn("DOM elements missing! Please ensure popup.html is saved and updated.");
  }
  const { presets, position } = await loadState();
  renderPresets(presets);
  updatePositionUI(position);
  await updateCurrentSize();
});
