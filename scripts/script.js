const tableBody = document.querySelector('tbody');
const filteredBy = document.getElementById('filter');
// const wcagVersion = document.getElementById('wcagVersion');
let selectedLevels = [], selectedVersions = [], selectedCategory = [];
let uniqeLevels = [
    // Filter unique levels
    ...new Set([
        ...wcagObj['tests'].map(x => x.wcagLevel),
        // Keep at least these levels
        'A',
        'AA'
        //,'AAA'
    ])
];
// Filter unique versions
let uniqeLVersions = [
    ...new Set([
        ...wcagObj['tests'].map(x => x.wcagVersion),
        // Keep at least this versions
        '2.0',
        '2.1'
        ///,'2.2',
    ])
];
// Filter uniqu categories
let uniqeCategories = [...new Set(wcagObj['tests'].map(x => x.category).flat())];

// Create and show levels in HTML
uniqeLevels.forEach(level => {
    document.getElementById('levels').innerHTML += `
	<li class="nav-item ms-3">
            <div class="form-check">
              <input name="${level}" class="form-check-input level-selector" type="checkbox" id="flexCheckDefault">
              <label class="form-check-label" for="flexCheckDefault">${level}</label>
            </div>
    </li>
	`
})

// Create and show versions in HTML
uniqeLVersions.forEach(version => {
    document.getElementById('versions').innerHTML += `
	<li class="nav-item ms-3">
            <div class="form-check">
              <input name="${version}" class="form-check-input version-selector" type="checkbox" value="" id="flexCheckDefault3">
              <label class="form-check-label" for="flexCheckDefault3">${version}</label>
            </div>
    </li>
	`
})

// Create and show categories in HTML
uniqeCategories.forEach(category => {
    document.getElementById('categories').innerHTML += `
    <li class="nav-item ms-3">
        <div class="form-check">
            <input name="${category}" class="form-check-input category-selector" type="checkbox" value="" id="flexCheckDefault5">
            <label class="form-check-label" for="flexCheckDefault5">${category}</label>
        </div>
    </li>
	`
})

// Show filtered by
function showFiltersOnUI() {
    let filterEl = document.getElementById('filter');
    // Joined filters value by comma or show dash
    filterEl.innerHTML = [selectedLevels, selectedVersions, selectedCategory].flat().map(x => `<span class="badge text-bg-success">${x}</span>`).join('') || '<span class="badge text-bg-success">All</span>'
}

// Create table row for each data
function populateTable(obj) {
    showFiltersOnUI();
    tableBody.innerHTML = '';
    const resultsElement = document.getElementById('returnedResults');
    const tests = obj['tests'];
    var returnedResults = 0;

    // wcagVersion.textContent = obj.latestWCAGversion;

    for (let i = 0; i < tests.length; i++) {
        const tableRow = document.createElement('tr');
        for (var key in tests[i]) {
            if (tests[i].hasOwnProperty(key)) {
                if (key !== 'link') {
                    var val = tests[i][key];
                    var tableData = document.createElement('td');
                    // Joined filter condition for Levels, Versions and Categories
                    let filterCondition =
                        // If any level, version or category selected check the data matched with the selections
                        (!selectedLevels.length || selectedLevels.indexOf(tests[i].wcagLevel) >= 0) &&
                        (!selectedVersions.length || selectedVersions.indexOf(tests[i].wcagVersion) >= 0) &&
                        (!selectedCategory.length || selectedCategory.filter(x => tests[i].category.indexOf(x) >= 0).length)
                    // Keep data if matched with the filer condition the show it in table
                    if (filterCondition) {
                        if (key == 'category') {
                            returnedResults++;
                            for (let a = 0; a < tests[i][key].length; a++) {
                                var cssSpan = document.createElement('span');
                                cssSpan.textContent = val[a];

                                cssSpan.classList.add('badge');
                                cssSpan.classList.add('text-bg-light');
                                tableData.appendChild(cssSpan);
                            }
                        }
                        else {
                            if (key == 'successCriteria') {
                                const a = document.createElement('a');
                                const linkText = document.createTextNode(val);
                                a.appendChild(linkText);
                                a.title = val
                                a.target = '_blank';
                                a.href = tests[i].link;

                                tableData.appendChild(a);
                            }
                            else if (key == 'test') {
                                const spanEl = document.createElement('span');
                                // Create URL and, or, strong from text and insert into span node
                                spanEl.innerHTML = urlify(tests[i].test)
                                    // Create or, with HTML element wrap
                                    .replace('or, ', '<strong>or, </strong>')
                                    // Create and, with HTML element wrap
                                    .replace('and, ', '<strong>and, </strong>')
                                // Append Child into table data (td)
                                tableData.appendChild(spanEl);
                            }
                            else {
                                // Level style by DOM Element
                                switch (val) {
                                    case 'A':
                                        var cssSpan = document.createElement('span');
                                        cssSpan.textContent = val;
                                        cssSpan.classList.add('badge');
                                        cssSpan.classList.add('text-bg-success');
                                        tableData.appendChild(cssSpan);
                                        break;
                                    case 'AA':
                                        var cssSpan = document.createElement('span');
                                        cssSpan.textContent = val;
                                        cssSpan.classList.add('badge');
                                        cssSpan.classList.add('text-bg-danger');
                                        tableData.appendChild(cssSpan);
                                        break;
                                    default:
                                        tableData.textContent = val;
                                        break;
                                }
                            }
                        }
                        // Adding row in HTML table
                        tableRow.appendChild(tableData);
                        tableBody.appendChild(tableRow);
                    }
                }
            }
        }

    }
    resultsElement.textContent = returnedResults;
}

// Getting selected levels
function levelFilter(e) {
    let allLevelCheckboxes = document.querySelectorAll(".level-selector")
    selectedLevels = Array.from(allLevelCheckboxes).filter(x => x.checked).map(x => x.name);
    console.log(selectedLevels)
}

// Getting selected versions
function versionFilter(e) {
    let allVersionCheckboxes = document.querySelectorAll(".version-selector")
    selectedVersions = Array.from(allVersionCheckboxes).filter(x => x.checked).map(x => x.name);
    console.log(selectedVersions)
}

// Getting selected categories
function categoryFilter(e) {
    let allCategoryCheckboxes = document.querySelectorAll(".category-selector")
    selectedCategory = Array.from(allCategoryCheckboxes).filter(x => x.checked).map(x => x.name);
    console.log(selectedCategory)
}

// Getting selected levels
function applyFilter() {
    levelFilter();
    versionFilter();
    categoryFilter();
    populateTable(wcagObj);
    document.querySelector('[aria-label="Close"]').click();
}

// Show table with all data
populateTable(wcagObj, 'all');

// Create URL from text
function urlify(text) {
    let urlRegex = /(https?:\/\/[^\s]+)/g;
    return text
        // Regular Expression Used
        // < and > are HTML keyword, so replace those by changing HTML scape
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        // replace url to HTML element
        .replace(urlRegex, function (url) {
            return '<a href="' + url + '">' + url + '</a>';
        })
}
