# 🏌️ The Shank Squad - Golf Performance Tracker

> Professional-grade golf performance analysis with cloud storage, user authentication, and advanced analytics

[![Version](https://img.shields.io/badge/version-5.0-blue.svg)](https://github.com/yourusername/golf-tracker)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Supabase](https://img.shields.io/badge/database-Supabase-3ECF8E.svg)](https://supabase.com)

## 🚀 Features

### **🔐 Secure Authentication**
- User registration with email verification
- Secure login/logout system
- Username and email-based accounts
- Protected user data with Row Level Security (RLS)

### **☁️ Cloud Storage & Sync**
- Real-time data synchronization across devices
- Secure cloud storage with Supabase
- No storage limits (unlike localStorage)
- Automatic backups and data persistence

### **📊 Advanced Golf Analytics**
- **USGA Handicap Calculations** - Official handicap index using USGA guidelines
- **Performance vs Peers** - Compare your stats against handicap-appropriate benchmarks
- **Detailed Course Management** - Store complete course layouts with hole-by-hole data
- **Comprehensive Round Tracking** - Score, putts, fairways, GIR, weather, and notes
- **Interactive Scorecards** - Visual hole-by-hole score entry with automatic calculations

### **📈 Professional Insights**
- Performance trending and improvement tracking
- Par-by-par analysis (Par 3s, 4s, and 5s)
- Ball striking vs putting performance breakdown
- Consistency ratings and score distribution analysis
- Fairway accuracy and greens in regulation tracking

### **📱 Modern User Experience**
- Responsive design for desktop, tablet, and mobile
- Intuitive tab-based navigation
- Real-time calculations and updates
- Professional visual design with smooth animations

## 🛠️ Quick Start

### **Option 1: Direct Use (Recommended)**
1. **Visit the live application**: [Open Golf Tracker](https://your-gitlab-pages-url) *(if GitLab Pages enabled)*
2. **Register** for a new account with username, email, and password
3. **Check your email** for verification (may take a few minutes)
4. **Login** and start tracking your golf performance!

### **Option 2: Local Development**
```bash
# Clone the repository
git clone https://gitlab.com/yourusername/golf-performance-tracker.git
cd golf-performance-tracker

# Open in browser
open index.html
# or
python -m http.server 8000  # For local development server
```

## 📋 How To Use

### **1. Set Up Your Profile**
- Register with a unique username and email
- Verify your account via email confirmation
- Login to access your personal golf dashboard

### **2. Add Golfers**
- Navigate to the "Golfers" tab
- Add yourself and any other golfers you track
- Each golfer gets individual handicap calculations

### **3. Create Course Database**
- Go to "Courses" tab to add your local golf courses
- Enter basic info (name, location, rating, slope)
- Add detailed hole information (yardage, par, handicap)
- Support for both 9-hole and 18-hole courses

### **4. Track Your Rounds**
Choose from two tracking methods:

**Quick Round Entry:**
- Use "Rounds" tab for fast score entry
- Add total score, putts, fairways hit, GIR
- Include weather conditions and notes

**Detailed Scorecard:**
- Use "Scorecard" tab for hole-by-hole tracking
- Visual scorecard with automatic totaling
- Saves individual hole scores for advanced analysis

### **5. Analyze Performance**
- **Dashboard**: Overview of handicap, trends, and key stats
- **Advanced Stats**: Detailed performance analysis and consistency
- **Par Analysis**: Breakdown of performance by hole difficulty

## 🎯 Understanding Your Data

### **Handicap Calculation**
Uses official USGA guidelines:
- **3-4 rounds**: Uses 1 best differential
- **5-6 rounds**: Uses 2-3 best differentials  
- **7+ rounds**: Uses best 8 differentials (for 20+ rounds)
- **Formula**: `(Adjusted Score - Course Rating) × 113 / Slope Rating`

### **Performance Benchmarks**
Your stats are compared against established benchmarks:

| Handicap Range | Category | Avg Score | Fairway % | GIR % | Avg Putts |
|---------------|----------|-----------|-----------|-------|-----------|
| 0-5 | Scratch | 72 | 75% | 72% | 29.0 |
| 6-9 | Single Digit | 78 | 65% | 55% | 30.5 |
| 10-18 | Mid Handicap | 85 | 55% | 40% | 32.0 |
| 19-28 | High Handicap | 95 | 45% | 25% | 34.0 |
| 29+ | Beginner | 105 | 35% | 15% | 36.0 |

## 🔧 Technical Stack

### **Frontend**
- **HTML5/CSS3** - Modern web standards
- **Vanilla JavaScript (ES6+)** - No framework dependencies
- **CSS Grid & Flexbox** - Responsive layout system
- **ES6 Modules** - Modern JavaScript architecture

### **Backend & Database**
- **Supabase** - PostgreSQL database with real-time features
- **Supabase Auth** - Secure user authentication
- **Row Level Security (RLS)** - Database-level data protection
- **RESTful API** - Standard database operations

### **Features**
- **Progressive Web App Ready** - Can be installed on devices
- **Cross-Platform** - Works on any modern browser
- **Offline Capable** - Core functionality works without internet*
- **Real-time Sync** - Data updates across all your devices

*Offline features planned for future release

## 📊 Data Security & Privacy

### **Your Data is Protected**
- ✅ **Encrypted Storage** - All data encrypted at rest and in transit
- ✅ **User Isolation** - You can only see your own data
- ✅ **No Tracking** - We don't track your usage or sell data
- ✅ **GDPR Compliant** - Full control over your personal data

### **Data Ownership**
- You own all your golf data
- Export functionality for data portability
- Delete your account and data anytime
- No vendor lock-in

## 🗂️ File Structure

```
golf-performance-tracker/
├── index.html              # Main application file
├── css/
│   └── styles.css          # Application styles
├── js/
│   └── app.js              # Application logic & Supabase integration
├── README.md               # This documentation
├── LICENSE                 # MIT License
└── .gitignore             # Git ignore patterns
```

## 📈 Version History

### **v5.0 - Supabase Integration** *(Current)*
- ✅ **User Authentication** - Secure login/register system
- ✅ **Cloud Database** - Replaced localStorage with Supabase
- ✅ **Enhanced Schema** - Detailed hole-by-hole tracking
- ✅ **Cross-Device Sync** - Access data from anywhere
- ✅ **Advanced Security** - Row Level Security implementation
- ✅ **Professional Features** - Enhanced analytics and reporting

### **v4.1 - localStorage Version** *(Legacy)*
- ✅ Local storage-based data persistence
- ✅ Basic handicap calculations
- ✅ Course and round management
- ✅ Simple performance analytics

## 🚧 Roadmap

### **Planned Features**
- [ ] **Mobile App** - Native iOS/Android applications
- [ ] **Social Features** - Share rounds and compete with friends
- [ ] **Tournament Mode** - Organize and track tournament play
- [ ] **Advanced Analytics** - Strokes gained analysis
- [ ] **Course Database** - Integration with public course databases
- [ ] **Weather Integration** - Automatic weather data for rounds
- [ ] **GPS Integration** - Course mapping and shot tracking
- [ ] **Pro Shop Integration** - Equipment recommendations

### **Technical Improvements**
- [ ] **Offline Support** - Full offline functionality with sync
- [ ] **Performance Optimization** - Faster loading and calculations
- [ ] **Advanced Charts** - Interactive performance visualizations
- [ ] **Data Import** - Import from other golf apps
- [ ] **API Access** - Developer API for integrations

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### **🐛 Bug Reports**
1. Check existing [Issues](https://gitlab.com/yourusername/golf-tracker/-/issues)
2. Create detailed bug report with steps to reproduce
3. Include browser/device information

### **💡 Feature Requests**
1. Search existing feature requests
2. Create detailed proposal with use cases
3. Explain how it improves the golf tracking experience

### **👩‍💻 Code Contributions**
```bash
# Fork the repository
git clone https://gitlab.com/yourusername/golf-tracker.git
cd golf-tracker

# Create feature branch
git checkout -b feature/amazing-feature

# Make your changes
# Test thoroughly

# Commit with clear messages
git commit -m "feat: add amazing feature for better golf tracking"

# Push and create merge request
git push origin feature/amazing-feature
```

## 🔒 Privacy & Data

### **What We Store**
- Golf performance data (scores, courses, rounds)
- User account information (username, email)
- Application preferences and settings

### **What We DON'T Store**
- Personal identifying information beyond email
- Location data (unless you manually enter course locations)
- Any data not directly related to golf performance

### **Data Control**
- Export your data anytime
- Delete your account and all data
- Full transparency in data usage

## 📞 Support

### **Getting Help**
1. **Documentation** - Check this README and inline help
2. **Issues** - [Create an issue](https://gitlab.com/yourusername/golf-tracker/-/issues) for bugs or questions
3. **Feature Requests** - Use issue templates for new features

### **Common Issues**
- **Login Problems**: Check email verification and password requirements
- **Data Not Syncing**: Ensure stable internet connection
- **Performance Issues**: Try clearing browser cache

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **USGA** - For handicap calculation guidelines and golf standards
- **Supabase** - For providing excellent backend-as-a-service
- **Golf Community** - For feedback and feature suggestions
- **Open Source Community** - For tools and inspiration

---

## 🏌️‍♂️ Happy Golfing!

*"Golf is a game of inches. The most important are the six inches between your ears."* - Arnold Palmer

Track your progress, improve your game, and enjoy every round! 

**Made with ❤️ for golfers, by golfers.**

---

**🔗 Quick Links:**
- [Live Application](https://your-gitlab-pages-url)
- [Report Bug](https://gitlab.com/yourusername/golf-tracker/-/issues)
- [Request Feature](https://gitlab.com/yourusername/golf-tracker/-/issues)
- [View Source](https://gitlab.com/yourusername/golf-tracker)

*Last updated: [Current Date]*
