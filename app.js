/**
 * Windows 11 Web - Основное приложение
 * PWA с поддержкой офлайн работы
 * Расширенная версия с 30+ приложениями
 */

// Глобальное состояние
const state = {
    windows: [],
    activeWindow: null,
    windowZIndex: 100,
    theme: 'dark',
    startMenuOpen: false,
    widgetsOpen: false,
    notificationsOpen: false,
    lockScreenVisible: true,
    bootScreenVisible: true,
    fullscreen: false,
    fileSystem: {},
    installedApps: [],
    systemInfo: {
        cpu: 0,
        ram: 0,
        disk: 0,
        network: 'online'
    }
};

// Инициализация файловой системы
function initFileSystem() {
    const defaultFiles = {
        'C:': {
            'Users': {
                'Пользователь': {
                    'Desktop': { 'welcome.txt': 'Добро пожаловать в Windows 11 Web!' },
                    'Documents': { 'note.txt': 'Мои заметки' },
                    'Downloads': {},
                    'Pictures': {},
                    'Music': {},
                    'Videos': {}
                }
            },
            'Program Files': {},
            'Windows': {}
        }
    };
    state.fileSystem = defaultFiles;
}

// Конфигурация приложений (30+)
const apps = {
    explorer: { name: 'Проводник', icon: '📁', width: 900, height: 550, content: createExplorerContent },
    edge: { name: 'Microsoft Edge', icon: '🌐', width: 1000, height: 650, content: createEdgeContent },
    word: { name: 'Word', icon: '📝', width: 900, height: 650, content: createWordContent },
    excel: { name: 'Excel', icon: '📊', width: 900, height: 650, content: createExcelContent },
    powerpoint: { name: 'PowerPoint', icon: '📽️', width: 900, height: 650, content: createPowerPointContent },
    calculator: { name: 'Калькулятор', icon: '🔢', width: 340, height: 500, content: createCalculatorContent },
    settings: { name: 'Параметры', icon: '⚙️', width: 950, height: 650, content: createSettingsContent },
    store: { name: 'Microsoft Store', icon: '🛒', width: 950, height: 650, content: createStoreContent },
    photos: { name: 'Фотографии', icon: '🖼️', width: 900, height: 600, content: createPhotosContent },
    terminal: { name: 'Терминал', icon: '💻', width: 750, height: 500, content: createTerminalContent },
    notepad: { name: 'Блокнот', icon: '📄', width: 650, height: 550, content: createNotepadContent },
    music: { name: 'Музыка', icon: '🎵', width: 850, height: 600, content: createMusicContent },
    video: { name: 'Видео', icon: '🎬', width: 950, height: 650, content: createVideoContent },
    camera: { name: 'Камера', icon: '📷', width: 700, height: 550, content: createCameraContent },
    maps: { name: 'Карты', icon: '🗺️', width: 900, height: 600, content: createMapsContent },
    weather: { name: 'Погода', icon: '🌤️', width: 500, height: 600, content: createWeatherContent },
    news: { name: 'Новости', icon: '📰', width: 800, height: 600, content: createNewsContent },
    calendar: { name: 'Календарь', icon: '📅', width: 700, height: 550, content: createCalendarContent },
    mail: { name: 'Почта', icon: '📧', width: 900, height: 600, content: createMailContent },
    messages: { name: 'Сообщения', icon: '💬', width: 700, height: 550, content: createMessagesContent },
    phone: { name: 'Телефон', icon: '📱', width: 400, height: 650, content: createPhoneContent },
    clock: { name: 'Часы', icon: '⏰', width: 500, height: 550, content: createClockContent },
    alarm: { name: 'Будильник', icon: '🔔', width: 450, height: 500, content: createAlarmContent },
    timer: { name: 'Таймер', icon: '⏱️', width: 400, height: 450, content: createTimerContent },
    stopwatch: { name: 'Секундомер', icon: '🕐', width: 400, height: 450, content: createStopwatchContent },
    voice: { name: 'Диктофон', icon: '🎤', width: 450, height: 500, content: createVoiceContent },
    paint: { name: 'Paint', icon: '🎨', width: 850, height: 650, content: createPaintContent },
    photosEditor: { name: 'Фоторедактор', icon: '✂️', width: 900, height: 650, content: createPhotosEditorContent },
    pdf: { name: 'PDF Reader', icon: '📕', width: 800, height: 600, content: createPdfContent },
    taskmanager: { name: 'Диспетчер задач', icon: '📈', width: 750, height: 500, content: createTaskManagerContent },
    registry: { name: 'Редастр реестра', icon: '🗂️', width: 800, height: 550, content: createRegistryContent },
    disk: { name: 'Очистка диска', icon: '💾', width: 600, height: 500, content: createDiskContent },
    defrag: { name: 'Дефрагментация', icon: '🔄', width: 700, height: 500, content: createDefragContent },
    network: { name: 'Сеть', icon: '🌐', width: 750, height: 550, content: createNetworkContent },
    bluetooth: { name: 'Bluetooth', icon: '📶', width: 500, height: 550, content: createBluetoothContent },
    update: { name: 'Центр обновлений', icon: '🔄', width: 700, height: 600, content: createUpdateContent },
    security: { name: 'Безопасность', icon: '🛡️', width: 800, height: 600, content: createSecurityContent },
    backup: { name: 'Резервное копирование', icon: '💿', width: 700, height: 550, content: createBackupContent },
    recovery: { name: 'Восстановление', icon: '🔧', width: 650, height: 550, content: createRecoveryContent },
    about: { name: 'О системе', icon: 'ℹ️', width: 600, height: 500, content: createAboutContent },
    feedback: { name: 'Обратная связь', icon: '💭', width: 600, height: 550, content: createFeedbackContent },
    tips: { name: 'Советы', icon: '💡', width: 650, height: 550, content: createTipsContent },
    
    // Игры
    chess: { name: 'Шахматы', icon: '♟️', width: 550, height: 600, content: createChessContent },
    checkers: { name: 'Шашки', icon: '⚫', width: 500, height: 550, content: createCheckersContent },
    ticTacToe: { name: 'Крестики-нолики', icon: '⭕', width: 400, height: 450, content: createTicTacToeContent },
    snake: { name: 'Змейка', icon: '🐍', width: 450, height: 500, content: createSnakeContent },
    tetris: { name: 'Тетрис', icon: '🧱', width: 400, height: 550, content: createTetrisContent },
    breakout: { name: 'Арканоид', icon: '🧱', width: 500, height: 550, content: createBreakoutContent },
    pacman: { name: 'Pac-Man', icon: '👻', width: 500, height: 550, content: createPacmanContent },
    sudoku: { name: 'Судоку', icon: '🔢', width: 500, height: 550, content: createSudokuContent },
    minesweeper: { name: 'Сапёр', icon: '💣', width: 450, height: 500, content: createMinesweeperContent },
    solitaire: { name: 'Косынка', icon: '🃏', width: 700, height: 550, content: createSolitaireContent },
    memory: { name: 'Найди пару', icon: '🎴', width: 500, height: 550, content: createMemoryContent },
    quiz: { name: 'Викторина', icon: '❓', width: 600, height: 550, content: createQuizContent },
    
    // Утилиты
    converter: { name: 'Конвертер', icon: '🔄', width: 500, height: 550, content: createConverterContent },
    unitConverter: { name: 'Конвертер величин', icon: '📏', width: 550, height: 600, content: createUnitConverterContent },
    currency: { name: 'Курсы валют', icon: '💱', width: 500, height: 550, content: createCurrencyContent },
    qr: { name: 'QR-сканер', icon: '📱', width: 500, height: 550, content: createQrContent },
    barcode: { name: 'Штрих-код', icon: '📊', width: 500, height: 500, content: createBarcodeContent },
    colorPicker: { name: 'Пипетка', icon: '🎨', width: 450, height: 500, content: createColorPickerContent },
    screenshot: { name: 'Ножницы', icon: '✂️', width: 600, height: 500, content: createScreenshotContent },
    recorder: { name: 'Запись экрана', icon: '🎥', width: 550, height: 500, content: createRecorderContent },
    speedtest: { name: 'Тест скорости', icon: '🚀', width: 600, height: 500, content: createSpeedtestContent },
    ip: { name: 'IP-адрес', icon: '🌍', width: 500, height: 450, content: createIpContent },
    password: { name: 'Генератор паролей', icon: '🔐', width: 500, height: 500, content: createPasswordContent },
    notes: { name: 'Заметки', icon: '📌', width: 600, height: 550, content: createNotesContent },
    todo: { name: 'Задачи', icon: '✅', width: 550, height: 600, content: createTodoContent },
    pomodoro: { name: 'Помодоро', icon: '🍅', width: 450, height: 500, content: createPomodoroContent },
    habits: { name: 'Привычки', icon: '📊', width: 600, height: 550, content: createHabitsContent },
    finance: { name: 'Финансы', icon: '💰', width: 700, height: 600, content: createFinanceContent },
    calculatorScientific: { name: 'Научный калькулятор', icon: '🧮', width: 500, height: 600, content: createScientificCalculatorContent },
    units: { name: 'Единицы измерения', icon: '⚖️', width: 500, height: 550, content: createUnitsContent },
    dictionary: { name: 'Словарь', icon: '📖', width: 600, height: 550, content: createDictionaryContent },
    translate: { name: 'Переводчик', icon: '🈯', width: 650, height: 550, content: createTranslateContent },
    books: { name: 'Книги', icon: '📚', width: 800, height: 600, content: createBooksContent },
    radio: { name: 'Радио', icon: '📻', width: 550, height: 500, content: createRadioContent },
    tv: { name: 'ТВ', icon: '📺', width: 800, height: 500, content: createTvContent },
    streaming: { name: 'Стриминг', icon: '📡', width: 750, height: 550, content: createStreamingContent },
    social: { name: 'Соцсети', icon: '🌐', width: 800, height: 600, content: createSocialContent },
    browser2: { name: 'Браузер 2', icon: '🦊', width: 1000, height: 700, content: createBrowser2Content },
    ftp: { name: 'FTP Клиент', icon: '📤', width: 800, height: 550, content: createFtpContent },
    ssh: { name: 'SSH Клиент', icon: '🔗', width: 800, height: 550, content: createSshContent },
    database: { name: 'Базы данных', icon: '🗄️', width: 850, height: 600, content: createDatabaseContent },
    code: { name: 'Редактор кода', icon: '💻', width: 950, height: 700, content: createCodeContent },
    ide: { name: 'IDE', icon: '🖥️', width: 1000, height: 750, content: createIdeContent },
    git: { name: 'Git', icon: '🌿', width: 800, height: 550, content: createGitContent },
    docker: { name: 'Docker', icon: '🐳', width: 800, height: 550, content: createDockerContent },
    vm: { name: 'Виртуальная машина', icon: '💽', width: 900, height: 650, content: createVmContent },
    ai: { name: 'ИИ Ассистент', icon: '🤖', width: 600, height: 650, content: createAiContent },
    chat: { name: 'Чат', icon: '💬', width: 700, height: 600, content: createChatContent },
    videoCall: { name: 'Видеозвонок', icon: '📹', width: 800, height: 650, content: createVideoCallContent }
};

// ============================================
// Инициализация
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initFileSystem();
    initBootScreen();
    initLockScreen();
    initTaskbar();
    initStartMenu();
    initDesktop();
    initWindows();
    initPanels();
    initContextMenu();
    initClock();
    initWidgets();
    registerServiceWorker();
    initTheme();
    initPWAInstall();
    initFullscreen();
});

function initBootScreen() {
    setTimeout(() => {
        const bootScreen = document.getElementById('boot-screen');
        bootScreen.classList.add('hidden');
        state.bootScreenVisible = false;
    }, 2000);
}

function initLockScreen() {
    const lockScreen = document.getElementById('lock-screen');
    lockScreen.addEventListener('click', () => {
        if (!state.bootScreenVisible) {
            lockScreen.classList.add('hidden');
            state.lockScreenVisible = false;
        }
    });
}

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        // Регистрируем service worker с правильным scope для GitHub Pages
        navigator.serviceWorker.register('./service-worker.js', {
            scope: './'
        })
        .then(reg => {
            console.log('[SW] Service Worker registered:', reg.scope);
            
            // Проверка обновлений
            reg.addEventListener('updatefound', () => {
                const newWorker = reg.installing;
                console.log('[SW] Update found');
                
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        addNotification('🔄', 'Обновление', 'Доступна новая версия. Обновите страницу.');
                    }
                });
            });
        })
        .catch(err => {
            console.error('[SW] Registration failed:', err);
        });
        
        // Контроллер изменений
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('[SW] Controller changed');
        });
    }
}

// ============================================
// Часы и дата
// ============================================

function initClock() {
    updateClock();
    setInterval(updateClock, 1000);
}

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    // Время в трее
    document.getElementById('taskbar-time').textContent = `${hours}:${minutes}`;
    
    // Время на экране блокировки
    document.getElementById('lock-time').textContent = `${hours}:${minutes}`;
    
    // Дата на экране блокировки
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    document.getElementById('lock-date').textContent = now.toLocaleDateString('ru-RU', options);
    
    // Календарь в виджетах
    updateWidgetCalendar(now);
}

function updateWidgetCalendar(now) {
    const calendarEl = document.getElementById('widget-calendar');
    if (!calendarEl) return;
    
    const month = now.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
    const day = now.getDate();
    calendarEl.innerHTML = `<strong>${month.charAt(0).toUpperCase() + month.slice(1)}</strong><br>Сегодня: ${day}`;
}

// ============================================
// Панель задач
// ============================================

function initTaskbar() {
    // Кнопка Пуск
    document.getElementById('start-btn').addEventListener('click', toggleStartMenu);
    
    // Кнопка виджетов
    document.getElementById('widgets-btn').addEventListener('click', toggleWidgets);
    
    // Кнопка уведомлений
    document.getElementById('notifications-btn').addEventListener('click', toggleNotifications);
    
    // Кнопка показа рабочего стола
    document.getElementById('show-desktop').addEventListener('click', showDesktop);
    
    // Поиск
    document.getElementById('search-btn').addEventListener('click', () => {
        showToast('🔍', 'Поиск', 'В разработке');
    });
    
    // Чат
    document.getElementById('chat-btn').addEventListener('click', () => {
        showToast('💬', 'Чат', 'В разработке');
    });
    
    // Язык
    document.getElementById('language-btn').addEventListener('click', () => {
        showToast('🌐', 'Язык', 'RU - Русский');
    });
}

function toggleStartMenu() {
    state.startMenuOpen = !state.startMenuOpen;
    const startMenu = document.getElementById('start-menu');
    
    if (state.startMenuOpen) {
        startMenu.classList.add('visible');
        closePanels();
    } else {
        startMenu.classList.remove('visible');
    }
}

function closeStartMenu() {
    state.startMenuOpen = false;
    document.getElementById('start-menu').classList.remove('visible');
}

function showDesktop() {
    state.windows.forEach(win => {
        if (!win.minimized) {
            minimizeWindow(win.id);
        }
    });
}

// ============================================
// Меню Пуск
// ============================================

function initStartMenu() {
    // Поиск в меню Пуск
    const searchInput = document.getElementById('start-search-input');
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        filterPinnedApps(query);
    });
    
    // Кнопка питания
    document.getElementById('power-btn').addEventListener('click', showPowerMenu);
    
    // Закреплённые приложения
    document.querySelectorAll('.pinned-app').forEach(app => {
        app.addEventListener('click', () => {
            const appId = app.dataset.app;
            openApp(appId);
            closeStartMenu();
        });
    });
    
    // Рекомендации
    document.querySelectorAll('.recommended-item').forEach(item => {
        item.addEventListener('click', () => {
            showToast('📄', 'Файл', 'Открытие файла...');
            closeStartMenu();
        });
    });
    
    // Профиль пользователя
    document.querySelector('.user-profile').addEventListener('click', () => {
        showToast('👤', 'Профиль', 'Пользователь');
    });
}

function filterPinnedApps(query) {
    const pinnedApps = document.querySelectorAll('.pinned-app');
    pinnedApps.forEach(app => {
        const name = app.querySelector('span').textContent.toLowerCase();
        if (name.includes(query)) {
            app.style.display = 'flex';
        } else {
            app.style.display = 'none';
        }
    });
}

function showPowerMenu() {
    const actions = ['⏻ Завершение работы', '🔄 Перезагрузка', '😴 Сон'];
    const action = prompt('Выберите действие:\n1 - Завершение работы\n2 - Перезагрузка\n3 - Сон');
    
    if (action === '1') {
        showToast('⏻', 'Завершение', 'Система завершает работу...');
        setTimeout(() => {
            location.reload();
        }, 2000);
    } else if (action === '2') {
        showToast('🔄', 'Перезагрузка', 'Система перезагружается...');
        setTimeout(() => {
            location.reload();
        }, 2000);
    } else if (action === '3') {
        showToast('😴', 'Сон', 'Система переходит в спящий режим...');
    }
}

// ============================================
// Рабочий стол
// ============================================

function initDesktop() {
    const desktop = document.getElementById('desktop');
    const desktopIcons = document.getElementById('desktop-icons');
    
    // Двойной клик по иконкам
    desktopIcons.addEventListener('dblclick', (e) => {
        const icon = e.target.closest('.desktop-icon');
        if (icon) {
            const appId = icon.dataset.app;
            openApp(appId);
        }
    });
    
    // Выделение иконок
    desktopIcons.addEventListener('click', (e) => {
        const icon = e.target.closest('.desktop-icon');
        document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
        if (icon) {
            icon.classList.add('selected');
        }
    });
    
    // Контекстное меню рабочего стола
    desktop.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (!e.target.closest('.window')) {
            showContextMenu(e.clientX, e.clientY, 'desktop');
        }
    });
    
    // Клик для снятия выделения
    desktop.addEventListener('click', (e) => {
        if (!e.target.closest('.desktop-icon') && !e.target.closest('.window')) {
            document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
        }
    });
}

// ============================================
// Оконный менеджер
// ============================================

function initWindows() {
    // Обработка изменения размера окна
    document.addEventListener('mousemove', handleWindowResize);
    document.addEventListener('mouseup', stopWindowResize);
}

function openApp(appId) {
    const app = apps[appId];
    if (!app) return;
    
    const windowId = 'window-' + Date.now();
    const windowEl = createWindowElement(windowId, app);
    
    document.getElementById('windows-container').appendChild(windowEl);
    addToTaskbar(windowId, app);
    
    state.windows.push({
        id: windowId,
        appId: appId,
        element: windowEl,
        minimized: false,
        maximized: false
    });
    
    focusWindow(windowId);
    
    // Анимация открытия
    windowEl.classList.add('window-open');
    
    showToast(app.icon, app.name, 'Приложение запущено');
}

function createWindowElement(windowId, app) {
    const windowEl = document.createElement('div');
    windowEl.className = 'window';
    windowEl.id = windowId;
    windowEl.style.width = app.width + 'px';
    windowEl.style.height = app.height + 'px';
    windowEl.style.left = (100 + state.windows.length * 30) + 'px';
    windowEl.style.top = (50 + state.windows.length * 30) + 'px';
    windowEl.style.zIndex = ++state.windowZIndex;
    
    windowEl.innerHTML = `
        <div class="window-header">
            <div class="window-title">
                <span class="app-icon">${app.icon}</span>
                <span>${app.name}</span>
            </div>
            <div class="window-controls">
                <button class="window-control minimize-btn" title="Свернуть">─</button>
                <button class="window-control maximize-btn" title="Развернуть">◻</button>
                <button class="window-control close-btn" title="Закрыть">✕</button>
            </div>
        </div>
        <div class="window-content"></div>
        <div class="window-resize-handle"></div>
    `;
    
    const contentEl = windowEl.querySelector('.window-content');
    contentEl.appendChild(app.content());
    
    // События окна
    const header = windowEl.querySelector('.window-header');
    header.addEventListener('mousedown', startWindowDrag);
    header.addEventListener('touchstart', startWindowDrag, { passive: false });
    
    windowEl.querySelector('.minimize-btn').addEventListener('click', () => minimizeWindow(windowId));
    windowEl.querySelector('.maximize-btn').addEventListener('click', () => toggleMaximizeWindow(windowId));
    windowEl.querySelector('.close-btn').addEventListener('click', () => closeWindow(windowId));
    
    windowEl.querySelector('.window-resize-handle').addEventListener('mousedown', startWindowResize);
    
    windowEl.addEventListener('mousedown', () => focusWindow(windowId));
    windowEl.addEventListener('click', () => focusWindow(windowId));
    
    // Контекстное меню окна
    windowEl.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        showContextMenu(e.clientX, e.clientY, 'window', windowId);
    });
    
    return windowEl;
}

function focusWindow(windowId) {
    state.windows.forEach(win => {
        win.element.style.zIndex = win.id === windowId ? ++state.windowZIndex : win.element.style.zIndex;
    });
    
    state.activeWindow = windowId;
    
    // Обновление taskbar
    document.querySelectorAll('.taskbar-app').forEach(app => {
        app.classList.remove('active');
    });
    document.querySelector(`.taskbar-app[data-window="${windowId}"]`)?.classList.add('active');
}

function minimizeWindow(windowId) {
    const win = state.windows.find(w => w.id === windowId);
    if (!win) return;
    
    win.minimized = true;
    win.element.classList.add('minimized');
    
    document.querySelector(`.taskbar-app[data-window="${windowId}"]`)?.classList.remove('active');
}

function restoreWindow(windowId) {
    const win = state.windows.find(w => w.id === windowId);
    if (!win) return;
    
    win.minimized = false;
    win.element.classList.remove('minimized');
    focusWindow(windowId);
}

function toggleMaximizeWindow(windowId) {
    const win = state.windows.find(w => w.id === windowId);
    if (!win) return;
    
    win.maximized = !win.maximized;
    win.element.classList.toggle('maximized');
    
    const btn = win.element.querySelector('.maximize-btn');
    btn.textContent = win.maximized ? '❐' : '◻';
}

function closeWindow(windowId) {
    const win = state.windows.find(w => w.id === windowId);
    if (!win) return;
    
    win.element.style.opacity = '0';
    win.element.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        win.element.remove();
        state.windows = state.windows.filter(w => w.id !== windowId);
        removeFromTaskbar(windowId);
    }, 150);
}

// Перетаскивание окон
let isDragging = false;
let dragWindow = null;
let dragOffset = { x: 0, y: 0 };

function startWindowDrag(e) {
    if (e.target.closest('.window-controls')) return;
    
    isDragging = true;
    dragWindow = e.target.closest('.window');
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    dragOffset.x = clientX - dragWindow.offsetLeft;
    dragOffset.y = clientY - dragWindow.offsetTop;
    
    document.addEventListener('mousemove', dragWindowHandler);
    document.addEventListener('touchmove', dragWindowHandler, { passive: false });
    document.addEventListener('mouseup', stopWindowDrag);
    document.addEventListener('touchend', stopWindowDrag);
}

function dragWindowHandler(e) {
    if (!isDragging || !dragWindow) return;
    e.preventDefault();
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const x = clientX - dragOffset.x;
    const y = clientY - dragOffset.y;
    
    dragWindow.style.left = Math.max(0, x) + 'px';
    dragWindow.style.top = Math.max(0, y) + 'px';
}

function stopWindowDrag() {
    isDragging = false;
    dragWindow = null;
    document.removeEventListener('mousemove', dragWindowHandler);
    document.removeEventListener('touchmove', dragWindowHandler);
}

// Изменение размера окон
let isResizing = false;
let resizeWindow = null;

function startWindowResize(e) {
    isResizing = true;
    resizeWindow = e.target.closest('.window');
    e.stopPropagation();
    
    document.addEventListener('mousemove', handleWindowResize);
    document.addEventListener('mouseup', stopWindowResize);
}

function handleWindowResize(e) {
    if (!isResizing || !resizeWindow) return;
    
    const rect = resizeWindow.getBoundingClientRect();
    const newWidth = e.clientX - rect.left;
    const newHeight = e.clientY - rect.top;
    
    if (newWidth > 300) resizeWindow.style.width = newWidth + 'px';
    if (newHeight > 200) resizeWindow.style.height = newHeight + 'px';
}

function stopWindowResize() {
    isResizing = false;
    resizeWindow = null;
    document.removeEventListener('mousemove', handleWindowResize);
}

// ============================================
// Панель задач (приложения)
// ============================================

function addToTaskbar(windowId, app) {
    const taskbarApps = document.getElementById('taskbar-apps');
    const appEl = document.createElement('button');
    appEl.className = 'taskbar-app active';
    appEl.dataset.window = windowId;
    appEl.innerHTML = app.icon;
    appEl.title = app.name;
    
    appEl.addEventListener('click', () => {
        const win = state.windows.find(w => w.id === windowId);
        if (win) {
            if (win.minimized) {
                restoreWindow(windowId);
            } else if (state.activeWindow === windowId) {
                minimizeWindow(windowId);
            } else {
                focusWindow(windowId);
            }
        }
    });
    
    taskbarApps.appendChild(appEl);
}

function removeFromTaskbar(windowId) {
    const appEl = document.querySelector(`.taskbar-app[data-window="${windowId}"]`);
    if (appEl) {
        appEl.remove();
    }
}

// ============================================
// Боковые панели
// ============================================

function initPanels() {
    // Закрытие панелей
    document.getElementById('widgets-close').addEventListener('click', toggleWidgets);
    document.getElementById('notifications-close').addEventListener('click', toggleNotifications);
    
    // Быстрые настройки
    document.getElementById('wifi-btn').addEventListener('click', function() {
        this.classList.toggle('active');
    });
    
    document.getElementById('bluetooth-btn').addEventListener('click', function() {
        this.classList.toggle('active');
    });
    
    document.getElementById('airplane-btn').addEventListener('click', function() {
        this.classList.toggle('active');
    });
    
    document.getElementById('dnd-btn').addEventListener('click', function() {
        this.classList.toggle('active');
    });
    
    // Яркость
    document.getElementById('brightness').addEventListener('input', function() {
        document.body.style.filter = `brightness(${this.value}%)`;
    });
}

function toggleWidgets() {
    state.widgetsOpen = !state.widgetsOpen;
    const panel = document.getElementById('widgets-panel');
    
    if (state.widgetsOpen) {
        panel.classList.add('visible');
        if (state.notificationsOpen) toggleNotifications();
    } else {
        panel.classList.remove('visible');
    }
}

function toggleNotifications() {
    state.notificationsOpen = !state.notificationsOpen;
    const panel = document.getElementById('notifications-panel');
    
    if (state.notificationsOpen) {
        panel.classList.add('visible');
        if (state.widgetsOpen) toggleWidgets();
    } else {
        panel.classList.remove('visible');
    }
}

function closePanels() {
    if (state.widgetsOpen) toggleWidgets();
    if (state.notificationsOpen) toggleNotifications();
}

// ============================================
// Виджеты
// ============================================

function initWidgets() {
    // Данные виджетов уже в HTML
}

// ============================================
// Контекстное меню
// ============================================

function initContextMenu() {
    document.addEventListener('click', () => {
        hideContextMenu();
    });
    
    document.addEventListener('contextmenu', (e) => {
        if (!e.target.closest('.desktop') && !e.target.closest('.window')) {
            hideContextMenu();
        }
    });
}

function showContextMenu(x, y, type, windowId = null) {
    hideContextMenu();
    
    const menu = type === 'window' 
        ? document.getElementById('window-context-menu')
        : document.getElementById('context-menu');
    
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
    menu.classList.add('visible');
    menu.dataset.windowId = windowId || '';
    
    // Обработчики действий
    menu.querySelectorAll('.context-item').forEach(item => {
        item.onclick = (e) => {
            e.stopPropagation();
            handleContextAction(item.dataset.action, windowId);
            hideContextMenu();
        };
    });
}

function hideContextMenu() {
    document.querySelectorAll('.context-menu').forEach(menu => {
        menu.classList.remove('visible');
    });
}

function handleContextAction(action, windowId) {
    switch (action) {
        case 'refresh':
            location.reload();
            break;
        case 'close':
        case 'minimize':
        case 'maximize':
        case 'restore':
            if (windowId) {
                const win = state.windows.find(w => w.id === windowId);
                if (win) {
                    if (action === 'close') closeWindow(windowId);
                    else if (action === 'minimize') minimizeWindow(windowId);
                    else if (action === 'maximize') toggleMaximizeWindow(windowId);
                    else if (action === 'restore') restoreWindow(windowId);
                }
            }
            break;
        case 'settings':
            openApp('settings');
            break;
        case 'personalize':
            showToast('🎨', 'Персонализация', 'Открытие настроек персонализации...');
            setTimeout(() => openApp('settings'), 500);
            break;
        case 'new':
            showToast('📁', 'Создать', 'Выберите тип файла');
            break;
    }
}

// ============================================
// Тема
// ============================================

function initTheme() {
    const savedTheme = localStorage.getItem('win11-theme') || 'dark';
    applyTheme(savedTheme);
}

function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme(state.theme);
    localStorage.setItem('win11-theme', state.theme);
}

function applyTheme(theme) {
    state.theme = theme;
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(theme + '-theme');
}

// ============================================
// Уведомления
// ============================================

function showToast(icon, title, message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function addNotification(icon, title, message) {
    const content = document.getElementById('notifications-content');
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-icon">${icon}</div>
        <div class="notification-text">
            <strong>${title}</strong>
            <p>${message}</p>
        </div>
    `;
    content.prepend(notification);
}

// ============================================
// Полноэкранный режим
// ============================================

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => {
            state.fullscreen = true;
        });
    } else {
        document.exitFullscreen().then(() => {
            state.fullscreen = false;
        });
    }
}

// Клавиша F11 для полноэкранного режима
document.addEventListener('keydown', (e) => {
    if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
    }
    
    // Alt+F4 для закрытия активного окна
    if (e.altKey && e.key === 'F4') {
        e.preventDefault();
        if (state.activeWindow) {
            closeWindow(state.activeWindow);
        }
    }
    
    // Win ключ для меню Пуск
    if (e.key === 'Meta' || e.key === 'OS') {
        e.preventDefault();
        toggleStartMenu();
    }
    
    // Escape для закрытия меню
    if (e.key === 'Escape') {
        closeStartMenu();
        closePanels();
        hideContextMenu();
    }
});

// ============================================
// Создание контента приложений
// ============================================

function createExplorerContent() {
    const container = document.createElement('div');
    container.className = 'app-container';
    container.innerHTML = `
        <div class="app-toolbar">
            <button>⬅️</button>
            <button>➡️</button>
            <button>⬆️</button>
            <button>🔄</button>
        </div>
        <div class="explorer-layout">
            <div class="explorer-sidebar">
                <div class="explorer-nav-item active">🏠 Главная</div>
                <div class="explorer-nav-item">🖥️ Этот компьютер</div>
                <div class="explorer-nav-item">📁 Документы</div>
                <div class="explorer-nav-item">🖼️ Изображения</div>
                <div class="explorer-nav-item">🎵 Музыка</div>
                <div class="explorer-nav-item">🎬 Видео</div>
                <div class="explorer-nav-item">☁️ OneDrive</div>
                <div class="explorer-nav-item">🗑️ Корзина</div>
            </div>
            <div class="explorer-main">
                <div class="explorer-address-bar">
                    <span>📍</span>
                    <input type="text" value="Этот компьютер">
                </div>
                <div class="explorer-files">
                    <div class="explorer-file">
                        <div class="explorer-file-icon">💿</div>
                        <div class="explorer-file-name">Диск (C:)</div>
                    </div>
                    <div class="explorer-file">
                        <div class="explorer-file-icon">💿</div>
                        <div class="explorer-file-name">Диск (D:)</div>
                    </div>
                    <div class="explorer-file">
                        <div class="explorer-file-icon">📁</div>
                        <div class="explorer-file-name">Документы</div>
                    </div>
                    <div class="explorer-file">
                        <div class="explorer-file-icon">📁</div>
                        <div class="explorer-file-name">Загрузки</div>
                    </div>
                    <div class="explorer-file">
                        <div class="explorer-file-icon">📁</div>
                        <div class="explorer-file-name">Рабочий стол</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    return container;
}

function createEdgeContent() {
    const container = document.createElement('div');
    container.className = 'app-container';
    container.innerHTML = `
        <div class="app-toolbar">
            <button>⬅️</button>
            <button>➡️</button>
            <button>🔄</button>
            <button>🏠</button>
            <input type="text" placeholder="Введите URL или поисковый запрос" style="flex:1;padding:6px 12px;border:1px solid var(--border-color);border-radius:20px;background:var(--mica);color:var(--text-color);outline:none;">
            <button>⭐</button>
            <button>⋮</button>
        </div>
        <div class="app-body" style="display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;">
            <div style="font-size:64px;margin-bottom:20px;">🌐</div>
            <h2 style="color:var(--text-color);margin-bottom:10px;">Microsoft Edge</h2>
            <p style="color:var(--text-color);opacity:0.7;">Браузер готов к работе</p>
            <div style="margin-top:20px;">
                <input type="text" placeholder="Поиск в интернете..." style="padding:12px 20px;width:400px;max-width:90%;border:1px solid var(--border-color);border-radius:24px;background:var(--mica);color:var(--text-color);outline:none;">
            </div>
        </div>
    `;
    return container;
}

function createWordContent() {
    const container = document.createElement('div');
    container.className = 'app-container';
    container.innerHTML = `
        <div class="app-toolbar">
            <button>📄 Новый</button>
            <button>📂 Открыть</button>
            <button>💾 Сохранить</button>
            <button>🖨️ Печать</button>
            <span style="border-left:1px solid var(--border-color);margin:0 8px;"></span>
            <button><b>B</b></button>
            <button><i>I</i></button>
            <button><u>U</u></button>
        </div>
        <div class="app-body" style="padding:0;">
            <div style="width:100%;height:100%;padding:40px;background:white;color:black;overflow:auto;">
                <h1 style="margin-bottom:20px;">Документ Word</h1>
                <p>Начните вводить текст здесь...</p>
                <p style="color:#666;">Это демонстрационная версия Microsoft Word для Windows 11 Web.</p>
            </div>
        </div>
    `;
    return container;
}

function createExcelContent() {
    const container = document.createElement('div');
    container.className = 'app-container';
    container.innerHTML = `
        <div class="app-toolbar">
            <button>📄 Новый</button>
            <button>📂 Открыть</button>
            <button>💾 Сохранить</button>
            <button>📊 Диаграмма</button>
        </div>
        <div class="app-body" style="padding:0;overflow:auto;">
            <table style="width:100%;border-collapse:collapse;">
                <tr>
                    <th style="border:1px solid #ccc;background:#f3f3f3;padding:8px;width:50px;"></th>
                    <th style="border:1px solid #ccc;background:#f3f3f3;padding:8px;">A</th>
                    <th style="border:1px solid #ccc;background:#f3f3f3;padding:8px;">B</th>
                    <th style="border:1px solid #ccc;background:#f3f3f3;padding:8px;">C</th>
                    <th style="border:1px solid #ccc;background:#f3f3f3;padding:8px;">D</th>
                </tr>
                <tr>
                    <th style="border:1px solid #ccc;background:#f3f3f3;padding:8px;">1</th>
                    <td style="border:1px solid #ccc;padding:8px;"><input type="text" style="width:100%;border:none;outline:none;" value="Продукт"></td>
                    <td style="border:1px solid #ccc;padding:8px;"><input type="text" style="width:100%;border:none;outline:none;" value="Цена"></td>
                    <td style="border:1px solid #ccc;padding:8px;"><input type="text" style="width:100%;border:none;outline:none;" value="Кол-во"></td>
                    <td style="border:1px solid #ccc;padding:8px;"><input type="text" style="width:100%;border:none;outline:none;" value="Сумма"></td>
                </tr>
                <tr>
                    <th style="border:1px solid #ccc;background:#f3f3f3;padding:8px;">2</th>
                    <td style="border:1px solid #ccc;padding:8px;"><input type="text" style="width:100%;border:none;outline:none;" value="Товар 1"></td>
                    <td style="border:1px solid #ccc;padding:8px;"><input type="number" style="width:100%;border:none;outline:none;" value="100"></td>
                    <td style="border:1px solid #ccc;padding:8px;"><input type="number" style="width:100%;border:none;outline:none;" value="5"></td>
                    <td style="border:1px solid #ccc;padding:8px;"><input type="text" style="width:100%;border:none;outline:none;" value="=B2*C2"></td>
                </tr>
                <tr>
                    <th style="border:1px solid #ccc;background:#f3f3f3;padding:8px;">3</th>
                    <td style="border:1px solid #ccc;padding:8px;"><input type="text" style="width:100%;border:none;outline:none;" value="Товар 2"></td>
                    <td style="border:1px solid #ccc;padding:8px;"><input type="number" style="width:100%;border:none;outline:none;" value="200"></td>
                    <td style="border:1px solid #ccc;padding:8px;"><input type="number" style="width:100%;border:none;outline:none;" value="3"></td>
                    <td style="border:1px solid #ccc;padding:8px;"><input type="text" style="width:100%;border:none;outline:none;" value="=B3*C3"></td>
                </tr>
            </table>
        </div>
    `;
    return container;
}

function createCalculatorContent() {
    const container = document.createElement('div');
    container.className = 'app-container';
    container.style.height = '100%';
    
    const calc = document.createElement('div');
    calc.className = 'calculator-grid';
    calc.innerHTML = `
        <div class="calc-display" id="calc-display">0</div>
        <button class="calc-btn" data-action="clear">C</button>
        <button class="calc-btn" data-action="backspace">⌫</button>
        <button class="calc-btn" data-action="percent">%</button>
        <button class="calc-btn operator" data-action="divide">÷</button>
        <button class="calc-btn" data-value="7">7</button>
        <button class="calc-btn" data-value="8">8</button>
        <button class="calc-btn" data-value="9">9</button>
        <button class="calc-btn operator" data-action="multiply">×</button>
        <button class="calc-btn" data-value="4">4</button>
        <button class="calc-btn" data-value="5">5</button>
        <button class="calc-btn" data-value="6">6</button>
        <button class="calc-btn operator" data-action="subtract">−</button>
        <button class="calc-btn" data-value="1">1</button>
        <button class="calc-btn" data-value="2">2</button>
        <button class="calc-btn" data-value="3">3</button>
        <button class="calc-btn operator" data-action="add">+</button>
        <button class="calc-btn" data-value="0" style="grid-column:span 2;">0</button>
        <button class="calc-btn" data-action="decimal">.</button>
        <button class="calc-btn equals" data-action="equals">=</button>
    `;
    
    container.appendChild(calc);
    
    // Логика калькулятора
    let display = '0';
    let previousValue = null;
    let operation = null;
    let waitingForOperand = false;
    
    const displayEl = calc.querySelector('#calc-display');
    
    calc.addEventListener('click', (e) => {
        const btn = e.target.closest('.calc-btn');
        if (!btn) return;
        
        const value = btn.dataset.value;
        const action = btn.dataset.action;
        
        if (value) {
            if (waitingForOperand) {
                display = value;
                waitingForOperand = false;
            } else {
                display = display === '0' ? value : display + value;
            }
        } else if (action) {
            switch (action) {
                case 'clear':
                    display = '0';
                    previousValue = null;
                    operation = null;
                    waitingForOperand = false;
                    break;
                case 'backspace':
                    display = display.length > 1 ? display.slice(0, -1) : '0';
                    break;
                case 'percent':
                    display = String(parseFloat(display) / 100);
                    break;
                case 'decimal':
                    if (!display.includes('.')) {
                        display += '.';
                    }
                    break;
                case 'add':
                case 'subtract':
                case 'multiply':
                case 'divide':
                    previousValue = parseFloat(display);
                    operation = action;
                    waitingForOperand = true;
                    break;
                case 'equals':
                    if (previousValue !== null && operation) {
                        const current = parseFloat(display);
                        let result;
                        switch (operation) {
                            case 'add': result = previousValue + current; break;
                            case 'subtract': result = previousValue - current; break;
                            case 'multiply': result = previousValue * current; break;
                            case 'divide': result = previousValue / current; break;
                        }
                        display = String(result);
                        previousValue = null;
                        operation = null;
                        waitingForOperand = true;
                    }
                    break;
            }
        }
        
        displayEl.textContent = display;
    });
    
    return container;
}

function createSettingsContent() {
    const container = document.createElement('div');
    container.className = 'app-container';
    container.innerHTML = `
        <div class="settings-layout">
            <div class="settings-sidebar">
                <div class="settings-nav-item active">🏠 Главная</div>
                <div class="settings-nav-item">🖥️ Система</div>
                <div class="settings-nav-item">📱 Bluetooth и устройства</div>
                <div class="settings-nav-item">🌐 Сеть и интернет</div>
                <div class="settings-nav-item">🎨 Персонализация</div>
                <div class="settings-nav-item">📦 Приложения</div>
                <div class="settings-nav-item">👤 Учетные записи</div>
                <div class="settings-nav-item">⏰ Время и язык</div>
                <div class="settings-nav-item">🎮 Игры</div>
                <div class="settings-nav-item">♿ Специальные возможности</div>
                <div class="settings-nav-item">🔒 Конфиденциальность</div>
                <div class="settings-nav-item">🔄 Обновление</div>
            </div>
            <div class="settings-content">
                <h2 style="color:var(--text-color);margin-bottom:24px;">Параметры Windows</h2>
                
                <div class="settings-section">
                    <h3>Тема</h3>
                    <div class="settings-option">
                        <div class="settings-option-info">
                            <span class="settings-option-icon">🌓</span>
                            <div class="settings-option-text">
                                <h4>Тёмная тема</h4>
                                <p>Переключение между светлой и тёмной темой</p>
                            </div>
                        </div>
                        <div class="toggle-switch ${state.theme === 'dark' ? 'active' : ''}" id="theme-toggle"></div>
                    </div>
                </div>
                
                <div class="settings-section">
                    <h3>О системе</h3>
                    <div class="settings-option">
                        <div class="settings-option-info">
                            <span class="settings-option-icon">💻</span>
                            <div class="settings-option-text">
                                <h4>Windows 11 Web</h4>
                                <p>Версия: 1.0.0 | PWA Edition</p>
                            </div>
                        </div>
                    </div>
                    <div class="settings-option">
                        <div class="settings-option-info">
                            <span class="settings-option-icon">🌐</span>
                            <div class="settings-option-text">
                                <h4>Браузер</h4>
                                <p>${navigator.userAgent.split(' ').pop()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Переключатель темы
    setTimeout(() => {
        const themeToggle = container.querySelector('#theme-toggle');
        themeToggle.addEventListener('click', toggleTheme);
    }, 0);
    
    // Навигация
    container.querySelectorAll('.settings-nav-item').forEach(item => {
        item.addEventListener('click', function() {
            container.querySelectorAll('.settings-nav-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    return container;
}

function createStoreContent() {
    const container = document.createElement('div');
    container.className = 'app-container';
    container.innerHTML = `
        <div class="app-toolbar">
            <button>🏠 Главная</button>
            <button>🎮 Игры</button>
            <button>📱 Приложения</button>
            <button>🎬 Фильмы</button>
            <input type="text" placeholder="Поиск в магазине" style="flex:1;padding:6px 12px;border:1px solid var(--border-color);border-radius:20px;background:var(--mica);color:var(--text-color);outline:none;">
        </div>
        <div class="app-body">
            <h2 style="color:var(--text-color);margin-bottom:20px;">Рекомендуемые приложения</h2>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:16px;">
                <div style="padding:16px;background:var(--mica);border-radius:8px;border:1px solid var(--border-color);cursor:pointer;" onclick="showToast('📥','Загрузка','Установка приложения...')">
                    <div style="font-size:48px;margin-bottom:8px;">🎵</div>
                    <div style="color:var(--text-color);font-weight:600;">Spotify</div>
                    <div style="color:var(--text-color);opacity:0.7;font-size:12px;">Бесплатно</div>
                </div>
                <div style="padding:16px;background:var(--mica);border-radius:8px;border:1px solid var(--border-color);cursor:pointer;" onclick="showToast('📥','Загрузка','Установка приложения...')">
                    <div style="font-size:48px;margin-bottom:8px;">🎬</div>
                    <div style="color:var(--text-color);font-weight:600;">Netflix</div>
                    <div style="color:var(--text-color);opacity:0.7;font-size:12px;">Бесплатно</div>
                </div>
                <div style="padding:16px;background:var(--mica);border-radius:8px;border:1px solid var(--border-color);cursor:pointer;" onclick="showToast('📥','Загрузка','Установка приложения...')">
                    <div style="font-size:48px;margin-bottom:8px;">💬</div>
                    <div style="color:var(--text-color);font-weight:600;">Discord</div>
                    <div style="color:var(--text-color);opacity:0.7;font-size:12px;">Бесплатно</div>
                </div>
                <div style="padding:16px;background:var(--mica);border-radius:8px;border:1px solid var(--border-color);cursor:pointer;" onclick="showToast('📥','Загрузка','Установка приложения...')">
                    <div style="font-size:48px;margin-bottom:8px;">📸</div>
                    <div style="color:var(--text-color);font-weight:600;">Instagram</div>
                    <div style="color:var(--text-color);opacity:0.7;font-size:12px;">Бесплатно</div>
                </div>
            </div>
        </div>
    `;
    return container;
}

function createPhotosContent() {
    const container = document.createElement('div');
    container.className = 'app-container';
    container.innerHTML = `
        <div class="app-toolbar">
            <button>📂 Открыть</button>
            <button>🖼️ Показать</button>
            <button>✏️ Изменить</button>
            <button>🗑️ Удалить</button>
        </div>
        <div class="app-body">
            <h2 style="color:var(--text-color);margin-bottom:20px;">Коллекция</h2>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px;">
                <div style="aspect-ratio:1;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:8px;cursor:pointer;" onclick="showToast('🖼️','Фото','Просмотр изображения')"></div>
                <div style="aspect-ratio:1;background:linear-gradient(135deg,#f093fb,#f5576c);border-radius:8px;cursor:pointer;" onclick="showToast('🖼️','Фото','Просмотр изображения')"></div>
                <div style="aspect-ratio:1;background:linear-gradient(135deg,#4facfe,#00f2fe);border-radius:8px;cursor:pointer;" onclick="showToast('🖼️','Фото','Просмотр изображения')"></div>
                <div style="aspect-ratio:1;background:linear-gradient(135deg,#43e97b,#38f9d7);border-radius:8px;cursor:pointer;" onclick="showToast('🖼️','Фото','Просмотр изображения')"></div>
                <div style="aspect-ratio:1;background:linear-gradient(135deg,#fa709a,#fee140);border-radius:8px;cursor:pointer;" onclick="showToast('🖼️','Фото','Просмотр изображения')"></div>
                <div style="aspect-ratio:1;background:linear-gradient(135deg,#a8edea,#fed6e3);border-radius:8px;cursor:pointer;" onclick="showToast('🖼️','Фото','Просмотр изображения')"></div>
            </div>
        </div>
    `;
    return container;
}

function createTerminalContent() {
    const container = document.createElement('div');
    container.className = 'app-container';
    container.style.height = '100%';
    
    const terminal = document.createElement('div');
    terminal.className = 'terminal-content';
    terminal.innerHTML = `
        <div>Microsoft Windows [Version 10.0.22000.1]</div>
        <div>(c) Microsoft Corporation. All rights reserved.</div>
        <br>
        <div id="terminal-output"></div>
        <div class="terminal-input-line">
            <span class="terminal-prompt">C:\\Users\\Пользователь></span>
            <input type="text" class="terminal-input" autofocus>
        </div>
    `;
    
    container.appendChild(terminal);
    
    // Логика терминала
    const input = terminal.querySelector('.terminal-input');
    const output = terminal.querySelector('#terminal-output');
    const commands = {
        'help': 'Доступные команды: help, ver, dir, cd, cls, echo, date, time, exit',
        'ver': 'Microsoft Windows [Version 10.0.22000.1]',
        'dir': ' Директория C:\\Users\\Пользователь\n\n<DIR>    .\n<DIR>    ..\n<DIR>    Desktop\n<DIR>    Documents\n<DIR>    Downloads',
        'cls': 'CLS',
        'date': new Date().toLocaleDateString('ru-RU'),
        'time': new Date().toLocaleTimeString('ru-RU'),
        'echo': 'ECHO is on.'
    };
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = input.value.trim().toLowerCase();
            const cmdLine = document.createElement('div');
            cmdLine.innerHTML = `<span class="terminal-prompt">C:\\Users\\Пользователь></span> ${input.value}`;
            output.appendChild(cmdLine);
            
            if (cmd === 'exit') {
                const win = terminal.closest('.window');
                if (win) closeWindow(win.id);
                return;
            }
            
            if (cmd === 'cls') {
                output.innerHTML = '';
            } else if (commands[cmd]) {
                const result = document.createElement('div');
                result.textContent = commands[cmd];
                output.appendChild(result);
            } else if (cmd.startsWith('echo ')) {
                const result = document.createElement('div');
                result.textContent = input.value.substring(5);
                output.appendChild(result);
            } else if (cmd) {
                const result = document.createElement('div');
                result.textContent = `'${cmd}' is not recognized as an internal or external command.`;
                result.style.color = '#ff6b6b';
                output.appendChild(result);
            }
            
            input.value = '';
            terminal.scrollTop = terminal.scrollHeight;
        }
    });
    
    return container;
}

function createNotepadContent() {
    const container = document.createElement('div');
    container.className = 'app-container';
    container.innerHTML = `
        <div class="app-toolbar">
            <button>📄 Новый</button>
            <button>📂 Открыть</button>
            <button>💾 Сохранить</button>
            <span style="border-left:1px solid var(--border-color);margin:0 8px;"></span>
            <button>✂️ Вырезать</button>
            <button>📋 Копировать</button>
            <button>📌 Вставить</button>
        </div>
        <textarea class="notepad-textarea" placeholder="Начните вводить текст..."></textarea>
    `;
    return container;
}

function createMusicContent() {
    const container = document.createElement('div');
    container.className = 'app-container';
    container.innerHTML = `
        <div class="app-toolbar">
            <button>⏮️</button>
            <button>▶️</button>
            <button>⏸️</button>
            <button>⏭️</button>
            <input type="range" style="flex:1;max-width:200px;" min="0" max="100" value="30">
        </div>
        <div class="app-body" style="display:flex;flex-direction:column;align-items:center;justify-content:center;">
            <div style="width:200px;height:200px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:16px;display:flex;align-items:center;justify-content:center;margin-bottom:20px;">
                <span style="font-size:80px;">🎵</span>
            </div>
            <h3 style="color:var(--text-color);margin-bottom:8px;">Название трека</h3>
            <p style="color:var(--text-color);opacity:0.7;">Исполнитель</p>
            <div style="width:100%;max-width:400px;margin-top:20px;">
                <input type="range" style="width:100%;" min="0" max="100" value="45">
                <div style="display:flex;justify-content:space-between;margin-top:8px;">
                    <span style="color:var(--text-color);font-size:12px;">1:23</span>
                    <span style="color:var(--text-color);font-size:12px;">3:45</span>
                </div>
            </div>
        </div>
    `;
    return container;
}

function createVideoContent() {
    const container = document.createElement('div');
    container.className = 'app-container';
    container.innerHTML = `
        <div class="app-body" style="display:flex;flex-direction:column;height:100%;">
            <div style="flex:1;background:#000;display:flex;align-items:center;justify-content:center;">
                <span style="font-size:80px;">🎬</span>
            </div>
            <div class="app-toolbar" style="border-top:1px solid var(--border-color);border-bottom:none;">
                <button>⏮️</button>
                <button>▶️</button>
                <button>⏸️</button>
                <button>⏭️</button>
                <input type="range" style="flex:1;" min="0" max="100" value="0">
                <button>🔊</button>
                <input type="range" style="width:80px;" min="0" max="100" value="50">
                <button>⛶</button>
            </div>
        </div>
    `;
    return container;
}

// PWA: Обработка установки
let deferredPrompt = null;

function initPWAInstall() {
    const installBanner = document.getElementById('pwa-install-banner');
    const installBtn = document.getElementById('pwa-install-btn');
    const closeBtn = document.getElementById('pwa-install-close');
    
    // Обработка beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        console.log('[PWA] Установка доступна');
        
        // Показываем баннер в меню Пуск
        if (installBanner) {
            installBanner.style.display = 'block';
        }
        
        // Альтернативно: добавляем кнопку в панель задач
        addInstallNotification();
    });
    
    // Обработка успешной установки
    window.addEventListener('appinstalled', () => {
        console.log('[PWA] Приложение установлено');
        if (installBanner) {
            installBanner.style.display = 'none';
        }
        deferredPrompt = null;
        showToast('✅', 'Windows 11', 'Приложение успешно установлено');
    });
    
    // Кнопка установки в баннере
    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (!deferredPrompt) {
                showToast('⚠️', 'Установка', 'Установка недоступна. Попробуйте добавить на главный экран через меню браузера.');
                return;
            }
            
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log('[PWA] Выбор пользователя:', outcome);
            deferredPrompt = null;
            
            if (installBanner) {
                installBanner.style.display = 'none';
            }
        });
    }
    
    // Закрытие баннера
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (installBanner) {
                installBanner.style.display = 'none';
            }
        });
    }
}

function addInstallNotification() {
    // Проверяем, не показывали ли уже
    if (sessionStorage.getItem('pwa-install-shown')) return;
    
    setTimeout(() => {
        showToast('📥', 'Установка', 'Нажмите "Поделиться" → "На экран «Домой»"');
        sessionStorage.setItem('pwa-install-shown', 'true');
    }, 3000);
}

// Полноэкранный режим
function initFullscreen() {
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }
    
    // Отслеживание изменения полноэкранного режима
    document.addEventListener('fullscreenchange', () => {
        state.fullscreen = !!document.fullscreenElement;
        const btn = document.getElementById('fullscreen-btn');
        if (btn) {
            btn.textContent = state.fullscreen ? '⛶' : '⛶';
        }
    });
}

function toggleFullscreen() {
    const elem = document.documentElement;
    
    if (!document.fullscreenElement) {
        // Вход в полноэкранный режим
        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch(err => {
                console.log('[Fullscreen] Error:', err);
                // Fallback для iOS
                if (elem.webkitRequestFullscreen) {
                    elem.webkitRequestFullscreen();
                }
            });
        } else if (elem.webkitRequestFullscreen) {
            // Safari iOS
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            // IE/Edge
            elem.msRequestFullscreen();
        }
        
        state.fullscreen = true;
        showToast('⛶', 'Полный экран', 'Нажмите F11 или кнопку для выхода');
    } else {
        // Выход из полноэкранного режима
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        
        state.fullscreen = false;
    }
}

// PWA: Обработка установки
let deferredPromptOld;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPromptOld = e;
});

// PWA: Обновление доступно
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        addNotification('🔄', 'Обновление', 'Доступна новая версия приложения');
    });
}

console.log('Windows 11 Web initialized');
