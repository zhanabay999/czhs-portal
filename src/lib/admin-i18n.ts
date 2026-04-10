export type AdminLocale = "kk" | "ru";

const t: Record<string, Record<AdminLocale, string>> = {
  // Sidebar
  "sidebar.title": { kk: "ЦЖС Admin", ru: "ЦЖС Админ" },
  "sidebar.dashboard": { kk: "Dashboard", ru: "Панель" },
  "sidebar.news": { kk: "Жаңалықтар", ru: "Новости" },
  "sidebar.sanatorium": { kk: "Санаторий", ru: "Санаторий" },
  "sidebar.summerCamp": { kk: "Жазғы лагерь", ru: "Летний лагерь" },
  "sidebar.faq": { kk: "FAQ", ru: "FAQ" },
  "sidebar.contest": { kk: "Конкурстар", ru: "Конкурсы" },
  "sidebar.sports": { kk: "Спорт", ru: "Спорт" },
  "sidebar.sportsApplications": { kk: "Спорт өтінімдер", ru: "Заявки спортсменов" },
  "sidebar.patronage": { kk: "Патронаж", ru: "Патронаж" },
  "sidebar.heroSlides": { kk: "Слайдтар", ru: "Слайды" },
  "sidebar.leadership": { kk: "Басшылық", ru: "Руководство" },
  "sidebar.users": { kk: "Пайдаланушылар", ru: "Пользователи" },
  "sidebar.settings": { kk: "Баптаулар", ru: "Настройки" },
  "sidebar.profile": { kk: "Профиль", ru: "Профиль" },
  "sidebar.home": { kk: "Басты бетке", ru: "На главную" },
  "sidebar.logout": { kk: "Шығу", ru: "Выход" },

  // Dashboard
  "dash.title": { kk: "Dashboard", ru: "Панель управления" },
  "dash.subtitle": { kk: "ЦЖС Порталы басқару панелі", ru: "Панель управления порталом ЦЖС" },
  "dash.news": { kk: "Жаңалықтар", ru: "Новости" },
  "dash.users": { kk: "Пайдаланушылар", ru: "Пользователи" },
  "dash.votes": { kk: "Дауыстар", ru: "Голоса" },
  "dash.quickActions": { kk: "Жылдам әрекеттер", ru: "Быстрые действия" },
  "dash.addNews": { kk: "Жаңалық қосу", ru: "Добавить новость" },
  "dash.addSport": { kk: "Спорт іс-шара", ru: "Спорт. событие" },
  "dash.addFaq": { kk: "FAQ қосу", ru: "Добавить FAQ" },
  "dash.sysInfo": { kk: "Жүйе ақпараты", ru: "Информация о системе" },
  "dash.platform": { kk: "Платформа", ru: "Платформа" },
  "dash.database": { kk: "Деректер қоры", ru: "База данных" },
  "dash.hosting": { kk: "Хостинг", ru: "Хостинг" },
  "dash.languages": { kk: "Тілдер", ru: "Языки" },

  // News admin
  "news.title": { kk: "Жаңалықтар", ru: "Новости" },
  "news.count": { kk: "жаңалық", ru: "новостей" },
  "news.add": { kk: "Жаңалық қосу", ru: "Добавить новость" },
  "news.heading": { kk: "Тақырып", ru: "Заголовок" },
  "news.status": { kk: "Статус", ru: "Статус" },
  "news.views": { kk: "Қаралым", ru: "Просмотры" },
  "news.date": { kk: "Күні", ru: "Дата" },
  "news.action": { kk: "Әрекет", ru: "Действие" },
  "news.internal": { kk: "Ішкі", ru: "Внутр." },
  "news.empty": { kk: "Жаңалықтар жоқ. Жаңасын қосыңыз.", ru: "Нет новостей. Добавьте новую." },

  // News new/edit
  "newsForm.title": { kk: "Жаңа жаңалық", ru: "Новая новость" },
  "newsForm.tabKk": { kk: "Қазақша", ru: "Казахский" },
  "newsForm.tabRu": { kk: "Русский", ru: "Русский" },
  "newsForm.titleKk": { kk: "Тақырып (ҚАЗ) *", ru: "Заголовок (КАЗ) *" },
  "newsForm.titleKkPh": { kk: "Жаңалық тақырыбы", ru: "Заголовок новости на казахском" },
  "newsForm.excerptKk": { kk: "Қысқаша сипаттама (ҚАЗ)", ru: "Краткое описание (КАЗ)" },
  "newsForm.excerptKkPh": { kk: "Қысқаша мәтін...", ru: "Краткий текст..." },
  "newsForm.contentKk": { kk: "Мазмұны (ҚАЗ) *", ru: "Содержание (КАЗ) *" },
  "newsForm.contentKkPh": { kk: "Жаңалық мазмұнын жазыңыз. HTML тегтерін қолдануға болады: <p>, <h2>, <b>, <ul>, <li>, <img>", ru: "Напишите содержание на казахском. Можно использовать HTML теги: <p>, <h2>, <b>, <ul>, <li>, <img>" },
  "newsForm.titleRu": { kk: "Заголовок (РУС) *", ru: "Заголовок (РУС) *" },
  "newsForm.titleRuPh": { kk: "Заголовок новости", ru: "Заголовок новости на русском" },
  "newsForm.excerptRu": { kk: "Краткое описание (РУС)", ru: "Краткое описание (РУС)" },
  "newsForm.excerptRuPh": { kk: "Краткий текст...", ru: "Краткий текст..." },
  "newsForm.contentRu": { kk: "Содержание (РУС) *", ru: "Содержание (РУС) *" },
  "newsForm.contentRuPh": { kk: "Напишите содержание новости. Можно использовать HTML теги: <p>, <h2>, <b>, <ul>, <li>, <img>", ru: "Напишите содержание на русском. Можно использовать HTML теги: <p>, <h2>, <b>, <ul>, <li>, <img>" },
  "newsForm.settings": { kk: "Баптаулар", ru: "Настройки" },
  "newsForm.coverUrl": { kk: "Мұқаба суреті URL", ru: "URL обложки" },
  "newsForm.isInternal": { kk: "Ішкі жаңалық", ru: "Внутренняя новость" },
  "newsForm.isPinned": { kk: "Бекітілген", ru: "Закреплено" },
  "newsForm.publish": { kk: "Жариялау", ru: "Публикация" },
  "newsForm.saveDraft": { kk: "Жоба ретінде сақтау", ru: "Сохранить как черновик" },
  "newsForm.publishBtn": { kk: "Жариялау", ru: "Опубликовать" },
  "newsForm.required": { kk: "Барлық міндетті өрістерді толтырыңыз", ru: "Заполните все обязательные поля" },
  "newsForm.success": { kk: "Жаңалық сәтті сақталды", ru: "Новость успешно сохранена" },
  "newsForm.error": { kk: "Қате орын алды", ru: "Произошла ошибка" },

  // Users
  "users.title": { kk: "Пайдаланушылар", ru: "Пользователи" },
  "users.count": { kk: "пайдаланушы", ru: "пользователей" },
  "users.name": { kk: "Аты-жөні", ru: "ФИО" },
  "users.role": { kk: "Рөлі", ru: "Роль" },
  "users.department": { kk: "Бөлімше", ru: "Отдел" },
  "users.status": { kk: "Статус", ru: "Статус" },
  "users.lastLogin": { kk: "Кірген уақыт", ru: "Последний вход" },
  "users.active": { kk: "Белсенді", ru: "Активен" },
  "users.inactive": { kk: "Өшірілген", ru: "Неактивен" },
  "users.pending": { kk: "Мақұлдауды күтуде", ru: "Ожидают одобрения" },
  "users.pendingCount": { kk: "өтінім", ru: "заявок" },
  "users.approve": { kk: "Мақұлдау", ru: "Одобрить" },
  "users.reject": { kk: "Қабылдамау", ru: "Отклонить" },
  "users.registeredAt": { kk: "Тіркелу күні", ru: "Дата регистрации" },
  "users.approved": { kk: "Мақұлдалған", ru: "Одобрен" },
  "users.notApproved": { kk: "Мақұлдалмаған", ru: "Не одобрен" },
  "users.employeeId": { kk: "Табельдік нөмір", ru: "Табельный номер" },
  "users.patronymic": { kk: "Әкесінің аты", ru: "Отчество" },

  // FAQ
  "faq.title": { kk: "FAQ", ru: "FAQ" },
  "faq.count": { kk: "сұрақ", ru: "вопросов" },
  "faq.add": { kk: "Сұрақ қосу", ru: "Добавить вопрос" },
  "faq.question": { kk: "Сұрақ", ru: "Вопрос" },
  "faq.status": { kk: "Статус", ru: "Статус" },
  "faq.action": { kk: "Әрекет", ru: "Действие" },
  "faq.empty": { kk: "Сұрақтар жоқ", ru: "Нет вопросов" },

  // FAQ form
  "faqForm.title": { kk: "Жаңа сұрақ", ru: "Новый вопрос" },
  "faqForm.questionKk": { kk: "Сұрақ (ҚАЗ) *", ru: "Вопрос (КАЗ) *" },
  "faqForm.answerKk": { kk: "Жауап (ҚАЗ) *", ru: "Ответ (КАЗ) *" },
  "faqForm.questionRu": { kk: "Вопрос (РУС) *", ru: "Вопрос (РУС) *" },
  "faqForm.answerRu": { kk: "Ответ (РУС) *", ru: "Ответ (РУС) *" },
  "faqForm.required": { kk: "Барлық өрістерді толтырыңыз", ru: "Заполните все поля" },
  "faqForm.success": { kk: "FAQ сәтті сақталды", ru: "FAQ успешно сохранён" },
  "faqForm.error": { kk: "Қате", ru: "Ошибка" },
  "faqForm.saveDraft": { kk: "Жоба ретінде сақтау", ru: "Сохранить как черновик" },
  "faqForm.publish": { kk: "Жариялау", ru: "Опубликовать" },

  // Sports
  "sports.title": { kk: "Спорт іс-шаралар", ru: "Спортивные события" },
  "sports.count": { kk: "іс-шара", ru: "событий" },
  "sports.add": { kk: "Іс-шара қосу", ru: "Добавить событие" },
  "sports.name": { kk: "Атауы", ru: "Название" },
  "sports.type": { kk: "Түрі", ru: "Тип" },
  "sports.status": { kk: "Статус", ru: "Статус" },
  "sports.date": { kk: "Күні", ru: "Дата" },
  "sports.action": { kk: "Әрекет", ru: "Действие" },
  "sports.empty": { kk: "Іс-шаралар жоқ", ru: "Нет событий" },

  // Sanatorium
  "sanatorium.title": { kk: "Санаторий", ru: "Санаторий" },
  "sanatorium.subtitle": { kk: "Санаторлық-курорттық сауықтыру бетін басқару", ru: "Управление страницей санаторно-курортного оздоровления" },
  "sanatorium.desc": { kk: "Мазмұнды, бағдарламаларды және құжаттарды басқарыңыз", ru: "Управляйте содержанием, программами и документами" },

  // Summer Camp
  "camp.title": { kk: "Жазғы лагерь", ru: "Летний лагерь" },
  "camp.subtitle": { kk: "Балалардың жазғы демалысын басқару", ru: "Управление детским летним отдыхом" },
  "camp.desc": { kk: "Ауысымдарды, фотогалереяны және құжаттарды басқарыңыз", ru: "Управляйте сменами, фотогалереей и документами" },

  // Contest
  "contest.title": { kk: "Конкурстар", ru: "Конкурсы" },
  "contest.contestants": { kk: "Қатысушылар", ru: "Участницы" },
  "contest.votes": { kk: "Дауыстар", ru: "Голоса" },
  "contest.empty": { kk: "Конкурстар жоқ", ru: "Нет конкурсов" },

  // Settings
  "settings.title": { kk: "Баптаулар", ru: "Настройки" },
  "settings.subtitle": { kk: "Сайт баптаулары", ru: "Настройки сайта" },
  "settings.desc": { kk: "Логотип, баннер, байланыс ақпараты", ru: "Логотип, баннер, контактная информация" },

  // News extended
  "news.search": { kk: "Жаңалық іздеу...", ru: "Поиск по новостям..." },
  "news.archive": { kk: "Мұрағатқа жіберу", ru: "Архивировать" },
  "news.archived": { kk: "Мұрағатталды", ru: "Архивировано" },
  "news.noResults": { kk: "Іздеу нәтижесі жоқ", ru: "Ничего не найдено" },
  "news.category": { kk: "Санат", ru: "Рубрика" },
  "news.noCategory": { kk: "Санатсыз", ru: "Без рубрики" },
  "news.statsAll": { kk: "Барлығы", ru: "Всего" },
  "news.statsPublished": { kk: "Жарияланған", ru: "Опубликовано" },
  "news.statsDraft": { kk: "Жобалар", ru: "Черновики" },
  "news.statsArchived": { kk: "Мұрағат", ru: "Архив" },

  // News form extended
  "newsForm.editTitle": { kk: "Жаңалықты өңдеу", ru: "Редактирование новости" },
  "newsForm.preview": { kk: "Қарау", ru: "Просмотр" },
  "newsForm.coverPreview": { kk: "Мұқаба суретін алдын ала қарау", ru: "Предпросмотр обложки" },
  "newsForm.internalHint": { kk: "Тек қызметкерлерге көрінеді", ru: "Видна только сотрудникам" },
  "newsForm.pinnedHint": { kk: "Жаңалықтар тізімінде жоғарыда", ru: "Наверху в ленте новостей" },
  "newsForm.saved": { kk: "Сақталды", ru: "Сохранено" },
  "newsForm.confirmArchive": { kk: "Мұрағатқа жіберу?", ru: "Архивировать эту новость?" },
  "newsForm.viewCount": { kk: "Қаралым", ru: "Просмотров" },
  "newsForm.createdAt": { kk: "Жасалды", ru: "Создано" },

  // Role labels
  "roles.super_admin": { kk: "Супер Админ", ru: "Супер Админ" },
  "roles.admin": { kk: "Әкімші", ru: "Администратор" },
  "roles.content_manager": { kk: "Контент менеджер", ru: "Контент-менеджер" },
  "roles.hr_manager": { kk: "HR менеджер", ru: "HR менеджер" },
  "roles.contest_manager": { kk: "Конкурс менеджері", ru: "Менеджер конкурсов" },
  "roles.sports_manager": { kk: "Спорт менеджері", ru: "Менеджер спорта" },
  "roles.moderator": { kk: "Модератор", ru: "Модератор" },
  "roles.news_moderator": { kk: "Жаңалықтар модераторы", ru: "Модератор новостей" },
  "roles.social_admin": { kk: "Әлеуметтік әкімші", ru: "Админ Жылы Жүрекпен" },
  "roles.employee": { kk: "Қызметкер", ru: "Сотрудник" },

  // Leadership
  "leadership.title": { kk: "Басшылық", ru: "Руководство" },
  "leadership.add": { kk: "Басшы қосу", ru: "Добавить руководителя" },
  "leadership.name": { kk: "Аты-жөні", ru: "ФИО" },
  "leadership.position": { kk: "Лауазымы", ru: "Должность" },
  "leadership.level": { kk: "Деңгей", ru: "Уровень" },
  "leadership.photo": { kk: "Фото URL", ru: "Фото URL" },
  "leadership.parent": { kk: "Басшысы", ru: "Руководитель" },
  "leadership.empty": { kk: "Басшылар жоқ", ru: "Нет руководителей" },
  "leadership.save": { kk: "Сақтау", ru: "Сохранить" },
  "leadership.delete": { kk: "Жою", ru: "Удалить" },
  "leadership.edit": { kk: "Өңдеу", ru: "Редактировать" },
  "leadership.level1": { kk: "Директор", ru: "Директор" },
  "leadership.level2": { kk: "Орынбасар", ru: "Заместитель" },
  "leadership.level3": { kk: "Атқарушы директор", ru: "Исполнительный директор" },
  "leadership.success": { kk: "Сәтті сақталды", ru: "Успешно сохранено" },
  "leadership.error": { kk: "Қате орын алды", ru: "Произошла ошибка" },
  "leadership.confirmDelete": { kk: "Жоюды растайсыз ба?", ru: "Подтвердите удаление" },

  // Common
  "common.status": { kk: "Статус", ru: "Статус" },
  "common.tabKk": { kk: "Қазақша", ru: "Казахский" },
  "common.tabRu": { kk: "Русский", ru: "Русский" },
  "common.category": { kk: "Санат", ru: "Категория" },
};

export function adminT(key: string, locale: AdminLocale): string {
  return t[key]?.[locale] || key;
}

export function getAdminLocaleFromCookie(): AdminLocale {
  if (typeof document === "undefined") return "ru";
  const match = document.cookie.match(/(?:^|; )admin_locale=(kk|ru)/);
  return (match?.[1] as AdminLocale) || "ru";
}

export function setAdminLocaleCookie(locale: AdminLocale) {
  document.cookie = `admin_locale=${locale};path=/;max-age=${365 * 24 * 60 * 60}`;
}
