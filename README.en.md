# IRL Admin - Administrative Panel

<div align="center">

[![pt-BR](https://img.shields.io/badge/lang-pt--BR-green.svg)](README.md)
[![en](https://img.shields.io/badge/lang-en-red.svg)](README.en.md)

</div>

Educational management system developed for the **Instituto Dr. Rocha Lima de Proteção e Assistência à Infância** (Dr. Rocha Lima Institute for Child Protection and Assistance) as part of the **Extension Project II (PEX II)** from Descomplica college.

## 📋 About the Project

**IRL Admin** is a web administrative panel developed specifically to assist the pedagogical management of the Instituto Dr. Rocha Lima NGO. The system enables efficient student attendance control, task monitoring, and detailed report generation from collected data, facilitating educators' work and improving pedagogical monitoring.

## 🎯 Problem Statement

During the visit to the NGO, educators reported difficulties in maintaining organized and centralized control over student attendance, homework completion, and school materials verification. These processes were done manually, which was time-consuming, hindered pedagogical monitoring, and limited the generation of consolidated reports for analysis.

IRL Admin emerges as a response to this need, offering a practical and accessible digital solution that optimizes educators' work and improves the institution's pedagogical management.

### 🚀 Objective

Facilitate the work of NGO educators through a digital tool that allows:

- Efficient student attendance control
- Homework completion tracking
- School materials verification (backpack)
- Generation of statistics and reports for pedagogical monitoring

## ✨ Main Features

### Class Management

- **Create and edit classes** with complete information (name, responsible person, school year, status)
- **Automatic alphabetical organization** of classes
- **Status control** (active/inactive) for school period management

### Daily Student Control

- **Attendance/absence recording** with intuitive interface
- **Homework control** (brought/not brought)
- **Backpack verification** (organized/disorganized)
- **Responsive interface** optimized for mobile devices
- **Visual components** with icons and differentiated colors for each status

### Statistics and Reports

- **Main dashboard** with overview of all classes
- **Statistics by specific date** with precise attendance calculations
- **Interactive charts** for data visualization:
  - Last 30 days trend
  - Comparison between classes
  - Percentage distribution by category
  - Monthly statistics
- **Automated calculations** considering all active students

### Student Management

- **Register new students** directly in classes
- **Status control** (active/inactive) for enrollment management
- **Minimalist interface** to facilitate daily use

## 🛠️ Technologies Used

### Frontend

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form + React Hot Toast
- **Routing**: React Router DOM

### Backend & Infrastructure

- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Hosting**: Firebase Hosting

## 📱 Responsiveness

The system was developed with **mobile-first design**, ensuring an optimized experience on:

- Smartphones (main usage interface)
- Tablets and desktops
- Monitors of different resolutions

## 🎨 User Interface

### Design System

- **Thematic colors** based on the NGO's visual identity
- **Reusable components** for visual consistency
- **Clear visual feedback** for all user actions
- **Intuitive navigation** with self-explanatory icons

### Accessibility

- **Informative tooltips** on all buttons
- **Clear visual states** (hover, active, disabled)
- **Adequate contrast** to facilitate reading
- **Descriptive texts** for user guidance

## 📊 Analysis Features

### Statistical Calculations

- **Real attendance**: Considers all active students, not just those with records
- **Time zone correction**: Prevents date issues between UTC and local time
- **Period data**: Daily, monthly, and annual analyses
- **Comparison between classes**: To identify patterns and specific needs

### Data Visualization

- **Trend charts**: Tracking evolution over time
- **Pie charts**: Percentage distribution of categories
- **Bar charts**: Comparison between different classes
- **Statistical tables**: Detailed numerical data

## 🔒 Security and Data

- **Firebase Authentication**: Secure login for educators
- **Route protection**: Restricted access to authenticated users
- **Automatic backup**: Data stored in Firebase cloud
- **Privacy**: Compliance with minor data protection guidelines

## 🎓 Academic Context

This project was developed as part of **Extension Project II (PEX II)**, demonstrating:

- **Practical application** of technical knowledge for social benefit
- **Agile methodology** for development
- **Collaboration** between academia and the third sector
- **Social impact** through technology

## 🏛️ About the NGO

The **Instituto Dr. Rocha Lima de Proteção e Assistência à Infância** is a non-profit organization dedicated to the educational and social development of children and adolescents, promoting quality education and citizen formation.

## 🎥 Interface Preview

Access to the system is restricted to registered staff.
To demonstrate its operation, a preview video was prepared showing the main screens and panel features in use, evidencing the real navigation and management experience within the platform.

https://github.com/user-attachments/assets/37b8e4cd-d075-4ea9-a380-afc5bb89234c

## 🚀 How to Run the Project

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- Firebase account with configured project

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/irl-admin.git

# Enter the project folder
cd irl-admin

# Install dependencies
npm install

# Configure environment variables
# Edit src/firebase/config.js with your Firebase credentials

# Run the project in development mode
npm run dev
```

### Build for Production

```bash
# Create optimized build
npm run build

# Preview build locally
npm run preview
```

## 📄 License

This project was developed for exclusive use by the **Instituto Dr. Rocha Lima de Proteção e Assistência à Infância**.

---

<div align="center">

**Developed with ❤️ for Instituto Dr. Rocha Lima de Proteção e Assistência à Infância**

</div>
