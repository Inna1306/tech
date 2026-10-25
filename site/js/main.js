/* Мобильное меню + фильтры учебных материалов */
document.addEventListener('DOMContentLoaded', function () {
  // --- бургер-меню ---
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', links.classList.contains('open'));
    });
  }

  // --- подсветка активного пункта меню по URL ---
  var path = location.pathname.replace(/\/index\.html$/, '/') || '/';
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href && (path.indexOf(href.replace('./', '').replace('../', '')) !== -1)) {
      a.classList.add('active');
    }
  });

  // --- фильтры на странице «Учебные материалы» ---
  var grid = document.getElementById('materials-grid');
  if (grid) {
    var buttons = document.querySelectorAll('.filter-btn[data-filter]');
    var search = document.getElementById('mat-search');
    var currentType = 'all';

    function applyFilters() {
      var q = (search && search.value || '').toLowerCase().trim();
      var visible = 0;
      grid.querySelectorAll('.mat-card').forEach(function (card) {
        var type = card.getAttribute('data-type') || '';
        var disc = card.getAttribute('data-disc') || '';
        var text = card.textContent.toLowerCase();
        var okType = (currentType === 'all' || currentType === 'pm' || currentType === 'op')
          ? true : type === currentType || disc === currentType;
        if (currentType === 'pm') okType = disc.indexOf('ПМ') === 0;
        if (currentType === 'op') okType = disc.indexOf('ОП') === 0;
        if (currentType === 'all') okType = true;
        var okText = !q || text.indexOf(q) !== -1;
        var show = okType && okText;
        card.style.display = show ? '' : 'none';
        if (show) visible++;
      });
      var empty = document.getElementById('materials-empty');
      if (empty) empty.style.display = visible ? 'none' : 'block';
    }

    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        buttons.forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        currentType = b.getAttribute('data-filter');
        applyFilters();
      });
    });
    if (search) search.addEventListener('input', applyFilters);
  }

  // --- форма обратной связи: mailto-сборка + уведомление ---
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var subject = encodeURIComponent('Обращение с сайта: ' + (d.get('topic') || ''));
      var body = encodeURIComponent(
        'Имя: ' + d.get('name') + '\nEmail: ' + d.get('email') +
        '\nТип обращения: ' + d.get('topic') + '\n\nСообщение:\n' + d.get('message')
      );
      window.location.href = 'mailto:inna742@ya.ru?subject=' + subject + '&body=' + body;
      var ok = document.getElementById('form-ok');
      if (ok) ok.style.display = 'block';
      form.reset();
    });
  }
});

/* Переключатель цветовой темы: green (по умолчанию) / violet */
(function () {
  var saved = 'green';
  try { saved = localStorage.getItem('theme') || 'green'; } catch (e) {}
  document.documentElement.setAttribute('data-theme', saved);

  document.addEventListener('DOMContentLoaded', function () {
    var wrap = document.querySelector('.theme-switch');
    if (!wrap) return;
    function paint() {
      var t = document.documentElement.getAttribute('data-theme') || 'green';
      wrap.querySelectorAll('button').forEach(function (b) {
        var on = b.getAttribute('data-set') === t;
        b.classList.toggle('active-green', on && b.getAttribute('data-set') === 'green');
        b.classList.toggle('active-violet', on && b.getAttribute('data-set') === 'violet');
      });
    }
    wrap.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () {
        var t = b.getAttribute('data-set');
        document.documentElement.setAttribute('data-theme', t);
        try { localStorage.setItem('theme', t); } catch (e) {}
        paint();
      });
    });
    paint();
  });
})();

/* Если фото в слоте загрузилось — скрываем текст-подсказку */
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.photo-slot img, .hero-photo img').forEach(function (img) {
    var box = img.closest('.photo-slot, .hero-photo');
    if (!box) return;
    if (img.complete && img.naturalWidth > 0) box.classList.add('has-photo');
    else img.addEventListener('load', function () { box.classList.add('has-photo'); });
  });
});
