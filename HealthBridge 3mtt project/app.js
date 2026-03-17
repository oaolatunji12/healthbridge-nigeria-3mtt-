// Chart instances
let symptomChartInstance = null;
let diseaseChartInstance = null;

// State Data Map for quick filtering
const stateDataMap = {};
let currentStateFilter = null;

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    initDataMaps();
    initDashboard();
    initTicker();
    
    // Default USSD screen
    document.getElementById('ussd-input').value = '*123#';
});

// Tab Switching
function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(`${tabId}-tab`).classList.add('active');
}

// Data Processing
function initDataMaps() {
    states.forEach(state => {
        stateDataMap[state] = [];
    });
    
    mockReports.forEach(report => {
        if (stateDataMap[report.state]) {
            stateDataMap[report.state].push(report);
        }
    });
}

function initDashboard() {
    document.getElementById('daily-reports-count').innerText = `Daily Report Summary: ${mockReports.length}`;
    
    // Determine National Alert Status
    const criticalCount = mockReports.filter(r => r.status === 'Critical').length;
    const warningCount = mockReports.filter(r => r.status === 'Warning').length;
    
    const indicator = document.getElementById('national-alert-indicator');
    const alertText = document.getElementById('alert-text');
    
    if (criticalCount > 10) {
        indicator.className = 'alert-indicator red';
        alertText.innerText = 'National Status: CRITICAL ALERT';
    } else if (warningCount > 15 || criticalCount > 5) {
        indicator.className = 'alert-indicator yellow';
        alertText.innerText = 'National Status: BORDERLINE RISK';
    } else {
        indicator.className = 'alert-indicator green';
        alertText.innerText = 'National Status: HEALTHY';
    }
    
    renderMap();
    updateDashboardView(null);
    
    document.getElementById('reset-map-btn').addEventListener('click', () => {
        currentStateFilter = null;
        document.querySelectorAll('.state-path').forEach(el => el.style.fill = 'var(--map-base)');
        updateDashboardView(null);
    });
}

function updateDashboardView(stateFilter) {
    const title = document.getElementById('selected-state-title');
    const resetBtn = document.getElementById('reset-map-btn');
    
    if (stateFilter) {
        title.innerText = `${stateFilter} State Overview`;
        resetBtn.classList.remove('hidden');
    } else {
        title.innerText = `National Overview`;
        resetBtn.classList.add('hidden');
    }
    
    const filteredReports = stateFilter ? stateDataMap[stateFilter] : mockReports;
    
    renderAlerts(filteredReports);
    renderCharts(filteredReports);
    renderClusterTable(filteredReports);
}

function renderAlerts(reports) {
    const container = document.getElementById('alerts-container');
    container.innerHTML = '';
    
    // Look for unique alertTriggers
    const alertsConfig = {};
    
    reports.forEach(r => {
        if (r.alertTrigger) {
            if (!alertsConfig[r.alertTrigger]) {
                alertsConfig[r.alertTrigger] = { count: 0, severity: r.status };
            }
            alertsConfig[r.alertTrigger].count++;
        }
    });

    let hasAlerts = false;
    for (const [triggerName, info] of Object.entries(alertsConfig)) {
        if (info.count > 1) { // Only show if cluster threshold met
            hasAlerts = true;
            const card = document.createElement('div');
            card.className = `alert-card ${info.severity === 'Critical' ? 'critical' : 'warning'}`;
            card.innerHTML = `
                <h5>🚨 ${triggerName}</h5>
                <p>Abnormal high volume of reports detected (${info.count} cases).</p>
            `;
            container.appendChild(card);
        }
    }
    
    if (!hasAlerts) {
        container.innerHTML = '<p style="color:var(--text-muted);font-size:0.9rem;">No active early warning alerts for this selection.</p>';
    }
}

let topSymptomsChartInstance = null;

function renderCharts(reports) {
    // ---- LEFT PANEL DATA ----
    
    // 1. Top Symptoms Nationwide (Pie Chart)
    const symptomCountsAll = {};
    mockReports.forEach(r => {
        symptomCountsAll[r.symptom] = (symptomCountsAll[r.symptom] || 0) + 1;
    });
    const top5Symptoms = Object.entries(symptomCountsAll).sort((a,b)=>b[1]-a[1]).slice(0,5);
    
    const ctxPie = document.getElementById('topSymptomsPieChart').getContext('2d');
    if (topSymptomsChartInstance) topSymptomsChartInstance.destroy();
    
    topSymptomsChartInstance = new Chart(ctxPie, {
        type: 'doughnut',
        data: {
            labels: top5Symptoms.map(s => s[0]),
            datasets: [{
                data: top5Symptoms.map(s => s[1]),
                backgroundColor: [
                    '#1b5e20', '#388e3c', '#4caf50', '#81c784', '#c8e6c9'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right', labels: { boxWidth: 10, font: {size: 10} } }
            }
        }
    });

    // 2. Top 5 States Abnormal
    const stateAbnormalCounts = {};
    mockReports.forEach(r => {
        if(r.status === 'Critical' || r.status === 'Warning') {
            stateAbnormalCounts[r.state] = (stateAbnormalCounts[r.state] || 0) + 1;
        }
    });
    const topAbnormal = Object.entries(stateAbnormalCounts).sort((a,b)=>b[1]-a[1]).slice(0,5);
    
    const ulStates = document.getElementById('top-abnormal-states');
    ulStates.innerHTML = '';
    topAbnormal.forEach(st => {
        ulStates.innerHTML += `<li><span class="state-name">${st[0]}</span> <span class="state-count">${st[1]} alerts</span></li>`;
    });

    // 3. Real-time alerts feed (left panel)
    const feedContainer = document.getElementById('live-alerts-feed');
    feedContainer.innerHTML = '';
    // Reverse chronologically, show only warning/critical
    const recentAlerts = [...mockReports].filter(r => r.status !== 'Healthy').slice(0, 15);
    recentAlerts.forEach(r => {
        const typeClass = r.status.toLowerCase();
        const icon = r.status === 'Critical' ? '🚨' : '⚠️';
        feedContainer.innerHTML += `
            <div class="feed-item ${typeClass}">
                <span class="feed-time">${r.timestamp.substring(11, 16)} - ${r.state}</span>
                <strong>${icon} ${r.symptom}</strong> reported.
            </div>
        `;
    });

    // ---- RIGHT PANEL DATA ----

    // 4. Symptom Trend (Bar Chart - State Filtered)
    const symptomCounts = {};
    reports.forEach(r => {
        symptomCounts[r.symptom] = (symptomCounts[r.symptom] || 0) + 1;
    });
    
    const sortedSymptoms = Object.entries(symptomCounts).sort((a,b)=>b[1]-a[1]).slice(0,5);
    
    const symptomLabels = sortedSymptoms.map(s => s[0]);
    const symptomDataVals = sortedSymptoms.map(s => s[1]);

    const ctxSymptom = document.getElementById('symptomTrendChart').getContext('2d');
    if (symptomChartInstance) symptomChartInstance.destroy();
    
    symptomChartInstance = new Chart(ctxSymptom, {
        type: 'bar',
        data: {
            labels: symptomLabels,
            datasets: [{
                label: 'Reported Cases',
                data: symptomDataVals,
                backgroundColor: 'rgba(56, 142, 60, 0.7)',
                borderColor: 'rgba(56, 142, 60, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true } }
        }
    });

    // 5. Disease Trend Prediction (Line Chart - Mocked predictive data)
    const days = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Prediction"];
    let base = reports.length; 
    const trendData = [
        Math.floor(base * 0.5),
        Math.floor(base * 0.6),
        Math.floor(base * 0.8),
        Math.floor(base * 1.1),
        Math.floor(base * 1.4),
        Math.floor(base * 1.5),
        Math.floor(base * 1.8) 
    ];

    const ctxDisease = document.getElementById('diseaseTrendChart').getContext('2d');
    if (diseaseChartInstance) diseaseChartInstance.destroy();
    
    diseaseChartInstance = new Chart(ctxDisease, {
        type: 'line',
        data: {
            labels: days,
            datasets: [{
                label: 'Infections Trend',
                data: trendData,
                backgroundColor: 'rgba(211, 47, 47, 0.1)',
                borderColor: 'rgba(211, 47, 47, 1)',
                borderWidth: 2,
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true } }
        }
    });

    // 6. Mini Trend Analysis (Day vs Week) - CSS Only Bar Graph
    const miniTrendContainer = document.getElementById('mini-trend-analysis');
    const dayRatio = (Math.random() * 60 + 20).toFixed(0); 
    const weekRatio = (Math.random() * 40 + 60).toFixed(0);
    const monthRatio = 100;
    
    miniTrendContainer.innerHTML = `
        <div class="trend-col">
            <div class="trend-bar" style="height: ${dayRatio}%;"></div>
            <span class="trend-label">24h</span>
        </div>
        <div class="trend-col">
            <div class="trend-bar" style="height: ${weekRatio}%;"></div>
            <span class="trend-label">7d</span>
        </div>
        <div class="trend-col">
            <div class="trend-bar" style="height: ${monthRatio}%;"></div>
            <span class="trend-label">30d</span>
        </div>
    `;

    // 7. State Risk Summary Cards
    renderRiskCards();
}

function renderRiskCards() {
    const container = document.getElementById('risk-cards-container');
    container.innerHTML = '';
    
    // Aggregate by State
    const stateStats = {};
    mockReports.forEach(r => {
        if(!stateStats[r.state]) {
            stateStats[r.state] = { count: 0, highestRisk: 'Healthy', symptoms: new Set() };
        }
        stateStats[r.state].count++;
        stateStats[r.state].symptoms.add(r.symptom);
        
        if(r.status === 'Critical') stateStats[r.state].highestRisk = 'Critical';
        if(r.status === 'Warning' && stateStats[r.state].highestRisk !== 'Critical') stateStats[r.state].highestRisk = 'Warning';
    });

    // Sort by most cases, take top 4 to display as summary cards
    const sortedStates = Object.entries(stateStats).sort((a,b) => b[1].count - a[1].count).slice(0, 4);
    
    sortedStates.forEach(([stateName, data]) => {
        const topSymptomArr = Array.from(data.symptoms);
        const symptomStr = topSymptomArr.slice(0,2).join(', ');
        
        container.innerHTML += `
            <div class="risk-card ${data.highestRisk}">
                <h5>${stateName}</h5>
                <p class="r-count">${data.count}</p>
                <p class="r-status">${data.highestRisk}</p>
                <div style="font-size: 0.70rem; color: #666; margin-top:5px; padding-top:5px; border-top: 1px dotted #ccc">
                    ${symptomStr}
                </div>
            </div>
        `;
    });
}

function renderClusterTable(reports) {
    const tbody = document.getElementById('cluster-table-body');
    tbody.innerHTML = '';
    
    // Group by state and symptom to find clusters
    const clusterMap = {};
    reports.forEach(r => {
        if (r.isCluster) {
            const key = `${r.state}-${r.symptom}`;
            if(!clusterMap[key]) {
                clusterMap[key] = { state: r.state, symptom: r.symptom, count: 0, status: r.status };
            }
            clusterMap[key].count++;
        }
    });
    
    const clusters = Object.values(clusterMap).filter(c => c.count > 2); // Threshold for visual table
    
    if (clusters.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No massive active clusters</td></tr>';
        return;
    }

    clusters.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${c.state}</strong></td>
            <td>${c.symptom}</td>
            <td>${c.count}</td>
            <td><span style="color:${c.status === 'Critical' ? 'var(--alert-red)' : 'var(--alert-yellow)'};font-weight:bold">${c.status}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

// SVG Map Rendering using D3
function renderMap() {
    const wrapper = document.getElementById('map-svg-wrapper');
    const width = 400;
    const height = 400;
    
    const svg = d3.select("#map-svg-wrapper")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("width", "100%")
        .style("height", "100%");

    // Tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "map-tooltip");

    // We'll use a reliable SVG TopoJSON endpoint from Highcharts for Nigeria States
    d3.json("https://code.highcharts.com/mapdata/countries/ng/ng-all.topo.json")
        .then(function(topology) {
            const geodata = topojson.feature(topology, topology.objects.default);
            
            // Create a projection fitting Nigeria
            const projection = d3.geoMercator()
                .fitSize([width, height], geodata);
                
            const path = d3.geoPath().projection(projection);

            function getNormalizedStateName(props) {
                let name = props.name;
                if (name === "Federal Capital Territory") return "FCT";
                if (name === "Nassarawa") return "Nasarawa";
                return name;
            }

            svg.selectAll("path")
                .data(geodata.features)
                .enter().append("path")
                .attr("d", path)
                .attr("class", "state-path")
                .attr("id", d => `state-${getNormalizedStateName(d.properties).replace(/\s+/g, '-')}`)
                // Color intensity logic based on report counts
                .style("fill", d => {
                    const sName = getNormalizedStateName(d.properties);
                    const rpts = stateDataMap[sName]?.length || 0;
                    if (rpts > 10) return "#1b5e20"; // Dark green High volume
                    if (rpts > 5) return "#388e3c"; // Mid green
                    if (rpts > 0) return "#81c784"; // Light green
                    return "var(--map-base)";
                })
                .on("mouseover", function(event, d) {
                    const sName = getNormalizedStateName(d.properties);
                    const rpts = stateDataMap[sName]?.length || 0;
                    d3.select(this).style("stroke", "#333").style("stroke-width", 2);
                    
                    tooltip.transition().duration(200).style("opacity", .9);
                    tooltip.html(`<strong>${sName}</strong><br/>Reports: ${rpts}`)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function(event, d) {
                    d3.select(this).style("stroke", "white").style("stroke-width", 1);
                    tooltip.transition().duration(500).style("opacity", 0);
                })
                .on("click", function(event, d) {
                    // Filter dataset
                    currentStateFilter = getNormalizedStateName(d.properties);
                    
                    // Reset all fills
                    svg.selectAll("path").style("fill", "var(--map-base)");
                    // Highlight selected
                    d3.select(this).style("fill", "var(--map-highlight)");
                    
                    updateDashboardView(currentStateFilter);
                });

            // Add State Text Labels
            svg.selectAll("text")
                .data(geodata.features)
                .enter().append("text")
                .attr("class", "state-label")
                .attr("transform", function(d) {
                    const centroid = path.centroid(d);
                    // Handle edge cases where centroid might be NaN
                    if(isNaN(centroid[0]) || isNaN(centroid[1])) return "translate(-100,-100)"; 
                    return "translate(" + centroid + ")";
                })
                .attr("dy", ".35em")
                .text(d => {
                    let name = getNormalizedStateName(d.properties);
                    // Abbreviate very long names to keep the map readable
                    if (name === "Federal Capital Territory") return "FCT";
                    if (name === "Cross River") return "CR";
                    if (name === "Akwa Ibom") return "Akwa";
                    return name;
                })
                .style("font-size", "8px")
                .style("fill", "#222")
                .style("text-anchor", "middle")
                .style("pointer-events", "none"); // ensures text doesn't block hover events on states
        })
        .catch(error => {
            console.error("Map loading error, rendering fallback", error);
            wrapper.innerHTML = '<div style="text-align:center;padding:2rem;color:#888;">GeoJSON map could not load.<br>Verify internet connection.</div>';
        });
}

// Live Ticker Logic
function initTicker() {
    const container = document.getElementById('ticker-content');
    
    // Create ticker string from newest 20 reports
    const latest = mockReports.slice(0, 20);
    const tickerText = latest.map(r => `[${r.timestamp.substring(11,16)}] ${r.state}: ${r.symptom} (${r.language})`).join('  •  ');
    
    const tickerItem = document.createElement('div');
    tickerItem.className = 'ticker-item';
    tickerItem.innerText = tickerText + '  •  ' + tickerText; // Duplicate for seamless scrolling
    
    // Estimate animation duration based on text length
    const animDuration = Math.max(30, tickerText.length * 0.15);
    tickerItem.style.animationDuration = `${animDuration}s`;
    
    container.appendChild(tickerItem);
}
