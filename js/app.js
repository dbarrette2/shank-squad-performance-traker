// Data Storage
let golfers = JSON.parse(localStorage.getItem('advancedGolfTrackerGolfers') || '[]');
let courses = JSON.parse(localStorage.getItem('advancedGolfTrackerCourses') || '[]');
let rounds = JSON.parse(localStorage.getItem('advancedGolfTrackerRounds') || '[]');

// Initialize the application
function init() {
    updateDashboard();
    populateSelects();
    generateCourseHoles();
    renderTables();
    generateAdvancedStats();
    generateParAnalysis();
    
    // Set today's date as default
    document.getElementById('round-date').valueAsDate = new Date();
    document.getElementById('sc-date').valueAsDate = new Date();

    // Add event listener for course type change
    document.getElementById('course-type').addEventListener('change', generateCourseHoles);
}

// Tab Management
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');

    // Update data when switching to analysis tabs
    if (tabName === 'advanced-stats') {
        generateAdvancedStats();
    } else if (tabName === 'par-analysis') {
        generateParAnalysis();
    }
}

// Generate course holes setup with handicap
function generateCourseHoles() {
    const container = document.getElementById('course-holes');
    const courseType = document.getElementById('course-type').value;
    const numHoles = parseInt(courseType) || 18;
    
    container.innerHTML = '';
    
    for (let i = 1; i <= numHoles; i++) {
        const holeDiv = document.createElement('div');
        holeDiv.className = 'hole-setup';
        holeDiv.innerHTML = `
            <h4>Hole ${i}</h4>
            <label>Yardage</label>
            <input type="number" id="hole-${i}-yardage" placeholder="Yards" min="50" max="700">
            <label>Par</label>
            <input type="number" id="hole-${i}-par" placeholder="Par" min="3" max="5" value="${i <= 2 ? 4 : i === 3 || i === 6 || i === 9 ? 5 : i <= 4 ? 3 : 4}">
            <label>Handicap</label>
            <input type="number" id="hole-${i}-handicap" placeholder="HCP" min="1" max="${numHoles}" value="${i}">
        `;
        container.appendChild(holeDiv);
    }
}

// Golfer Management
function addGolfer() {
    const name = document.getElementById('golfer-name').value.trim();
    if (!name) {
        alert('Please enter a golfer name');
        return;
    }
    
    // Check if golfer name already exists
    if (golfers.some(g => g.name.toLowerCase() === name.toLowerCase())) {
        alert('A golfer with this name already exists');
        return;
    }
    
    const golfer = {
        id: Date.now(),
        name: name,
        createdDate: new Date().toISOString()
    };
    
    golfers.push(golfer);
    saveData();
    renderTables();
    populateSelects();
    clearGolferForm();
    updateDashboard();
}

function clearGolferForm() {
    document.getElementById('golfer-name').value = '';
}

function deleteGolfer(id) {
    if (confirm('Are you sure you want to delete this golfer?')) {
        golfers = golfers.filter(g => g.id !== id);
        saveData();
        renderTables();
        populateSelects();
        updateDashboard();
    }
}

// Course Management
function addCourse() {
    const name = document.getElementById('course-name').value.trim();
    if (!name) {
        alert('Please enter a course name');
        return;
    }
    
    const courseType = document.getElementById('course-type').value;
    const numHoles = parseInt(courseType);
    const holes = [];
    let totalPar = 0;
    
    for (let i = 1; i <= numHoles; i++) {
        const yardage = parseInt(document.getElementById(`hole-${i}-yardage`).value) || 0;
        const par = parseInt(document.getElementById(`hole-${i}-par`).value) || 4;
        const handicap = parseInt(document.getElementById(`hole-${i}-handicap`).value) || i;
        holes.push({ hole: i, yardage: yardage, par: par, handicap: handicap });
        totalPar += par;
    }
    
    const course = {
        id: Date.now(),
        name: name,
        city: document.getElementById('course-city').value.trim(),
        state: document.getElementById('course-state').value.trim(),
        tees: document.getElementById('course-tees').value,
        rating: parseFloat(document.getElementById('course-rating').value) || (numHoles === 9 ? 36 : 72),
        slope: parseInt(document.getElementById('course-slope').value) || 113,
        holes: holes,
        totalPar: totalPar,
        courseType: numHoles
    };
    
    courses.push(course);
    saveData();
    renderTables();
    populateSelects();
    clearCourseForm();
}

function clearCourseForm() {
    document.getElementById('course-name').value = '';
    document.getElementById('course-city').value = '';
    document.getElementById('course-state').value = '';
    document.getElementById('course-tees').value = 'White';
    document.getElementById('course-rating').value = '';
    document.getElementById('course-slope').value = '';
    document.getElementById('course-type').value = '18';
    generateCourseHoles();
}

function deleteCourse(id) {
    if (confirm('Are you sure you want to delete this course?')) {
        courses = courses.filter(c => c.id !== id);
        saveData();
        renderTables();
        populateSelects();
    }
}

// Round Management
function addRound() {
    const date = document.getElementById('round-date').value;
    const golferId = document.getElementById('round-golfer').value;
    const courseId = document.getElementById('round-course').value;
    const score = document.getElementById('round-score').value;
    
    if (!date || !golferId || !courseId || !score) {
        alert('Please fill in date, golfer, course, and score');
        return;
    }
    
    const round = {
        id: Date.now(),
        date: date,
        golferId: parseInt(golferId),
        courseId: parseInt(courseId),
        tees: document.getElementById('round-tees').value,
        score: parseInt(score),
        putts: parseInt(document.getElementById('round-putts').value) || null,
        fairways: parseInt(document.getElementById('round-fairways').value) || null,
        gir: parseInt(document.getElementById('round-gir').value) || null,
        holes: parseInt(document.getElementById('round-holes').value),
        competition: document.getElementById('round-competition').value,
        conditions: document.getElementById('round-conditions').value,
        notes: document.getElementById('round-notes').value
    };
    
    rounds.push(round);
    saveData();
    renderTables();
    clearRoundForm();
    updateDashboard();
    generateAdvancedStats();
    generateParAnalysis();
}

function clearRoundForm() {
    document.getElementById('round-golfer').value = '';
    document.getElementById('round-course').value = '';
    document.getElementById('round-tees').value = 'White';
    document.getElementById('round-score').value = '';
    document.getElementById('round-putts').value = '';
    document.getElementById('round-fairways').value = '';
    document.getElementById('round-gir').value = '';
    document.getElementById('round-competition').value = '';
    document.getElementById('round-notes').value = '';
}

function deleteRound(id) {
    if (confirm('Are you sure you want to delete this round?')) {
        rounds = rounds.filter(r => r.id !== id);
        saveData();
        renderTables();
        updateDashboard();
        generateAdvancedStats();
        generateParAnalysis();
    }
}

// Advanced Statistics Generation
function generateAdvancedStats() {
    const golferFilter = document.getElementById('stats-golfer').value;
    const roundsFilter = document.getElementById('stats-rounds').value;
    
    let filteredRounds = rounds.filter(round => {
        if (golferFilter && round.golferId !== parseInt(golferFilter)) return false;
        return round.score !== null;
    });

    // Limit to recent rounds
    if (roundsFilter !== 'all') {
        const limit = parseInt(roundsFilter);
        filteredRounds = filteredRounds.slice(-limit);
    }

    if (filteredRounds.length === 0) {
        resetAdvancedStats();
        return;
    }

    // Calculate statistics
    const scores = filteredRounds.map(r => r.score);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const stdDev = Math.sqrt(scores.map(s => Math.pow(s - avgScore, 2)).reduce((a, b) => a + b, 0) / scores.length);
    const bestScore = Math.min(...scores);
    const worstScore = Math.max(...scores);

    // Putting stats
    const roundsWithPutts = filteredRounds.filter(r => r.putts !== null);
    const avgPutts = roundsWithPutts.length > 0 ? 
        roundsWithPutts.map(r => r.putts).reduce((a, b) => a + b, 0) / roundsWithPutts.length : 0;

    // Ball striking stats
    const roundsWithFairways = filteredRounds.filter(r => r.fairways !== null);
    const avgFairwayAccuracy = roundsWithFairways.length > 0 ? 
        (roundsWithFairways.map(r => r.fairways).reduce((a, b) => a + b, 0) / roundsWithFairways.length) / 14 * 100 : 0;

    const roundsWithGIR = filteredRounds.filter(r => r.gir !== null);
    const avgGIR = roundsWithGIR.length > 0 ? 
        (roundsWithGIR.map(r => r.gir).reduce((a, b) => a + b, 0) / roundsWithGIR.length) / 18 * 100 : 0;

    // Update display
    document.getElementById('avg-score-detailed').textContent = avgScore.toFixed(1);
    document.getElementById('score-consistency').textContent = stdDev.toFixed(1);
    document.getElementById('best-vs-worst').textContent = `${bestScore}-${worstScore}`;
    document.getElementById('putting-avg').textContent = avgPutts > 0 ? avgPutts.toFixed(1) : '--';
    document.getElementById('fairway-accuracy').textContent = avgFairwayAccuracy > 0 ? avgFairwayAccuracy.toFixed(0) + '%' : '--%';
    document.getElementById('gir-percentage').textContent = avgGIR > 0 ? avgGIR.toFixed(0) + '%' : '--%';

    // Calculate strokes gained (simplified)
    const expectedScore = 72; // Par for most courses
    const strokesGained = expectedScore - avgScore;
    document.getElementById('sg-total').textContent = strokesGained > 0 ? `+${strokesGained.toFixed(1)}` : strokesGained.toFixed(1);
}

function resetAdvancedStats() {
    ['avg-score-detailed', 'score-consistency', 'best-vs-worst', 'putting-avg', 
     'fairway-accuracy', 'gir-percentage', 'sg-total'].forEach(id => {
        document.getElementById(id).textContent = '--';
    });
}

// Par Analysis Generation
function generateParAnalysis() {
    const golferFilter = document.getElementById('par-golfer').value;
    const courseFilter = document.getElementById('par-course').value;
    
    let filteredRounds = rounds.filter(round => {
        if (golferFilter && round.golferId !== parseInt(golferFilter)) return false;
        if (courseFilter && round.courseId !== parseInt(courseFilter)) return false;
        return round.score !== null;
    });

    if (filteredRounds.length === 0) {
        resetParAnalysis();
        return;
    }

    // For demonstration, we'll use simplified par analysis
    // In a real implementation, you'd need hole-by-hole scores
    const totalRounds = filteredRounds.length;
    const avgScore = filteredRounds.map(r => r.score).reduce((a, b) => a + b, 0) / totalRounds;
    
    // Estimated par performance (this would be calculated from actual hole scores)
    const par3Avg = (avgScore / 18 * 4).toFixed(1); // Roughly 4 par 3s per round
    const par4Avg = (avgScore / 18 * 10).toFixed(1); // Roughly 10 par 4s per round  
    const par5Avg = (avgScore / 18 * 4).toFixed(1); // Roughly 4 par 5s per round

    document.getElementById('par3-avg').textContent = par3Avg;
    document.getElementById('par4-avg').textContent = par4Avg;
    document.getElementById('par5-avg').textContent = par5Avg;

    // Update progress bars
    document.getElementById('par3-progress').style.width = Math.min((3.0 / parseFloat(par3Avg)) * 100, 100) + '%';
    document.getElementById('par4-progress').style.width = Math.min((4.0 / parseFloat(par4Avg)) * 100, 100) + '%';
    document.getElementById('par5-progress').style.width = Math.min((5.0 / parseFloat(par5Avg)) * 100, 100) + '%';
}

function resetParAnalysis() {
    ['par3-avg', 'par4-avg', 'par5-avg'].forEach(id => {
        document.getElementById(id).textContent = '--';
    });
    ['par3-progress', 'par4-progress', 'par5-progress'].forEach(id => {
        document.getElementById(id).style.width = '0%';
    });
}

// Update selects
function populateSelects() {
    // Golfer selects
    const golferSelects = ['round-golfer', 'sc-golfer', 'stats-golfer', 'par-golfer'];
    golferSelects.forEach(selectId => {
        const select = document.getElementById(selectId);
        const currentValue = select.value;
        
        if (selectId.startsWith('stats') || selectId.startsWith('par')) {
            select.innerHTML = '<option value="">All Golfers</option>';
        } else {
            select.innerHTML = '<option value="">Select Golfer...</option>';
        }
        
        golfers.forEach(golfer => {
            const option = document.createElement('option');
            option.value = golfer.id;
            option.textContent = golfer.name;
            select.appendChild(option);
        });
        
        select.value = currentValue;
    });
    
    // Course selects
    const courseSelects = ['round-course', 'sc-course', 'par-course'];
    courseSelects.forEach(selectId => {
        const select = document.getElementById(selectId);
        const currentValue = select.value;
        
        if (selectId.startsWith('par')) {
            select.innerHTML = '<option value="">All Courses</option>';
        } else {
            select.innerHTML = '<option value="">Select Course...</option>';
        }
        
        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.id;
            option.textContent = `${course.name} (${course.tees})`;
            select.appendChild(option);
        });
        
        select.value = currentValue;
    });
}

// Render tables
function renderTables() {
    // Golfers table
    const golfersTable = document.getElementById('golfers-table').getElementsByTagName('tbody')[0];
    golfersTable.innerHTML = '';
    golfers.forEach(golfer => {
        // Calculate handicap for this specific golfer
        const golferRounds = rounds.filter(r => r.golferId === golfer.id);
        const golferHandicapData = calculateHandicapForGolfer(golfer.id);
        const latestRound = golferRounds.length > 0 ? 
            golferRounds.sort((a, b) => new Date(b.date) - new Date(a.date))[0] : null;
        
        const row = golfersTable.insertRow();
        row.innerHTML = `
            <td><strong>${golfer.name}</strong></td>
            <td>${golferHandicapData.handicap !== null ? golferHandicapData.handicap.toFixed(1) : '--'}</td>
            <td>${golferRounds.length}</td>
            <td>${latestRound ? latestRound.date : 'No rounds'}</td>
            <td><button class="btn btn-danger" onclick="deleteGolfer(${golfer.id})">Delete</button></td>
        `;
    });
    
    // Courses table
    const coursesTable = document.getElementById('courses-table').getElementsByTagName('tbody')[0];
    coursesTable.innerHTML = '';
    courses.forEach(course => {
        const location = [course.city, course.state].filter(Boolean).join(', ') || '-';
        const courseType = course.courseType ? course.courseType + '-hole' : '18-hole';
        const row = coursesTable.insertRow();
        row.innerHTML = `
            <td>${course.name}</td>
            <td>${location}</td>
            <td>${courseType}</td>
            <td>${course.tees}</td>
            <td>${course.rating}</td>
            <td>${course.slope}</td>
            <td>${course.totalPar}</td>
            <td><button class="btn btn-danger" onclick="deleteCourse(${course.id})">Delete</button></td>
        `;
    });
    
    // Rounds table
    const roundsTable = document.getElementById('rounds-table').getElementsByTagName('tbody')[0];
    roundsTable.innerHTML = '';
    
    // Show most recent rounds first
    const sortedRounds = [...rounds].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedRounds.forEach(round => {
        const golfer = golfers.find(g => g.id === round.golferId);
        const course = courses.find(c => c.id === round.courseId);
        const fairwayPct = round.fairways !== null ? ((round.fairways / 14) * 100).toFixed(0) + '%' : '--';
        const girPct = round.gir !== null ? ((round.gir / 18) * 100).toFixed(0) + '%' : '--';
        
        const row = roundsTable.insertRow();
        row.innerHTML = `
            <td>${round.date}</td>
            <td>${golfer ? golfer.name : 'Unknown'}</td>
            <td>${course ? course.name : 'Unknown'}</td>
            <td>${round.score || '-'}</td>
            <td>${round.putts || '-'}</td>
            <td>${fairwayPct}</td>
            <td>${girPct}</td>
            <td><button class="btn btn-danger" onclick="deleteRound(${round.id})">Delete</button></td>
        `;
    });
}

// Handicap benchmarks by handicap range (based on USGA data)
const handicapBenchmarks = {
    'scratch': { range: [0, 5], fairway: 75, gir: 72, putts: 29.0, avgScore: 72 },
    'single': { range: [6, 9], fairway: 65, gir: 55, putts: 30.5, avgScore: 78 },
    'mid': { range: [10, 18], fairway: 55, gir: 40, putts: 32.0, avgScore: 85 },
    'high': { range: [19, 28], fairway: 45, gir: 25, putts: 34.0, avgScore: 95 },
    'beginner': { range: [29, 40], fairway: 35, gir: 15, putts: 36.0, avgScore: 105 }
};

// Calculate handicap index for a specific golfer
function calculateHandicapForGolfer(golferId) {
    // Get rounds for this specific golfer with complete data (score, course rating, slope)
    const validRounds = rounds.filter(round => {
        const course = courses.find(c => c.id === round.courseId);
        return round.golferId === golferId && round.score && course && course.rating && course.slope;
    });

    if (validRounds.length < 3) {
        return { handicap: null, category: 'Insufficient Data', roundsUsed: validRounds.length };
    }

    // Calculate differentials
    const differentials = validRounds.map(round => {
        const course = courses.find(c => c.id === round.courseId);
        const adjustedScore = Math.min(round.score, course.totalPar + 40); // ESC adjustment
        return (adjustedScore - course.rating) * 113 / course.slope;
    });

    // Sort differentials (best to worst)
    differentials.sort((a, b) => a - b);

    // Determine how many scores to use
    const numRounds = differentials.length;
    let numScoresToUse;
    if (numRounds >= 20) numScoresToUse = 8;
    else if (numRounds >= 10) numScoresToUse = Math.floor(numRounds * 0.4);
    else if (numRounds >= 5) numScoresToUse = numRounds - 2;
    else numScoresToUse = 1;

    // Calculate handicap index
    const bestDifferentials = differentials.slice(0, numScoresToUse);
    const avgDifferential = bestDifferentials.reduce((sum, diff) => sum + diff, 0) / bestDifferentials.length;
    const handicapIndex = avgDifferential * 0.96;

    // Determine category
    let category = 'Beginner';
    if (handicapIndex <= 5) category = 'Scratch Golfer';
    else if (handicapIndex <= 9) category = 'Single Digit';
    else if (handicapIndex <= 18) category = 'Mid Handicap';
    else if (handicapIndex <= 28) category = 'High Handicap';

    return { 
        handicap: Math.max(0, handicapIndex), 
        category: category, 
        roundsUsed: numScoresToUse,
        totalRounds: numRounds 
    };
}

// Calculate handicap index using USGA formula
function calculateHandicapIndex() {
    // Get rounds with complete data (score, course rating, slope)
    const validRounds = rounds.filter(round => {
        const course = courses.find(c => c.id === round.courseId);
        return round.score && course && course.rating && course.slope;
    });

    if (validRounds.length < 3) {
        return { handicap: null, category: 'Insufficient Data', roundsUsed: validRounds.length };
    }

    // Calculate differentials
    const differentials = validRounds.map(round => {
        const course = courses.find(c => c.id === round.courseId);
        const adjustedScore = Math.min(round.score, course.totalPar + 40); // ESC adjustment
        return (adjustedScore - course.rating) * 113 / course.slope;
    });

    // Sort differentials (best to worst)
    differentials.sort((a, b) => a - b);

    // Determine how many scores to use
    const numRounds = differentials.length;
    let numScoresToUse;
    if (numRounds >= 20) numScoresToUse = 8;
    else if (numRounds >= 10) numScoresToUse = Math.floor(numRounds * 0.4);
    else if (numRounds >= 5) numScoresToUse = numRounds - 2;
    else numScoresToUse = 1;

    // Calculate handicap index
    const bestDifferentials = differentials.slice(0, numScoresToUse);
    const avgDifferential = bestDifferentials.reduce((sum, diff) => sum + diff, 0) / bestDifferentials.length;
    const handicapIndex = avgDifferential * 0.96;

    // Determine category
    let category = 'Beginner';
    if (handicapIndex <= 5) category = 'Scratch Golfer';
    else if (handicapIndex <= 9) category = 'Single Digit';
    else if (handicapIndex <= 18) category = 'Mid Handicap';
    else if (handicapIndex <= 28) category = 'High Handicap';

    return { 
        handicap: Math.max(0, handicapIndex), 
        category: category, 
        roundsUsed: numScoresToUse,
        totalRounds: numRounds 
    };
}

// Get benchmark data for handicap range
function getBenchmarkForHandicap(handicapIndex) {
    if (handicapIndex === null) return handicapBenchmarks.mid;
    
    for (const [key, benchmark] of Object.entries(handicapBenchmarks)) {
        if (handicapIndex >= benchmark.range[0] && handicapIndex <= benchmark.range[1]) {
            return benchmark;
        }
    }
    return handicapBenchmarks.beginner;
}

// Calculate percentile ranking
function calculatePercentile(yourValue, benchmarkValue, isLowerBetter = true) {
    if (yourValue === null || benchmarkValue === null) return '--';
    
    let percentile;
    if (isLowerBetter) {
        percentile = benchmarkValue <= yourValue ? 
            Math.max(10, 100 - ((yourValue - benchmarkValue) / benchmarkValue * 100)) :
            Math.min(90, 50 + ((benchmarkValue - yourValue) / benchmarkValue * 50));
    } else {
        percentile = yourValue >= benchmarkValue ?
            Math.min(90, 50 + ((yourValue - benchmarkValue) / benchmarkValue * 50)) :
            Math.max(10, 100 - ((benchmarkValue - yourValue) / benchmarkValue * 100));
    }
    
    return Math.round(percentile) + 'th';
}

// Update dashboard
function updateDashboard() {
    document.getElementById('total-rounds').textContent = rounds.length;
    
    // Calculate handicap
    const handicapData = calculateHandicapIndex();
    const currentHandicap = handicapData.handicap;
    
    document.getElementById('current-handicap').textContent = 
        currentHandicap !== null ? currentHandicap.toFixed(1) : '--';
    document.getElementById('handicap-category').textContent = handicapData.category;
    document.getElementById('rounds-for-handicap').textContent = 
        `${handicapData.roundsUsed}/${handicapData.totalRounds}`;

    // Get benchmark data for current handicap
    const benchmark = getBenchmarkForHandicap(currentHandicap);
    
    const scoresWithData = rounds.filter(r => r.score !== null && r.score !== undefined);
    if (scoresWithData.length > 0) {
        const scores = scoresWithData.map(r => r.score);
        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        const bestScore = Math.min(...scores);
        const stdDev = Math.sqrt(scores.map(s => Math.pow(s - avgScore, 2)).reduce((a, b) => a + b, 0) / scores.length);
        
        document.getElementById('best-score').textContent = bestScore;
        document.getElementById('consistency-rating').textContent = stdDev.toFixed(1);
        
        // Your stats vs peer comparison
        document.getElementById('your-avg-score').textContent = avgScore.toFixed(1);
        document.getElementById('peer-avg-score').textContent = benchmark.avgScore;
        document.getElementById('score-vs-peers').textContent = 
            (avgScore - benchmark.avgScore > 0 ? '+' : '') + (avgScore - benchmark.avgScore).toFixed(1);
        
        // Score comparison bar
        const scoreComparison = Math.min(100, Math.max(0, (benchmark.avgScore / avgScore) * 100));
        document.getElementById('score-comparison-bar').style.width = scoreComparison + '%';
        document.getElementById('score-comparison-bar').style.background = 
            avgScore <= benchmark.avgScore ? '#27ae60' : '#e74c3c';
    }

    // Calculate fairway accuracy and comparison
    const fairwayData = rounds.filter(r => r.fairways !== null && r.fairways !== undefined);
    if (fairwayData.length > 0) {
        const avgFairways = fairwayData.map(r => r.fairways).reduce((a, b) => a + b, 0) / fairwayData.length;
        const fairwayPct = (avgFairways / 14 * 100);
        document.getElementById('your-fairway-pct').textContent = fairwayPct.toFixed(0) + '%';
        document.getElementById('peer-fairway-pct').textContent = benchmark.fairway + '%';
        document.getElementById('fairway-ranking').textContent = 
            calculatePercentile(fairwayPct, benchmark.fairway, false);
        
        const fairwayComparison = Math.min(100, (fairwayPct / benchmark.fairway) * 100);
        document.getElementById('fairway-comparison-bar').style.width = fairwayComparison + '%';
        document.getElementById('fairway-comparison-bar').style.background = 
            fairwayPct >= benchmark.fairway ? '#27ae60' : '#e74c3c';
    } else {
        document.getElementById('your-fairway-pct').textContent = '--%';
        document.getElementById('peer-fairway-pct').textContent = benchmark.fairway + '%';
        document.getElementById('fairway-ranking').textContent = '--';
        document.getElementById('fairway-comparison-bar').style.width = '0%';
    }

    // Calculate GIR percentage and comparison
    const girData = rounds.filter(r => r.gir !== null && r.gir !== undefined);
    if (girData.length > 0) {
        const avgGIR = girData.map(r => r.gir).reduce((a, b) => a + b, 0) / girData.length;
        const girPct = (avgGIR / 18 * 100);
        document.getElementById('your-gir-pct').textContent = girPct.toFixed(0) + '%';
        document.getElementById('peer-gir-pct').textContent = benchmark.gir + '%';
        document.getElementById('gir-ranking').textContent = 
            calculatePercentile(girPct, benchmark.gir, false);
        
        const girComparison = Math.min(100, (girPct / benchmark.gir) * 100);
        document.getElementById('gir-comparison-bar').style.width = girComparison + '%';
        document.getElementById('gir-comparison-bar').style.background = 
            girPct >= benchmark.gir ? '#27ae60' : '#e74c3c';
    } else {
        document.getElementById('your-gir-pct').textContent = '--%';
        document.getElementById('peer-gir-pct').textContent = benchmark.gir + '%';
        document.getElementById('gir-ranking').textContent = '--';
        document.getElementById('gir-comparison-bar').style.width = '0%';
    }

    // Calculate putting average and comparison
    const puttsData = rounds.filter(r => r.putts !== null && r.putts !== undefined);
    if (puttsData.length > 0) {
        const avgPutts = puttsData.map(r => r.putts).reduce((a, b) => a + b, 0) / puttsData.length;
        document.getElementById('your-putts').textContent = avgPutts.toFixed(1);
        document.getElementById('peer-putts').textContent = benchmark.putts.toFixed(1);
        document.getElementById('putting-ranking').textContent = 
            calculatePercentile(avgPutts, benchmark.putts, true);
        
        const puttingComparison = Math.min(100, Math.max(0, (benchmark.putts / avgPutts) * 100));
        document.getElementById('putting-comparison-bar').style.width = puttingComparison + '%';
        document.getElementById('putting-comparison-bar').style.background = 
            avgPutts <= benchmark.putts ? '#27ae60' : '#e74c3c';
    } else {
        document.getElementById('your-putts').textContent = '--';
        document.getElementById('peer-putts').textContent = benchmark.putts.toFixed(1);
        document.getElementById('putting-ranking').textContent = '--';
        document.getElementById('putting-comparison-bar').style.width = '0%';
    }

    // Calculate handicap trend
    if (rounds.length >= 6) {
        const recentRounds = rounds.slice(-10);
        const olderRounds = rounds.slice(-20, -10);
        
        if (olderRounds.length > 0 && recentRounds.length > 0) {
            const recentAvg = recentRounds.map(r => r.score).filter(s => s).reduce((a, b) => a + b, 0) / recentRounds.filter(r => r.score).length;
            const olderAvg = olderRounds.map(r => r.score).filter(s => s).reduce((a, b) => a + b, 0) / olderRounds.filter(r => r.score).length;
            const trend = recentAvg - olderAvg;
            
            const trendElement = document.getElementById('handicap-trend');
            if (trend < -0.5) {
                trendElement.textContent = '↗ Improving';
                trendElement.className = 'trend-indicator trend-up';
            } else if (trend > 0.5) {
                trendElement.textContent = '↘ Declining';
                trendElement.className = 'trend-indicator trend-down';
            } else {
                trendElement.textContent = '→ Stable';
                trendElement.className = 'trend-indicator';
            }

            document.getElementById('improvement-trend').textContent = 
                trend < 0 ? trend.toFixed(1) : '+' + trend.toFixed(1);
        }
    }

    // Calculate 9-hole vs 18-hole performance
    calculate9vs18Performance();

    // Update trend chart
    updateTrendChart();
}

// Calculate 9-hole vs 18-hole performance
function calculate9vs18Performance() {
    // Get rounds with course data
    const roundsWithCourseData = rounds.filter(round => {
        const course = courses.find(c => c.id === round.courseId);
        return round.score && course;
    });

    // Separate by course type
    const nineHoleRounds = roundsWithCourseData.filter(round => {
        const course = courses.find(c => c.id === round.courseId);
        return course.courseType === 9;
    });

    const eighteenHoleRounds = roundsWithCourseData.filter(round => {
        const course = courses.find(c => c.id === round.courseId);
        return course.courseType === 18 || !course.courseType; // Default to 18-hole for existing courses
    });

    // 18-hole performance
    if (eighteenHoleRounds.length > 0) {
        const scores18 = eighteenHoleRounds.map(r => r.score);
        const best18 = Math.min(...scores18);
        const recent18 = eighteenHoleRounds.slice(-10);
        const avg18 = recent18.length > 0 ? 
            recent18.map(r => r.score).reduce((a, b) => a + b, 0) / recent18.length : 0;
        
        document.getElementById('rounds-18-hole').textContent = eighteenHoleRounds.length;
        document.getElementById('best-18-hole').textContent = best18;
        document.getElementById('avg-18-hole').textContent = avg18.toFixed(1);
    } else {
        document.getElementById('rounds-18-hole').textContent = '0';
        document.getElementById('best-18-hole').textContent = '--';
        document.getElementById('avg-18-hole').textContent = '--';
    }

    // 9-hole performance
    if (nineHoleRounds.length > 0) {
        const scores9 = nineHoleRounds.map(r => r.score);
        const best9 = Math.min(...scores9);
        const recent9 = nineHoleRounds.slice(-10);
        const avg9 = recent9.length > 0 ? 
            recent9.map(r => r.score).reduce((a, b) => a + b, 0) / recent9.length : 0;
        
        document.getElementById('rounds-9-hole').textContent = nineHoleRounds.length;
        document.getElementById('best-9-hole').textContent = best9;
        document.getElementById('avg-9-hole').textContent = avg9.toFixed(1);
    } else {
        document.getElementById('rounds-9-hole').textContent = '0';
        document.getElementById('best-9-hole').textContent = '--';
        document.getElementById('avg-9-hole').textContent = '--';
    }
}

// Update trend chart
function updateTrendChart() {
    const chartContainer = document.getElementById('score-trend');
    if (!chartContainer) return;

    const recentRounds = rounds.filter(r => r.score).slice(-10);
    if (recentRounds.length === 0) {
        chartContainer.innerHTML = '<p>No score data available</p>';
        return;
    }

    chartContainer.innerHTML = '';
    const maxScore = Math.max(...recentRounds.map(r => r.score));
    const minScore = Math.min(...recentRounds.map(r => r.score));
    const range = maxScore - minScore;

    recentRounds.forEach((round, index) => {
        const height = range > 0 ? ((round.score - minScore) / range) * 150 + 20 : 50;
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = height + 'px';
        bar.textContent = round.score;
        
        const label = document.createElement('div');
        label.className = 'bar-label';
        label.textContent = `R${index + 1}`;
        
        const barContainer = document.createElement('div');
        barContainer.style.display = 'flex';
        barContainer.style.flexDirection = 'column';
        barContainer.style.alignItems = 'center';
        barContainer.appendChild(bar);
        barContainer.appendChild(label);
        
        chartContainer.appendChild(barContainer);
    });
}

// Scorecard functions (keeping existing functionality)
function loadScorecard() {
    const courseId = document.getElementById('sc-course').value;
    if (!courseId) return;
    
    const course = courses.find(c => c.id === parseInt(courseId));
    if (!course) return;
    
    let html = `
        <h3>${course.name} - ${course.tees} Tees</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(60px, 1fr)); gap: 2px; margin: 20px 0; background: white; padding: 15px; border-radius: 8px;">
            <div style="text-align: center; padding: 8px; background: #2c5530; color: white; font-weight: bold;">Hole</div>
    `;
    
    // Headers for holes 1-18
    for (let i = 1; i <= 18; i++) {
        html += `<div style="text-align: center; padding: 8px; background: #2c5530; color: white; font-weight: bold;">${i}</div>`;
    }
    html += `<div style="text-align: center; padding: 8px; background: #2c5530; color: white; font-weight: bold;">Total</div>`;
    
    // Yardage row
    html += `<div style="text-align: center; padding: 8px; background: #f8f9fa; font-weight: bold;">Yardage</div>`;
    let totalYards = 0;
    for (let i = 0; i < 18; i++) {
        const hole = course.holes[i];
        html += `<div style="text-align: center; padding: 8px; border: 1px solid #ddd;">${hole.yardage}</div>`;
        totalYards += hole.yardage;
    }
    html += `<div style="text-align: center; padding: 8px; background: #f8f9fa; font-weight: bold;">${totalYards}</div>`;
    
    // Par row
    html += `<div style="text-align: center; padding: 8px; background: #f8f9fa; font-weight: bold;">Par</div>`;
    let totalPar = 0;
    for (let i = 0; i < 18; i++) {
        const hole = course.holes[i];
        html += `<div style="text-align: center; padding: 8px; border: 1px solid #ddd;">${hole.par}</div>`;
        totalPar += hole.par;
    }
    html += `<div style="text-align: center; padding: 8px; background: #f8f9fa; font-weight: bold;">${totalPar}</div>`;
    
    // Handicap row
    html += `<div style="text-align: center; padding: 8px; background: #f8f9fa; font-weight: bold;">HCP</div>`;
    for (let i = 0; i < 18; i++) {
        const hole = course.holes[i];
        html += `<div style="text-align: center; padding: 8px; border: 1px solid #ddd;">${hole.handicap}</div>`;
    }
    html += `<div style="text-align: center; padding: 8px; background: #f8f9fa;"></div>`;
    
    // Score row
    html += `<div style="text-align: center; padding: 8px; background: #f8f9fa; font-weight: bold;">Score</div>`;
    for (let i = 1; i <= 18; i++) {
        html += `<input type="number" style="text-align: center; padding: 4px; border: 2px solid #667eea; border-radius: 4px; width: 100%;" id="score-${i}" min="1" max="15" onchange="calculateScorecard()">`;
    }
    html += `<div id="total-score" style="text-align: center; padding: 8px; background: #667eea; color: white; font-weight: bold; border-radius: 4px;">-</div>`;
    
    html += `</div>`;
    
    document.getElementById('scorecard-display').innerHTML = html;
    document.getElementById('save-scorecard').style.display = 'block';
}

function calculateScorecard() {
    let totalScore = 0;
    let completeScore = true;
    
    for (let i = 1; i <= 18; i++) {
        const scoreInput = document.getElementById(`score-${i}`);
        if (scoreInput) {
            const score = parseInt(scoreInput.value);
            if (score) {
                totalScore += score;
            } else {
                completeScore = false;
            }
        }
    }
    
    const totalElement = document.getElementById('total-score');
    if (totalElement) {
        totalElement.textContent = completeScore && totalScore > 0 ? totalScore : '-';
    }
}

function saveScorecard() {
    const golferId = document.getElementById('sc-golfer').value;
    const courseId = document.getElementById('sc-course').value;
    const date = document.getElementById('sc-date').value;
    
    if (!golferId || !courseId || !date) {
        alert('Please select golfer, course, and date');
        return;
    }
    
    const totalScore = document.getElementById('total-score').textContent;
    if (totalScore === '-') {
        alert('Please enter scores for all holes');
        return;
    }
    
    const round = {
        id: Date.now(),
        date: date,
        golferId: parseInt(golferId),
        courseId: parseInt(courseId),
        score: parseInt(totalScore),
        holes: 18,
        tees: 'Scorecard Entry',
        competition: 'Scorecard Entry',
        conditions: 'Good',
        putts: null,
        fairways: null,
        gir: null,
        notes: 'Entered via scorecard'
    };
    
    rounds.push(round);
    saveData();
    alert('Scorecard saved successfully!');
    updateDashboard();
    generateAdvancedStats();
    generateParAnalysis();
}

// Data persistence
function saveData() {
    localStorage.setItem('advancedGolfTrackerGolfers', JSON.stringify(golfers));
    localStorage.setItem('advancedGolfTrackerCourses', JSON.stringify(courses));
    localStorage.setItem('advancedGolfTrackerRounds', JSON.stringify(rounds));
}

// Export/Import
function exportData() {
    const data = {
        golfers: golfers,
        courses: courses,
        rounds: rounds,
        exportDate: new Date().toISOString(),
        version: '4.1-Shank-Squad'
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `shank-squad-golf-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            if (data.golfers && data.courses && data.rounds) {
                if (confirm('This will replace all existing data. Are you sure?')) {
                    golfers = data.golfers;
                    courses = data.courses;
                    rounds = data.rounds;
                    saveData();
                    renderTables();
                    populateSelects();
                    updateDashboard();
                    generateAdvancedStats();
                    generateParAnalysis();
                    alert('Data imported successfully!');
                }
            } else {
                alert('Invalid backup file format.');
            }
        } catch (error) {
            alert('Error reading backup file.');
        }
    };
    reader.readAsText(file);
}

// Initialize when page loads
init();
