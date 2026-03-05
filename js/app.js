// 数据存储键
const STORAGE_KEY = 'reading_notes';
const LANG_KEY = 'reading_notes_lang';
let currentCoverImage = '';
let currentNoteId = null;

// 多语言配置
const i18n = {
    zh: {
        siteTitle: '📚 读书笔记',
        siteSubtitle: '记录阅读的美好时光',
        writeNote: '+ 写笔记',
        emptyTitle: '还没有笔记',
        emptyDesc: '点击"写笔记"按钮，开始记录你的第一本书吧！',
        recommendTitle: '🎯 为你推荐',
        recommendDesc: '根据你的阅读偏好，为你精选以下书籍',
        editorTitle: '写读书笔记',
        bookName: '书名',
        bookNamePlaceholder: '请输入书名...',
        bookAuthor: '作者',
        authorPlaceholder: '请输入作者...',
        noteContent: '笔记内容',
        list: '列表',
        numberedList: '列表',
        insertImage: '插入图片',
        editorPlaceholder: '在这里写下你的读书心得...',
        coverImage: '封面图片',
        uploadCover: '点击上传封面',
        cancel: '取消',
        saveNote: '保存笔记',
        deleteNote: '删除笔记',
        close: '关闭',
        unknownAuthor: '未知作者',
        noteSaved: '笔记保存成功！',
        noteDeleted: '笔记已删除',
        enterBookName: '请输入书名',
        enterNoteContent: '请输入笔记内容',
        confirmDelete: '确定要删除这条笔记吗？此操作不可撤销。',
        author: '作者'
    },
    en: {
        siteTitle: '📚 Reading Notes',
        siteSubtitle: 'Record the wonderful moments of reading',
        writeNote: '+ Write Note',
        emptyTitle: 'No notes yet',
        emptyDesc: 'Click "Write Note" button to start recording your first book!',
        recommendTitle: '🎯 Recommended for You',
        recommendDesc: 'Selected books based on your reading preferences',
        editorTitle: 'Write Reading Note',
        bookName: 'Book Title',
        bookNamePlaceholder: 'Enter book title...',
        bookAuthor: 'Author',
        authorPlaceholder: 'Enter author name...',
        noteContent: 'Note Content',
        list: 'List',
        numberedList: 'List',
        insertImage: 'Insert Image',
        editorPlaceholder: 'Write your reading thoughts here...',
        coverImage: 'Cover Image',
        uploadCover: 'Click to upload cover',
        cancel: 'Cancel',
        saveNote: 'Save Note',
        deleteNote: 'Delete Note',
        close: 'Close',
        unknownAuthor: 'Unknown Author',
        noteSaved: 'Note saved successfully!',
        noteDeleted: 'Note deleted',
        enterBookName: 'Please enter book title',
        enterNoteContent: 'Please enter note content',
        confirmDelete: 'Are you sure you want to delete this note? This action cannot be undone.',
        author: 'Author'
    },
    ja: {
        siteTitle: '📚 読書ノート',
        siteSubtitle: '読書の素晴らしい瞬間を記録する',
        writeNote: '+ ノートを書く',
        emptyTitle: 'まだノートがありません',
        emptyDesc: '"ノートを書く"ボタンをクリックして、最初の本の記録を始めましょう！',
        recommendTitle: '🎯 あなたへのおすすめ',
        recommendDesc: 'あなたの読書好みに基づいて厳選された本',
        editorTitle: '読書ノートを書く',
        bookName: '書名',
        bookNamePlaceholder: '書名を入力してください...',
        bookAuthor: '著者',
        authorPlaceholder: '著者名を入力してください...',
        noteContent: 'ノート内容',
        list: 'リスト',
        numberedList: 'リスト',
        insertImage: '画像を挿入',
        editorPlaceholder: 'ここに読書の感想を書いてください...',
        coverImage: '表紙画像',
        uploadCover: 'クリックして表紙をアップロード',
        cancel: 'キャンセル',
        saveNote: 'ノートを保存',
        deleteNote: 'ノートを削除',
        close: '閉じる',
        unknownAuthor: '不明な著者',
        noteSaved: 'ノートが保存されました！',
        noteDeleted: 'ノートが削除されました',
        enterBookName: '書名を入力してください',
        enterNoteContent: 'ノート内容を入力してください',
        confirmDelete: 'このノートを削除してもよろしいですか？この操作は元に戻せません。',
        author: '著者'
    },
    ko: {
        siteTitle: '📚 독서 노트',
        siteSubtitle: '독서의 아름다운 순간을 기록하다',
        writeNote: '+ 노트 작성',
        emptyTitle: '아직 노트가 없습니다',
        emptyDesc: '"노트 작성" 버튼을 클릭하여 첫 번째 책을 기록하세요!',
        recommendTitle: '🎯 추천 도서',
        recommendDesc: '당신의 독서 취향에 따라 엄선된 도서들',
        editorTitle: '독서 노트 작성',
        bookName: '책 제목',
        bookNamePlaceholder: '책 제목을 입력하세요...',
        bookAuthor: '저자',
        authorPlaceholder: '저자 이름을 입력하세요...',
        noteContent: '노트 내용',
        list: '목록',
        numberedList: '목록',
        insertImage: '이미지 삽입',
        editorPlaceholder: '여기에 독서 소감을 작성하세요...',
        coverImage: '표지 이미지',
        uploadCover: '클릭하여 표지 업로드',
        cancel: '취소',
        saveNote: '노트 저장',
        deleteNote: '노트 삭제',
        close: '닫기',
        unknownAuthor: '알 수 없는 저자',
        noteSaved: '노트가 저장되었습니다!',
        noteDeleted: '노트가 삭제되었습니다',
        enterBookName: '책 제목을 입력하세요',
        enterNoteContent: '노트 내용을 입력하세요',
        confirmDelete: '이 노트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
        author: '저자'
    }
};

// 当前语言
let currentLang = localStorage.getItem(LANG_KEY) || 'zh';

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    applyLanguage();
    loadNotes();
    generateRecommendations();
});

// 切换语言
function toggleLanguage() {
    const langs = ['zh', 'en', 'ja', 'ko'];
    const currentIndex = langs.indexOf(currentLang);
    currentLang = langs[(currentIndex + 1) % langs.length];
    
    localStorage.setItem(LANG_KEY, currentLang);
    applyLanguage();
}

// 应用语言
function applyLanguage() {
    const langData = i18n[currentLang];
    const langLabels = {
        'zh': '🇨🇳 中文',
        'en': '🇺🇸 English',
        'ja': '🇯🇵 日本語',
        'ko': '🇰🇷 한국어'
    };
    
    // 更新语言按钮
    const langBtn = document.getElementById('current-lang');
    if (langBtn) {
        langBtn.textContent = langLabels[currentLang];
    }
    
    // 更新所有带有 data-i18n 属性的元素
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (langData[key]) {
            el.textContent = langData[key];
        }
    });
    
    // 更新所有带有 data-i18n-placeholder 属性的输入框
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (langData[key]) {
            el.placeholder = langData[key];
        }
    });
    
    // 更新页面标题
    document.title = langData.siteTitle;
}

// 获取当前语言的翻译文本
function t(key) {
    return i18n[currentLang][key] || i18n['zh'][key] || key;
}

// 书籍推荐数据库
const BOOK_RECOMMENDATIONS = [
    {
        id: 'rec1',
        title: '活着',
        author: '余华',
        category: '文学',
        tags: ['人生', '苦难', '坚韧', '生命', '感动'],
        description: '一个人一生的故事，讲述人如何去承受巨大的苦难。',
        cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&q=80'
    },
    {
        id: 'rec2',
        title: '百年孤独',
        author: '加西亚·马尔克斯',
        category: '文学',
        tags: ['魔幻现实主义', '家族', '孤独', '命运', '经典'],
        description: '布恩迪亚家族七代人的传奇故事，魔幻现实主义文学代表作。',
        cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&q=80'
    },
    {
        id: 'rec3',
        title: '三体',
        author: '刘慈欣',
        category: '科幻',
        tags: ['科幻', '宇宙', '文明', '未来', '探索'],
        description: '中国科幻巅峰之作，讲述人类文明与三体文明的博弈。',
        cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&q=80'
    }
];

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
        const keywords = ['人生', '成长', '爱情', '哲学', '历史', '科幻', '文学', '艺术'];
        
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
        container.innerHTML = '<p class="no-recommendations">暂无推荐</p>';
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
