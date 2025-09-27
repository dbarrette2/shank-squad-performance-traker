<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Shank Squad - Golf Performance Analysis</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <!-- Authentication Screen -->
    <div id="auth-screen" class="container">
        <div class="auth-container">
            <h1 style="text-align: center; color: #2c5530; margin-bottom: 30px;">🏌️ The Shank Squad</h1>
            
            <div class="auth-tabs">
                <button class="auth-tab active" onclick="showAuthTab('login')">Login</button>
                <button class="auth-tab" onclick="showAuthTab('register')">Register</button>
            </div>

            <div id="auth-error" class="error-message"></div>
            <div id="auth-success" class="success-message"></div>

            <!-- Login Form -->
            <form id="login-form" class="auth-form active">
                <div class="form-group">
                    <label for="login-email">Email</label>
                    <input type="email" id="login-email" required>
                </div>
                <div class="form-group">
                    <label for="login-password">Password</label>
                    <input type="password" id="login-password" required>
                </div>
                <button type="submit" class="btn" id="login-btn">Login</button>
            </form>

            <!-- Register Form -->
            <form id="register-form" class="auth-form">
                <div class="form-group">
                    <label for="register-username">Username</label>
                    <input type="text" id="register-username" required>
                </div>
                <div class="form-group">
                    <label for="register-email">Email</label>
                    <input type="email" id="register-email" required>
                </div>
                <div class="form-group">
                    <label for="register-password">Password</label>
                    <input type="password" id="register-password" required minlength="6">
                </div>
                <button type="submit" class="btn" id="register-btn">Register</button>
            </form>
        </div>
    </div>

    <!-- Main Application -->
    <div id="app-screen" class="container hidden">
        <div class="header">
            <div class="user-info">
                <span id="user-display"></span>
                <button class="btn btn-secondary" onclick="logout()" style="margin-left: 15px; padding: 6px 12px; font-size: 0.8rem;">Logout</button>
            </div>
            <h1>🏌️ The Shank Squad</h1>
            <p>Performance Analysis</p>
        </div>

        <div class="loading" id="loading">
            <p>Loading your golf data...</p>
        </div>

        <div id="main-content" class="hidden">
            <div class="tab-navigation">
                <button class="tab-btn active" onclick="showTab('dashboard')">Dashboard</button>
                <button class="tab-btn" onclick="showTab('golfers')">Golfers</button>
                <button class="tab-btn" onclick="showTab('courses')">Courses</button>
                <button class="tab-btn" onclick="showTab('rounds')">Rounds</button>
                <button class="tab-btn" onclick="showTab('advanced-stats')">Advanced Stats</button>
                <button class="tab-btn" onclick="showTab('par-analysis')">Par Analysis</button>
                <button class="tab-btn" onclick="showTab('scorecard')">Scorecard</button>
            </div>

            <!-- Dashboard Tab -->
            <div id="dashboard" class="tab-content active">
                <h2>🏠 Performance Dashboard</h2>
                
                <div class="section-header">Current Handicap & Trending</div>
                <div class="stats-grid">
                    <div class="stat-card" style="border-left: 4px solid #e74c3c;">
                        <div class="stat-value" id="current-handicap">--</div>
                        <div class="stat-label">Current Handicap Index</div>
                        <div class="trend-indicator" id="handicap-trend"></div>
                    </div>
                    <div class="stat-card" style="border-left: 4px solid #3498db;">
                        <div class="stat-value" id="handicap-category">--</div>
                        <div class="stat-label">Player Category</div>
                    </div>
                    <div class="stat-card" style="border-left: 4px solid #f39c12;">
                        <div class="stat-value" id="rounds-for-handicap">--</div>
                        <div class="stat-label">Rounds Used in Calculation</div>
                    </div>
                </div>

                <div class="section-header">Performance vs Peer Handicap Range</div>
                <div class="detailed-stats">
                    <div class="stat-section">
                        <h3>📊 Scoring Comparison</h3>
                        <div class="round-stats-grid">
                            <div class="quick-stat">
                                <div class="value" id="your-avg-score">--</div>
                                <div class="label">Your Average</div>
                            </div>
                            <div class="quick-stat">
                                <div class="value" id="peer-avg-score">--</div>
                                <div class="label">Peer Average</div>
                            </div>
                            <div class="quick-stat">
                                <div class="value" id="score-vs-peers">--</div>
                                <div class="label">Difference</div>
                            </div>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" id="score-comparison-bar" style="width: 50%;"></div>
                        </div>
                    </div>

                    <div class="stat-section">
                        <h3>🎯 Ball Striking vs Peers</h3>
                        <div class="round-stats-grid">
                            <div class="quick-stat">
                                <div class="value" id="your-fairway-pct">--%</div>
                                <div class="label">Your FW%</div>
                            </div>
                            <div class="quick-stat">
                                <div class="value" id="peer-fairway-pct">--%</div>
                                <div class="label">Peer FW%</div>
                            </div>
                            <div class="quick-stat">
                                <div class="value" id="fairway-ranking">--</div>
                                <div class="label">Percentile</div>
                            </div>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" id="fairway-comparison-bar" style="width: 50%;"></div>
                        </div>
                        
                        <div class="round-stats-grid" style="margin-top: 15px;">
                            <div class="quick-stat">
                                <div class="value" id="your-gir-pct">--%</div>
                                <div class="label">Your GIR%</div>
                            </div>
                            <div class="quick-stat">
                                <div class="value" id="peer-gir-pct">--%</div>
                                <div class="label">Peer GIR%</div>
                            </div>
                            <div class="quick-stat">
                                <div class="value" id="gir-ranking">--</div>
                                <div class="label">Percentile</div>
                            </div>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" id="gir-comparison-bar" style="width: 50%;"></div>
                        </div>
                    </div>

                    <div class="stat-section">
                        <h3>⛳ Putting vs Peers</h3>
                        <div class="round-stats-grid">
                            <div class="quick-stat">
                                <div class="value" id="your-putts">--</div>
                                <div class="label">Your Avg Putts</div>
                            </div>
                            <div class="quick-stat">
                                <div class="value" id="peer-putts">--</div>
                                <div class="label">Peer Avg Putts</div>
                            </div>
                            <div class="quick-stat">
                                <div class="value" id="putting-ranking">--</div>
                                <div class="label">Percentile</div>
                            </div>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" id="putting-comparison-bar" style="width: 50%;"></div>
                        </div>
                    </div>
                </div>

                <div class="section-header">Your Key Statistics</div>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-value" id="total-rounds">0</div>
                        <div class="stat-label">Total Rounds</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" id="best-score">--</div>
                        <div class="stat-label">Best Score</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" id="consistency-rating">--</div>
                        <div class="stat-label">Consistency Rating</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" id="total-courses">--</div>
                        <div class="stat-label">Courses Played</div>
                    </div>
                </div>

                <div class="performance-chart">
                    <h3>🎯 Recent Performance Trends</h3>
                    <div id="trend-chart" class="chart-container">
                        <div class="bar-chart" id="score-trend"></div>
                    </div>
                </div>
                
                <div class="section-header">Quick Actions</div>
                <button class="btn" onclick="showTab('rounds')">🌏️ Enter New Round</button>
                <button class="btn" onclick="showTab('scorecard')">📊 Quick Scorecard</button>
                <button class="btn export-btn" onclick="exportData()">📤 Export Data</button>
                <button class="btn import-btn" onclick="document.getElementById('import-file').click()">📥 Import Data</button>
                <input type="file" id="import-file" accept=".json" style="display: none" onchange="importData(event)">
            </div>

            <!-- Golfers Tab -->
            <div id="golfers" class="tab-content">
                <h2>⛳ Golfer Management</h2>
                
                <div class="section-header">Add New Golfer</div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="golfer-name">Golfer Name *</label>
                        <input type="text" id="golfer-name" required placeholder="Enter golfer name">
                    </div>
                </div>
                
                <button class="btn" onclick="addGolfer()">Add Golfer</button>
                <button class="btn btn-secondary" onclick="clearGolferForm()">Clear Form</button>
                
                <div class="section-header">Registered Golfers</div>
                <table id="golfers-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Current Handicap Index</th>
                            <th>Rounds Played</th>
                            <th>Latest Round</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>

            <!-- Courses Tab -->
            <div id="courses" class="tab-content">
                <h2>🏟️ Golf Course Management</h2>
                
                <div class="section-header">Course Information</div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="course-name">Course Name *</label>
                        <input type="text" id="course-name" required>
                    </div>
                    <div class="form-group">
                        <label for="course-city">City</label>
                        <input type="text" id="course-city" placeholder="e.g., Augusta">
                    </div>
                    <div class="form-group">
                        <label for="course-state">State</label>
                        <input type="text" id="course-state" placeholder="e.g., GA">
                    </div>
                    <div class="form-group">
                        <label for="course-tees">Tees</label>
                        <input type="text" id="course-tees" placeholder="e.g., Championship, Blue, Tips, Members" value="White">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="course-rating">Course Rating</label>
                        <input type="number" id="course-rating" step="0.1" min="60" max="80" placeholder="e.g., 72.1">
                    </div>
                    <div class="form-group">
                        <label for="course-slope">Slope Rating</label>
                        <input type="number" id="course-slope" min="55" max="155" placeholder="e.g., 113">
                    </div>
                    <div class="form-group">
                        <label for="course-type">Course Type</label>
                        <select id="course-type">
                            <option value="18">18 Hole Course</option>
                            <option value="9">9 Hole Course</option>
                        </select>
                    </div>
                </div>

                <div class="section-header">Detailed Hole Setup</div>
                <p style="text-align: center; margin-bottom: 15px; color: #666;">Change course type above to adjust number of holes</p>
                <div class="course-setup" id="course-holes">
                    <!-- Holes will be generated by JavaScript -->
                </div>
                
                <button class="btn" onclick="addCourse()">Add Course</button>
                <button class="btn btn-secondary" onclick="clearCourseForm()">Clear Form</button>
                
                <table id="courses-table">
                    <thead>
                        <tr>
                            <th>Course Name</th>
                            <th>Location</th>
                            <th>Type</th>
                            <th>Tees</th>
                            <th>Rating</th>
                            <th>Slope</th>
                            <th>Par</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>

            <!-- Rounds Tab -->
            <div id="rounds" class="tab-content">
                <h2>🌏️ Round Entry & Management</h2>
                
                <div class="section-header">Round Information</div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="round-date">Date *</label>
                        <input type="date" id="round-date" required>
                    </div>
                    <div class="form-group">
                        <label for="round-golfer">Golfer *</label>
                        <select id="round-golfer" required>
                            <option value="">Select Golfer...</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="round-course">Course *</label>
                        <select id="round-course" required onchange="updateCourseInfo()">
                            <option value="">Select Course...</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="round-tees">Tees Played</label>
                        <input type="text" id="round-tees" placeholder="e.g., Championship, Blue, Tips, Members" value="White">
                    </div>
                </div>

                <div class="section-header">Performance Statistics</div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="round-score">Total Score *</label>
                        <input type="number" id="round-score" min="50" max="150" required>
                    </div>
                    <div class="form-group">
                        <label for="round-putts">Total Putts</label>
                        <input type="number" id="round-putts" min="18" max="60">
                    </div>
                    <div class="form-group">
                        <label for="round-fairways">Fairways Hit</label>
                        <input type="number" id="round-fairways" min="0" max="14">
                    </div>
                    <div class="form-group">
                        <label for="round-gir">Greens in Regulation</label>
                        <input type="number" id="round-gir" min="0" max="18">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="round-holes">Holes Played</label>
                        <select id="round-holes">
                            <option value="9">9 Holes</option>
                            <option value="18" selected>18 Holes</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="round-competition">Competition/Event</label>
                        <input type="text" id="round-competition" placeholder="e.g., Monthly Medal, Casual Round">
                    </div>
                    <div class="form-group">
                        <label for="round-conditions">Weather Conditions</label>
                        <select id="round-conditions">
                            <option value="Perfect">Perfect</option>
                            <option value="Good">Good</option>
                            <option value="Windy">Windy</option>
                            <option value="Rainy">Rainy</option>
                            <option value="Cold">Cold</option>
                            <option value="Hot">Hot</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="round-notes">Notes</label>
                        <textarea id="round-notes" rows="2" placeholder="Course conditions, key observations, etc."></textarea>
                    </div>
                </div>
                
                <button class="btn" onclick="addRound()">Save Round</button>
                <button class="btn btn-secondary" onclick="clearRoundForm()">Clear Form</button>
                
                <div class="section-header">Recent Rounds</div>
                <table id="rounds-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Golfer</th>
                            <th>Course</th>
                            <th>Score</th>
                            <th>Putts</th>
                            <th>FW%</th>
                            <th>GIR%</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>

            <!-- Advanced Stats Tab -->
            <div id="advanced-stats" class="tab-content">
                <h2>📊 Advanced Performance Analysis</h2>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="stats-golfer">Golfer Filter</label>
                        <select id="stats-golfer" onchange="generateAdvancedStats()">
                            <option value="">All Golfers</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="stats-rounds">Recent Rounds</label>
                        <select id="stats-rounds" onchange="generateAdvancedStats()">
                            <option value="5">Last 5 Rounds</option>
                            <option value="10" selected>Last 10 Rounds</option>
                            <option value="20">Last 20 Rounds</option>
                            <option value="all">All Rounds</option>
                        </select>
                    </div>
                </div>

                <div class="detailed-stats">
                    <div class="stat-section">
                        <h3>🎯 Scoring Performance</h3>
                        <div class="quick-stat">
                            <div class="value" id="avg-score-detailed">--</div>
                            <div class="label">Average Score</div>
                        </div>
                        <div class="quick-stat">
                            <div class="value" id="score-consistency">--</div>
                            <div class="label">Standard Deviation</div>
                        </div>
                        <div class="quick-stat">
                            <div class="value" id="best-vs-worst">--</div>
                            <div class="label">Best vs Worst</div>
                        </div>
                    </div>

                    <div class="stat-section">
                        <h3>⛳ Short Game Analysis</h3>
                        <div class="quick-stat">
                            <div class="value" id="putting-avg">--</div>
                            <div class="label">Putts Per Round</div>
                        </div>
                        <div class="quick-stat">
                            <div class="value" id="putts-per-gir">--</div>
                            <div class="label">Putts Per GIR</div>
                        </div>
                        <div class="quick-stat">
                            <div class="value" id="scrambling">--%</div>
                            <div class="label">Scrambling %</div>
                        </div>
                    </div>

                    <div class="stat-section">
                        <h3>🎯 Ball Striking</h3>
                        <div class="quick-stat">
                            <div class="value" id="fairway-accuracy">--%</div>
                            <div class="label">Fairway Accuracy</div>
                        </div>
                        <div class="quick-stat">
                            <div class="value" id="gir-percentage">--%</div>
                            <div class="label">Greens in Regulation</div>
                        </div>
                        <div class="quick-stat">
                            <div class="value" id="proximity-to-pin">-- ft</div>
                            <div class="label">Avg Distance to Pin</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Par Analysis Tab -->
            <div id="par-analysis" class="tab-content">
                <h2>🎯 Par-by-Par Performance Analysis</h2>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="par-golfer">Golfer Filter</label>
                        <select id="par-golfer" onchange="generateParAnalysis()">
                            <option value="">All Golfers</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="par-course">Course Filter</label>
                        <select id="par-course" onchange="generateParAnalysis()">
                            <option value="">All Courses</option>
                        </select>
                    </div>
                </div>

                <div class="stats-grid" id="par-performance-grid">
                    <div class="stat-card">
                        <div class="stat-value" id="par3-avg">--</div>
                        <div class="stat-label">Par 3 Average</div>
                        <div class="progress-bar">
                            <div class="progress-fill" id="par3-progress" style="width: 0%;"></div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" id="par4-avg">--</div>
                        <div class="stat-label">Par 4 Average</div>
                        <div class="progress-bar">
                            <div class="progress-fill" id="par4-progress" style="width: 0%;"></div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" id="par5-avg">--</div>
                        <div class="stat-label">Par 5 Average</div>
                        <div class="progress-bar">
                            <div class="progress-fill" id="par5-progress" style="width: 0%;"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Scorecard Tab -->
            <div id="scorecard" class="tab-content">
                <h2>📊 Interactive Scorecard</h2>
                <div class="form-row">
                    <div class="form-group">
                        <label for="sc-golfer">Golfer</label>
                        <select id="sc-golfer">
                            <option value="">Select Golfer...</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="sc-course">Course</label>
                        <select id="sc-course" onchange="loadScorecard()">
                            <option value="">Select Course...</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="sc-date">Date</label>
                        <input type="date" id="sc-date">
                    </div>
                </div>
                
                <div id="scorecard-display">
                    <p>Select a course to display the scorecard.</p>
                </div>
                
                <button class="btn btn-success" onclick="saveScorecard()" id="save-scorecard" style="display: none;">Save Scorecard</button>
            </div>
        </div>
    </div>

    <script type="module" src="js/app.js"></script>
</body>
</html>
