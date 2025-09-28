// =============================================================================
// Hole-by-Hole Entry Functions
// Add these functions to your main app.js file
// =============================================================================

// Global variables for hole-by-hole tracking
let currentHoleByHoleData = {};
let selectedHoles = [];

/**
 * Load and initialize the hole-by-hole entry tab
 */
function loadHoleByHoleTab() {
    // Set today's date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('hbh-date').value = today;
    
    // Update selects
    updateHoleByHoleSelects();
    
    // Hide entry form initially
    document.getElementById('hole-by-hole-entry').style.display = 'none';
}

/**
 * Update golfer and course selects for hole-by-hole entry
 */
function updateHoleByHoleSelects() {
    // Update golfer select
    const golferSelect = document.getElementById('hbh-golfer');
    golferSelect.innerHTML = '<option value="">Select Golfer...</option>';
    appData.golfers.forEach(golfer => {
        const option = new Option(golfer.name, golfer.id);
        golferSelect.add(option);
    });
    
    // Update course select
    const courseSelect = document.getElementById('hbh-course');
    courseSelect.innerHTML = '<option value="">Select Course...</option>';
    appData.courses.forEach(course => {
        const option = new Option(course.name, course.id);
        courseSelect.add(option);
    });
}

/**
 * Handle course selection and load hole-by-hole entry form
 */
function loadHoleByHoleEntry() {
    const courseId = document.getElementById('hbh-course').value;
    const course = appData.courses.find(c => c.id === courseId);
    
    if (!course) {
        document.getElementById('hole-by-hole-entry').style.display = 'none';
        return;
    }
    
    // Show the entry form
    document.getElementById('hole-by-hole-entry').style.display = 'block';
    
    // Update holes selection based on course type
    updateHoleByHoleSelection();
}

/**
 * Update which holes to play based on selection
 */
function updateHoleByHoleSelection() {
    const courseId = document.getElementById('hbh-course').value;
    const holesPlayed = parseInt(document.getElementById('hbh-holes').value);
    const course = appData.courses.find(c => c.id === courseId);
    
    if (!course) return;
    
    // Determine which holes to show
    if (course.type === 18 && holesPlayed === 9) {
        // Show selection for front or back nine
        showNineSelection();
    } else {
        // Show all holes based on selection
        selectedHoles = [];
        for (let i = 1; i <= holesPlayed; i++) {
            selectedHoles.push(i);
        }
        generateHoleByHoleForm();
    }
}

/**
 * Show front/back nine selection for 18-hole courses
 */
function showNineSelection() {
    const selection = prompt("Which nine holes would you like to play?\n\n1. Front 9 (Holes 1-9)\n2. Back 9 (Holes 10-18)\n\nEnter 1 or 2:");
    
    if (selection === "1") {
        selectedHoles = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    } else if (selection === "2") {
        selectedHoles = [10, 11, 12, 13, 14, 15, 16, 17, 18];
    } else {
        // Default to front nine
        selectedHoles = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    }
    
    generateHoleByHoleForm();
}

/**
 * Generate the hole-by-hole entry form
 */
function generateHoleByHoleForm() {
    const courseId = document.getElementById('hbh-course').value;
    const course = appData.courses.find(c => c.id === courseId);
    
    if (!course || selectedHoles.length === 0) return;
    
    const container = document.getElementById('holes-container');
    container.innerHTML = '';
    currentHoleByHoleData = {};
    
    selectedHoles.forEach(holeNumber => {
        const holeData = course.holes.find(h => h.hole === holeNumber);
        if (!holeData) return;
        
        const holeCard = createHoleEntryCard(holeData, course);
        container.appendChild(holeCard);
        
        // Initialize data tracking
        currentHoleByHoleData[holeNumber] = {
            score: 0,
            putts: 0,
            fairwayHit: null,
            fairwayDirection: null,
            gir: false,
            sandSave: false,
            chipIn: false,
            penaltyStrokes: 0,
            notes: ''
        };
    });
    
    updateHoleByHoleTotals();
}

/**
 * Create a hole entry card
 */
function createHoleEntryCard(holeData, course) {
    const holeCard = document.createElement('div');
    holeCard.className = 'hole-entry-card';
    holeCard.id = `hole-${holeData.hole}-card`;
    
    const isPar3 = holeData.par === 3;
    
    holeCard.innerHTML = `
        <div class="hole-header">
            <div class="hole-title">Hole ${holeData.hole}</div>
            <div class="hole-info">
                <span>Par ${holeData.par}</span>
                <span>${holeData.yardage} yards</span>
                <span>HCP ${holeData.handicap}</span>
            </div>
        </div>
        
        <div class="hole-entry-grid">
            <div class="hole-input-group">
                <label for="hole-${holeData.hole}-score">Score *</label>
                <input type="number" 
                       id="hole-${holeData.hole}-score" 
                       min="1" 
                       max="12" 
                       value="${holeData.par}"
                       oninput="updateHoleData(${holeData.hole}, 'score', this.value)"
                       required>
            </div>
            
            <div class="hole-input-group">
                <label for="hole-${holeData.hole}-putts">Putts</label>
                <input type="number" 
                       id="hole-${holeData.hole}-putts" 
                       min="0" 
                       max="8" 
                       value="2"
                       oninput="updateHoleData(${holeData.hole}, 'putts', this.value)">
            </div>
            
            <div class="hole-input-group fairway-tracking ${isPar3 ? '' : 'show'}">
                <label for="hole-${holeData.hole}-fairway">Fairway Hit</label>
                <select id="hole-${holeData.hole}-fairway" 
                        onchange="updateHoleData(${holeData.hole}, 'fairwayHit', this.value)"
                        ${isPar3 ? 'disabled' : ''}>
                    <option value="">Select...</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select>
            </div>
            
            <div class="hole-input-group fairway-tracking ${isPar3 ? '' : 'show'}">
                <label for="hole-${holeData.hole}-direction">Miss Direction</label>
                <select id="hole-${holeData.hole}-direction" 
                        onchange="updateHoleData(${holeData.hole}, 'fairwayDirection', this.value)"
                        ${isPar3 ? 'disabled' : ''}>
                    <option value="">N/A</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                    <option value="center">Center</option>
                </select>
            </div>
            
            <div class="hole-input-group">
                <div class="checkbox-group">
                    <input type="checkbox" 
                           id="hole-${holeData.hole}-gir" 
                           onchange="updateHoleData(${holeData.hole}, 'gir', this.checked)">
                    <label for="hole-${holeData.hole}-gir">Green in Regulation</label>
                </div>
            </div>
            
            <div class="hole-input-group">
                <div class="checkbox-group">
                    <input type="checkbox" 
                           id="hole-${holeData.hole}-sand" 
                           onchange="updateHoleData(${holeData.hole}, 'sandSave', this.checked)">
                    <label for="hole-${holeData.hole}-sand">Sand Save</label>
                </div>
            </div>
            
            <div class="hole-input-group">
                <div class="checkbox-group">
                    <input type="checkbox" 
                           id="hole-${holeData.hole}-chip" 
                           onchange="updateHoleData(${holeData.hole}, 'chipIn', this.checked)">
                    <label for="hole-${holeData.hole}-chip">Chip In</label>
                </div>
            </div>
            
            <div class="hole-input-group">
                <label for="hole-${holeData.hole}-penalty">Penalty Strokes</label>
                <input type="number" 
                       id="hole-${holeData.hole}-penalty" 
                       min="0" 
                       max="5" 
                       value="0"
                       oninput="updateHoleData(${holeData.hole}, 'penaltyStrokes', this.value)">
            </div>
        </div>
        
        <div class="hole-input-group" style="margin-top: 15px;">
            <label for="hole-${holeData.hole}-notes">Notes</label>
            <textarea id="hole-${holeData.hole}-notes" 
                      rows="2" 
                      placeholder="Optional notes about this hole..."
                      oninput="updateHoleData(${holeData.hole}, 'notes', this.value)"></textarea>
        </div>
        
        <div class="hole-summary" id="hole-${holeData.hole}-summary">
            <div class="hole-summary-text">
                Score: ${holeData.par} | Putts: 2 | Result: Par
            </div>
        </div>
    `;
    
    return holeCard;
}

/**
 * Update hole data when inputs change
 */
function updateHoleData(holeNumber, field, value) {
    if (!currentHoleByHoleData[holeNumber]) return;
    
    // Convert values to appropriate types
    if (field === 'score' || field === 'putts' || field === 'penaltyStrokes') {
        value = parseInt(value) || 0;
    } else if (field === 'fairwayHit' || field === 'gir' || field === 'sandSave' || field === 'chipIn') {
        if (typeof value === 'string') {
            value = value === 'true';
        }
    }
    
    currentHoleByHoleData[holeNumber][field] = value;
    
    // Update hole summary
    updateHoleSummary(holeNumber);
    
    // Update round totals
    updateHoleByHoleTotals();
    
    // Update visual state
    updateHoleCardState(holeNumber);
}

/**
 * Update the summary for a specific hole
 */
function updateHoleSummary(holeNumber) {
    const courseId = document.getElementById('hbh-course').value;
    const course = appData.courses.find(c => c.id === courseId);
    const holeData = course.holes.find(h => h.hole === holeNumber);
    const data = currentHoleByHoleData[holeNumber];
    
    if (!holeData || !data) return;
    
    const score = data.score || holeData.par;
    const putts = data.putts || 0;
    const par = holeData.par;
    
    // Calculate result relative to par
    let result = '';
    const scoreToPar = score - par;
    if (scoreToPar <= -2) result = 'Eagle or Better';
    else if (scoreToPar === -1) result = 'Birdie';
    else if (scoreToPar === 0) result = 'Par';
    else if (scoreToPar === 1) result = 'Bogey';
    else if (scoreToPar === 2) result = 'Double Bogey';
    else result = 'Triple Bogey+';
    
    // Additional indicators
    const indicators = [];
    if (data.gir) indicators.push('GIR');
    if (data.sandSave) indicators.push('Sand Save');
    if (data.chipIn) indicators.push('Chip In');
    if (data.penaltyStrokes > 0) indicators.push(`${data.penaltyStrokes} Penalty`);
    
    const indicatorText = indicators.length > 0 ? ` | ${indicators.join(', ')}` : '';
    
    const summaryElement = document.getElementById(`hole-${holeNumber}-summary`);
    if (summaryElement) {
        summaryElement.querySelector('.hole-summary-text').textContent = 
            `Score: ${score} | Putts: ${putts} | Result: ${result}${indicatorText}`;
    }
}

/**
 * Update visual state of hole card based on completion
 */
function updateHoleCardState(holeNumber) {
    const data = currentHoleByHoleData[holeNumber];
    const card = document.getElementById(`hole-${holeNumber}-card`);
    
    if (!data || !card) return;
    
    // Check if hole is completed (has score and putts)
    const isCompleted = data.score > 0 && data.putts >= 0;
    
    if (isCompleted) {
        card.classList.add('completed');
    } else {
        card.classList.remove('completed');
    }
}

/**
 * Update round totals in the summary section
 */
function updateHoleByHoleTotals() {
    let totalScore = 0;
    let totalPutts = 0;
    let fairwaysHit = 0;
    let fairwaysTotal = 0;
    let girTotal = 0;
    let girHit = 0;
    
    const courseId = document.getElementById('hbh-course').value;
    const course = appData.courses.find(c => c.id === courseId);
    
    selectedHoles.forEach(holeNumber => {
        const data = currentHoleByHoleData[holeNumber];
        const holeData = course.holes.find(h => h.hole === holeNumber);
        
        if (!data || !holeData) return;
        
        totalScore += data.score || 0;
        totalPutts += data.putts || 0;
        
        // Count GIR
        girTotal++;
        if (data.gir) girHit++;
        
        // Count fairways (only for Par 4s and 5s)
        if (holeData.par >= 4) {
            fairwaysTotal++;
            if (data.fairwayHit === true) fairwaysHit++;
        }
    });
    
    // Update display
    document.getElementById('hbh-total-score').textContent = totalScore;
    document.getElementById('hbh-total-putts').textContent = totalPutts;
    document.getElementById('hbh-fairways-hit').textContent = `${fairwaysHit}/${fairwaysTotal}`;
    document.getElementById('hbh-gir').textContent = `${girHit}/${girTotal}`;
}

/**
 * Save the hole-by-hole round
 */
async function saveHoleByHoleRound() {
    const date = document.getElementById('hbh-date').value;
    const golferId = document.getElementById('hbh-golfer').value;
    const courseId = document.getElementById('hbh-course').value;
    const holesPlayed = parseInt(document.getElementById('hbh-holes').value);
    
    if (!date || !golferId || !courseId) {
        alert('Please fill in date, golfer, and course');
        return;
    }
    
    // Validate that at least some holes have scores
    const completedHoles = selectedHoles.filter(holeNumber => {
        const data = currentHoleByHoleData[holeNumber];
        return data && data.score > 0;
    });
    
    if (completedHoles.length === 0) {
        alert('Please enter scores for at least one hole');
        return;
    }
    
    const course = appData.courses.find(c => c.id === courseId);
    
    // Calculate totals
    let totalScore = 0;
    let totalPutts = 0;
    let fairwaysHit = 0;
    let fairwaysTotal = 0;
    let girTotal = 0;
    let girHit = 0;
    
    completedHoles.forEach(holeNumber => {
        const data = currentHoleByHoleData[holeNumber];
        const holeData = course.holes.find(h => h.hole === holeNumber);
        
        totalScore += data.score;
        totalPutts += data.putts || 0;
        
        girTotal++;
        if (data.gir) girHit++;
        
        if (holeData.par >= 4) {
            fairwaysTotal++;
            if (data.fairwayHit === true) fairwaysHit++;
        }
    });
    
    // Determine nine played for 18-hole courses
    let ninePlayed = null;
    if (course.type === 18 && holesPlayed === 9) {
        ninePlayed = selectedHoles[0] <= 9 ? 'front' : 'back';
    } else if (holesPlayed === 18) {
        ninePlayed = 'full';
    }
    
    // Create round record
    const round = {
        id: generateId(),
        date: date,
        golfer_id: golferId,
        course_id: courseId,
        tees: course.tees || 'White',
        score: totalScore,
        putts: totalPutts > 0 ? totalPutts : null,
        fairways_hit: fairwaysTotal > 0 ? fairwaysHit : null,
        gir: girTotal > 0 ? girHit : null,
        holes_played: completedHoles.length,
        nine_played: ninePlayed,
        competition: '',
        conditions: 'Perfect',
        notes: `Hole-by-hole entry for ${completedHoles.length} holes`,
        differential: calculateDifferential(totalScore, course, completedHoles.length),
        is_eighteen_equivalent: false,
        user_id: currentUser.id || 'demo',
        created_at: new Date().toISOString()
    };
    
    // Create hole score records
    const holeScores = [];
    completedHoles.forEach(holeNumber => {
        const data = currentHoleByHoleData[holeNumber];
        
        const holeScore = {
            id: generateId(),
            user_id: currentUser.id || 'demo',
            round_id: round.id,
            hole_number: holeNumber,
            score: data.score,
            putts: data.putts || null,
            fairway_hit: data.fairwayHit,
            fairway_direction: data.fairwayDirection || null,
            gir: data.gir,
            sand_save: data.sandSave,
            chip_in: data.chipIn,
            penalty_strokes: data.penaltyStrokes || 0,
            notes: data.notes || null,
            created_at: new Date().toISOString()
        };
        
        holeScores.push(holeScore);
    });
    
    try {
        if (supabase) {
            // Save to Supabase
            const { error: roundError } = await supabase
                .from('rounds')
                .insert([round]);
            
            if (roundError) throw roundError;
            
            const { error: holeScoresError } = await supabase
                .from('hole_scores')
                .insert(holeScores);
            
            if (holeScoresError) throw holeScoresError;
        }
        
        // Save to local data
        appData.rounds.push(round);
        appData.holeScores.push(...holeScores);
        saveLocalData();
        
        updateRoundsTable();
        updateDashboard();
        
        alert('Hole-by-hole round saved successfully!');
        
        // Clear the form
        clearHoleByHoleEntry();
        
        // Check for possible 18-hole combinations
        if (completedHoles.length === 9) {
            checkForEighteenHoleCombination(golferId, courseId, date);
        }
        
    } catch (error) {
        alert('Error saving round: ' + error.message);
    }
}

/**
 * Clear the hole-by-hole entry form
 */
function clearHoleByHoleEntry() {
    // Reset form fields
    document.getElementById('hbh-golfer').value = '';
    document.getElementById('hbh-course').value = '';
    document.getElementById('hbh-holes').value = '18';
    
    // Hide entry form
    document.getElementById('hole-by-hole-entry').style.display = 'none';
    
    // Clear data
    currentHoleByHoleData = {};
    selectedHoles = [];
    
    // Clear container
    document.getElementById('holes-container').innerHTML = '';
    
    // Reset totals
    document.getElementById('hbh-total-score').textContent = '0';
    document.getElementById('hbh-total-putts').textContent = '0';
    document.getElementById('hbh-fairways-hit').textContent = '0/0';
    document.getElementById('hbh-gir').textContent = '0/0';
}

// Add these functions to the global scope
window.loadHoleByHoleEntry = loadHoleByHoleEntry;
window.updateHoleByHoleSelection = updateHoleByHoleSelection;
window.updateHoleData = updateHoleData;
window.saveHoleByHoleRound = saveHoleByHoleRound;
window.clearHoleByHoleEntry = clearHoleByHoleEntry;
