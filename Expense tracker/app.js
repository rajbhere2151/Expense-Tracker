/**
 * ExpenseMate Web — Interactive Financial Dashboard & Expense Tracker
 * Features: LocalStorage CRUD, Custom Canvas Charts, Analytics, CSV/JSON Export, Dark/Light Themes
 */

(function () {
    'use strict';

    // =========================================================================
    // Category Definitions & Themes
    // =========================================================================
    const CATEGORIES = {
        EXPENSE: [
            { id: 'Food & Dining', name: 'Food & Dining', icon: '🍔', color: '#f59e0b' },
            { id: 'Transportation', name: 'Transportation', icon: '🚗', color: '#3b82f6' },
            { id: 'Shopping', name: 'Shopping', icon: '🛍️', color: '#ec4899' },
            { id: 'Bills & Utilities', name: 'Bills & Utilities', icon: '⚡', color: '#8b5cf6' },
            { id: 'Entertainment', name: 'Entertainment', icon: '🎬', color: '#06b6d4' },
            { id: 'Health & Medical', name: 'Health & Medical', icon: '💊', color: '#10b981' },
            { id: 'Education', name: 'Education', icon: '📚', color: '#6366f1' },
            { id: 'Personal Care', name: 'Personal Care', icon: '✨', color: '#d946ef' },
            { id: 'Groceries', name: 'Groceries', icon: '🛒', color: '#84cc16' },
            { id: 'Other Expense', name: 'Other', icon: '📦', color: '#64748b' }
        ],
        INCOME: [
            { id: 'Salary', name: 'Salary', icon: '💼', color: '#10b981' },
            { id: 'Freelance & Contract', name: 'Freelance', icon: '💻', color: '#06b6d4' },
            { id: 'Investments', name: 'Investments', icon: '📈', color: '#6366f1' },
            { id: 'Business', name: 'Business', icon: '🏬', color: '#f59e0b' },
            { id: 'Gift & Bonus', name: 'Gift / Bonus', icon: '🎁', color: '#ec4899' },
            { id: 'Other Income', name: 'Other', icon: '💰', color: '#84cc16' }
        ]
    };

    // Realistic Demo Transactions
    const INITIAL_DEMO_TRANSACTIONS = [
        {
            id: 'tx_demo_1',
            type: 'INCOME',
            amount: 65000,
            category: 'Salary',
            description: 'Monthly Tech Salary - Cognizant',
            paymentMethod: 'Net Banking',
            date: getRecentDate(12),
            timestamp: Date.now() - 12 * 86400000
        },
        {
            id: 'tx_demo_2',
            type: 'EXPENSE',
            amount: 14500,
            category: 'Bills & Utilities',
            description: 'Apartment Rent & Maintenance',
            paymentMethod: 'UPI',
            date: getRecentDate(11),
            timestamp: Date.now() - 11 * 86400000
        },
        {
            id: 'tx_demo_3',
            type: 'EXPENSE',
            amount: 3200,
            category: 'Groceries',
            description: 'Nature Basket Weekly Organic Supplies',
            paymentMethod: 'UPI',
            date: getRecentDate(7),
            timestamp: Date.now() - 7 * 86400000
        },
        {
            id: 'tx_demo_4',
            type: 'EXPENSE',
            amount: 1850,
            category: 'Food & Dining',
            description: 'Dinner with colleagues at Barbeque Nation',
            paymentMethod: 'Debit/Credit Card',
            date: getRecentDate(5),
            timestamp: Date.now() - 5 * 86400000
        },
        {
            id: 'tx_demo_5',
            type: 'INCOME',
            amount: 12000,
            category: 'Freelance & Contract',
            description: 'UI Design Milestone Payment',
            paymentMethod: 'UPI',
            date: getRecentDate(4),
            timestamp: Date.now() - 4 * 86400000
        },
        {
            id: 'tx_demo_6',
            type: 'EXPENSE',
            amount: 1250,
            category: 'Transportation',
            description: 'Uber rides & Metro recharge',
            paymentMethod: 'UPI',
            date: getRecentDate(3),
            timestamp: Date.now() - 3 * 86400000
        },
        {
            id: 'tx_demo_7',
            type: 'EXPENSE',
            amount: 4500,
            category: 'Shopping',
            description: 'Nike Running Shoes & Apparel',
            paymentMethod: 'Debit/Credit Card',
            date: getRecentDate(2),
            timestamp: Date.now() - 2 * 86400000
        },
        {
            id: 'tx_demo_8',
            type: 'EXPENSE',
            amount: 799,
            category: 'Entertainment',
            description: 'Netflix 4K & Spotify Subscription',
            paymentMethod: 'Debit/Credit Card',
            date: getRecentDate(1),
            timestamp: Date.now() - 1 * 86400000
        },
        {
            id: 'tx_demo_9',
            type: 'EXPENSE',
            amount: 420,
            category: 'Food & Dining',
            description: 'Coffee & Snacks at Blue Tokai',
            paymentMethod: 'UPI',
            date: getRecentDate(0),
            timestamp: Date.now()
        }
    ];

    function getRecentDate(daysAgo) {
        const d = new Date();
        d.setDate(d.getDate() - daysAgo);
        return d.toISOString().split('T')[0];
    }

    // =========================================================================
    // State Store
    // =========================================================================
    const StorageKey = {
        TRANSACTIONS: 'expensemate_transactions_v1',
        BUDGET: 'expensemate_monthly_budget_v1',
        PROFILE: 'expensemate_profile_v1',
        THEME: 'expensemate_theme_v1'
    };

    let state = {
        transactions: [],
        monthlyBudget: 35000,
        currency: '₹', // Fixed exclusively to INR (₹)
        userProfile: {
            name: 'John Doe',
            role: 'Personal Workspace'
        },
        theme: 'dark',
        activeTab: 'dashboard',
        editingId: null,
        deleteTargetId: null
    };

    // =========================================================================
    // Initialization
    // =========================================================================
    function init() {
        loadPersistedState();
        setupEventListeners();
        renderAll();
    }

    function loadPersistedState() {
        // Theme
        const savedTheme = localStorage.getItem(StorageKey.THEME) || 'dark';
        setTheme(savedTheme, false);

        // Fixed Currency: Always INR (₹)
        state.currency = '₹';

        // User Profile
        const savedProfile = localStorage.getItem(StorageKey.PROFILE);
        if (savedProfile) {
            try {
                const parsed = JSON.parse(savedProfile);
                if (parsed && parsed.name) {
                    state.userProfile = {
                        name: parsed.name,
                        role: parsed.role || 'Personal Workspace'
                    };
                }
            } catch (e) {
                console.error('Failed to parse user profile', e);
            }
        }

        // Budget
        const savedBudget = localStorage.getItem(StorageKey.BUDGET);
        state.monthlyBudget = savedBudget ? parseFloat(savedBudget) : 35000;
        const budgetInput = document.getElementById('budgetInputAmount');
        if (budgetInput) {
            budgetInput.value = state.monthlyBudget;
        }

        // Transactions
        const savedTransactions = localStorage.getItem(StorageKey.TRANSACTIONS);
        if (savedTransactions) {
            try {
                state.transactions = JSON.parse(savedTransactions);
            } catch (e) {
                console.error('Failed to parse stored transactions, falling back to demo', e);
                state.transactions = [...INITIAL_DEMO_TRANSACTIONS];
            }
        } else {
            // First time load
            state.transactions = [...INITIAL_DEMO_TRANSACTIONS];
            saveTransactions();
        }

        // Set default date in modal to today
        const transDateInput = document.getElementById('transDate');
        if (transDateInput) {
            transDateInput.value = new Date().toISOString().split('T')[0];
        }
    }

    function saveTransactions() {
        localStorage.setItem(StorageKey.TRANSACTIONS, JSON.stringify(state.transactions));
    }

    function saveBudget(newBudget) {
        state.monthlyBudget = parseFloat(newBudget) || 0;
        localStorage.setItem(StorageKey.BUDGET, state.monthlyBudget);
    }

    // =========================================================================
    // Formatting Helpers
    // =========================================================================
    function formatCurrency(amount) {
        const num = Number(amount) || 0;
        return `${state.currency} ${num.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    }

    function formatDate(dateStr) {
        if (!dateStr) return '—';
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            const date = new Date(parts[0], parts[1] - 1, parts[2]);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        }
        return dateStr;
    }

    function getCategoryMeta(type, categoryName) {
        const list = CATEGORIES[type] || CATEGORIES.EXPENSE;
        const found = list.find(c => c.id === categoryName || c.name === categoryName);
        if (found) return found;
        return { id: categoryName, name: categoryName, icon: '🏷️', color: '#94a3b8' };
    }

    // =========================================================================
    // UI Event Handlers
    // =========================================================================
    function setupEventListeners() {
        // Tab Navigation
        const navButtons = document.querySelectorAll('.nav-item');
        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.getAttribute('data-tab');
                switchTab(tab);
            });
        });

        // Mobile Sidebar Toggle
        const mobileToggle = document.getElementById('mobileToggle');
        const sidebar = document.getElementById('sidebar');
        if (mobileToggle && sidebar) {
            mobileToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                sidebar.classList.toggle('open');
            });

            document.addEventListener('click', (e) => {
                if (window.innerWidth <= 768 && !sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
                    sidebar.classList.remove('open');
                }
            });
        }

        // Theme Toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
                setTheme(nextTheme, true);
            });
        }

        // User Profile & Name Exchange Modal Handlers
        const userProfileBtn = document.getElementById('userProfileBtn');
        const profileModal = document.getElementById('profileModal');
        const closeProfileModalBtn = document.getElementById('closeProfileModalBtn');
        const cancelProfileBtn = document.getElementById('cancelProfileBtn');
        const profileForm = document.getElementById('profileForm');
        const profileNameInput = document.getElementById('profileNameInput');
        const profileRoleInput = document.getElementById('profileRoleInput');
        const profileAvatarPreview = document.getElementById('profileAvatarPreview');

        const openProfileModal = () => {
            if (!profileModal) return;
            if (profileNameInput) profileNameInput.value = state.userProfile.name;
            if (profileRoleInput) profileRoleInput.value = state.userProfile.role || '';
            if (profileAvatarPreview) profileAvatarPreview.textContent = computeInitials(state.userProfile.name);
            document.getElementById('profileNameError')?.classList.remove('visible');
            profileModal.classList.remove('hidden');
            setTimeout(() => profileNameInput?.focus(), 60);
        };

        const closeProfileModal = () => {
            if (profileModal) profileModal.classList.add('hidden');
        };

        if (userProfileBtn) userProfileBtn.addEventListener('click', openProfileModal);
        if (closeProfileModalBtn) closeProfileModalBtn.addEventListener('click', closeProfileModal);
        if (cancelProfileBtn) cancelProfileBtn.addEventListener('click', closeProfileModal);

        if (profileNameInput && profileAvatarPreview) {
            profileNameInput.addEventListener('input', (e) => {
                profileAvatarPreview.textContent = computeInitials(e.target.value);
            });
        }

        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = (profileNameInput?.value || '').trim();
                const role = (profileRoleInput?.value || '').trim() || 'Personal Workspace';
                const errorEl = document.getElementById('profileNameError');

                if (!name) {
                    if (errorEl) errorEl.classList.add('visible');
                    return;
                }
                if (errorEl) errorEl.classList.remove('visible');

                state.userProfile = { name, role };
                localStorage.setItem(StorageKey.PROFILE, JSON.stringify(state.userProfile));
                renderUserProfile();
                closeProfileModal();
                showToast(`Profile updated: Welcome, ${name}!`, 'success');
            });
        }

        // Add Modal Open Buttons
        const openAddModalBtn = document.getElementById('openAddModalBtn');
        const emptyStateAddBtn = document.getElementById('emptyStateAddBtn');
        if (openAddModalBtn) openAddModalBtn.addEventListener('click', () => openTransactionModal());
        if (emptyStateAddBtn) emptyStateAddBtn.addEventListener('click', () => openTransactionModal());

        // Modal Close Buttons
        const closeModalBtn = document.getElementById('closeModalBtn');
        const cancelModalBtn = document.getElementById('cancelModalBtn');
        if (closeModalBtn) closeModalBtn.addEventListener('click', closeTransactionModal);
        if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeTransactionModal);

        // Transaction Type Segmented Control (Switch category options)
        const typeRadios = document.querySelectorAll('input[name="transType"]');
        typeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                populateCategorySelect(e.target.value);
            });
        });

        // Transaction Form Submit
        const transForm = document.getElementById('transactionForm');
        if (transForm) {
            transForm.addEventListener('submit', handleTransactionSubmit);
        }

        // View All Transactions Button on Dashboard
        const viewAllTransBtn = document.getElementById('viewAllTransBtn');
        if (viewAllTransBtn) {
            viewAllTransBtn.addEventListener('click', () => switchTab('transactions'));
        }

        // Filters in Transactions View
        const searchInput = document.getElementById('transSearchInput');
        const typeFilter = document.getElementById('transTypeFilter');
        const catFilter = document.getElementById('transCategoryFilter');
        const paymentFilter = document.getElementById('transPaymentFilter');
        const sortFilter = document.getElementById('transSortOrder');

        [searchInput, typeFilter, catFilter, paymentFilter, sortFilter].forEach(el => {
            if (el) {
                el.addEventListener('input', () => renderTransactionsTable());
                el.addEventListener('change', () => renderTransactionsTable());
            }
        });

        // Budget Save Button
        const saveBudgetBtn = document.getElementById('saveBudgetBtn');
        if (saveBudgetBtn) {
            saveBudgetBtn.addEventListener('click', () => {
                const budgetInput = document.getElementById('budgetInputAmount');
                const val = parseFloat(budgetInput.value);
                if (isNaN(val) || val < 0) {
                    showToast('Please enter a valid budget amount', 'error');
                    return;
                }
                saveBudget(val);
                renderAll();
                showToast('Monthly budget updated successfully!', 'success');
            });
        }

        const editBudgetQuickBtn = document.getElementById('editBudgetQuickBtn');
        if (editBudgetQuickBtn) {
            editBudgetQuickBtn.addEventListener('click', () => switchTab('budget'));
        }

        // Excel Spreadsheet Direct Download Buttons
        const downloadExcelTopBtn = document.getElementById('downloadExcelTopBtn');
        const exportFilteredExcelBtn = document.getElementById('exportFilteredExcelBtn');

        if (downloadExcelTopBtn) {
            downloadExcelTopBtn.addEventListener('click', () => {
                downloadExcelSheet(state.transactions, 'ExpenseMate_All_Transactions');
            });
        }

        if (exportFilteredExcelBtn) {
            exportFilteredExcelBtn.addEventListener('click', () => {
                downloadExcelSheet(getFilteredTransactions(), 'ExpenseMate_Filtered_Transactions');
            });
        }

        // Delete Confirm Modal
        const closeDeleteModalBtn = document.getElementById('closeDeleteModalBtn');
        const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
        const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
        const deleteConfirmModal = document.getElementById('deleteConfirmModal');

        if (closeDeleteModalBtn && deleteConfirmModal) {
            closeDeleteModalBtn.addEventListener('click', () => deleteConfirmModal.classList.add('hidden'));
        }
        if (cancelDeleteBtn && deleteConfirmModal) {
            cancelDeleteBtn.addEventListener('click', () => deleteConfirmModal.classList.add('hidden'));
        }
        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', () => {
                if (state.deleteTargetId) {
                    deleteTransaction(state.deleteTargetId);
                    state.deleteTargetId = null;
                    if (deleteConfirmModal) deleteConfirmModal.classList.add('hidden');
                }
            });
        }

        // Window resize re-renders charts
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                renderCharts();
            }, 150);
        });
    }

    function setTheme(theme, persist = true) {
        state.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        if (persist) {
            localStorage.setItem(StorageKey.THEME, theme);
        }
        // Redraw charts with theme-appropriate text colors
        renderCharts();
    }

    function updateCurrencySymbols() {
        const prefix = document.getElementById('budgetPrefix');
        const affix = document.getElementById('modalCurrencyAffix');
        if (prefix) prefix.textContent = state.currency;
        if (affix) affix.textContent = state.currency;
    }

    function switchTab(tabId) {
        state.activeTab = tabId;

        // Nav active state
        document.querySelectorAll('.nav-item').forEach(btn => {
            if (btn.getAttribute('data-tab') === tabId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Tab Views
        document.querySelectorAll('.tab-view').forEach(view => {
            if (view.id === `view-${tabId}`) {
                view.classList.add('active');
            } else {
                view.classList.remove('active');
            }
        });

        // Update Page Titles
        const pageTitle = document.getElementById('pageTitle');
        const pageSubtitle = document.getElementById('pageSubtitle');
        if (pageTitle && pageSubtitle) {
            switch (tabId) {
                case 'dashboard':
                    pageTitle.textContent = 'Financial Dashboard';
                    pageSubtitle.innerHTML = `Welcome, <span id="welcomeUserName" class="user-greeting-highlight">${escapeHTML(state.userProfile.name)}</span> — real-time overview of your finances`;
                    break;
                case 'transactions':
                    pageTitle.textContent = 'Transaction History';
                    pageSubtitle.textContent = 'Search, filter, edit and export all individual financial entries';
                    break;
                case 'analytics':
                    pageTitle.textContent = 'Analytics & Insights';
                    pageSubtitle.textContent = 'Visual breakdown of spending habits, trends and payment modes';
                    break;
                case 'budget':
                    pageTitle.textContent = 'Budget Planner';
                    pageSubtitle.textContent = 'Define monthly allowances and monitor safe spending thresholds';
                    break;
            }
        }

        // Close mobile drawer if open
        const sidebar = document.getElementById('sidebar');
        if (sidebar && window.innerWidth <= 768) {
            sidebar.classList.remove('open');
        }

        // Render charts when switching to tabs with canvas
        setTimeout(() => {
            renderCharts();
        }, 50);
    }

    // =========================================================================
    // Core Render Pipeline & User Profile
    // =========================================================================
    function computeInitials(name) {
        if (!name || !name.trim()) return 'U';
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) {
            return parts[0].substring(0, 2).toUpperCase();
        }
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }

    function renderUserProfile() {
        const { name, role } = state.userProfile;
        const initials = computeInitials(name);

        const sidebarNameEl = document.getElementById('sidebarUserName');
        const sidebarAvatarEl = document.getElementById('sidebarAvatar');
        const sidebarRoleEl = document.getElementById('sidebarUserRole');
        const welcomeNameEl = document.getElementById('welcomeUserName');
        const previewAvatarEl = document.getElementById('profileAvatarPreview');

        if (sidebarNameEl) sidebarNameEl.textContent = name;
        if (sidebarAvatarEl) sidebarAvatarEl.textContent = initials;
        if (sidebarRoleEl) sidebarRoleEl.textContent = role || 'Personal Workspace';
        if (welcomeNameEl) welcomeNameEl.textContent = name;
        if (previewAvatarEl) previewAvatarEl.textContent = initials;
    }

    function renderAll() {
        renderUserProfile();
        updateCurrencySymbols();
        populateFilterCategories();
        renderDashboardStats();
        renderRecentTransactions();
        renderTransactionsTable();
        renderAnalyticsTab();
        renderBudgetTab();
        renderCharts();
    }

    function renderDashboardStats() {
        let totalIncome = 0;
        let totalExpense = 0;
        let incomeCount = 0;
        let todayExpense = 0;

        const todayStr = new Date().toISOString().split('T')[0];

        state.transactions.forEach(tx => {
            const amount = parseFloat(tx.amount) || 0;
            if (tx.type === 'INCOME') {
                totalIncome += amount;
                incomeCount++;
            } else {
                totalExpense += amount;
                if (tx.date === todayStr) {
                    todayExpense += amount;
                }
            }
        });

        const netBalance = totalIncome - totalExpense;
        const savingsRate = totalIncome > 0 ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100)) : 0;

        // Elements
        const netBalEl = document.getElementById('dashNetBalance');
        const totIncEl = document.getElementById('dashTotalIncome');
        const totExpEl = document.getElementById('dashTotalExpense');
        const incCntEl = document.getElementById('dashIncomeCount');
        const todayExpEl = document.getElementById('dashTodaySpent');
        const savRateEl = document.getElementById('dashSavingsRateText');

        if (netBalEl) netBalEl.textContent = formatCurrency(netBalance);
        if (totIncEl) totIncEl.textContent = formatCurrency(totalIncome);
        if (totExpEl) totExpEl.textContent = formatCurrency(totalExpense);
        if (incCntEl) incCntEl.textContent = `${incomeCount} deposit${incomeCount === 1 ? '' : 's'} recorded`;
        if (todayExpEl) todayExpEl.textContent = `Today: ${formatCurrency(todayExpense)}`;
        if (savRateEl) savRateEl.textContent = `Savings Rate: ${savingsRate}%`;

        // Budget Calculations
        const budget = state.monthlyBudget;
        const remainingBudget = Math.max(0, budget - totalExpense);
        const budgetPct = budget > 0 ? Math.round((totalExpense / budget) * 100) : 0;

        const budgetRemEl = document.getElementById('dashBudgetRemaining');
        const budgetDetailEl = document.getElementById('dashBudgetDetail');
        const budgetBadgeEl = document.getElementById('dashBudgetBadge');

        if (budgetRemEl) budgetRemEl.textContent = formatCurrency(remainingBudget);
        if (budgetDetailEl) budgetDetailEl.textContent = `${budgetPct}% of ${formatCurrency(budget)} limit used`;

        if (budgetBadgeEl) {
            budgetBadgeEl.className = 'badge';
            if (budgetPct >= 100) {
                budgetBadgeEl.classList.add('badge-danger');
                budgetBadgeEl.textContent = 'Exceeded';
            } else if (budgetPct >= 80) {
                budgetBadgeEl.classList.add('badge-warning');
                budgetBadgeEl.textContent = 'Caution';
            } else {
                budgetBadgeEl.classList.add('badge-income');
                budgetBadgeEl.textContent = 'Safe';
            }
        }

        // Sidebar budget card
        const sideBudgetPct = document.getElementById('side-budget-pct');
        const sideBudgetBar = document.getElementById('side-budget-bar');
        const sideSpent = document.getElementById('side-spent-amount');
        const sideTotal = document.getElementById('side-total-budget');

        if (sideBudgetPct) sideBudgetPct.textContent = `${budgetPct}%`;
        if (sideBudgetBar) {
            sideBudgetBar.style.width = `${Math.min(100, budgetPct)}%`;
            if (budgetPct >= 100) {
                sideBudgetBar.style.background = 'linear-gradient(90deg, #f43f5e, #e11d48)';
            } else if (budgetPct >= 80) {
                sideBudgetBar.style.background = 'linear-gradient(90deg, #f59e0b, #d97706)';
            } else {
                sideBudgetBar.style.background = 'linear-gradient(90deg, #6366f1, #a855f7)';
            }
        }
        if (sideSpent) sideSpent.textContent = formatCurrency(totalExpense);
        if (sideTotal) sideTotal.textContent = formatCurrency(budget);

        // Budget Alert Banner
        const alertBanner = document.getElementById('budgetAlertBanner');
        const alertTitle = document.getElementById('budgetAlertTitle');
        const alertDesc = document.getElementById('budgetAlertDesc');
        const alertIcon = document.getElementById('budgetAlertIcon');

        if (alertBanner) {
            if (budgetPct >= 100) {
                alertBanner.classList.remove('hidden');
                alertBanner.style.background = 'linear-gradient(90deg, rgba(244, 63, 94, 0.15), rgba(244, 63, 94, 0.05))';
                alertBanner.style.borderColor = 'rgba(244, 63, 94, 0.3)';
                if (alertIcon) alertIcon.textContent = '🚨';
                if (alertTitle) {
                    alertTitle.textContent = 'Budget Exceeded!';
                    alertTitle.style.color = 'var(--expense)';
                }
                if (alertDesc) alertDesc.textContent = `Total expenses have surpassed your monthly budget limit of ${formatCurrency(budget)}.`;
            } else if (budgetPct >= 80) {
                alertBanner.classList.remove('hidden');
                alertBanner.style.background = 'linear-gradient(90deg, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.05))';
                alertBanner.style.borderColor = 'rgba(245, 158, 11, 0.3)';
                if (alertIcon) alertIcon.textContent = '⚠️';
                if (alertTitle) {
                    alertTitle.textContent = 'Budget Warning (>= 80%)';
                    alertTitle.style.color = 'var(--warning)';
                }
                if (alertDesc) alertDesc.textContent = `You have spent ${budgetPct}% of your allocated limit. Monitor ongoing expenses closely.`;
            } else {
                alertBanner.classList.add('hidden');
            }
        }

        // Quick Insights
        renderQuickInsights(totalExpense);
    }

    function renderQuickInsights(totalExpense) {
        const expenses = state.transactions.filter(t => t.type === 'EXPENSE');

        // Top category
        const catMap = {};
        expenses.forEach(t => {
            catMap[t.category] = (catMap[t.category] || 0) + (parseFloat(t.amount) || 0);
        });

        let topCat = '—';
        let topCatVal = 0;
        for (const [cat, val] of Object.entries(catMap)) {
            if (val > topCatVal) {
                topCatVal = val;
                topCat = cat;
            }
        }

        // Peak expense
        let peakExpense = 0;
        expenses.forEach(t => {
            const amt = parseFloat(t.amount) || 0;
            if (amt > peakExpense) peakExpense = amt;
        });

        // Daily average for last 30 days
        const dailyAvg = totalExpense > 0 ? (totalExpense / 30) : 0;

        const insightTopCatEl = document.getElementById('insightTopCat');
        const insightPeakEl = document.getElementById('insightPeakExpense');
        const insightDailyEl = document.getElementById('insightDailyAvg');

        if (insightTopCatEl) insightTopCatEl.textContent = topCat;
        if (insightPeakEl) insightPeakEl.textContent = formatCurrency(peakExpense);
        if (insightDailyEl) insightDailyEl.textContent = formatCurrency(dailyAvg);
    }

    // =========================================================================
    // Tables Rendering
    // =========================================================================
    function renderRecentTransactions() {
        const tbody = document.getElementById('recentTransactionsList');
        if (!tbody) return;

        const sorted = [...state.transactions].sort((a, b) => b.timestamp - a.timestamp);
        const recent = sorted.slice(0, 5);

        if (recent.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-muted" style="padding: 28px;">
                        No transactions recorded yet. Click "Add Transaction" to begin!
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = recent.map(tx => renderTableRowHTML(tx, false)).join('');
        attachTableActionListeners(tbody);
    }

    function getFilteredTransactions() {
        const searchVal = (document.getElementById('transSearchInput')?.value || '').toLowerCase().trim();
        const typeVal = document.getElementById('transTypeFilter')?.value || 'ALL';
        const catVal = document.getElementById('transCategoryFilter')?.value || 'ALL';
        const payVal = document.getElementById('transPaymentFilter')?.value || 'ALL';
        const sortVal = document.getElementById('transSortOrder')?.value || 'date-desc';

        return state.transactions.filter(tx => {
            // Type
            if (typeVal !== 'ALL' && tx.type !== typeVal) return false;
            // Category
            if (catVal !== 'ALL' && tx.category !== catVal) return false;
            // Payment
            if (payVal !== 'ALL' && tx.paymentMethod !== payVal) return false;
            // Search
            if (searchVal) {
                const matchDesc = (tx.description || '').toLowerCase().includes(searchVal);
                const matchCat = (tx.category || '').toLowerCase().includes(searchVal);
                const matchPay = (tx.paymentMethod || '').toLowerCase().includes(searchVal);
                if (!matchDesc && !matchCat && !matchPay) return false;
            }
            return true;
        }).sort((a, b) => {
            switch (sortVal) {
                case 'date-asc':
                    return a.timestamp - b.timestamp;
                case 'amount-desc':
                    return (parseFloat(b.amount) || 0) - (parseFloat(a.amount) || 0);
                case 'amount-asc':
                    return (parseFloat(a.amount) || 0) - (parseFloat(b.amount) || 0);
                case 'date-desc':
                default:
                    return b.timestamp - a.timestamp;
            }
        });
    }

    function renderTransactionsTable() {
        const tbody = document.getElementById('allTransactionsList');
        const emptyState = document.getElementById('transEmptyState');
        const countLabel = document.getElementById('transCountLabel');
        const incTotalBadge = document.getElementById('filteredIncomeTotal');
        const expTotalBadge = document.getElementById('filteredExpenseTotal');

        if (!tbody) return;

        const filtered = getFilteredTransactions();

        let fIncome = 0;
        let fExpense = 0;
        filtered.forEach(tx => {
            const amt = parseFloat(tx.amount) || 0;
            if (tx.type === 'INCOME') fIncome += amt;
            else fExpense += amt;
        });

        if (countLabel) countLabel.textContent = `Showing ${filtered.length} transaction${filtered.length === 1 ? '' : 's'}`;
        if (incTotalBadge) incTotalBadge.textContent = `+${formatCurrency(fIncome)}`;
        if (expTotalBadge) expTotalBadge.textContent = `-${formatCurrency(fExpense)}`;

        if (filtered.length === 0) {
            tbody.innerHTML = '';
            if (emptyState) emptyState.classList.remove('hidden');
            return;
        }

        if (emptyState) emptyState.classList.add('hidden');
        tbody.innerHTML = filtered.map(tx => renderTableRowHTML(tx, true)).join('');
        attachTableActionListeners(tbody);
    }

    function renderTableRowHTML(tx, showTypeBadge = true) {
        const isIncome = tx.type === 'INCOME';
        const meta = getCategoryMeta(tx.type, tx.category);
        const amountSign = isIncome ? '+' : '-';
        const amountClass = isIncome ? 'text-income' : 'text-expense';

        return `
            <tr data-id="${tx.id}">
                <td>
                    <div class="trans-desc-cell">
                        <div class="trans-icon-bubble" style="background: ${meta.color}20; color: ${meta.color};">
                            ${meta.icon}
                        </div>
                        <div>
                            <div class="trans-title">${escapeHTML(tx.description || tx.category)}</div>
                            <div class="trans-sub">${tx.paymentMethod || 'Other'}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="category-tag">
                        <span>${meta.icon}</span>
                        <span>${escapeHTML(tx.category)}</span>
                    </span>
                </td>
                <td class="text-secondary">${formatDate(tx.date)}</td>
                <td><span class="payment-tag">${escapeHTML(tx.paymentMethod || 'Cash')}</span></td>
                ${showTypeBadge ? `<td><span class="badge ${isIncome ? 'badge-income' : 'badge-expense'}">${tx.type}</span></td>` : ''}
                <td class="amount-cell ${amountClass}">${amountSign}${formatCurrency(tx.amount)}</td>
                <td class="text-right">
                    <div class="table-actions">
                        <button class="table-action-btn btn-edit" data-id="${tx.id}" title="Edit Transaction" aria-label="Edit">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button class="table-action-btn btn-delete" data-id="${tx.id}" title="Delete Transaction" aria-label="Delete">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    function attachTableActionListeners(parent) {
        parent.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                openEditTransaction(id);
            });
        });

        parent.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                confirmDeleteTransaction(id);
            });
        });
    }

    // =========================================================================
    // Analytics & Budget Tab Renderers
    // =========================================================================
    function renderAnalyticsTab() {
        const expenses = state.transactions.filter(t => t.type === 'EXPENSE');
        const incomes = state.transactions.filter(t => t.type === 'INCOME');

        let totalExpense = expenses.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
        let totalIncome = incomes.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

        // Highest spending day
        const dayMap = {};
        expenses.forEach(t => {
            dayMap[t.date] = (dayMap[t.date] || 0) + (parseFloat(t.amount) || 0);
        });

        let highestDay = '—';
        let highestDayAmt = 0;
        for (const [day, amt] of Object.entries(dayMap)) {
            if (amt > highestDayAmt) {
                highestDayAmt = amt;
                highestDay = formatDate(day);
            }
        }

        const hDayEl = document.getElementById('analyticsHighestDay');
        const hDayAmtEl = document.getElementById('analyticsHighestDayAmount');
        if (hDayEl) hDayEl.textContent = highestDay;
        if (hDayAmtEl) hDayAmtEl.textContent = `${formatCurrency(highestDayAmt)} peak day`;

        // Primary Payment mode
        const payMap = {};
        expenses.forEach(t => {
            const mode = t.paymentMethod || 'Other';
            payMap[mode] = (payMap[mode] || 0) + (parseFloat(t.amount) || 0);
        });

        let primaryMode = '—';
        let primaryModeAmt = 0;
        for (const [mode, amt] of Object.entries(payMap)) {
            if (amt > primaryModeAmt) {
                primaryModeAmt = amt;
                primaryMode = mode;
            }
        }
        const primaryPct = totalExpense > 0 ? Math.round((primaryModeAmt / totalExpense) * 100) : 0;

        const primPayEl = document.getElementById('analyticsPrimaryPayment');
        const primPayPctEl = document.getElementById('analyticsPrimaryPaymentPct');
        if (primPayEl) primPayEl.textContent = primaryMode;
        if (primPayPctEl) primPayPctEl.textContent = `${primaryPct}% of all expenses`;

        // Net Savings
        const netSavings = totalIncome - totalExpense;
        const savingsPct = totalIncome > 0 ? Math.max(0, Math.round((netSavings / totalIncome) * 100)) : 0;

        const netSavEl = document.getElementById('analyticsNetSavings');
        const savPctEl = document.getElementById('analyticsSavingsPct');
        if (netSavEl) netSavEl.textContent = formatCurrency(netSavings);
        if (savPctEl) savPctEl.textContent = `${savingsPct}% retention rate`;

        // Category Spending Progress Bars
        const catMap = {};
        const catCount = {};
        expenses.forEach(t => {
            catMap[t.category] = (catMap[t.category] || 0) + (parseFloat(t.amount) || 0);
            catCount[t.category] = (catCount[t.category] || 0) + 1;
        });

        const sortedCats = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
        const catBarsContainer = document.getElementById('categoryBarsList');

        if (catBarsContainer) {
            if (sortedCats.length === 0) {
                catBarsContainer.innerHTML = '<p class="text-muted text-center" style="padding: 20px;">No expense records available.</p>';
            } else {
                catBarsContainer.innerHTML = sortedCats.map(([catName, amt]) => {
                    const meta = getCategoryMeta('EXPENSE', catName);
                    const pct = totalExpense > 0 ? Math.round((amt / totalExpense) * 100) : 0;
                    const count = catCount[catName] || 0;

                    return `
                        <div class="category-progress-item">
                            <div class="cat-progress-top">
                                <div>
                                    <span style="margin-right: 6px;">${meta.icon}</span>
                                    <span>${escapeHTML(catName)}</span>
                                    <span class="text-muted text-sm font-normal">(${count} items)</span>
                                </div>
                                <div>
                                    <span>${formatCurrency(amt)}</span>
                                    <span class="text-muted text-sm" style="margin-left: 8px;">${pct}%</span>
                                </div>
                            </div>
                            <div class="cat-progress-bar-bg">
                                <div class="cat-progress-bar-fill" style="width: ${pct}%; background: ${meta.color};"></div>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }
    }

    function renderBudgetTab() {
        const totalExpense = state.transactions
            .filter(t => t.type === 'EXPENSE')
            .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

        const budget = state.monthlyBudget;
        const budgetPct = budget > 0 ? Math.round((totalExpense / budget) * 100) : 0;

        // Circular stroke-dasharray (0 to 100)
        const circularBudgetBar = document.getElementById('circularBudgetBar');
        const circleBudgetPct = document.getElementById('circleBudgetPct');

        if (circleBudgetPct) circleBudgetPct.textContent = `${budgetPct}%`;
        if (circularBudgetBar) {
            const visualPct = Math.min(100, budgetPct);
            circularBudgetBar.setAttribute('stroke-dasharray', `${visualPct}, 100`);

            if (budgetPct >= 100) {
                circularBudgetBar.style.stroke = '#f43f5e';
            } else if (budgetPct >= 80) {
                circularBudgetBar.style.stroke = '#f59e0b';
            } else {
                circularBudgetBar.style.stroke = '#818cf8';
            }
        }

        // Recommended 50/30/20 caps
        const categoryCapsList = document.getElementById('categoryCapsList');
        if (categoryCapsList) {
            const needsBudget = budget * 0.50; // 50%
            const wantsBudget = budget * 0.30;  // 30%
            const savingsGoal = budget * 0.20;  // 20%

            categoryCapsList.innerHTML = `
                <div class="cap-item">
                    <div>
                        <strong>Essential Needs (50%)</strong>
                        <div class="text-muted text-sm">Rent, Groceries, Utilities, Health</div>
                    </div>
                    <strong>${formatCurrency(needsBudget)}</strong>
                </div>
                <div class="cap-item">
                    <div>
                        <strong>Discretionary Wants (30%)</strong>
                        <div class="text-muted text-sm">Dining Out, Shopping, Entertainment</div>
                    </div>
                    <strong>${formatCurrency(wantsBudget)}</strong>
                </div>
                <div class="cap-item">
                    <div>
                        <strong>Savings & Emergency Fund (20%)</strong>
                        <div class="text-muted text-sm">Investments, FD, Emergency Reserves</div>
                    </div>
                    <strong class="text-income">${formatCurrency(savingsGoal)}</strong>
                </div>
            `;
        }
    }

    // =========================================================================
    // Custom Canvas Charts (Donut & Weekly Trend)
    // =========================================================================
    function renderCharts() {
        renderCategoryDonut();
        renderWeeklyTrendBar();
        renderPaymentMethodsPie();
    }

    function renderCategoryDonut() {
        const canvas = document.getElementById('categoryDonutChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;

        // Set crisp canvas resolution
        const width = 220;
        const height = 220;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        ctx.clearRect(0, 0, width, height);

        const expenses = state.transactions.filter(t => t.type === 'EXPENSE');
        const catMap = {};
        let totalExpense = 0;

        expenses.forEach(t => {
            const amt = parseFloat(t.amount) || 0;
            catMap[t.category] = (catMap[t.category] || 0) + amt;
            totalExpense += amt;
        });

        // Update center total
        const donutTotalVal = document.getElementById('donutTotalVal');
        if (donutTotalVal) donutTotalVal.textContent = formatCurrency(totalExpense);

        const sortedCats = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
        const legendContainer = document.getElementById('categoryLegendList');

        const centerX = width / 2;
        const centerY = height / 2;
        const radius = 88;
        const innerRadius = 60;

        if (totalExpense === 0 || sortedCats.length === 0) {
            // Draw empty ring
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.arc(centerX, centerY, innerRadius, 2 * Math.PI, 0, true);
            ctx.fillStyle = state.theme === 'dark' ? '#1a2030' : '#e2e8f0';
            ctx.fill();

            if (legendContainer) {
                legendContainer.innerHTML = '<span class="text-muted text-sm">No expenses recorded</span>';
            }
            return;
        }

        let startAngle = -Math.PI / 2;

        sortedCats.forEach(([catName, amt]) => {
            const sliceAngle = (amt / totalExpense) * (2 * Math.PI);
            const endAngle = startAngle + sliceAngle;
            const meta = getCategoryMeta('EXPENSE', catName);

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
            ctx.closePath();
            ctx.fillStyle = meta.color;
            ctx.fill();

            // Gap outline
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = state.theme === 'dark' ? '#141824' : '#ffffff';
            ctx.stroke();

            startAngle = endAngle;
        });

        // Render Legend (Top 5)
        if (legendContainer) {
            const top5 = sortedCats.slice(0, 5);
            legendContainer.innerHTML = top5.map(([catName, amt]) => {
                const meta = getCategoryMeta('EXPENSE', catName);
                const pct = Math.round((amt / totalExpense) * 100);
                return `
                    <div class="legend-item">
                        <div class="legend-left">
                            <span class="legend-dot" style="background: ${meta.color};"></span>
                            <span>${meta.icon} ${escapeHTML(catName)}</span>
                        </div>
                        <span class="legend-pct">${pct}%</span>
                    </div>
                `;
            }).join('');
        }
    }

    function renderWeeklyTrendBar() {
        const canvas = document.getElementById('weeklyBarChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;

        const rect = canvas.getBoundingClientRect();
        const width = rect.width || 340;
        const height = 190;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, width, height);

        // Generate past 7 days dates
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const iso = d.toISOString().split('T')[0];
            const label = d.toLocaleDateString('en-US', { weekday: 'short' });
            days.push({ iso, label, amount: 0 });
        }

        // Sum expenses per day
        state.transactions.filter(t => t.type === 'EXPENSE').forEach(t => {
            const dayObj = days.find(d => d.iso === t.date);
            if (dayObj) {
                dayObj.amount += (parseFloat(t.amount) || 0);
            }
        });

        const maxAmt = Math.max(...days.map(d => d.amount), 500);

        // Drawing properties
        const paddingLeft = 14;
        const paddingRight = 14;
        const paddingTop = 20;
        const paddingBottom = 30;
        const chartW = width - paddingLeft - paddingRight;
        const chartH = height - paddingTop - paddingBottom;
        const barWidth = Math.min(28, (chartW / days.length) * 0.55);
        const colW = chartW / days.length;

        // Draw horizontal grid lines
        const gridColor = state.theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
        const textColor = state.theme === 'dark' ? '#94a3b8' : '#64748b';

        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;
        for (let i = 0; i <= 3; i++) {
            const y = paddingTop + (chartH / 3) * i;
            ctx.beginPath();
            ctx.moveTo(paddingLeft, y);
            ctx.lineTo(width - paddingRight, y);
            ctx.stroke();
        }

        // Draw Bars
        days.forEach((day, idx) => {
            const x = paddingLeft + (idx * colW) + (colW - barWidth) / 2;
            const barHeight = (day.amount / maxAmt) * chartH;
            const y = paddingTop + chartH - barHeight;

            // Draw rounded bar
            ctx.fillStyle = day.amount > 0 ? '#6366f1' : (state.theme === 'dark' ? '#1e293b' : '#e2e8f0');
            drawRoundedRect(ctx, x, y, barWidth, Math.max(barHeight, 4), 6);

            // X-axis label
            ctx.fillStyle = textColor;
            ctx.font = '11px Plus Jakarta Sans, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(day.label, x + barWidth / 2, height - 10);

            // Value text above bar if non-zero
            if (day.amount > 0) {
                ctx.fillStyle = state.theme === 'dark' ? '#f8fafc' : '#0f172a';
                ctx.font = 'bold 10px Plus Jakarta Sans, sans-serif';
                const formatted = day.amount >= 1000 ? `${(day.amount / 1000).toFixed(1)}k` : `${Math.round(day.amount)}`;
                ctx.fillText(formatted, x + barWidth / 2, Math.max(14, y - 6));
            }
        });
    }

    function renderPaymentMethodsPie() {
        const canvas = document.getElementById('paymentMethodsChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;

        const width = 320;
        const height = 200;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, width, height);

        const expenses = state.transactions.filter(t => t.type === 'EXPENSE');
        const payMap = {};
        let totalExpense = 0;

        expenses.forEach(t => {
            const mode = t.paymentMethod || 'Other';
            const amt = parseFloat(t.amount) || 0;
            payMap[mode] = (payMap[mode] || 0) + amt;
            totalExpense += amt;
        });

        const colors = {
            'UPI': '#10b981',
            'Debit/Credit Card': '#6366f1',
            'Cash': '#f59e0b',
            'Net Banking': '#ec4899',
            'Other': '#84cc16'
        };

        const centerX = 90;
        const centerY = height / 2;
        const radius = 65;

        if (totalExpense === 0) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.fillStyle = state.theme === 'dark' ? '#1a2030' : '#e2e8f0';
            ctx.fill();
            return;
        }

        let startAngle = -Math.PI / 2;
        const entries = Object.entries(payMap);

        entries.forEach(([mode, amt]) => {
            const sliceAngle = (amt / totalExpense) * (2 * Math.PI);
            const endAngle = startAngle + sliceAngle;
            const color = colors[mode] || '#94a3b8';

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();

            startAngle = endAngle;
        });

        // Payment Badges
        const badgesRow = document.getElementById('paymentBadgesRow');
        if (badgesRow) {
            badgesRow.innerHTML = entries.map(([mode, amt]) => {
                const color = colors[mode] || '#94a3b8';
                const pct = Math.round((amt / totalExpense) * 100);
                return `
                    <span class="category-tag" style="border: 1px solid ${color}40">
                        <span style="color: ${color}">●</span>
                        <span>${escapeHTML(mode)}</span>
                        <strong>${pct}%</strong>
                    </span>
                `;
            }).join('');
        }
    }

    function drawRoundedRect(ctx, x, y, width, height, radius) {
        if (height < radius) radius = height / 2;
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height);
        ctx.lineTo(x, y + height);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
    }

    // =========================================================================
    // Modal & CRUD Operations
    // =========================================================================
    function populateCategorySelect(type, selectedCategory = '') {
        const select = document.getElementById('transCategory');
        if (!select) return;

        const list = CATEGORIES[type] || CATEGORIES.EXPENSE;
        select.innerHTML = list.map(c => `
            <option value="${c.name}" ${c.name === selectedCategory ? 'selected' : ''}>
                ${c.icon} ${c.name}
            </option>
        `).join('');
    }

    function populateFilterCategories() {
        const filterSelect = document.getElementById('transCategoryFilter');
        if (!filterSelect) return;

        const currentVal = filterSelect.value || 'ALL';
        const allCats = [...CATEGORIES.EXPENSE, ...CATEGORIES.INCOME];
        const unique = Array.from(new Set(allCats.map(c => c.name)));

        let html = '<option value="ALL">All Categories</option>';
        html += unique.map(c => `<option value="${c}" ${c === currentVal ? 'selected' : ''}>${c}</option>`).join('');
        filterSelect.innerHTML = html;
    }

    function openTransactionModal(editData = null) {
        const modal = document.getElementById('transactionModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalIcon = document.getElementById('modalIcon');
        const editIdInput = document.getElementById('editTransactionId');
        const amountInput = document.getElementById('transAmount');
        const descInput = document.getElementById('transDescription');
        const dateInput = document.getElementById('transDate');
        const paySelect = document.getElementById('transPaymentMethod');

        clearFormErrors();

        if (editData) {
            state.editingId = editData.id;
            modalTitle.textContent = 'Edit Transaction';
            modalIcon.textContent = '✏️';
            editIdInput.value = editData.id;
            amountInput.value = editData.amount;
            descInput.value = editData.description || '';
            dateInput.value = editData.date || new Date().toISOString().split('T')[0];
            if (paySelect) paySelect.value = editData.paymentMethod || 'UPI';

            // Set radio
            const targetRadio = document.querySelector(`input[name="transType"][value="${editData.type}"]`);
            if (targetRadio) targetRadio.checked = true;

            populateCategorySelect(editData.type, editData.category);
        } else {
            state.editingId = null;
            modalTitle.textContent = 'New Transaction';
            modalIcon.textContent = '✍️';
            editIdInput.value = '';
            amountInput.value = '';
            descInput.value = '';
            dateInput.value = new Date().toISOString().split('T')[0];
            if (paySelect) paySelect.value = 'UPI';

            const expRadio = document.querySelector('input[name="transType"][value="EXPENSE"]');
            if (expRadio) expRadio.checked = true;

            populateCategorySelect('EXPENSE');
        }

        modal.classList.remove('hidden');
        amountInput.focus();
    }

    function closeTransactionModal() {
        const modal = document.getElementById('transactionModal');
        if (modal) modal.classList.add('hidden');
        state.editingId = null;
    }

    function clearFormErrors() {
        document.querySelectorAll('.form-error').forEach(el => el.classList.remove('visible'));
    }

    function handleTransactionSubmit(e) {
        e.preventDefault();
        clearFormErrors();

        const amountInput = document.getElementById('transAmount');
        const descInput = document.getElementById('transDescription');
        const dateInput = document.getElementById('transDate');
        const catSelect = document.getElementById('transCategory');
        const paySelect = document.getElementById('transPaymentMethod');
        const typeInput = document.querySelector('input[name="transType"]:checked');

        const amount = parseFloat(amountInput.value);
        const description = (descInput.value || '').trim();
        const date = dateInput.value;
        const category = catSelect.value;
        const paymentMethod = paySelect.value;
        const type = typeInput ? typeInput.value : 'EXPENSE';

        let hasError = false;

        if (isNaN(amount) || amount <= 0) {
            document.getElementById('amountError').classList.add('visible');
            hasError = true;
        }

        if (!description) {
            document.getElementById('descError').classList.add('visible');
            hasError = true;
        }

        if (hasError) return;

        const dateParts = date.split('-');
        const timestamp = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]).getTime() || Date.now();

        if (state.editingId) {
            // Update Existing
            const index = state.transactions.findIndex(t => t.id === state.editingId);
            if (index !== -1) {
                state.transactions[index] = {
                    ...state.transactions[index],
                    type,
                    amount,
                    description,
                    category,
                    paymentMethod,
                    date,
                    timestamp
                };
                showToast('Transaction updated successfully!', 'success');
            }
        } else {
            // Create New
            const newTx = {
                id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
                type,
                amount,
                description,
                category,
                paymentMethod,
                date,
                timestamp
            };
            state.transactions.unshift(newTx);
            showToast('New transaction added!', 'success');
        }

        saveTransactions();
        closeTransactionModal();
        renderAll();
    }

    function openEditTransaction(id) {
        const tx = state.transactions.find(t => t.id === id);
        if (tx) {
            openTransactionModal(tx);
        }
    }

    function confirmDeleteTransaction(id) {
        const tx = state.transactions.find(t => t.id === id);
        if (!tx) return;

        state.deleteTargetId = id;
        const modal = document.getElementById('deleteConfirmModal');
        const text = document.getElementById('deleteModalText');

        if (text) {
            text.textContent = `Are you sure you want to delete "${tx.description}" (${formatCurrency(tx.amount)})?`;
        }
        if (modal) modal.classList.remove('hidden');
    }

    function deleteTransaction(id) {
        state.transactions = state.transactions.filter(t => t.id !== id);
        saveTransactions();
        renderAll();
        showToast('Transaction deleted', 'info');
    }

    // =========================================================================
    // Excel Spreadsheet Data Export
    // =========================================================================
    function downloadExcelSheet(transactionList, filenamePrefix = 'ExpenseMate_Transactions') {
        if (!transactionList || transactionList.length === 0) {
            showToast('No transaction records available to export', 'error');
            return;
        }

        // Calculate Totals for Excel summary section
        let totalIncome = 0;
        let totalExpense = 0;

        transactionList.forEach(t => {
            const amt = parseFloat(t.amount) || 0;
            if (t.type === 'INCOME') totalIncome += amt;
            else totalExpense += amt;
        });
        const netSavings = totalIncome - totalExpense;

        // Excel Column Headers
        const headers = [
            'Transaction ID',
            'Date',
            'Type',
            'Category',
            'Description / Note',
            'Payment Method',
            'Currency',
            'Amount (₹)'
        ];

        // Format data rows with proper CSV escaping
        const dataRows = transactionList.map(t => {
            const amt = (parseFloat(t.amount) || 0).toFixed(2);
            return [
                `"${t.id}"`,
                `"${t.date}"`,
                `"${t.type}"`,
                `"${(t.category || '').replace(/"/g, '""')}"`,
                `"${(t.description || '').replace(/"/g, '""')}"`,
                `"${(t.paymentMethod || 'Other').replace(/"/g, '""')}"`,
                '"INR"',
                amt
            ].join(',');
        });

        // Add Excel summary rows at the bottom
        const emptyRow = '"","","","","","","",""';
        const summaryRows = [
            emptyRow,
            `"FINANCIAL SUMMARY","","","","","","",""`,
            `"Total Income","","","","","","INR",${totalIncome.toFixed(2)}`,
            `"Total Expenses","","","","","","INR",${totalExpense.toFixed(2)}`,
            `"Net Savings / Balance","","","","","","INR",${netSavings.toFixed(2)}`,
            `"User Name","${(state.userProfile?.name || '').replace(/"/g, '""')}","","","","","",""`,
            `"Generated On","${new Date().toLocaleString('en-IN')}","","","","","",""`
        ];

        // Prepend UTF-8 BOM (\uFEFF) so Microsoft Excel opens cleanly without encoding issues
        const excelCsvContent = '\uFEFF' + [headers.join(','), ...dataRows, ...summaryRows].join('\r\n');

        const blob = new Blob([excelCsvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const todayStr = new Date().toISOString().split('T')[0];
        link.setAttribute('href', url);
        link.setAttribute('download', `${filenamePrefix}_${todayStr}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        showToast(`Excel sheet with ${transactionList.length} transactions downloaded!`, 'success');
    }

    // =========================================================================
    // Utilities & Toast System
    // =========================================================================
    function showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️'
        };

        toast.innerHTML = `
            <span>${icons[type] || 'ℹ️'}</span>
            <span>${escapeHTML(message)}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    }

    function escapeHTML(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Run on DOM Ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
