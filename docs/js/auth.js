
// Global Authentication and Navigation Guard

(function() {
    // Inject CSS for notification dropdown
    const styles = `
        .notificationbox {
            position: relative; /* Ensure this is positioned for the dropdown */
        }
        .notification-dropdown {
            position: absolute;
            top: 50px; /* Adjusted for better spacing */
            right: -10px; /* Move it a bit to the left from the edge */
            width: 350px;
            background: #fff;
            border: 1px solid #ddd;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            z-index: 101;
            display: none;
            border-radius: 4px;
            overflow: hidden;
        }
        .notification-dropdown.show {
            display: block;
        }
        .notification-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 15px;
            border-bottom: 1px solid #eee;
        }
        .notification-header h4 {
            margin: 0;
            font-size: 16px;
        }
        .notification-header .mark-all-read {
            font-size: 12px;
            color: var(--accent);
            cursor: pointer;
        }
        .notification-list {
            max-height: 400px;
            overflow-y: auto;
        }
        .notification-item-dropdown {
            padding: 15px;
            border-bottom: 1px solid #eee;
            cursor: pointer;
            transition: background 0.2s;
        }
        .notification-item-dropdown:last-child {
            border-bottom: none;
        }
        .notification-item-dropdown:hover {
            background: #f9f9f9;
        }
        .notification-item-dropdown.unread {
            background: #fffafa;
            font-weight: 700;
        }
        .notification-item-dropdown p {
            font-size: 14px;
            margin: 0 0 5px;
            color: #333;
            font-weight: normal;
        }
        .notification-item-dropdown .date {
            font-size: 12px;
            color: #888;
            font-weight: normal;
        }
        .no-notifications {
            padding: 40px 20px;
            text-align: center;
            color: #888;
        }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    const auth = LibraryAPI.getAuth();
    const currentPage = window.location.pathname.split('/').pop();

    // Navigation Guard
    if (!auth.isLoggedIn && currentPage === 'myPage.html') {
        alert('請先登入！');
        window.location.href = 'login.html';
        return;
    }
    if (auth.isLoggedIn && currentPage === 'login.html') {
        window.location.href = 'index.html';
        return;
    }

    // Update Header based on Auth Status
    const header = document.querySelector('.header');
    if (header) {
        const actions = header.querySelector('.header__actions');
        if (auth.isLoggedIn) {
            actions.innerHTML = `
                <div class="notificationbox">
                    <i class="fa-regular fa-bell"></i>
                    <span class="dot" style="display: none;"></span>
                    <div class="notification-dropdown" id="notification-dropdown">
                        <!-- Content will be injected here -->
                    </div>
                </div>
                <div class="user-profile">
                    <a href="myPage.html">
                        <i class="fa-regular fa-user"></i> 您好，${auth.name}
                    </a>
                </div>
                <div style="cursor: pointer; margin-left: 10px;" onclick="LibraryAPI.logout()">
                    <i class="fa-solid fa-right-from-bracket"></i> 登出
                </div>
            `;
            setupNotificationBell();
        } else {
            actions.innerHTML = `
                <a href="login.html" class="btn-login-nav" style="font-weight: 700;">
                    <i class="fa-solid fa-right-to-bracket"></i> 登入
                </a>
            `;
        }
    }

    async function setupNotificationBell() {
        const bell = document.querySelector('.notificationbox');
        const dropdown = document.getElementById('notification-dropdown');
        const dot = bell.querySelector('.dot');

        // Check for unread notifications initially
        const initialNotifs = await LibraryAPI.getNotifications();
        if (initialNotifs.some(n => !n.read)) {
            dot.style.display = 'block';
        }

        bell.addEventListener('click', async (e) => {
            if (e.target.closest('.notification-item-dropdown') || e.target.closest('.mark-all-read')) {
                return; // Let item-specific handlers take care of it
            }
            
            const isVisible = dropdown.classList.contains('show');
            if (isVisible) {
                dropdown.classList.remove('show');
            } else {
                dropdown.innerHTML = '<div style="padding:20px; text-align:center;"><i class="fa-solid fa-spinner fa-spin"></i></div>';
                dropdown.classList.add('show');
                
                const notifications = await LibraryAPI.getNotifications();
                renderNotifications(notifications);
            }
        });

        // Close dropdown if clicked outside
        document.addEventListener('click', (e) => {
            if (!bell.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });
    }

    function renderNotifications(notifications) {
        const dropdown = document.getElementById('notification-dropdown');
        const dot = document.querySelector('.notificationbox .dot');
        
        let content = '';
        if (notifications.length === 0) {
            content = '<div class="no-notifications">沒有任何通知</div>';
        } else {
            const items = notifications.map(n => `
                <div class="notification-item-dropdown ${n.read ? '' : 'unread'}" data-id="${n.id}">
                    <p>${n.content}</p>
                    <div class="date">${n.date}</div>
                </div>
            `).join('');
            content = `
                <div class="notification-header">
                    <h4>通知</h4>
                    <span class="mark-all-read">全部已讀</span>
                </div>
                <div class="notification-list">${items}</div>
            `;
        }
        dropdown.innerHTML = content;

        // Update dot visibility
        if (notifications.some(n => !n.read)) {
            dot.style.display = 'block';
        } else {
            dot.style.display = 'none';
        }

        addDropdownListeners();
    }

    function addDropdownListeners() {
        const dropdown = document.getElementById('notification-dropdown');

        // Mark all as read
        const markAllReadBtn = dropdown.querySelector('.mark-all-read');
        if (markAllReadBtn) {
            markAllReadBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                await LibraryAPI.markAllNotificationsAsRead();
                const updatedNotifs = await LibraryAPI.getNotifications();
                renderNotifications(updatedNotifs);
            });
        }

        // Mark one as read and navigate
        dropdown.querySelectorAll('.notification-item-dropdown').forEach(item => {
            item.addEventListener('click', async (e) => {
                e.stopPropagation();
                const notifId = item.dataset.id;
                await LibraryAPI.markNotificationAsRead(notifId);
                window.location.href = 'myPage.html';
            });
        });
    }
})();
