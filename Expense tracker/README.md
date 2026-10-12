# ExpenseMate — Personal Finance & Expense Tracker 🌐

> **Platform:** Modern Web Application (HTML5, Vanilla CSS, JavaScript)  
> **Currency:** Fixed strictly to Indian Rupee (`₹ INR`)  
> **Storage:** LocalStorage Relational State with Complete Offline Privacy & Zero External Dependencies  

---

## 📌 Project Overview
**ExpenseMate** is a responsive, feature-packed personal finance web application designed to help individuals record, manage, and analyze their daily income and expenses. It features monthly budget tracking with automated threshold alerts, interactive category spending visual analytics via custom canvas charts, customizable user profile/name, and direct one-click data export into Microsoft Excel spreadsheets.

---

## 🚀 How to Run the Website

### Method 1: Direct Browser Launch (Fastest)
Simply double-click [`index.html`](file:///c:/Expense%20tracker/index.html) or right-click and choose **Open with > Google Chrome / Microsoft Edge / Firefox**.

### Method 2: Local Web Server (Recommended)
You can run a lightweight local server using Python or Node:

```bash
# Using Python
python -m http.server 8000
```
Then navigate to **http://localhost:8000** in your browser.

---

## 🌟 Key Features

### 1. 📊 Real-Time Financial Dashboard
- **Net Balance, Total Income, & Total Expenses**: Instant calculation with Indian Rupee formatting (`₹`).
- **Monthly Budget Tracker**: Real-time progress bar with visual status badges (*Safe*, *Caution*, *Exceeded*).
- **Daily Spending Insights**: Automatic calculation of daily averages, peak expense, and top spending category.
- **Dynamic Category Donut Chart**: Crisp custom Canvas 2D visualization with percentage distribution and legend.
- **7-Day Trend Chart**: Responsive bar chart tracking past 7 days outflows.
- **Recent Activity Table**: View latest transactions with quick edit and delete options.

### 2. 💳 Filterable Transaction Manager
- **Live Search**: Filter dynamically across descriptions, categories, and payment methods.
- **Type Filter**: Switch between *All*, *Expense*, and *Income*.
- **Category & Payment Filter**: Narrow records by categories (*Food, Utilities, Travel, Shopping, Salary, etc.*) and payment modes (*UPI, Cash, Debit/Credit Card, Net Banking*).
- **Sorting Options**: Sort by *Newest*, *Oldest*, *Highest Amount*, or *Lowest Amount*.

### 3. 📗 One-Click Excel Spreadsheet Export
- **Download Excel Sheet**: Directly export complete transaction records with one click on the topbar or the Transactions filter toolbar.
- **UTF-8 Excel Optimization**: Formatted with a UTF-8 BOM so Microsoft Excel opens currency symbols, Indian Rupees (`₹`), notes, and dates cleanly without any encoding issues.
- **Formula-Ready Numbers**: Amounts are exported as numeric values so `=SUM()`, `=AVERAGE()`, and `=COUNT()` work immediately in Excel.
- **Financial Summary Footer**: Includes a formatted bottom summary with Total Income, Total Expenses, Net Savings, Workspace User, and export timestamps.

### 4. 👤 Customizable User Profile & Name
- **Interactive Profile Pill**: Click the bottom-left sidebar user card to open the **Edit User Profile** dialog.
- **Dynamic Avatar Generation**: Initials automatically update in real-time as you type your name (e.g. *Raj Bhere* ➔ *RB*).
- **Personalized Header**: The top dashboard greeting dynamically addresses you by name.
- **Persistent Storage**: Saved in `localStorage` so your name stays preserved across reloads.

### 5. 🎯 Budget Planner
- **Customizable Monthly Limit**: Set and update monthly budgets on the fly.
- **Circular SVG Progress Ring**: Visual indicator of budget utilization.
- **Automated Threshold Warnings**:
  - 🟢 **Safe Zone (<80%)**: Spending is within planned limits.
  - 🟡 **Caution Zone (80%–99%)**: Amber alert banner appears on dashboard.
  - 🔴 **Over-Budget (100%+)**: Critical alert indicating budget exceeded.
- **50/30/20 Financial Rule Guide**: Automatic breakdown of Essential Needs (50%), Discretionary Wants (30%), and Savings (20%).

### 6. 🎨 Design & Accessibility
- **Fintech Dark / Light Modes**: One-click theme toggle persisted across sessions.
- **Fixed Currency**: Standardized strictly to Indian Rupee (`₹ INR`).
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices.

---

## 📂 Project Structure

```
Expense tracker/
├── index.html       // Semantic HTML5 structure, navigation, and modal dialogs
├── style.css        // Design system, dark/light themes, typography, and responsive styles
├── app.js           // State management, localStorage CRUD, custom Canvas charts, and Excel export
└── README.md        // Documentation and user guide
```
