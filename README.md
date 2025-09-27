# The Shank Squad - Golf Performance Tracker

A comprehensive web-based golf performance analysis tool that helps golfers track their rounds, calculate USGA handicap indices, and analyze their game performance.

## Features

### Core Functionality
- **Multi-Golfer Support**: Track performance for multiple golfers
- **Course Database**: Detailed course setup with hole-by-hole information (yardage, par, handicap)
- **Round Management**: Complete round entry with comprehensive statistics
- **USGA Handicap Calculation**: Official handicap index calculation following USGA guidelines
- **Data Persistence**: Local storage with export/import capabilities

### Performance Analytics
- **Dashboard Overview**: Real-time performance metrics and trends
- **Peer Comparison**: Compare your stats against handicap-appropriate benchmarks
- **Advanced Statistics**: Detailed analysis of scoring, putting, and ball striking
- **Par Analysis**: Performance breakdown by par 3s, 4s, and 5s
- **Trend Tracking**: Visual representation of score improvements over time

### User Interface
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Interactive Scorecard**: Visual scorecard for easy round entry
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Multiple Views**: Organized tabs for different functions (Dashboard, Golfers, Courses, Rounds, Stats)

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/golf-performance-tracker.git
   cd golf-performance-tracker
   ```

2. **Open the application**
   ```bash
   # Simply open index.html in your web browser
   open index.html
   # or
   start index.html
   # or double-click the file
   ```

3. **Start tracking**
   - Add golfers in the "Golfers" tab
   - Add your golf courses in the "Courses" tab
   - Begin tracking rounds in the "Rounds" tab
   - View analytics in the "Dashboard" and "Advanced Stats" tabs

## Usage Guide

### Adding Golfers
1. Navigate to the "Golfers" tab
2. Enter the golfer's name and click "Add Golfer"
3. The golfer will appear in the registered golfers table

### Setting Up Courses
1. Go to the "Courses" tab
2. Fill in basic course information (name, location, tees, rating, slope)
3. Choose between 9-hole or 18-hole course
4. Enter detailed hole information (yardage, par, handicap for each hole)
5. Click "Add Course" to save

### Recording Rounds
1. Visit the "Rounds" tab
2. Select date, golfer, and course
3. Enter your total score and optional statistics:
   - Total putts
   - Fairways hit
   - Greens in regulation
   - Weather conditions
   - Notes
4. Click "Save Round"

### Using the Scorecard
1. Go to the "Scorecard" tab
2. Select golfer and course
3. Enter scores for each hole
4. Total score calculates automatically
5. Save as a complete round

## Technical Details

### Technology Stack
- **Frontend**: Pure HTML5, CSS3, and JavaScript (ES6+)
- **Storage**: Browser localStorage API
- **Styling**: Custom CSS with responsive grid layouts
- **No Dependencies**: Runs entirely in the browser without external libraries

### Browser Compatibility
- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

### Data Storage
- All data is stored locally in your browser's localStorage
- Data persists between sessions
- Export/import functionality for data backup and transfer

## Handicap Calculation

The application follows official USGA handicap calculation guidelines:

1. **Score Differentials**: Calculated using the formula: `(Adjusted Score - Course Rating) × 113 / Slope Rating`
2. **Rounds Used**: 
   - 3-4 rounds: Use 1 best differential
   - 5-6 rounds: Use best 2-3 differentials  
   - 7-8 rounds: Use best 3-4 differentials
   - 9+ rounds: Use best 8 differentials (for 20+ rounds)
3. **Handicap Index**: Average of selected differentials × 0.96

## Performance Benchmarks

The app compares your performance against established benchmarks by handicap category:

| Category | Handicap Range | Avg Score | Fairway % | GIR % | Avg Putts |
|----------|----------------|-----------|-----------|-------|-----------|
| Scratch | 0-5 | 72 | 75% | 72% | 29.0 |
| Single Digit | 6-9 | 78 | 65% | 55% | 30.5 |
| Mid Handicap | 10-18 | 85 | 55% | 40% | 32.0 |
| High Handicap | 19-28 | 95 | 45% | 25% | 34.0 |
| Beginner | 29+ | 105 | 35% | 15% | 36.0 |

## File Structure

```
golf-performance-tracker/
├── index.html          # Main application file
├── css/
│   └── styles.css      # Application styles
├── js/
│   └── app.js          # Application logic
├── README.md           # This file
├── LICENSE             # MIT License
└── .gitignore         # Git ignore rules
```

## Contributing

Contributions are welcome! Here are some ways you can help:

### Bug Reports
- Use the GitHub Issues tab to report bugs
- Include steps to reproduce the issue
- Specify browser and version

### Feature Requests
- Submit feature ideas via GitHub Issues
- Explain the use case and expected behavior
- Consider backward compatibility

### Code Contributions
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Roadmap

### Planned Features
- [ ] Round history and detailed stroke tracking
- [ ] Course slope/rating database integration
- [ ] Multi-device sync capabilities
- [ ] Advanced statistical analysis (strokes gained)
- [ ] Tournament mode and leaderboards
- [ ] Weather API integration
- [ ] PDF scorecard generation
- [ ] Mobile app version

### Potential Enhancements
- [ ] Course photo gallery
- [ ] GPS distance tracking
- [ ] Social features and sharing
- [ ] Integration with golf course booking systems
- [ ] Wearable device compatibility

## Data Privacy

- All data is stored locally in your browser
- No data is transmitted to external servers
- Use export/import for data backup and transfer
- Clear browser data will remove all golf tracking data

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter issues or have questions:

1. Check the [Issues](https://github.com/yourusername/golf-performance-tracker/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide detailed information about your browser and the steps to reproduce any problems

## Acknowledgments

- USGA for handicap calculation guidelines
- Golf course design inspiration from various public courses
- Performance benchmarks based on industry statistical data

---

**Happy Golfing! May your drives be long and your putts be true!**
