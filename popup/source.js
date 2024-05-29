// Imports
import { createTr } from "./createTr.js";
import { sortTabs, downloadFileWith, getNewRowIndex } from "./helpers.js";

// Get filtered chrome tabs
const tabs = await chrome.tabs.query({
    url: [
        "https://developer.chrome.com/docs/webstore/*",
        "https://developer.chrome.com/docs/extensions/*",
        "https://app.hubspot.com/*",
    ],
});

// Output DOM for user
const outputTable = document.getElementById("output");

const handleResetButtonClick = () => {
    localStorage.setStorage({});
    chrome.storage.local.set({ popupData: localStorage.getStorage() });
    outputTable.innerHTML = "";
};

// Helper function: Process rows
const populateRows = (result) => {
    const tabs = result.popupData;

    if (tabs) {
        // Sort tabs in rows
        const rows = sortTabs(tabs);

        rows.forEach((row) => {
            createTr(outputTable, row.url, row.title);
        });
    }
};

// Handles storage
const localStorage = {
    storage: {},
  
    setStorage(newStorage) {
        this.storage = newStorage;
    },

    setStorageRow(key, value) {
        this.storage[key] = value;
    },

    getStorage() {
        return this.storage;
    }
};

// Retrieve saved tab data from Chrome's local storage
chrome.storage.local.get(["popupData"], (result) => {
    localStorage.setStorage(result.popupData);
    populateRows(result);
});

// Create a row with active tab's url and title
const handleCaptureButtonClick = () => {
    // Loop through tabs and grab active tab
    for (const tab of tabs) {
        if (tab.active) {
            // Show rows to user
            createTr(outputTable, tab.url, tab.title);

            //Populate local storage data
            const newRowIndex = getNewRowIndex(localStorage.getStorage());
            localStorage.setStorageRow(newRowIndex, {
                url: tab.url,
                title: tab.title
            });
        }
    }

    // Save data to chrome.storage.local
    chrome.storage.local.set({ popupData: localStorage.getStorage() });
};

// Copy data to clipboard
const copyDataToClipboard = () => {
    const tabs = localStorage.getStorage();

    if (tabs) {
        let tabData = "";

        // Sort tabs in rows
        const rows = sortTabs(tabs);

        rows.forEach((row, index) => {
            if (index + 1 === row.length) {
                tabData += `${row.url}\t${row.title}`;
            }
            tabData += `${row.url}\t${row.title}\n`;
        });

        if (!tabData) {
            return;
        }

        // Copy to clipboard
        navigator.clipboard.writeText(tabData);
    }
};

// Download .csv
const handleDownloadCSV = () => {
    const tabs = localStorage.getStorage();
    downloadFileWith(tabs);
};

// Event listeners
document
    .getElementById("reset-data")
    .addEventListener("click", handleResetButtonClick);
document
    .getElementById("capture")
    .addEventListener("click", handleCaptureButtonClick);
document
    .getElementById("copy-data")
    .addEventListener("click", copyDataToClipboard);
document
    .getElementById("download-data")
    .addEventListener("click", handleDownloadCSV);
