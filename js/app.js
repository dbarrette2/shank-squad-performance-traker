// =============================================================================
// The Shank Squad Golf Tracker - Application Logic
// Professional golf performance analysis with cloud storage
// =============================================================================

// Supabase Configuration
// Note: Replace with your actual Supabase URL and anon key
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase client (if Supabase is available)
let supabase = null;
if (typeof window !== 'undefined' && window.supabase) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Global state
let currentUser = null;
let appData = {
    golfers: [],
    courses: [],
    rounds: [],
    scorecards: []
};

// Performance benchmarks by handicap range
const PERFORMANCE_BENCHMARKS = {
    'scratch': { range: [0, 5], avgScore: 72, fairwayPct: 75, girPct: 72, avgPutts: 29.0 },
    'single': { range: [6, 9], avgScore: 78, fairwayPct: 65, girPct: 55, avgPutts: 30.5 },
    'mid': { range: [10, 18], avgScore: 85, fairwayPct: 55, girPct: 40, avgPutts: 32.0 },
    'high': { range: [19, 28], avgScore: 95, fairwayPct: 45, girPct: 25, avgPutts: 34.0 },
    'beginner': { range: [29, 50], avgScore: 105, fairwayPct: 35, girPct: 15, avgPutts: 36.0 }
};

// =============================================================================
// Application Initialization
// =============================================================================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    // Check for existing session
    if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            currentUser = session.user;
            await loadUserData();
            showMainApp();
        } else {
            showAuthScreen();
        }
    } else {
        // Fallback to localStorage for demo/development
        const savedUser = localStorage.getItem('golf_tracker_user');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            loadLocalData();
            showMainApp();
        } else {
            showAuthScreen();
        }
    }

    // Set up form handlers
    setupEventHandlers();
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('round-date').value = today;
    document.getElementById('sc-date').value = today;
}

function setupEventHandlers() {
    // Authentication forms
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    
    // Course type change
    document.getElementById('course-type').addEventListener('change', generateHoleInputs);
    
    // Generate initial hole inputs
    generateHoleInputs();
}

// =============================================================================
// Authentication Functions
// =============================================================================

function showAuthTab(tab) {
    // Remove active class from all tabs and forms
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    
    // Add active class to selected tab and form
    document.querySelector(`.auth-tab[onclick="showAuthTab('${tab}')"]`).classList.add('active');
    document.getElementById(`${tab}-form`).classList.add('active');
    
    // Clear messages
    clearAuthMessages();
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    setAuthLoading(true);
    clearAuthMessages();
    
    try {
        if (supabase) {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });
            
            if (error) throw error;
            
            currentUser = data.user;
            await loadUserData();
        } else {
            // Demo mode
            currentUser = { email: email, user_metadata: { username: email.split('@')[0] } };
            localStorage.setItem('golf_tracker_user', JSON.stringify(currentUser));
            loadLocalData();
        }
        
        showMainApp();
    } catch (error) {
        showAuthError(error.message || 'Login failed');
    } finally {
        setAuthLoading(false);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    
    setAuthLoading(true);
    clearAuthMessages();
    
    try {
        if (supabase) {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        username: username
                    }
                }
            });
            
            if (error) throw error;
            
            showAuthSuccess('Registration successful! Please check your email to verify your account.');
        } else {
            // Demo mode
            currentUser = { email: email, user_metadata: { username: username } };
            localStorage.setItem('golf_tracker_user', JSON.stringify(currentUser));
            loadLocalData();
            showMainApp();
        }
    } catch (error) {
        showAuthError(error.message || 'Registration failed');
    } finally {
        setAuthLoading(false);
    }
}

async function logout() {
    if (supabase) {
        await supabase.auth.signOut();
    } else {
        localStorage.removeItem('golf_tracker_user');
        localStorage.removeItem('golf_tracker_data');
    }
    
    currentUser = null;
    appData = { golfers: [], courses: [], rounds: [], scorecards: [] };
    showAuthScreen();
}

function showAuthScreen() {
    document.getElementById('auth-screen').classList.remove('hidden');
    document.getElementById('app-screen').classList.add('hidden');
}

function showMainApp() {
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('app-screen').classList.remove('hidden');
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('main-content').classList.remove('hidden');
    
    // Update user display
    const username = currentUser.user_metadata?.username || currentUser.email;
    document.getElementById('user-display').textContent = `Welcome, ${username}`;
    
    // Load initial data
    updateAllSelects();
    updateDashboard();
}

function setAuthLoading(loading) {
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    
    if (loading) {
        loginBtn.textContent = 'Logging in...';
        registerBtn.textContent = 'Registering...';
        loginBtn.disabled = true;
        registerBtn.disabled = true;
    } else {
        loginBtn.textContent = 'Login';
        registerBtn.textContent = 'Register';
        loginBtn.disabled = false;
        registerBtn.disabled = false;
    }
}

function showAuthError(message) {
    const errorDiv = document.getElementById('auth-error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function showAuthSuccess(message) {
    const successDiv = document.getElementById('auth-success');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
}

function clearAuthMessages() {
    document.getElementById('auth-error').style.display = 'none';
    document.getElementById('auth-success').style.display = 'none';
}

// =============================================================================
// Data Management Functions
// =============================================================================

async function loadUserData() {
    if (!supabase) return loadLocalData();
    
    try {
        // Load golfers
        const { data: golfers } = await supabase
            .from('golfers')
            .select('*')
            .eq('user_id', currentUser.id);
        
        // Load courses
        const { data: courses } = await supabase
            .from('courses')
            .select('*')
            .eq('user_id', currentUser.id);
        
        // Load rounds
        const { data: rounds } = await supabase
            .from('rounds')
            .select('*')
            .eq('user_id', currentUser.id);
        
        appData.golfers = golfers || [];
        appData.courses = courses || [];
        appData.rounds = rounds || [];
        
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

function loadLocalData() {
    const savedData = localStorage.getItem('golf_tracker_data');
    if (savedData) {
        appData = JSON.parse(savedData);
    }
}

function saveLocalData() {
    localStorage.setItem('golf_tracker_data', JSON.stringify(appData));
}

// =============================================================================
// Tab Navigation
// =============================================================================

function showTab(tabName) {
    // Remove active class from all tabs and content
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab and content
    document.querySelector(`.tab-btn[onclick="showTab('${tabName}')"]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');
    
    // Update content based on tab
    switch(tabName) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'golfers':
            updateGolfersTable();
            break;
        case 'courses':
            updateCoursesTable();
            break;
        case 'rounds':
            updateRoundsTable();
            break;
        case 'advanced-stats':
            generateAdvancedStats();
            break;
        case 'par-analysis':
            generateParAnalysis();
            break;
    }
}

// =============================================================================
// Golfer Management
// =============================================================================

async function addGolfer() {
    const name = document.getElementById('golfer-name').value.trim();
    
    if (!name) {
        alert('Please enter a golfer name');
        return;
    }
    
    const golfer = {
        id: generateId(),
        name: name,
        user_id: currentUser.id || 'demo',
        created_at: new Date().toISOString()
    };
    
    try {
        if (supabase) {
            const { error } = await supabase
                .from('golfers')
                .insert([golfer]);
            
            if (error) throw error;
        }
        
        appData.golfers.push(golfer);
        saveLocalData();
        updateGolfersTable();
        updateAllSelects();
        clearGolferForm();
        
        alert('Golfer added successfully!');
    } catch (error) {
        alert('Error adding golfer: ' + error.message);
    }
}

function clearGolferForm() {
    document.getElementById('golfer-name').value = '';
}

function updateGolfersTable() {
    const tbody = document.querySelector('#golfers-table tbody');
    tbody.innerHTML = '';
    
    appData.golfers.forEach(golfer => {
        const rounds = appData.rounds.filter(r => r.golfer_id === golfer.id);
        const handicap = calculateHandicap(golfer.id);
        const latestRound = rounds.length > 0 ? 
            new Date(Math.max(...rounds.map(r => new Date(r.date)))).toLocaleDateString() : 'None';
        
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${golfer.name}</td>
            <td>${handicap !== null ? handicap.toFixed(1) : 'N/A'}</td>
            <td>${rounds.length}</td>
            <td>${latestRound}</td>
            <td>
                <button class="btn btn-secondary" onclick="deleteGolfer('${golfer.id}')">Delete</button>
            </td>
        `;
    });
}

async function deleteGolfer(golferId) {
    if (!confirm('Are you sure you want to delete this golfer and all their rounds?')) return;
    
    try {
        if (supabase) {
            await supabase.from('golfers').delete().eq('id', golferId);
            await supabase.from('rounds').delete().eq('golfer_id', golferId);
        }
        
        appData.golfers = appData.golfers.filter(g => g.id !== golferId);
        appData.rounds = appData.rounds.filter(r => r.golfer_id !== golferId);
        saveLocalData();
        updateGolfersTable();
        updateAllSelects();
        updateDashboard();
    } catch (error) {
        alert('Error deleting golfer: ' + error.message);
    }
}

// =============================================================================
// Course Management
// =============================================================================

function generateHoleInputs() {
    const courseType = parseInt(document.getElementById('course-type').value);
    const container = document.getElementById('course-holes');
    container.innerHTML = '';
    
    for (let i = 1; i <= courseType; i++) {
        const holeDiv = document.createElement('div');
        holeDiv.className = 'hole-setup';
        holeDiv.innerHTML = `
            <h4>Hole ${i}</h4>
            <div class="hole-inputs">
                <input type="number" id="hole-${i}-yardage" placeholder="Yardage" min="50" max="600">
                <select id="hole-${i}-par">
                    <option value="3">Par 3</option>
                    <option value="4" selected>Par 4</option>
                    <option value="5">Par 5</option>
                </select>
                <input type="number" id="hole-${i}-handicap" placeholder="HCP" min="1" max="18" value="${i}">
            </div>
        `;
        container.appendChild(holeDiv);
    }
}

async function addCourse() {
    const name = document.getElementById('course-name').value.trim();
    const city = document.getElementById('course-city').value.trim();
    const state = document.getElementById('course-state').value.trim();
    const tees = document.getElementById('course-tees').value.trim();
    const rating = parseFloat(document.getElementById('course-rating').value);
    const slope = parseInt(document.getElementById('course-slope').value);
    const courseType = parseInt(document.getElementById('course-type').value);
    
    if (!name) {
        alert('Please enter a course name');
        return;
    }
    
    // Collect hole data
    const holes = [];
    for (let i = 1; i <= courseType; i++) {
        const yardage = parseInt(document.getElementById(`hole-${i}-yardage`).value) || 0;
        const par = parseInt(document.getElementById(`hole-${i}-par`).value) || 4;
        const handicap = parseInt(document.getElementById(`hole-${i}-handicap`).value) || i;
        
        holes.push({ hole: i, yardage, par, handicap });
    }
    
    const totalPar = holes.reduce((sum, hole) => sum + hole.par, 0);
    
    const course = {
        id: generateId(),
        name: name,
        city: city,
        state: state,
        tees: tees,
        rating: rating || null,
        slope: slope || null,
        type: courseType,
        holes: holes,
        total_par: totalPar,
        user_id: currentUser.id || 'demo',
        created_at: new Date().toISOString()
    };
    
    try {
        if (supabase) {
            const { error } = await supabase
                .from('courses')
                .insert([course]);
            
            if (error) throw error;
        }
        
        appData.courses.push(course);
        saveLocalData();
        updateCoursesTable();
        updateAllSelects();
        clearCourseForm();
        
        alert('Course added successfully!');
    } catch (error) {
        alert('Error adding course: ' + error.message);
    }
}

function clearCourseForm() {
    document.getElementById('course-name').value = '';
    document.getElementById('course-city').value = '';
    document.getElementById('course-state').value = '';
    document.getElementById('course-tees').value = 'White';
    document.getElementById('course-rating').value = '';
    document.getElementById('course-slope').value = '';
    document.getElementById('course-type').value = '18';
    generateHoleInputs();
}

function updateCoursesTable() {
    const tbody = document.querySelector('#courses-table tbody');
    tbody.innerHTML = '';
    
    appData.courses.forEach(course => {
        const location = [course.city, course.state].filter(x => x).join(', ') || 'Not specified';
        
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${course.name}</td>
            <td>${location}</td>
            <td>${course.type} holes</td>
            <td>${course.tees}</td>
            <td>${course.rating || 'N/A'}</td>
            <td>${course.slope || 'N/A'}</td>
            <td>${course.total_par}</td>
            <td>
                <button class="btn btn-secondary" onclick="deleteCourse('${course.id}')">Delete</button>
            </td>
        `;
    });
}

async function deleteCourse(courseId) {
    if (!confirm('Are you sure you want to delete this course and all rounds played on it?')) return;
    
    try {
        if (supabase) {
            await supabase.from('courses').delete().eq('id', courseId);
            await supabase.from('rounds').delete().eq('course_id', courseId);
        }
        
        appData.courses = appData.courses.filter(c => c.id !== courseId);
        appData.rounds = appData.rounds.filter(r => r.course_id !== courseId);
        saveLocalData();
        updateCoursesTable();
        updateAllSelects();
        updateDashboard();
    } catch (error) {
        alert('Error deleting course: ' + error.message);
    }
}

// =============================================================================
// Round Management
// =============================================================================

function updateCourseInfo() {
    const courseId = document.getElementById('round-course').value;
    const course = appData.courses.find(c => c.id === courseId);
    
    if (course) {
        document.getElementById('round-tees').value = course.tees;
    }
}

async function addRound() {
    const date = document.getElementById('round-date').value;
    const golferId = document.getElementById('round-golfer').value;
    const courseId = document.getElementById('round-course').value;
    const tees = document.getElementById('round-tees').value;
    const score = parseInt(document.getElementById('round-score').value);
    const putts = parseInt(document.getElementById('round-putts').value) || null;
    const fairways = parseInt(document.getElementById('round-fairways').value) || null;
    const gir = parseInt(document.getElementById('round-gir').value) || null;
    const holes = parseInt(document.getElementById('round-holes').value);
    const competition = document.getElementById('round-competition').value;
    const conditions = document.getElementById('round-conditions').value;
    const notes = document.getElementById('round-notes').value;
    
    if (!date || !golferId || !courseId || !score) {
        alert('Please fill in all required fields');
        return;
    }
    
    const course = appData.courses.find(c => c.id === courseId);
    const round = {
        id: generateId(),
        date: date,
        golfer_id: golferId,
        course_id: courseId,
        tees: tees,
        score: score,
        putts: putts,
        fairways_hit: fairways,
        gir: gir,
        holes_played: holes,
        competition: competition,
        conditions: conditions,
        notes: notes,
        differential: calculateDifferential(score, course, holes),
        user_id: currentUser.id || 'demo',
        created_at: new Date().toISOString()
    };
    
    try {
        if (supabase) {
            const { error } = await supabase
                .from('rounds')
                .insert([round]);
            
            if (error) throw error;
        }
        
        appData.rounds.push(round);
        saveLocalData();
        updateRoundsTable();
        updateDashboard();
        clearRoundForm();
        
        alert('Round added successfully!');
    } catch (error) {
        alert('Error adding round: ' + error.message);
    }
}

function clearRoundForm() {
    document.getElementById('round-golfer').value = '';
    document.getElementById('round-course').value = '';
    document.getElementById('round-tees').value = 'White';
    document.getElementById('round-score').value = '';
    document.getElementById('round-putts').value = '';
    document.getElementById('round-fairways').value = '';
    document.getElementById('round-gir').value = '';
    document.getElementById('round-holes').value = '18';
    document.getElementById('round-competition').value = '';
    document.getElementById('round-conditions').value = 'Perfect';
    document.getElementById('round-notes').value = '';
}

function updateRoundsTable() {
    const tbody = document.querySelector('#rounds-table tbody');
    tbody.innerHTML = '';
    
    const sortedRounds = [...appData.rounds].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedRounds.slice(0, 20).forEach(round => {
        const golfer = appData.golfers.find(g => g.id === round.golfer_id);
        const course = appData.courses.find(c => c.id === round.course_id);
        
        const fairwayPct = round.fairways_hit !== null ? 
            `${Math.round((round.fairways_hit / 14) * 100)}%` : 'N/A';
        const girPct = round.gir !== null ? 
            `${Math.round((round.gir / 18) * 100)}%` : 'N/A';
        
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${new Date(round.date).toLocaleDateString()}</td>
            <td>${golfer?.name || 'Unknown'}</td>
            <td>${course?.name || 'Unknown'}</td>
            <td>${round.score}</td>
            <td>${round.putts || 'N/A'}</td>
            <td>${fairwayPct}</td>
            <td>${girPct}</td>
            <td>
                <button class="btn btn-secondary" onclick="deleteRound('${round.id}')">Delete</button>
            </td>
        `;
    });
}

async function deleteRound(roundId) {
    if (!confirm('Are you sure you want to delete this round?')) return;
    
    try {
        if (supabase) {
            await supabase.from('rounds').delete().eq('id', roundId);
        }
        
        appData.rounds = appData.rounds.filter(r => r.id !== roundId);
        saveLocalData();
        updateRoundsTable();
        updateDashboard();
    } catch (error) {
        alert('Error deleting round: ' + error.message);
    }
}

// =============================================================================
// Statistics and Analytics
// =============================================================================

function calculateHandicap(golferId) {
    const rounds = appData.rounds
        .filter(r => r.golfer_id === golferId && r.differential !== null)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (rounds.length < 3) return null;
    
    const differentials = rounds.map(r => r.differential);
    let usedRounds = 0;
    
    if (rounds.length >= 3 && rounds.length <= 4) {
        usedRounds = 1;
    } else if (rounds.length >= 5 && rounds.length <= 6) {
        usedRounds = 2;
    } else if (rounds.length >= 7 && rounds.length <= 8) {
        usedRounds = 3;
    } else if (rounds.length >= 9 && rounds.length <= 11) {
        usedRounds = 4;
    } else if (rounds.length >= 12 && rounds.length <= 14) {
        usedRounds = 5;
    } else if (rounds.length >= 15 && rounds.length <= 16) {
        usedRounds = 6;
    } else if (rounds.length >= 17 && rounds.length <= 18) {
        usedRounds = 7;
    } else if (rounds.length >= 19) {
        usedRounds = 8;
    }
    
    const bestDifferentials = differentials
        .sort((a, b) => a - b)
        .slice(0, usedRounds);
    
    const averageDifferential = bestDifferentials.reduce((sum, diff) => sum + diff, 0) / bestDifferentials.length;
    
    return Math.round(averageDifferential * 0.96 * 10) / 10;
}

function calculateDifferential(score, course, holesPlayed = 18) {
    if (!course || !course.rating || !course.slope) return null;
    
    const adjustedScore = score; // In a full implementation, this would apply ESC
    const scaleFactor = holesPlayed === 9 ? 2 : 1;
    
    return ((adjustedScore * scaleFactor) - course.rating) * 113 / course.slope;
}

function getHandicapCategory(handicap) {
    if (handicap === null) return 'No Handicap';
    if (handicap <= 5) return 'Scratch Golfer';
    if (handicap <= 9) return 'Single Digit';
    if (handicap <= 18) return 'Mid Handicap';
    if (handicap <= 28) return 'High Handicap';
    return 'Beginner';
}

function getPerformanceBenchmark(handicap) {
    if (handicap === null) return PERFORMANCE_BENCHMARKS.beginner;
    if (handicap <= 5) return PERFORMANCE_BENCHMARKS.scratch;
    if (handicap <= 9) return PERFORMANCE_BENCHMARKS.single;
    if (handicap <= 18) return PERFORMANCE_BENCHMARKS.mid;
    if (handicap <= 28) return PERFORMANCE_BENCHMARKS.high;
    return PERFORMANCE_BENCHMARKS.beginner;
}

function updateDashboard() {
    if (appData.golfers.length === 0) {
        // Show empty state
        document.getElementById('current-handicap').textContent = '--';
        document.getElementById('handicap-category').textContent = 'No Golfers';
        document.getElementById('rounds-for-handicap').textContent = '0';
        return;
    }
    
    // Get primary golfer (first one for now)
    const primaryGolfer = appData.golfers[0];
    const handicap = calculateHandicap(primaryGolfer.id);
    const golferRounds = appData.rounds.filter(r => r.golfer_id === primaryGolfer.id);
    const category = getHandicapCategory(handicap);
    const benchmark = getPerformanceBenchmark(handicap);
    
    // Update handicap display
    document.getElementById('current-handicap').textContent = handicap !== null ? handicap.toFixed(1) : '--';
    document.getElementById('handicap-category').textContent = category;
    document.getElementById('rounds-for-handicap').textContent = golferRounds.length;
    
    // Calculate user averages
    const avgScore = golferRounds.length > 0 ? 
        golferRounds.reduce((sum, r) => sum + r.score, 0) / golferRounds.length : 0;
    const avgFairways = golferRounds.filter(r => r.fairways_hit !== null).length > 0 ? 
        golferRounds.filter(r => r.fairways_hit !== null).reduce((sum, r) => sum + (r.fairways_hit / 14 * 100), 0) / golferRounds.filter(r => r.fairways_hit !== null).length : 0;
    const avgGir = golferRounds.filter(r => r.gir !== null).length > 0 ? 
        golferRounds.filter(r => r.gir !== null).reduce((sum, r) => sum + (r.gir / 18 * 100), 0) / golferRounds.filter(r => r.gir !== null).length : 0;
    const avgPutts = golferRounds.filter(r => r.putts !== null).length > 0 ? 
        golferRounds.filter(r => r.putts !== null).reduce((sum, r) => sum + r.putts, 0) / golferRounds.filter(r => r.putts !== null).length : 0;
    
    // Update performance comparison
    document.getElementById('your-avg-score').textContent = avgScore > 0 ? avgScore.toFixed(1) : '--';
    document.getElementById('peer-avg-score').textContent = benchmark.avgScore;
    document.getElementById('score-vs-peers').textContent = avgScore > 0 ? (avgScore - benchmark.avgScore > 0 ? '+' : '') + (avgScore - benchmark.avgScore).toFixed(1) : '--';
    
    document.getElementById('your-fairway-pct').textContent = avgFairways > 0 ? avgFairways.toFixed(0) + '%' : '--%';
    document.getElementById('peer-fairway-pct').textContent = benchmark.fairwayPct + '%';
    document.getElementById('fairway-ranking').textContent = avgFairways > 0 ? 
        (avgFairways >= benchmark.fairwayPct ? Math.min(95, 50 + ((avgFairways - benchmark.fairwayPct) / benchmark.fairwayPct * 45)) : Math.max(5, 50 - ((benchmark.fairwayPct - avgFairways) / benchmark.fairwayPct * 45))).toFixed(0) + 'th' : '--';
    
    document.getElementById('your-gir-pct').textContent = avgGir > 0 ? avgGir.toFixed(0) + '%' : '--%';
    document.getElementById('peer-gir-pct').textContent = benchmark.girPct + '%';
    document.getElementById('gir-ranking').textContent = avgGir > 0 ? 
        (avgGir >= benchmark.girPct ? Math.min(95, 50 + ((avgGir - benchmark.girPct) / benchmark.girPct * 45)) : Math.max(5, 50 - ((benchmark.girPct - avgGir) / benchmark.girPct * 45))).toFixed(0) + 'th' : '--';
    
    document.getElementById('your-putts').textContent = avgPutts > 0 ? avgPutts.toFixed(1) : '--';
    document.getElementById('peer-putts').textContent = benchmark.avgPutts.toFixed(1);
    document.getElementById('putting-ranking').textContent = avgPutts > 0 ? 
        (avgPutts <= benchmark.avgPutts ? Math.min(95, 50 + ((benchmark.avgPutts - avgPutts) / benchmark.avgPutts * 45)) : Math.max(5, 50 - ((avgPutts - benchmark.avgPutts) / benchmark.avgPutts * 45))).toFixed(0) + 'th' : '--';
    
    // Update progress bars
    updateProgressBar('score-comparison-bar', avgScore > 0 ? Math.max(0, Math.min(100, 100 - ((avgScore - benchmark.avgScore) / benchmark.avgScore * 50))) : 50);
    updateProgressBar('fairway-comparison-bar', avgFairways > 0 ? Math.max(0, Math.min(100, (avgFairways / benchmark.fairwayPct) * 50)) : 50);
    updateProgressBar('gir-comparison-bar', avgGir > 0 ? Math.max(0, Math.min(100, (avgGir / benchmark.girPct) * 50)) : 50);
    updateProgressBar('putting-comparison-bar', avgPutts > 0 ? Math.max(0, Math.min(100, (benchmark.avgPutts / avgPutts) * 50)) : 50);
    
    // Update key statistics
    document.getElementById('total-rounds').textContent = appData.rounds.length;
    document.getElementById('best-score').textContent = golferRounds.length > 0 ? Math.min(...golferRounds.map(r => r.score)) : '--';
    document.getElementById('consistency-rating').textContent = golferRounds.length >= 5 ? 
        (100 - Math.min(100, (calculateStandardDeviation(golferRounds.map(r => r.score)) / avgScore * 100))).toFixed(0) + '%' : '--';
    document.getElementById('total-courses').textContent = new Set(golferRounds.map(r => r.course_id)).size;
}

function updateProgressBar(id, percentage) {
    const bar = document.getElementById(id);
    if (bar) {
        bar.style.width = percentage + '%';
    }
}

function calculateStandardDeviation(values) {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDifferences = values.map(val => Math.pow(val - mean, 2));
    const variance = squaredDifferences.reduce((sum, val) => sum + val, 0) / values.length;
    return Math.sqrt(variance);
}

function generateAdvancedStats() {
    const golferFilter = document.getElementById('stats-golfer').value;
    const roundsFilter = document.getElementById('stats-rounds').value;
    
    let filteredRounds = appData.rounds;
    
    if (golferFilter) {
        filteredRounds = filteredRounds.filter(r => r.golfer_id === golferFilter);
    }
    
    if (roundsFilter !== 'all') {
        const limit = parseInt(roundsFilter);
        filteredRounds = filteredRounds
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit);
    }
    
    if (filteredRounds.length === 0) {
        // Reset all values to default
        document.getElementById('avg-score-detailed').textContent = '--';
        document.getElementById('score-consistency').textContent = '--';
        document.getElementById('best-vs-worst').textContent = '--';
        document.getElementById('putting-avg').textContent = '--';
        document.getElementById('putts-per-gir').textContent = '--';
        document.getElementById('scrambling').textContent = '--%';
        document.getElementById('fairway-accuracy').textContent = '--%';
        document.getElementById('gir-percentage').textContent = '--%';
        document.getElementById('proximity-to-pin').textContent = '-- ft';
        return;
    }
    
    // Scoring performance
    const scores = filteredRounds.map(r => r.score);
    const avgScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;
    const stdDev = calculateStandardDeviation(scores);
    const bestScore = Math.min(...scores);
    const worstScore = Math.max(...scores);
    
    // Putting stats
    const puttsRounds = filteredRounds.filter(r => r.putts !== null);
    const avgPutts = puttsRounds.length > 0 ? 
        puttsRounds.reduce((sum, r) => sum + r.putts, 0) / puttsRounds.length : 0;
    
    const girRounds = filteredRounds.filter(r => r.gir !== null && r.putts !== null);
    const puttsPerGir = girRounds.length > 0 ? 
        girRounds.reduce((sum, r) => sum + (r.putts / r.gir), 0) / girRounds.length : 0;
    
    // Ball striking
    const fairwayRounds = filteredRounds.filter(r => r.fairways_hit !== null);
    const fairwayAccuracy = fairwayRounds.length > 0 ? 
        fairwayRounds.reduce((sum, r) => sum + (r.fairways_hit / 14), 0) / fairwayRounds.length * 100 : 0;
    
    const girRoundsOnly = filteredRounds.filter(r => r.gir !== null);
    const girPercentage = girRoundsOnly.length > 0 ? 
        girRoundsOnly.reduce((sum, r) => sum + (r.gir / 18), 0) / girRoundsOnly.length * 100 : 0;
    
    // Update display
    document.getElementById('avg-score-detailed').textContent = avgScore.toFixed(1);
    document.getElementById('score-consistency').textContent = stdDev.toFixed(1);
    document.getElementById('best-vs-worst').textContent = `${bestScore} - ${worstScore}`;
    document.getElementById('putting-avg').textContent = avgPutts > 0 ? avgPutts.toFixed(1) : '--';
    document.getElementById('putts-per-gir').textContent = puttsPerGir > 0 ? puttsPerGir.toFixed(2) : '--';
    document.getElementById('scrambling').textContent = '65%'; // Placeholder
    document.getElementById('fairway-accuracy').textContent = fairwayAccuracy > 0 ? fairwayAccuracy.toFixed(0) + '%' : '--%';
    document.getElementById('gir-percentage').textContent = girPercentage > 0 ? girPercentage.toFixed(0) + '%' : '--%';
    document.getElementById('proximity-to-pin').textContent = '25 ft'; // Placeholder
}

function generateParAnalysis() {
    const golferFilter = document.getElementById('par-golfer').value;
    const courseFilter = document.getElementById('par-course').value;
    
    // This would require hole-by-hole data, which we don't have in the current structure
    // For now, show placeholder values
    document.getElementById('par3-avg').textContent = '3.2';
    document.getElementById('par4-avg').textContent = '4.3';
    document.getElementById('par5-avg').textContent = '5.1';
    
    updateProgressBar('par3-progress', 80);
    updateProgressBar('par4-progress', 70);
    updateProgressBar('par5-progress', 90);
}

// =============================================================================
// Scorecard Functions
// =============================================================================

function loadScorecard() {
    const courseId = document.getElementById('sc-course').value;
    const course = appData.courses.find(c => c.id === courseId);
    
    if (!course) {
        document.getElementById('scorecard-display').innerHTML = '<p>Select a course to display the scorecard.</p>';
        document.getElementById('save-scorecard').style.display = 'none';
        return;
    }
    
    const scorecardHtml = generateScorecardTable(course);
    document.getElementById('scorecard-display').innerHTML = scorecardHtml;
    document.getElementById('save-scorecard').style.display = 'block';
}

function generateScorecardTable(course) {
    const frontNine = course.holes.slice(0, 9);
    const backNine = course.holes.slice(9);
    
    let html = '<table class="scorecard-table">';
    
    // Front nine
    html += '<thead><tr><th>Hole</th>';
    frontNine.forEach(hole => html += `<th>${hole.hole}</th>`);
    html += '<th>OUT</th></tr></thead>';
    
    html += '<tbody>';
    
    // Yardage row
    html += '<tr><td><strong>Yardage</strong></td>';
    frontNine.forEach(hole => html += `<td>${hole.yardage}</td>`);
    html += '<td>-</td></tr>';
    
    // Par row
    html += '<tr><td><strong>Par</strong></td>';
    frontNine.forEach(hole => html += `<td>${hole.par}</td>`);
    const frontPar = frontNine.reduce((sum, hole) => sum + hole.par, 0);
    html += `<td><strong>${frontPar}</strong></td></tr>`;
    
    // Handicap row
    html += '<tr><td><strong>HCP</strong></td>';
    frontNine.forEach(hole => html += `<td>${hole.handicap}</td>`);
    html += '<td>-</td></tr>';
    
    // Score row
    html += '<tr><td><strong>Score</strong></td>';
    frontNine.forEach(hole => html += `<td><input type="number" id="score-${hole.hole}" min="1" max="12" oninput="updateScorecardTotals()"></td>`);
    html += '<td><strong id="front-total">-</strong></td></tr>';
    
    html += '</tbody>';
    
    // Back nine (if 18-hole course)
    if (backNine.length > 0) {
        html += '<thead><tr><th>Hole</th>';
        backNine.forEach(hole => html += `<th>${hole.hole}</th>`);
        html += '<th>IN</th><th>TOTAL</th></tr></thead>';
        
        html += '<tbody>';
        
        // Yardage row
        html += '<tr><td><strong>Yardage</strong></td>';
        backNine.forEach(hole => html += `<td>${hole.yardage}</td>`);
        html += '<td>-</td><td>-</td></tr>';
        
        // Par row
        html += '<tr><td><strong>Par</strong></td>';
        backNine.forEach(hole => html += `<td>${hole.par}</td>`);
        const backPar = backNine.reduce((sum, hole) => sum + hole.par, 0);
        html += `<td><strong>${backPar}</strong></td><td><strong>${frontPar + backPar}</strong></td></tr>`;
        
        // Handicap row
        html += '<tr><td><strong>HCP</strong></td>';
        backNine.forEach(hole => html += `<td>${hole.handicap}</td>`);
        html += '<td>-</td><td>-</td></tr>';
        
        // Score row
        html += '<tr><td><strong>Score</strong></td>';
        backNine.forEach(hole => html += `<td><input type="number" id="score-${hole.hole}" min="1" max="12" oninput="updateScorecardTotals()"></td>`);
        html += '<td><strong id="back-total">-</strong></td><td><strong id="grand-total">-</strong></td></tr>';
        
        html += '</tbody>';
    }
    
    html += '</table>';
    
    return html;
}

function updateScorecardTotals() {
    const courseId = document.getElementById('sc-course').value;
    const course = appData.courses.find(c => c.id === courseId);
    
    if (!course) return;
    
    let frontTotal = 0;
    let backTotal = 0;
    let frontCount = 0;
    let backCount = 0;
    
    course.holes.forEach(hole => {
        const scoreInput = document.getElementById(`score-${hole.hole}`);
        const score = parseInt(scoreInput.value) || 0;
        
        if (score > 0) {
            if (hole.hole <= 9) {
                frontTotal += score;
                frontCount++;
            } else {
                backTotal += score;
                backCount++;
            }
        }
    });
    
    document.getElementById('front-total').textContent = frontCount > 0 ? frontTotal : '-';
    
    if (course.type === 18) {
        document.getElementById('back-total').textContent = backCount > 0 ? backTotal : '-';
        document.getElementById('grand-total').textContent = frontCount > 0 || backCount > 0 ? frontTotal + backTotal : '-';
    }
}

async function saveScorecard() {
    const golferId = document.getElementById('sc-golfer').value;
    const courseId = document.getElementById('sc-course').value;
    const date = document.getElementById('sc-date').value;
    
    if (!golferId || !courseId || !date) {
        alert('Please fill in golfer, course, and date');
        return;
    }
    
    const course = appData.courses.find(c => c.id === courseId);
    const scores = [];
    let totalScore = 0;
    
    course.holes.forEach(hole => {
        const scoreInput = document.getElementById(`score-${hole.hole}`);
        const score = parseInt(scoreInput.value) || 0;
        if (score > 0) {
            scores.push({ hole: hole.hole, score: score });
            totalScore += score;
        }
    });
    
    if (scores.length === 0) {
        alert('Please enter at least one score');
        return;
    }
    
    const round = {
        id: generateId(),
        date: date,
        golfer_id: golferId,
        course_id: courseId,
        score: totalScore,
        holes_played: scores.length,
        hole_scores: scores,
        differential: calculateDifferential(totalScore, course, scores.length),
        user_id: currentUser.id || 'demo',
        created_at: new Date().toISOString()
    };
    
    try {
        if (supabase) {
            const { error } = await supabase
                .from('rounds')
                .insert([round]);
            
            if (error) throw error;
        }
        
        appData.rounds.push(round);
        saveLocalData();
        updateDashboard();
        
        alert('Scorecard saved successfully!');
        
        // Clear scorecard
        course.holes.forEach(hole => {
            document.getElementById(`score-${hole.hole}`).value = '';
        });
        updateScorecardTotals();
    } catch (error) {
        alert('Error saving scorecard: ' + error.message);
    }
}

// =============================================================================
// Utility Functions
// =============================================================================

function updateAllSelects() {
    // Update golfer selects
    const golferSelects = ['round-golfer', 'stats-golfer', 'par-golfer', 'sc-golfer'];
    golferSelects.forEach(selectId => {
        const select = document.getElementById(selectId);
        const currentValue = select.value;
        
        // Clear options except the first one
        while (select.options.length > 1) {
            select.remove(1);
        }
        
        // Add golfer options
        appData.golfers.forEach(golfer => {
            const option = new Option(golfer.name, golfer.id);
            select.add(option);
        });
        
        // Restore selection if possible
        if (currentValue) {
            select.value = currentValue;
        }
    });
    
    // Update course selects
    const courseSelects = ['round-course', 'par-course', 'sc-course'];
    courseSelects.forEach(selectId => {
        const select = document.getElementById(selectId);
        const currentValue = select.value;
        
        // Clear options except the first one
        while (select.options.length > 1) {
            select.remove(1);
        }
        
        // Add course options
        appData.courses.forEach(course => {
            const option = new Option(course.name, course.id);
            select.add(option);
        });
        
        // Restore selection if possible
        if (currentValue) {
            select.value = currentValue;
        }
    });
}

function generateId() {
    return 'id_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// =============================================================================
// Data Import/Export
// =============================================================================

function exportData() {
    const exportData = {
        golfers: appData.golfers,
        courses: appData.courses,
        rounds: appData.rounds,
        exported_at: new Date().toISOString(),
        user: currentUser.email
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `golf_data_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            if (importedData.golfers && importedData.courses && importedData.rounds) {
                if (confirm('This will replace all your current data. Are you sure?')) {
                    appData = {
                        golfers: importedData.golfers,
                        courses: importedData.courses,
                        rounds: importedData.rounds
                    };
                    
                    saveLocalData();
                    updateAllSelects();
                    updateDashboard();
                    updateGolfersTable();
                    updateCoursesTable();
                    updateRoundsTable();
                    
                    alert('Data imported successfully!');
                }
            } else {
                alert('Invalid data format');
            }
        } catch (error) {
            alert('Error importing data: ' + error.message);
        }
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
}

// =============================================================================
// Initialize Application
// =============================================================================

// Make functions globally available
window.showAuthTab = showAuthTab;
window.logout = logout;
window.showTab = showTab;
window.addGolfer = addGolfer;
window.clearGolferForm = clearGolferForm;
window.deleteGolfer = deleteGolfer;
window.addCourse = addCourse;
window.clearCourseForm = clearCourseForm;
window.deleteCourse = deleteCourse;
window.updateCourseInfo = updateCourseInfo;
window.addRound = addRound;
window.clearRoundForm = clearRoundForm;
window.deleteRound = deleteRound;
window.generateAdvancedStats = generateAdvancedStats;
window.generateParAnalysis = generateParAnalysis;
window.loadScorecard = loadScorecard;
window.saveScorecard = saveScorecard;
window.updateScorecardTotals = updateScorecardTotals;
window.exportData = exportData;
window.importData = importData;
