// Concatenate object URL and title
const concatenateURLandTitle = (arrayOfObjects) => {
    let url = "";
    let title = "";
    for (let i = 0; i < arrayOfObjects.length; i++) {
        if (i + 1 === arrayOfObjects.length) {
            url += `${arrayOfObjects[i].url}`;
            title += `${arrayOfObjects[i].title}`;
            continue;
        }
        url += `${arrayOfObjects[i].url}, `;
        title += `${arrayOfObjects[i].title}, `;
    }

    const result = {
        url: url,
        title: title,
    };

    return result;
};

// Sort object's tabs and return sorted array
const sortTabs = (tabs) => {
    // Initialize the result array
    const results = [];

    // Turn object's array into default array
    const rawTabsArray = [];
    Object.entries(tabs).forEach((key, tab) => {
        const line = {
            url: tabs[tab].url,
            title: tabs[tab].title,
        };
        rawTabsArray.push(line);
    });

    // Variables for processing row combination
    const maxRows = 9;
    let maxCols = Math.ceil(rawTabsArray.length / maxRows);

    let maxRowsColAppliesTo = 0;
    if (rawTabsArray.length % maxRows === 0 && rawTabsArray.length > maxRows) {
        maxRowsColAppliesTo = maxRows;
    } else {
        maxRowsColAppliesTo = rawTabsArray.length % maxRows;
    }

    let rowStartIndex = 0;

    // Process rows with row combination [PT 1]
    for (let i = 0; i < maxRowsColAppliesTo; i++) {
        let line = [];

        // Row combination
        for (let j = 0; j < maxCols; j++) {
            line.push(rawTabsArray[rowStartIndex]);

            // Increase index for rows with and without row combination
            rowStartIndex++;
        }

        line = concatenateURLandTitle(line);
        results.push(line);
    }

    // Re-calculate processing for PT 2 row combination
    if (rawTabsArray.length > maxRows) {
        // Move cursor 1 col to the left
        maxCols--;
        // Apply row combination to remaining rows
        maxRowsColAppliesTo = maxRows - maxRowsColAppliesTo;
    } else {
        // Prevent error on smaller data
        maxRowsColAppliesTo = 0;
    }

    // Process rows with row combination [PT 2]
    for (let i = 0; i < maxRowsColAppliesTo; i++) {
        let line = [];

        // Row combination
        for (let j = 0; j < maxCols; j++) {
            line.push(rawTabsArray[rowStartIndex]);

            // Increase index for rows with and without row combination
            rowStartIndex++;
        }

        line = concatenateURLandTitle(line);
        results.push(line);
    }

    // Process remaining rows without row combination
    for (let i = rowStartIndex; i < rawTabsArray.length; i++) {
        let line = [];
        line.push(rawTabsArray[i]);
        line = concatenateURLandTitle(line);
        results.push(line);
    }

    // Return row info in array
    return results;
};

// Process file download
const downloadFileWith = (tabs) => {
    if (tabs) {
        let tabData = "";

        // Sort tabs in rows
        const rows = sortTabs(tabs);

        rows.forEach((row, index) => {
            if (index + 1 === row.length) {
                // Hint: replaces " with nothing
                tabData += `"${row.url}","${row.title.replaceAll(
                    `"`,
                    ``
                )}"`;
            }
            // Hint: replaces " with nothing
            tabData += `"${row.url}","${row.title.replaceAll(`"`, ``)}",\n`;
        });

        if (!tabData) {
            return;
        }

        // Create a Blob from the CSV string
        let blob = new Blob([tabData], { type: "text/csv" });

        // Create, click and remove a link element
        let link = document.createElement("a");
        link.download = "QuickTab-Extractor-export.csv";
        link.href = window.URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

// Load data from local browser storage
const loadRowsFromLocal = () => {
    // Potential development
};

const getNewRowIndex = (storage) => {
    const newRowIndex = Object.entries(storage).length;
    return newRowIndex;
};

// Exports
export { sortTabs, downloadFileWith, getNewRowIndex };
