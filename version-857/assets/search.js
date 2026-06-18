import { movies } from './search-data.js';

var input = document.querySelector('[data-search-input]');
var button = document.querySelector('[data-search-button]');
var results = document.querySelector('[data-search-results]');
var summary = document.querySelector('[data-search-summary]');

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function render(items, label) {
  if (!results || !summary) {
    return;
  }

  summary.textContent = label;

  if (!items.length) {
    results.innerHTML = '<div class="empty-result">没有找到匹配剧集</div>';
    return;
  }

  results.innerHTML = items.slice(0, 120).map(function (movie) {
    var tags = movie.tags.slice(0, 3).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');

    return [
      '<a class="movie-card compact" href="' + escapeHtml(movie.url) + '">',
      '  <div class="poster-wrap">',
      '    <img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '">',
      '    <span class="year-badge">' + escapeHtml(movie.year) + '</span>',
      '    <span class="play-badge">播放</span>',
      '  </div>',
      '  <div class="movie-info">',
      '    <h3>' + escapeHtml(movie.title) + '</h3>',
      '    <p>' + escapeHtml(movie.oneLine) + '</p>',
      '    <div class="meta-line"><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.type) + '</span></div>',
      '    <div class="tag-row">' + tags + '</div>',
      '  </div>',
      '</a>'
    ].join('');
  }).join('');
}

function runSearch() {
  var query = input ? input.value.trim().toLowerCase() : '';

  if (!query) {
    render(movies.slice(0, 60), '推荐内容');
    return;
  }

  var matched = movies.filter(function (movie) {
    var text = [
      movie.title,
      movie.year,
      movie.region,
      movie.type,
      movie.genre,
      movie.oneLine,
      movie.category,
      movie.tags.join(' ')
    ].join(' ').toLowerCase();

    return text.indexOf(query) !== -1;
  });

  render(matched, '找到 ' + matched.length + ' 部相关内容');
}

if (input) {
  input.addEventListener('input', runSearch);
  input.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      runSearch();
    }
  });
}

if (button) {
  button.addEventListener('click', runSearch);
}
