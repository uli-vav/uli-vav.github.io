// ==================== 1. Начальные данные ====================
// Здесь будут храниться все наши задачи.
// Каждая задача — это объект: { id, text, completed }
let tasks = [];
// ==================== 2. Получаем ссылки на элементы из HTML ====================
const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const tasksList = document.getElementById('tasksList');
const clearAllButton = document.getElementById('clearAllButton');
const remainingSpan = document.getElementById('remainingCount'); // сюда будем писать число оставшихся задач
// ==================== 3. Функции для работы с localStorage ====================
// Загружаем задачи из хранилища браузера при запуске
function loadTasks() {
    const saved = localStorage.getItem('myTodoTasks'); // пытаемся получить данные по ключу 'myTodoTasks'
    if (saved) {
        // Если там что-то есть, превращаем строку обратно в массив
        tasks = JSON.parse(saved);
    } else {
        // Если ничего нет, оставляем пустой массив
        tasks = [];
    }
}
// Сохраняем текущий массив задач в localStorage
function saveTasks() {
    localStorage.setItem('myTodoTasks', JSON.stringify(tasks));
}
// ==================== 4. Функция отображения задач на странице ====================
function renderTasks() {
    // Очищаем контейнер со списком задач
    tasksList.innerHTML = '';
    // Переменная для подсчёта оставшихся (невыполненных) задач
    let remaining = 0;
    // Перебираем все задачи в массиве
    tasks.forEach(task => {
        // Создаём карточку задачи — элемент <div>
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task-item'; // добавляем класс для стилей
        if (task.completed) {
            taskDiv.classList.add('completed'); // если задача выполнена, добавляем ещё класс completed
        }
        taskDiv.dataset.id = task.id; // сохраняем id задачи в атрибут data-id
        // Создаём чекбокс
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;
        // При изменении чекбокса переключаем состояние задачи
        checkbox.addEventListener('change', () => toggleTask(task.id));
        // Создаём элемент с текстом задачи
        const textSpan = document.createElement('span');
        textSpan.className = 'task-text';
        textSpan.textContent = task.text;
        // Создаём кнопку удаления
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '✖';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        // Собираем всё вместе: в карточку добавляем чекбокс, текст, кнопку
        taskDiv.appendChild(checkbox);
        taskDiv.appendChild(textSpan);
        taskDiv.appendChild(deleteBtn);
        // Добавляем готовую карточку в общий список
        tasksList.appendChild(taskDiv);
        // Если задача ещё не выполнена, увеличиваем счётчик remaining
        if (!task.completed) {
            remaining++;
        }
    });
    // Обновляем счётчик на странице
    remainingSpan.textContent = remaining;
}
// ==================== 5. Функция добавления новой задачи ====================
function addTask() {
    const text = taskInput.value.trim(); // берём текст из поля и убираем лишние пробелы
    if (text === '') {
        alert('Введите текст задачи!'); // если ничего не ввели, показываем предупреждение
        return;
    }
    // Создаём объект новой задачи
    const newTask = {
        id: Date.now(), // уникальный номер на основе текущего времени
        text: text,
        completed: false
    };
    // Добавляем в массив
    tasks.push(newTask);
    // Сохраняем в localStorage
    saveTasks();
    // Перерисовываем список
    renderTasks();
    // Очищаем поле ввода
    taskInput.value = '';
}
// ==================== 6. Функция переключения состояния задачи ====================
function toggleTask(id) {
    // Ищем задачу с таким id
    const task = tasks.find(t => t.id === id);
    if (task) {
        // Меняем completed на противоположное
        task.completed = !task.completed;
        // Сохраняем и перерисовываем
        saveTasks();
        renderTasks();
    }
}
// ==================== 7. Функция удаления задачи ====================
function deleteTask(id) {
    // Оставляем в массиве только те задачи, у которых id не равен переданному
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}
// ==================== 8. Функция очистки всех задач ====================
function clearAllTasks() {
    // Спрашиваем подтверждение
    if (confirm('Точно удалить все задачи?')) {
        tasks = []; // обнуляем массив
        saveTasks();
        renderTasks();
    }
}
// ==================== 9. Навешиваем обработчики событий ====================
addButton.addEventListener('click', addTask); // при клике на кнопку Добавить
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') { // если нажали Enter в поле ввода
        addTask();
    }
});
clearAllButton.addEventListener('click', clearAllTasks);
// ==================== 10. Запуск: загружаем сохранённые задачи и показываем их ====================
loadTasks();
renderTasks();
// ========== ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ SEO И UX ==========
// Функция для отслеживания действий пользователей (для будущей аналитики)
function trackUserAction(action, taskText = '') {
    console.log(`[SEO Event] ${action}: ${taskText}`);
    // В будущем здесь можно подключить Яндекс.Метрику или Google Analytics
}
// Добавляем отслеживание добавления задачи
const originalAddTask = addTask;
window.addTask = function() {
    const text = taskInput.value.trim();
    if (text) {
        trackUserAction('task_added', text);
    }
    originalAddTask();
};
// Добавляем отслеживание удаления задачи
const originalDeleteTask = deleteTask;
window.deleteTask = function(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        trackUserAction('task_deleted', task.text);
    }
    originalDeleteTask(id);
};
// Автоматическое сохранение при изменении задач (уже есть, но дублируем для надёжности)
window.addEventListener('beforeunload', function() {
    saveTasks();
});
// Выводим информацию о версии приложения (для отладки)
console.log('Мои задачи — версия 2.0 (SEO-оптимизированная)');
