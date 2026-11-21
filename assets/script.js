/**
 * ============================================
 * HEARTWARMING - SISTEMA DE ATENDIMENTO MULTICANAL
 * ============================================
 * Arquivo principal de JavaScript.
 * Estrutura:
 *   1. Utilitários e Helpers (classe Utils)
 *   2. Gerenciador de Notas (CRUD + localStorage)
 *   3. Sistema de Scripts (popups de estrofes)
 *   4. Seleção de Personagens (tabs de detalhes)
 *   5. Popup "Ler Mais" (textos por categoria)
 *   6. App Principal (inicialização)
 *   7. Funções Globais (compatibilidade com HTML)
 * ============================================ */

// ============================================
// 1. UTILITÁRIOS E HELPERS
// ============================================

const CONFIG = {
    notificationDuration: 2000,
    fadeOutDuration: 300
};

/**
 * Classe utilitária com helpers reutilizáveis
 */
class Utils {
    static getElement(selector) {
        return document.querySelector(selector);
    }

    static getAllElements(selector) {
        return document.querySelectorAll(selector);
    }

    static createElement(tag, className = '', attributes = {}) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
        return element;
    }

    /**
     * Exibe notificação toast no centro inferior da tela
     */
    static showNotification(message) {
        const notification = Utils.getElement('#notification');
        if (!notification) return;
        notification.textContent = message;
        notification.style.display = 'block';
        notification.style.opacity = '1';
        notification.style.padding = '10px';
        notification.style.marginBottom = '10px';
        notification.style.backgroundColor = '#4caf50';
        notification.style.color = 'white';
        notification.style.borderRadius = '5px';

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.style.display = 'none';
            }, CONFIG.fadeOutDuration);
        }, CONFIG.notificationDuration);
    }

    /**
     * Copia texto para a área de transferência
     */
    static copyToClipboard(text) {
        return navigator.clipboard.writeText(text).catch(() => {
            const tempTextarea = document.createElement('textarea');
            tempTextarea.value = text;
            document.body.appendChild(tempTextarea);
            tempTextarea.select();
            document.execCommand('copy');
            document.body.removeChild(tempTextarea);
        });
    }

    static normalizeText(text) {
        return String(text || '')
            .replace(/\r\n?/g, '\n')
            .replace(/\u0000/g, '');
    }

    static storageSet(key, value) {
        try {
            localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Não foi possível salvar no armazenamento local:', error);
            Utils.showNotification('Erro ao salvar. Armazenamento indisponível.');
            return false;
        }
    }
}


// ============================================
// 2. GERENCIADOR DE NOTAS
// ============================================
// CRUD completo com persistência em localStorage.
// Features: criar, editar, excluir, fixar, cores, busca.
// ============================================

const STORAGE_KEY = 'notes_app_storage_v1';

const AVAILABLE_COLORS = [
    { name: 'Branco', bg: '#ffffff', border: '#e0e0e0' },
    { name: 'Vermelho', bg: '#f28482', border: '#e07c79' },
    { name: 'Laranja', bg: '#fbbc04', border: '#f5a623' },
    { name: 'Amarelo', bg: '#fff475', border: '#fde293' },
    { name: 'Verde', bg: '#ccff90', border: '#c6e9a8' },
    { name: 'Ciano', bg: '#a7ffeb', border: '#81e4d8' },
    { name: 'Azul', bg: '#cbf0f8', border: '#a8e6f1' },
    { name: 'Roxo', bg: '#d7aefb', border: '#c6a0f5' },
    { name: 'Rosa', bg: '#fdcfe8', border: '#f7bbd9' },
    { name: 'Cinza', bg: '#e8eaed', border: '#dadce0' },
];

let notesList = [];
let currentNoteId = null;
let searchText = '';
let noteSaveTimer = null;

// ---- Inicialização ----
window.addEventListener('load', () => {
    loadNotesFromStorage();
    setupEventListeners();
    renderApp();
});

function setupEventListeners() {
    // Busca em tempo real
    const searchField = document.getElementById('searchField');
    if (searchField) searchField.addEventListener('input', (e) => {
        searchText = e.target.value;
        renderApp();
    });

    // Edição de título (autosave)
    const editorTitle = document.getElementById('editorTitle');
    if (editorTitle) editorTitle.addEventListener('input', (e) => {
        if (currentNoteId) {
            const note = notesList.find(n => n.id === currentNoteId);
            if (note) {
                note.title = Utils.normalizeText(e.target.value);
                note.updatedAt = new Date();
                scheduleNoteSave(note);
            }
        }
    });

    // Edição de conteúdo (autosave)
    const editorContent = document.getElementById('editorContent');
    if (editorContent) editorContent.addEventListener('input', (e) => {
        if (currentNoteId) {
            const note = notesList.find(n => n.id === currentNoteId);
            if (note) {
                note.content = Utils.normalizeText(e.target.value);
                note.updatedAt = new Date();
                resizeNoteEditor(editorContent);
                scheduleNoteSave(note);
            }
        }
    });
    if (editorContent) {
        editorContent.style.whiteSpace = 'pre-wrap';
        editorContent.style.overflowWrap = 'anywhere';
        editorContent.addEventListener('paste', (e) => {
            e.preventEventDefault?.();
            e.preventDefault();
            const pastedText = e.clipboardData?.getData('text/plain') || '';
            const start = editorContent.selectionStart;
            const end = editorContent.selectionEnd;
            editorContent.setRangeText(Utils.normalizeText(pastedText), start, end, 'end');
            editorContent.dispatchEvent(new Event('input', { bubbles: true }));
        });
        editorContent.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                saveNotesToStorage();
                if (currentNoteId) {
                    const note = notesList.find(n => n.id === currentNoteId);
                    if (note) updateNoteCardInGrid(note);
                }
                Utils.showNotification('Nota salva!');
            }
        });
    }

    // Fechar paleta de cores ao clicar fora
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.color-palette-menu') && !e.target.closest('[onclick*="toggleColorMenu"]')) {
            const colorMenu = document.getElementById('colorMenu');
            if (colorMenu) colorMenu.classList.remove('is-open');
        }
    });
}

// ---- Persistência ----
function saveNotesToStorage() {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(
                notesList.map(note => ({
                    id: note.id,
                    title: note.title,
                    content: note.content,
                    color: note.color,
                    isPinned: note.isPinned,
                    createdAt: note.createdAt instanceof Date ? note.createdAt.toISOString() : note.createdAt,
                    updatedAt: note.updatedAt instanceof Date ? note.updatedAt.toISOString() : note.updatedAt,
                }))
            )
        );
    } catch (error) {
        console.error('Erro ao salvar notas:', error);
    }

    function scheduleNoteSave(note) {
        if (noteSaveTimer) clearTimeout(noteSaveTimer);
        noteSaveTimer = setTimeout(() => {
            saveNotesToStorage();
            updateNoteCardInGrid(note);
            updateNoteTimestamp(note);
        }, 450);
    }

    function updateNoteTimestamp(note) {
        const timestamp = document.getElementById('editorTimestamp');
        if (!timestamp) return;
        timestamp.textContent = `Atualizado ${note.updatedAt.toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}`;
    }

    function resizeNoteEditor(editor) {
        if (!editor) return;
        editor.style.height = 'auto';
        editor.style.height = `${Math.max(180, editor.scrollHeight)}px`;
    }
}

function loadNotesFromStorage() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        notesList = data
            ? JSON.parse(data).map(note => ({
                id: note.id,
                title: note.title ?? '',
                content: Utils.normalizeText(note.content ?? ''),
                color: note.color ?? AVAILABLE_COLORS[0],
                isPinned: note.isPinned ?? false,
                createdAt: new Date(note.createdAt),
                updatedAt: new Date(note.updatedAt),
            }))
            : [];
    } catch (error) {
        console.error('Erro ao carregar notas:', error);
        notesList = [];
    }
}

// ---- CRUD ----
function createNote() {
    const newNote = {
        id: Date.now(),
        title: '',
        content: '',
        color: AVAILABLE_COLORS[0],
        isPinned: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    notesList.unshift(newNote);
    currentNoteId = newNote.id;
    saveNotesToStorage();
    renderApp();
    document.getElementById('editorTitle').focus();
}

function saveCurrentNote() {
    if (currentNoteId) {
        saveNotesToStorage();
        renderApp();
    }
}

function deleteNote(id) {
    notesList = notesList.filter(n => n.id !== id);
    if (currentNoteId === id) currentNoteId = null;
    saveNotesToStorage();
    renderApp();
}

function deleteCurrentNote() {
    if (currentNoteId) {
        deleteNote(currentNoteId);
    }
}

function togglePin() {
    const note = notesList.find(n => n.id === currentNoteId);
    if (note) {
        note.isPinned = !note.isPinned;
        note.updatedAt = new Date();
        saveNotesToStorage();
        renderApp();
    }
}

function toggleNotePin(id) {
    const note = notesList.find(n => n.id === id);
    if (note) {
        note.isPinned = !note.isPinned;
        note.updatedAt = new Date();
        saveNotesToStorage();
        renderApp();
    }
}

function toggleColorMenu() {
    document.getElementById('colorMenu').classList.toggle('is-open');
}

function changeNoteColor(color) {
    const note = notesList.find(n => n.id === currentNoteId);
    if (note) {
        note.color = color;
        note.updatedAt = new Date();
        saveNotesToStorage();
        renderApp();
        document.getElementById('colorMenu').classList.remove('is-open');
    }
}

function selectNote(id) {
    currentNoteId = id;
    renderApp();
}

// ---- Renderização ----
function updateNoteCardInGrid(note) {
    const noteElement = document.querySelector(`[onclick="selectNote(${note.id})"]`);
    if (noteElement) {
        const headerEl = noteElement.querySelector('.note-header');
        const bodyEl = noteElement.querySelector('.note-body');

        if (headerEl) {
            if (note.title) {
                headerEl.textContent = note.title;
                headerEl.style.display = 'block';
            } else {
                headerEl.style.display = 'none';
            }
        }

        if (bodyEl) {
            bodyEl.textContent = note.content ? note.content : 'Vazia';
        }
    }
}

function filterNotes() {
    return notesList.filter(note =>
        note.title.toLowerCase().includes(searchText.toLowerCase()) ||
        note.content.toLowerCase().includes(searchText.toLowerCase())
    );
}

function renderColorMenu() {
    const menu = document.getElementById('colorMenu');
    const note = notesList.find(n => n.id === currentNoteId);
    menu.innerHTML = AVAILABLE_COLORS.map(color => `
        <div class="color-item ${note && note.color.bg === color.bg ? 'is-selected' : ''}"
             style="background-color: ${color.bg}; border-color: ${color.border};"
             onclick="changeNoteColor(${JSON.stringify(color).replace(/"/g, '&quot;')})"
             title="${color.name}"></div>
    `).join('');
}

function renderNoteCard(note) {
    return `
        <div class="note-item ${currentNoteId === note.id ? 'is-active' : ''} ${note.isPinned ? 'is-pinned' : ''}"
             style="background-color: ${note.color.bg}; border-color: ${note.color.border};"
             onclick="selectNote(${note.id})">
            <i class="fas fa-thumbtack note-pin-badge"></i>
            ${note.title ? `<div class="note-header">${escapeHtml(note.title)}</div>` : ''}
            <div class="note-body">${note.content ? escapeHtml(note.content) : 'Vazia'}</div>
            <div class="note-footer">
                <button class="note-action-btn" onclick="event.stopPropagation(); toggleNotePin(${note.id})" title="Afixar">
                    <i class="fas fa-thumbtack"></i>
                </button>
                <button class="note-action-btn is-delete" onclick="event.stopPropagation(); deleteNote(${note.id})" title="Deletar">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
}

function renderEditor() {
    const note = notesList.find(n => n.id === currentNoteId);
    const editor = document.getElementById('editorSidebar');

    if (!note) {
        editor.classList.add('is-hidden');
        return;
    }

    editor.classList.remove('is-hidden');
    editor.style.backgroundColor = note.color.bg;
    const editorTitle = document.getElementById('editorTitle');
    const editorContent = document.getElementById('editorContent');
    if (editorTitle) editorTitle.value = Utils.normalizeText(note.title);
    if (editorContent) {
        editorContent.value = Utils.normalizeText(note.content);
        resizeNoteEditor(editorContent);
    }

    const timestamp = note.updatedAt.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById('editorTimestamp').textContent = `Atualizado ${timestamp}`;
}

function renderApp() {
    const filtered = filterNotes();
    const pinned = filtered.filter(n => n.isPinned).sort((a, b) => b.updatedAt - a.updatedAt);
    const unpinned = filtered.filter(n => !n.isPinned).sort((a, b) => b.updatedAt - a.updatedAt);

    const pinnedContainer = document.getElementById('pinnedNotesContainer');
    if (pinned.length > 0) {
        pinnedContainer.innerHTML = `
            <div class="notes-section-title">Fixadas</div>
            <div class="notes-grid">
                ${pinned.map(note => renderNoteCard(note)).join('')}
            </div>
        `;
    } else {
        pinnedContainer.innerHTML = '';
    }

    const unpinnedContainer = document.getElementById('unpinnedNotesContainer');
    if (unpinned.length > 0) {
        unpinnedContainer.innerHTML = `
            ${pinned.length > 0 ? '<div class="notes-section-title">Outras</div>' : ''}
            <div class="notes-grid">
                ${unpinned.map(note => renderNoteCard(note)).join('')}
            </div>
        `;
    } else {
        unpinnedContainer.innerHTML = '';
    }

    document.getElementById('emptyNotesContainer').style.display = filtered.length === 0 ? 'flex' : 'none';
    renderEditor();
    renderColorMenu();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}


// ============================================
// 3. SISTEMA DE SCRIPTS (POPUPS)
// ============================================
// Gerencia os popups de estrofes de atendimento.
// Salva estrofes customizadas no localStorage.
// ============================================

class ScriptManager {
    constructor() {
        this.popup = Utils.getElement('#popup');
        this.estrofesContainer = Utils.getElement('#estrofesContainer');
        this.currentKey = null;
        this.currentCardId = null;
        this.saveTimer = null;

        // Textos padrão por categoria de script
        this.textosDefault = {
            inicio: {
                padrao: [
                    (vars) => `${vars.greeting}, [Nome do Cliente]! Me chamo ${vars.nomeAtendente} e serei responsavel pelo seu atendimento hoje. Verifiquei aqui que sua solicitacao esta relacionada a [assunto], certo?`,
                    (vars) => `${vars.greeting}, [Nome do Cliente]! Peco desculpas pela demora no retorno - estamos com um volume elevado de atendimentos hoje. Agradeco muito pela sua paciencia e ja estou aqui para te ajudar da melhor forma possivel.`
                ],
            },
            aguarde: {
                padrao: [
                    () => "Agradeco pela sua paciencia! Ja estou finalizando aqui e em breve trago a resposta para voce.",
                    () => "Muito obrigado por aguardar! Estou finalizando os ultimos detalhes e ja volto com mais informacoes.",
                    () => "Obrigado por esperar! Ja estou encerrando o protocolo e trarei novidades em instantes."
                ],
            },
            seminteracao: {
                padrao: [
                    () => "Antes de finalizarmos, ficou alguma duvida? Posso te ajudar com mais alguma coisa? Quero garantir um atendimento completo para voce!",
                    () => "Ha mais alguma duvida ou algo em que eu possa te ajudar antes de encerrarmos? Meu objetivo e garantir que tudo esteja 100% resolvido."
                ],
            },
            prefinal: {
                padrao: [
                    () => "Antes de finalizarmos, ficou alguma duvida? Posso te ajudar com mais alguma coisa? Quero garantir um atendimento completo para voce!",
                    () => "Ha mais alguma duvida ou algo em que eu possa te ajudar antes de encerrarmos? Meu objetivo e garantir que tudo esteja 100% resolvido."
                ],
            },
            fim: {
                padrao: [
                    (vars) => `Sinto muito por nao conseguir resolver tudo de imediato, mas me dediquei ao maximo para te ajudar e sigo acompanhando para que tudo se resolva o quanto antes. Desejo que ${vars.greetingLower} seja leve e repleto(a) de coisas boas para voce e sua familia.`,
                    (vars) => `Mesmo nao conseguindo resolver tudo agora, quero que saiba que estou aqui para te apoiar no que for preciso. Que ${vars.greetingLower} seja cheio de boas energias para voce!`
                ],
            }
        };
    }

    getGreeting() {
        const hora = new Date().getHours();
        if (hora >= 0 && hora < 5) return 'Boa madrugada filial';
        if (hora < 12) return 'Bom dia filial';
        if (hora < 18) return 'Boa tarde filial';
        return 'Boa noite filial';
    }

    getGreetingVars() {
        const greeting = this.getGreeting();
        return {
            greeting,
            greetingLower: greeting.charAt(0).toLowerCase() + greeting.slice(1)
        };
    }

    init() {
        this.initScriptBoxes();
        this.setupPopupEvents();
    }

    initScriptBoxes() {
        const colorBoxes = Utils.getAllElements('.color-box');
        colorBoxes.forEach(box => {
            box.addEventListener('click', () => {
                const key = box.dataset.key || 'inicio';
                const cardId = box.dataset.id || 'padrao';
                this.currentKey = key;
                this.currentCardId = cardId;

                const vars = {
                    greeting: this.getGreeting(),
                    greetingLower: this.getGreeting().toLowerCase(),
                    nomeAtendente: 'Wemerson',
                };

                this.showPopupForCard(key, vars, cardId);
            });
        });
    }

    showPopupForCard(key, vars = {}, cardId = 'padrao') {
        if (!this.popup || !this.estrofesContainer) return;
        this.estrofesContainer.innerHTML = '';

        const storageKey = `estrofes_${key}_${cardId}`;
        const saved = localStorage.getItem(storageKey);
        let estrofes;

        if (saved) {
            try {
                estrofes = JSON.parse(saved);
            } catch (e) {
                estrofes = null;
            }
        }

        if (!estrofes || estrofes.length === 0) {
            const defaults = this.textosDefault[key]?.[cardId] || this.textosDefault[key]?.['padrao'];
            estrofes = defaults ? defaults.map(fn => typeof fn === 'function' ? fn(vars, key) : fn) : ['Texto...'];
        }

        estrofes
            .map(text => Utils.normalizeText(text))
            .filter(Boolean)
            .forEach((text, index) => this.renderEstrofe(text, index));
        this.popup.style.display = 'flex';
    }

    renderEstrofe(text, index) {
        if (!this.estrofesContainer) return;
        const div = Utils.createElement('div', 'estrofe');
        div.dataset.index = index;
        const textarea = this.createTextarea(text);
        const buttons = this.createEstrofeButtons(textarea, div);
        div.appendChild(textarea);
        div.appendChild(buttons);
        this.estrofesContainer.appendChild(div);
    }

    createTextarea(text) {
        const textarea = Utils.createElement('textarea');
        textarea.value = Utils.normalizeText(text);
        textarea.readOnly = true;
        textarea.style.minHeight = '80px';
        textarea.style.width = '100%';
        textarea.style.resize = 'vertical';
        textarea.style.whiteSpace = 'pre-wrap';
        textarea.style.overflowWrap = 'anywhere';
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.max(80, textarea.scrollHeight)}px`;
            textarea.classList.add('is-saving');
            this.scheduleSave();
        });
        requestAnimationFrame(() => {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.max(80, textarea.scrollHeight)}px`;
        });
        textarea.addEventListener('keydown', (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                event.preventDefault();
                textarea.readOnly = true;
                this.saveEstrofes();
                Utils.showNotification('Texto salvo!');
            }
        });
        textarea.addEventListener('paste', (event) => {
            event.preventDefault();
            const pastedText = event.clipboardData?.getData('text/plain') || '';
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            textarea.setRangeText(Utils.normalizeText(pastedText), start, end, 'end');
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
        });
        textarea.addEventListener('blur', () => {
            if (!textarea.readOnly) {
                this.saveEstrofes();
                Utils.showNotification('Texto salvo automaticamente.');
            }
        });
        return textarea;
    }

    createEstrofeButtons(textarea, div) {
        const container = Utils.createElement('div', 'estrofe-buttons');
        container.style.marginTop = '10px';
        container.style.display = 'flex';
        container.style.gap = '10px';
        container.appendChild(this.createCopyButton(textarea));
        container.appendChild(this.createEditButton(textarea));
        container.appendChild(this.createRemoveButton(div));
        return container;
    }

    createCopyButton(textarea) {
        const btn = Utils.createElement('button', 'copy-btn btn');
        btn.textContent = 'Copiar';
        btn.onclick = () => {
            Utils.copyToClipboard(textarea.value).then(() => {
                Utils.showNotification("Texto copiado!");
            });
        };
        return btn;
    }

    createEditButton(textarea) {
        const btn = Utils.createElement('button', 'edit-btn btn');
        btn.textContent = 'Editar';
        btn.onclick = () => {
            const isEditing = !textarea.readOnly;
            if (isEditing) {
                textarea.readOnly = true;
                textarea.classList.remove('is-saving');
                btn.textContent = 'Editar';
                btn.classList.remove('save-btn');
                btn.classList.add('edit-btn');
                this.saveEstrofes();
                Utils.showNotification("Texto salvo!");
            } else {
                textarea.readOnly = false;
                textarea.focus();
                btn.textContent = 'Salvar';
                btn.classList.remove('edit-btn');
                btn.classList.add('save-btn');
            }
        };
        return btn;
    }

    createRemoveButton(div) {
        const btn = Utils.createElement('button', 'remove-btn btn');
        btn.textContent = 'Remover';
        btn.style.backgroundColor = '#dc3545';
        let confirmTimeout;

        btn.onclick = () => {
            if (btn.textContent === 'Remover') {
                btn.textContent = 'Confirmar?';
                btn.style.backgroundColor = '#ff6b6b';
                confirmTimeout = setTimeout(() => {
                    btn.textContent = 'Remover';
                    btn.style.backgroundColor = '#dc3545';
                }, 3000);
            } else {
                clearTimeout(confirmTimeout);
                div.remove();
                this.saveEstrofes();
                Utils.showNotification('Estrofe removida!');
            }
        };
        return btn;
    }

    addEstrofe() {
        const novoTexto = "Nova estrofe - edite aqui...";
        this.renderEstrofe(novoTexto, 0);
        this.saveEstrofes();
        Utils.showNotification("Nova estrofe adicionada!");
    }

    saveEstrofes() {
        if (!this.currentKey || !this.currentCardId) return;
        const textareas = Utils.getAllElements('#estrofesContainer textarea');
        const estrofes = [...textareas]
            .map(t => Utils.normalizeText(t.value))
            .filter(t => t.trim().length > 0);
        if (estrofes.length === 0) {
            Utils.showNotification("Nao e possivel salvar: nenhuma estrofe preenchida.");
            return;
        }
        const storageKey = `estrofes_${this.currentKey}_${this.currentCardId}`;
        if (Utils.storageSet(storageKey, estrofes)) {
            Utils.getAllElements('#estrofesContainer textarea').forEach(textarea => {
                textarea.classList.remove('is-saving');
            });
        }
    }

    scheduleSave() {
        if (this.saveTimer) clearTimeout(this.saveTimer);
        this.saveTimer = setTimeout(() => this.saveEstrofes(), 450);
    }

    closePopup() {
        if (this.popup) {
            if (this.saveTimer) clearTimeout(this.saveTimer);
            this.saveEstrofes();
            this.popup.style.display = 'none';
        }
    }

    setupPopupEvents() {
        if (this.popup) {
            const closeButton = this.popup.querySelector('.popup-close');
            closeButton?.addEventListener('click', (event) => {
                event.preventEventDefault?.();
                event.preventDefault();
                event.stopPropagation();
                this.closePopup();
            });
            this.popup.addEventListener("click", (e) => {
                if (e.target === this.popup) {
                    this.closePopup();
                }
            });
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape' && this.popup.style.display !== 'none') {
                    this.closePopup();
                }
            });
        }
    }
}


// ============================================
// 4. SELEÇÃO DE PERSONAGENS
// ============================================
// Controla a troca de abas entre os 8 personagens
// e a exibição dos painéis de detalhes.
// ============================================

class CharacterSelection {
    init() {
        const characterCards = Utils.getAllElements('.character-card');
        const characterDetails = Utils.getAllElements('.character-details');

        characterCards.forEach(card => {
            card.addEventListener('click', () => {
                this.selectCharacter(card, characterCards, characterDetails);
            });
        });

        this.showDefaultCharacter(characterCards, characterDetails);
    }

    selectCharacter(selectedCard, allCards, allDetails) {
        allCards.forEach(card => card.classList.remove('active'));
        selectedCard.classList.add('active');
        allDetails.forEach(detail => {
            detail.style.display = 'none';
        });
        const character = selectedCard.dataset.character;
        const details = Utils.getElement(`#details-${character}`);
        if (details) {
            details.style.display = 'flex';
        }
    }

    showDefaultCharacter(characterCards, characterDetails) {
        const activeCard = Utils.getElement('.character-card.active');
        if (activeCard) {
            const character = activeCard.dataset.character;
            const details = Utils.getElement(`#details-${character}`);
            if (details) {
                details.style.display = 'flex';
            }
        }
    }
}


// ============================================
// 5. POPUP "LER MAIS"
// ============================================
// Gerencia textos extensos por categoria.
// Permite editar, copiar e adicionar novos textos.
// ============================================

class ReadMorePopup {
    constructor() {
        this.popup = Utils.getElement('#readMorePopup');
        this.popupContent = this.popup?.querySelector('.popup-texto-vazio p');
        this.currentCategory = null;
        this.currentCardId = 'padrao';
    }

    init() {
        this.initReadMoreButtons();
        this.setupPopupEvents();
    }

    initReadMoreButtons() {
        const readMoreBtns = Utils.getAllElements('.read-more-btn');
        readMoreBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const category = btn.dataset.popupId;
                if (category) {
                    this.showPopupForCategory(category);
                }
            });
        });
    }

    showPopupForCategory(category) {
        if (!this.popup || !this.popupContent) {
            console.error("Popup 'Ler mais' nao encontrado");
            return;
        }

        this.currentCategory = category;
        this.popupContent.innerHTML = '';

        const storageKey = `textos_${category}`;
        const saved = localStorage.getItem(storageKey);
        let textos;

        if (saved) {
            try {
                textos = JSON.parse(saved);
            } catch (e) {
                textos = null;
            }
        }

        if (!textos || textos.length === 0) {
            textos = ['Nenhum texto salvo. Adicione um novo texto.'];
        }

        textos
            .map(text => Utils.normalizeText(text))
            .filter(Boolean)
            .forEach((text, index) => this.renderText(text, index, category));

        const addBtn = Utils.createElement('button', 'add-estrofe-btn');
        addBtn.textContent = 'Adicionar Novo Texto';
        addBtn.id = `addBtn-${category}`;
        addBtn.onclick = () => this.adicionarNovoTexto(category);
        this.popupContent.appendChild(addBtn);

        this.popup.style.display = 'flex';
    }

    renderText(text, index, category) {
        if (!this.popupContent) return;
        const id = `text_${category}_${index}_${Date.now()}`;

        const textDiv = Utils.createElement('div', 'texto-item');
        textDiv.id = id;
        textDiv.style.cssText = 'width: 100%; min-height: 120px; background: var(--white); color: var(--gray-950); border: 1px solid var(--gray-200); padding: var(--space-4); font-size: var(--font-size-base); border-radius: var(--radius-md); font-family: var(--font-family); line-height: var(--line-height-relaxed); resize: vertical; white-space: pre-wrap; overflow-wrap: anywhere;';
        textDiv.textContent = Utils.normalizeText(text);

        const buttonsDiv = Utils.createElement('div', 'texto-buttons');
        buttonsDiv.style.cssText = 'margin: 10px 0; display: flex; gap: 5px;';
        buttonsDiv.appendChild(this.createCopyButton(id));
        buttonsDiv.appendChild(this.createEditButton(id, category));
        buttonsDiv.appendChild(this.createRemoveButton(id, category));

        const hr = Utils.createElement('hr');
        hr.style.margin = '10px 0';

        const addButton = this.popupContent.querySelector('button[id^="addBtn-"]');
        if (addButton) {
            this.popupContent.insertBefore(textDiv, addButton);
            this.popupContent.insertBefore(buttonsDiv, addButton);
            this.popupContent.insertBefore(hr, addButton);
        } else {
            this.popupContent.appendChild(textDiv);
            this.popupContent.appendChild(buttonsDiv);
            this.popupContent.appendChild(hr);
        }
    }

    createCopyButton(elementId) {
        const btn = Utils.createElement('button', 'copy-btn');
        btn.textContent = 'Copiar';
        btn.onclick = () => {
            const element = document.getElementById(elementId);
            const text = element ? this.getEditableText(element) : '';
            if (!text) return;
            navigator.clipboard.writeText(text).then(() => {
                btn.textContent = 'Copiado!';
                btn.style.backgroundColor = '#06c934ff';
                setTimeout(() => {
                    btn.textContent = 'Copiar';
                    btn.style.backgroundColor = '#06c934ff';
                }, 2000);
            });
        };
        return btn;
    }

    createEditButton(elementId, category) {
        const btn = Utils.createElement('button', 'edit-btn');
        btn.textContent = 'Editar';
        btn.onclick = () => {
            const element = document.getElementById(elementId);
            if (!element) return;
            const isEditing = element.contentEditable === 'true';
            if (isEditing) {
                const conteudo = this.getEditableText(element);
                element.textContent = conteudo;
                element.contentEditable = 'false';
                element.classList.remove('is-editing');
                element.style.outline = 'none';
                element.style.color = 'unset';
                btn.textContent = 'Editar';
                this.sincronizarTexto(elementId, conteudo, category);
                Utils.showNotification('Texto salvo!');
            } else {
                element.contentEditable = 'true';
                element.setAttribute('role', 'textbox');
                element.setAttribute('aria-multiline', 'true');
                element.setAttribute('spellcheck', 'true');
                element.classList.add('is-editing');
                element.focus();
                element.style.color = 'rgb(0, 0, 0)';
                btn.textContent = 'Salvar';
                element.onpaste = (event) => {
                    event.preventDefault();
                    const pastedText = event.clipboardData?.getData('text/plain') || '';
                    const selection = window.getSelection();
                    if (!selection || !selection.rangeCount) return;
                    const range = selection.getRangeAt(0);
                    range.deleteContents();
                    const textNode = document.createTextNode(Utils.normalizeText(pastedText));
                    range.insertNode(textNode);
                    range.setStartAfter(textNode);
                    range.collapse(true);
                    selection.removeAllRanges();
                    selection.addRange(range);
                    element.dispatchEvent(new Event('input', { bubbles: true }));
                };
                element.onkeydown = (event) => {
                    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                        event.preventDefault();
                        btn.click();
                    }
                };
                element.oninput = () => {
                    if (element.saveTimer) clearTimeout(element.saveTimer);
                    element.saveTimer = setTimeout(() => {
                        const conteudo = this.getEditableText(element);
                        this.sincronizarTexto(elementId, conteudo, category);
                    }, 450);
                };
                element.onblur = () => {
                    if (element.saveTimer) clearTimeout(element.saveTimer);
                    const conteudo = this.getEditableText(element);
                    this.sincronizarTexto(elementId, conteudo, category);
                };
            }
        };
        return btn;
    }

    createRemoveButton(elementId, category) {
        const btn = Utils.createElement('button', 'remove-btn');
        btn.textContent = 'Excluir';
        let confirmTimeout;
        btn.onclick = () => {
            if (btn.textContent === 'Excluir') {
                btn.textContent = 'Confirmar?';
                btn.style.backgroundColor = '#ff6b6b';
                confirmTimeout = setTimeout(() => {
                    btn.textContent = 'Excluir';
                    btn.style.backgroundColor = '#dc3545';
                }, 3000);
            } else {
                clearTimeout(confirmTimeout);
                const element = document.getElementById(elementId);
                const buttonsDiv = btn.closest('.texto-buttons');
                const nextHr = buttonsDiv?.nextElementSibling;
                element?.remove();
                buttonsDiv?.remove();
                if (nextHr?.tagName === 'HR') nextHr.remove();
                this.removerTexto(elementId, category);
                Utils.showNotification('Texto removido!');
            }
        };
        return btn;
    }

    sincronizarTexto(elementId, conteudo, category) {
        Utils.storageSet(`texto_${elementId}`, conteudo);
        this.salvarTextosDaCategoria(category);
    }

    removerTexto(elementId, category) {
        localStorage.removeItem(`texto_${elementId}`);
        this.salvarTextosDaCategoria(category);
    }

    getEditableText(element) {
        const renderedText = typeof element.innerText === 'string'
            ? element.innerText
            : element.textContent;

        return Utils.normalizeText(renderedText);
    }

    salvarTextosDaCategoria(category) {
        const items = document.querySelectorAll('#readMorePopup .texto-item');
        const textos = Array.from(items).map(item =>
            this.getEditableText(item)
        );
        Utils.storageSet(`textos_${category}`, textos);
    }

    adicionarNovoTexto(category) {
        const novoTexto = 'Novo texto - edite aqui...';
        const index = Date.now();
        this.renderText(novoTexto, index, category);
        Utils.showNotification('Novo texto adicionado!');
    }

    closePopup() {
        if (this.popup) {
            if (this.currentCategory) this.salvarTextosDaCategoria(this.currentCategory);
            this.popup.style.display = 'none';
        }
    }

    setupPopupEvents() {
        if (this.popup) {
            const closeButton = this.popup.querySelector('.popup-close');
            closeButton?.addEventListener('click', (event) => {
                event.preventEventDefault?.();
                event.preventDefault();
                event.stopPropagation();
                this.closePopup();
            });
            this.popup.addEventListener('click', (e) => {
                if (e.target === this.popup) {
                    this.closePopup();
                }
            });
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape' && this.popup.style.display !== 'none') {
                    this.closePopup();
                }
            });
        }
    }
}


// ============================================
// 6. GERENCIADOR PRINCIPAL DA APLICAÇÃO
// ============================================

class HeartwarmingApp {
    constructor() {
        this.scriptManager = new ScriptManager();
        this.characterSelection = new CharacterSelection();
        this.readMorePopup = new ReadMorePopup();
    }

    init() {
        this.scriptManager.init();
        this.characterSelection.init();
        this.readMorePopup.init();
    }
}


// ============================================
// 7. FUNÇÕES GLOBAIS (Compatibilidade com HTML)
// ============================================

const app = new HeartwarmingApp();

function closePopup() {
    app.scriptManager.closePopup();
}

function addEstrofe() {
    app.scriptManager.addEstrofe();
}

function closeReadMorePopup() {
    app.readMorePopup.closePopup();
}


// ============================================
// 8. INICIALIZAÇÃO DA APLICAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
