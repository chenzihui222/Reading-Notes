
// 生成推荐
function generateRecommendations() {
    const notes = getNotes();
    const recommendationSection = document.getElementById('recommendation-section');
    
    if (!recommendationSection) return;
    
    if (notes.length === 0) {
        recommendationSection.style.display = 'none';
        return;
    }
    
    recommendationSection.style.display = 'block';
    
    const userPreferences = analyzeUserPreferences(notes);
    const recommendations = getBookRecommendations(userPreferences, notes);
    renderRecommendations(recommendations);
}

// 分析用户阅读偏好
function analyzeUserPreferences(notes) {
    const preferences = { authors: {}, tags: {}, categories: {} };
    
    notes.forEach(note => {
        if (note.author && note.author !== t('unknownAuthor')) {
            preferences.authors[note.author] = (preferences.authors[note.author] || 0) + 1;
        }
        
        const content = stripHtml(note.content).toLowerCase();
        const keywords = ['人生', '成长', '爱情', '哲学', '历史', '科幻', '文学', '艺术',
            '孤独', '梦想', '自由', '思考', '现实', '未来', '自然', '治愈',
            '勇气', '坚持', '智慧', '真理', '探索', '生命', '命运', '社会'];
        
        keywords.forEach(keyword => {
            if (content.includes(keyword)) {
                preferences.tags[keyword] = (preferences.tags[keyword] || 0) + 1;
            }
        });
    });
    
    return preferences;
}

// 获取推荐书籍
function getBookRecommendations(preferences, userNotes) {
    const userBookTitles = userNotes.map(n => n.title.toLowerCase());
    
    const scoredBooks = BOOK_RECOMMENDATIONS.map(book => {
        let score = 0;
        
        if (preferences.authors[book.author]) {
            score += preferences.authors[book.author] * 3;
        }
        
        book.tags.forEach(tag => {
            if (preferences.tags[tag]) {
                score += preferences.tags[tag] * 2;
            }
        });
        
        score += Math.random() * 2;
        
        return { ...book, score };
    });
    
    return scoredBooks
        .filter(book => !userBookTitles.includes(book.title.toLowerCase()))
        .sort((a, b) => b.score - a.score)
        .slice(0, 4);
}

// 渲染推荐
function renderRecommendations(recommendations) {
    const container = document.getElementById('recommendation-list');
    
    if (!container) return;
    
    if (recommendations.length === 0) {
        container.innerHTML = '<p class="no-recommendations">暂无推荐，多写几篇笔记后就能获得个性化推荐啦！</p>';
        return;
    }
    
    container.innerHTML = recommendations.map(book => `
        <div class="recommendation-card">
            <div class="rec-cover" style="background-image: url('${book.cover}')">
                <span class="rec-category">${book.category}</span>
            </div>
            <div class="rec-content">
                <h4 class="rec-title">${escapeHtml(book.title)}</h4>
                <p class="rec-author">${escapeHtml(book.author)}</p>
                <p class="rec-description">${escapeHtml(book.description)}</p>
                <div class="rec-tags">
                    ${book.tags.slice(0, 3).map(tag => `<span class="rec-tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

// 加载笔记列表
function loadNotes() {
    const notes = getNotes();
    const notesList = document.getElementById('notes-list');
    const emptyState = document.getElementById('empty-state');
    
    if (notes.length === 0) {
        notesList.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    notesList.innerHTML = notes.map(note => createNoteCard(note)).join('');
}

// 获取所有笔记
function getNotes() {
    const notes = localStorage.getItem(STORAGE_KEY);
    return notes ? JSON.parse(notes) : [];
}

// 创建笔记卡片 HTML
function createNoteCard(note) {
    const excerpt = stripHtml(note.content).substring(0, 100) + '...';
    const coverStyle = note.cover ? `background-image: url('${note.cover}')` : '';
    const date = new Date(note.createdAt).toLocaleString('zh-CN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
    });
    
    return `
        <div class="note-card" onclick="showDetail('${note.id}')">
            <div class="note-cover" style="${coverStyle}"></div>
            <div class="note-content">
                <h3 class="note-title">${escapeHtml(note.title)}</h3>
                <p class="note-author">${t('author')}: ${escapeHtml(note.author)}</p>
                <p class="note-excerpt">${escapeHtml(excerpt)}</p>
                <p class="note-date">${date}</p>
            </div>
        </div>
    `;
}

// 显示编辑器
function showEditor() {
    currentNoteId = null;
    currentCoverImage = '';
    document.getElementById('book-title').value = '';
    document.getElementById('book-author').value = '';
    document.getElementById('editor').innerHTML = '';
    document.getElementById('cover-preview').style.backgroundImage = '';
    document.getElementById('cover-preview').classList.remove('has-image');
    document.getElementById('editor-modal').style.display = 'flex';
}

// 关闭编辑器
function closeEditor() {
    document.getElementById('editor-modal').style.display = 'none';
    currentCoverImage = '';
    currentNoteId = null;
}

// 保存笔记
function saveNote() {
    const title = document.getElementById('book-title').value.trim();
    const author = document.getElementById('book-author').value.trim();
    const content = document.getElementById('editor').innerHTML;
    
    if (!title) {
        alert(t('enterBookName'));
        return;
    }
    
    if (!content.trim()) {
        alert(t('enterNoteContent'));
        return;
    }
    
    const note = {
        id: currentNoteId || Date.now().toString(),
        title: title,
        author: author || t('unknownAuthor'),
        content: content,
        cover: currentCoverImage,
        createdAt: currentNoteId ? getNoteById(currentNoteId).createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    const notes = getNotes();
    
    if (currentNoteId) {
        const index = notes.findIndex(n => n.id === currentNoteId);
        if (index !== -1) notes[index] = note;
    } else {
        notes.unshift(note);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    loadNotes();
    generateRecommendations();
    closeEditor();
    alert(t('noteSaved'));
}

// 显示笔记详情
function showDetail(id) {
    const note = getNoteById(id);
    if (!note) return;
    
    currentNoteId = id;
    
    document.getElementById('detail-title').textContent = note.title;
    document.getElementById('detail-author').textContent = note.author;
    document.getElementById('detail-date').textContent = new Date(note.createdAt).toLocaleString('zh-CN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
    });
    document.getElementById('detail-content').innerHTML = note.content;
    
    const coverContainer = document.getElementById('detail-cover');
    if (note.cover) {
        coverContainer.innerHTML = `<img src="${note.cover}" alt="${note.title}">`;
    } else {
        coverContainer.innerHTML = '';
    }
    
    document.getElementById('detail-modal').style.display = 'flex';
}

// 关闭详情页
function closeDetail() {
    document.getElementById('detail-modal').style.display = 'none';
    currentNoteId = null;
}

// 删除当前笔记
function deleteCurrentNote() {
    if (!currentNoteId) return;
    
    if (!confirm(t('confirmDelete'))) return;
    
    const notes = getNotes().filter(n => n.id !== currentNoteId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    loadNotes();
    generateRecommendations();
    closeDetail();
    alert(t('noteDeleted'));
}

// 根据 ID 获取笔记
function getNoteById(id) {
    return getNotes().find(n => n.id === id);
}

// 格式化文本
function formatText(command) {
    document.execCommand(command, false, null);
    document.getElementById('editor').focus();
}

// 处理封面上传
function handleCoverUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        alert('请上传图片文件');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        alert('图片大小不能超过 5MB');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        currentCoverImage = e.target.result;
        const preview = document.getElementById('cover-preview');
        preview.style.backgroundImage = `url('${currentCoverImage}')`;
        preview.classList.add('has-image');
    };
    reader.readAsDataURL(file);
}

// 处理内容图片上传
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        alert('请上传图片文件');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        alert('图片大小不能超过 5MB');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.style.maxWidth = '100%';
        
        const editor = document.getElementById('editor');
        editor.focus();
        
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.insertNode(img);
            range.collapse(false);
        } else {
            editor.appendChild(img);
        }
        
        const br = document.createElement('br');
        editor.appendChild(br);
    };
    reader.readAsDataURL(file);
    event.target.value = '';
}

// 工具函数：去除 HTML 标签
function stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

// 工具函数：转义 HTML 特殊字符
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 点击弹窗外部关闭
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        if (event.target.id === 'editor-modal') {
            closeEditor();
        } else if (event.target.id === 'detail-modal') {
            closeDetail();
        }
    }
};

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeEditor();
        closeDetail();
    }
});