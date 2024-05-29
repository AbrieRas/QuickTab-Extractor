// Create a table row with two td elements
const createTr = (dom, url, subject) => {
    // New row
    const tr = document.createElement("tr");
    tr.classList.add("data-row");

    // New td
    const urlTd = document.createElement("td");
    urlTd.innerText = url;

    // New td
    const subjectTd = document.createElement("td");
    subjectTd.innerText = subject;

    // Add td to row
    tr.appendChild(urlTd);
    tr.appendChild(subjectTd);

    // Add row to given DOM
    dom.appendChild(tr);
};

// Exports
export { createTr };