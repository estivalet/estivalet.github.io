// course-detail.js — renders any course from its JSON file
// URL format: pages/courses/course.html?id=python-do-zero-a-automacao

(async function () {
  // ── Helpers ──────────────────────────────────────────────────────────────
  const BASE = (() => {
    const path = window.location.pathname;
    if (path.includes('/pages/courses/')) return '../../';
    if (path.includes('/pages/')) return '../';
    return '';
  })();

  function stars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    let html = '';
    for (let i = 0; i < 5; i++) {
      if (i < full) html += '<i class="fas fa-star"></i>';
      else if (i === full && half) html += '<i class="fas fa-star-half-alt"></i>';
      else html += '<i class="far fa-star"></i>';
    }
    return html;
  }

  // ── Load JSON ─────────────────────────────────────────────────────────────
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) { document.body.innerHTML = '<p style="color:red;padding:6rem 2rem">Course not found.</p>'; return; }

  let course;
  try {
    const res = await fetch(BASE + 'data/course-details/' + id + '.json');
    if (!res.ok) throw new Error('not found');
    course = await res.json();
  } catch {
    document.body.innerHTML = '<p style="color:red;padding:6rem 2rem">Could not load course data.</p>';
    return;
  }

  // ── Update <title> ────────────────────────────────────────────────────────
  document.title = course.title + ' | Estivalet';

  // ── Render hero ──────────────────────────────────────────────────────────
  document.getElementById('cd-hero-title').textContent = course.title;
  document.getElementById('cd-hero-subtitle').textContent = course.subtitle;
  // hero video
  const videoEl = document.getElementById('cd-hero-video');
  if (videoEl && course.videoUrl) videoEl.src = course.videoUrl;

  // fallback img (hidden but keep reference safe)
  const imgEl = document.getElementById('cd-hero-img');
  if (imgEl) { imgEl.src = BASE + course.image; imgEl.alt = course.title; }
  document.getElementById('cd-rating-val').textContent = course.rating;
  document.getElementById('cd-stars').innerHTML = stars(course.rating);
  document.getElementById('cd-rating-count').textContent = '(' + course.ratingCount + ' avaliações)';
  document.getElementById('cd-students').textContent = course.students + ' alunos';
  document.getElementById('cd-updated').textContent = 'Atualizado em ' + course.lastUpdated;
  document.getElementById('cd-language').textContent = course.language;
  document.getElementById('cd-level').textContent = course.level;
  document.getElementById('cd-udemy-btn').href = course.udemyUrl;

  // tech tags
  const tagsEl = document.getElementById('cd-tech-tags');
  tagsEl.innerHTML = course.technologies.map(t => `<span class="tech-tag">${t}</span>`).join('');

  // ── What you'll learn ─────────────────────────────────────────────────────
  document.getElementById('cd-learn-list').innerHTML =
    course.whatYouLearn.map(i => `<li><i class="fas fa-check"></i>${i}</li>`).join('');

  // ── Requirements ─────────────────────────────────────────────────────────
  document.getElementById('cd-req-list').innerHTML =
    course.requirements.map(r => `<li><i class="fas fa-circle" style="font-size:.4rem;vertical-align:middle"></i>${r}</li>`).join('');

  // ── Description ──────────────────────────────────────────────────────────
  document.getElementById('cd-description').innerHTML =
    course.description.split('\n').filter(Boolean).map(p => `<p>${p}</p>`).join('');

  // ── Course includes ───────────────────────────────────────────────────────
  document.getElementById('cd-includes').innerHTML =
    course.includes.map(i => `<li><i class="${i.icon}"></i>${i.text}</li>`).join('');

  // ── Curriculum ───────────────────────────────────────────────────────────
  const currEl = document.getElementById('cd-curriculum');
  let totalLectures = 0;
  currEl.innerHTML = course.sections.map((sec) => {
    totalLectures += sec.lectures;
    const lessonsHtml = sec.lessons.map(l => {
      const dur = l.duration ? `<span class="cd-lesson-dur">${l.duration}</span>` : '';
      const title = typeof l === 'string' ? l : l.title;
      return `<div class="cd-lesson"><i class="fas fa-play-circle"></i><span>${title}</span>${dur}</div>`;
    }).join('');
    return `
      <div class="cd-section">
        <button class="cd-section-header" onclick="this.parentElement.classList.toggle('open')">
          <span><i class="fas fa-chevron-right cd-chevron"></i>${sec.title}</span>
          <span class="cd-sec-meta">${sec.lectures} aulas · ${sec.duration}</span>
        </button>
        <div class="cd-section-body">${lessonsHtml}</div>
      </div>`;
  }).join('');
  document.getElementById('cd-curriculum-meta').textContent =
    `${course.sections.length} seções · ${totalLectures} aulas · ${course.totalDuration || ''} no total`;

  // ── Instructor ────────────────────────────────────────────────────────────
  document.getElementById('cd-inst-name').textContent = course.instructor.name;
  document.getElementById('cd-inst-title').textContent = course.instructor.title;
  document.getElementById('cd-inst-bio').textContent = course.instructor.bio;
  document.getElementById('cd-inst-avatar').src = BASE + course.instructor.avatar;
  document.getElementById('cd-inst-rating').textContent = course.instructor.rating;
  document.getElementById('cd-inst-students').textContent = course.instructor.students;
  document.getElementById('cd-inst-courses').textContent = course.instructor.courses;

  // ── Reviews ───────────────────────────────────────────────────────────────
  document.getElementById('cd-overall-rating').textContent = course.rating;
  document.getElementById('cd-overall-stars').innerHTML = stars(course.rating);
  document.getElementById('cd-reviews').innerHTML = course.reviews.map(r => `
    <div class="cd-review-card">
      <div class="cd-review-header">
        <div class="cd-reviewer-avatar">${r.name.charAt(0)}</div>
        <div>
          <div class="cd-reviewer-name">${r.name}</div>
          <div class="cd-reviewer-meta">
            <span style="color:var(--accent-secondary)">${stars(r.rating)}</span>
            <span style="color:var(--text-muted);font-size:.85rem;margin-left:.5rem">${r.date}</span>
          </div>
        </div>
      </div>
      <p class="cd-review-text">${r.text}</p>
    </div>`).join('');
})();
