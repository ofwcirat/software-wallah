const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const levelFilter = document.getElementById('levelFilter');
const clearSearch = document.getElementById('clearSearch');
const courseGrid = document.getElementById('courseGrid');
const courseCards = [...document.querySelectorAll('.course-card')];
const emptyState = document.getElementById('emptyState');
const courseCount = document.getElementById('courseCount');
const dialog = document.getElementById('courseDialog');
const toast = document.getElementById('toast');
let toastTimer;

document.getElementById('year').textContent = new Date().getFullYear();

function setTheme(dark) {
  body.classList.toggle('dark', dark);
  themeToggle.textContent = dark ? '☀' : '☾';
  themeToggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  try { localStorage.setItem('softwareWallahTheme', dark ? 'dark' : 'light'); } catch (error) {}
}
try { setTheme(localStorage.getItem('softwareWallahTheme') === 'dark'); } catch (error) { setTheme(false); }
themeToggle.addEventListener('click', () => setTheme(!body.classList.contains('dark')));

menuToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.textContent = open ? '×' : '☰';
});
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.textContent = '☰';
}));

function filterCourses() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const level = levelFilter.value;
  let visible = 0;
  courseCards.forEach(card => {
    const text = `${card.dataset.title} ${card.dataset.description} ${card.dataset.category} ${card.dataset.level}`.toLowerCase();
    const matches = text.includes(query) &&
      (category === 'all' || card.dataset.category === category) &&
      (level === 'all' || card.dataset.level === level);
    card.hidden = !matches;
    if (matches) visible++;
  });
  courseCount.textContent = `${visible} ${visible === 1 ? 'course' : 'courses'}`;
  emptyState.hidden = visible !== 0;
  courseGrid.hidden = visible === 0;
  clearSearch.style.display = query ? 'block' : 'none';
}
searchInput.addEventListener('input', filterCourses);
categoryFilter.addEventListener('change', filterCourses);
levelFilter.addEventListener('change', filterCourses);
clearSearch.addEventListener('click', () => { searchInput.value = ''; searchInput.focus(); filterCourses(); });
document.getElementById('resetFilters').addEventListener('click', () => {
  searchInput.value = ''; categoryFilter.value = 'all'; levelFilter.value = 'all'; filterCourses();
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

courseGrid.addEventListener('click', event => {
  const button = event.target.closest('[data-open-course]');
  if (!button) return;
  const card = button.closest('.course-card');
  document.getElementById('dialogIcon').textContent = card.dataset.icon;
  document.getElementById('dialogTitle').textContent = card.dataset.title;
  document.getElementById('dialogDescription').textContent = card.dataset.description;
  document.getElementById('dialogDuration').textContent = `◷ ${card.dataset.duration}`;
  document.getElementById('dialogLessons').textContent = `▤ ${card.dataset.lessons}`;
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else showToast(`${card.dataset.title}: ${card.dataset.description}`);
});
document.getElementById('dialogClose').addEventListener('click', () => dialog.close());
document.getElementById('dialogDone').addEventListener('click', () => {
  const title = document.getElementById('dialogTitle').textContent;
  dialog.close();
  showToast(`Great choice! ${title} is ready for you to explore.`);
});
dialog.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
});

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('visible'));
}
filterCourses();
