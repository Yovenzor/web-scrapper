async function scrapePage() {
    const url = document.getElementById("url").value;
    if (!url) return alert("Please enter a URL.");
    
    const loadingMessage = document.getElementById("loadingMessage");
    const searchInput = document.getElementById("search");
    loadingMessage.style.display = "block";
    searchInput.style.display = "none";
    
    try {
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, "text/html");
        
        let links = new Set([...doc.querySelectorAll("a")].map(a => a.href).filter(href => href.startsWith("http")));
        let images = new Set([...doc.querySelectorAll("img")].map(img => img.src).filter(src => src.startsWith("http")));
        
        displayResults(links, "Link");
        displayResults(images, "Image");
        searchInput.style.display = "block";
    } catch (error) {
        alert("Error fetching page: " + error);
    } finally {
        loadingMessage.style.display = "none";
    }
}

function displayResults(items, type) {
    const tbody = document.getElementById("resultsBody");
    tbody.innerHTML = "";
    items.forEach(item => {
        const row = tbody.insertRow();
        row.insertCell(0).innerText = type;
        row.insertCell(1).innerHTML = `<a href="${item}" target="_blank">${item}</a>`;
    });
}

function searchResults() {
    let filter = document.getElementById("search").value.toLowerCase();
    let rows = document.getElementById("resultsTable").getElementsByTagName("tr");
    
    for (let i = 1; i < rows.length; i++) {
        let txtValue = rows[i].textContent || rows[i].innerText;
        rows[i].style.display = txtValue.toLowerCase().includes(filter) ? "" : "none";
    }
}