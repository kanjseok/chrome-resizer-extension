const DEFAULT_PRESETS = [
  { width: 1280, height: 720, label: "HD" },
  { width: 1440, height: 900, label: "" },
  { width: 1920, height: 1080, label: "FHD" },
  { width: 375, height: 667, label: "Mobile" },
  { width: 768, height: 1024, label: "Tablet" },
];

const COMMAND_INDEX_MAP = {
  "resize-1": 0,
  "resize-2": 1,
  "resize-3": 2,
  "resize-4": 3,
};

chrome.runtime.onInstalled.addListener(async () => {
  const { presets } = await chrome.storage.sync.get("presets");
  if (!Array.isArray(presets)) {
    await chrome.storage.sync.set({ presets: DEFAULT_PRESETS });
  }
});

chrome.commands.onCommand.addListener(async (command) => {
  const index = COMMAND_INDEX_MAP[command];
  if (index === undefined) return;

  const stored = await chrome.storage.sync.get(["presets", "windowPosition", "centerWindow"]);
  const presets = Array.isArray(stored.presets) ? stored.presets : DEFAULT_PRESETS;
  const preset = presets[index];
  if (!preset) return;

  let position = stored.windowPosition;
  if (!position) {
    if (stored.centerWindow) position = "center";
    else position = "none";
  }

  const win = await chrome.windows.getCurrent();
  const update = { width: preset.width, height: preset.height, state: "normal" };

  if (position && position !== "none") {
    const displayInfo = await getPrimaryWorkArea();
    if (displayInfo) {
      switch (position) {
        case "top-left":
          update.left = displayInfo.left;
          update.top = displayInfo.top;
          break;
        case "top-right":
          update.left = Math.max(displayInfo.left, displayInfo.left + displayInfo.width - preset.width);
          update.top = displayInfo.top;
          break;
        case "top-center":
          update.left = Math.max(displayInfo.left, displayInfo.left + Math.round((displayInfo.width - preset.width) / 2));
          update.top = displayInfo.top;
          break;
        case "bottom-left":
          update.left = displayInfo.left;
          update.top = Math.max(displayInfo.top, displayInfo.top + displayInfo.height - preset.height);
          break;
        case "bottom-right":
          update.left = Math.max(displayInfo.left, displayInfo.left + displayInfo.width - preset.width);
          update.top = Math.max(displayInfo.top, displayInfo.top + displayInfo.height - preset.height);
          break;
        case "bottom-center":
          update.left = Math.max(displayInfo.left, displayInfo.left + Math.round((displayInfo.width - preset.width) / 2));
          update.top = Math.max(displayInfo.top, displayInfo.top + displayInfo.height - preset.height);
          break;
        case "left-center":
          update.left = displayInfo.left;
          update.top = Math.max(displayInfo.top, displayInfo.top + Math.round((displayInfo.height - preset.height) / 2));
          break;
        case "right-center":
          update.left = Math.max(displayInfo.left, displayInfo.left + displayInfo.width - preset.width);
          update.top = Math.max(displayInfo.top, displayInfo.top + Math.round((displayInfo.height - preset.height) / 2));
          break;
        case "center":
          update.left = Math.max(displayInfo.left, displayInfo.left + Math.round((displayInfo.width - preset.width) / 2));
          update.top = Math.max(displayInfo.top, displayInfo.top + Math.round((displayInfo.height - preset.height) / 2));
          break;
      }
    }
  }

  await chrome.windows.update(win.id, update);
});

function getPrimaryWorkArea() {
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
        resolve(null);
      }
    } catch {
      resolve(null);
    }
  });
}
