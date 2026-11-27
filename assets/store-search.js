(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        const searchInput = document.getElementById('searchInput');
        const clearButton = document.getElementById('clearBtn');
        const resultsCount = document.getElementById('resultsCount');
        const listContainer = document.getElementById('listaContainer');
        const modalOverlay = document.getElementById('modalOverlay');
        const modalContent = document.getElementById('modalContent');

        if (!searchInput || !listContainer) return;

        const pharmacies = window.FARMACIAS_DATA;
        if (!Array.isArray(pharmacies) || pharmacies.length === 0) {
            listContainer.innerHTML = '<div class="ifood-empty">Não foi possível carregar as farmácias.</div>';
            resultsCount.textContent = 'Erro ao carregar os dados.';
            console.error('[Busca de lojas] FARMACIAS_DATA não está disponível ou está vazia.');
            return;
        }

        const escapeHtml = function (value) {
            return String(value == null ? '—' : value).replace(/[&<>"']/g, function (character) {
                return {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#39;'
                }[character];
            });
        };

        const normalize = function (value) {
            return String(value == null ? '' : value)
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '');
        };

        const displayValue = function (value) {
            return value == null || String(value).trim() === '' ? '' : String(value);
        };

        let filteredPharmacies = pharmacies;
        let previousBodyOverflow = '';
        let previouslyFocusedElement = null;

        function updateCount() {
            const term = searchInput.value.trim();
            resultsCount.textContent = term
                ? filteredPharmacies.length + ' resultado' + (filteredPharmacies.length === 1 ? '' : 's') + ' para "' + term + '"'
                : pharmacies.length + ' farmácias carregadas';
        }

        function renderList() {
            if (filteredPharmacies.length === 0) {
                listContainer.innerHTML = '<div class="ifood-empty">Nenhuma farmácia encontrada.</div>';
                return;
            }

            const limit = 50;
            const cards = filteredPharmacies.slice(0, limit).map(function (pharmacy) {
                const location = [pharmacy.cidade, pharmacy.estado].filter(Boolean).join(' — ');
                return '<button type="button" class="ifood-farmacia-card" data-java="' + escapeHtml(pharmacy.java) + '">' +
                    '<span class="ifood-farmacia-info">' +
                    '<span class="ifood-farmacia-name">' + escapeHtml(pharmacy.farmacia || 'Farmácia') + '</span>' +
                    '<span class="ifood-farmacia-location">' + escapeHtml(location || 'Localização não informada') + '</span>' +
                    '</span>' +
                    '<span class="ifood-farmacia-tag">' + escapeHtml(pharmacy.bandeira || 'Sem bandeira') + ' · ' + escapeHtml(pharmacy.java) + '</span>' +
                    '</button>';
            }).join('');

            const moreHint = filteredPharmacies.length > limit
                ? '<div class="ifood-more-hint">Mais ' + (filteredPharmacies.length - limit) + ' resultados. Refine a busca.</div>'
                : '';

            listContainer.innerHTML = cards + moreHint;
        }

        function search() {
            const term = normalize(searchInput.value.trim());
            filteredPharmacies = term
                ? pharmacies.filter(function (pharmacy) {
                    const searchableFields = [
                        pharmacy.java, pharmacy.farmacia, pharmacy.cidade, pharmacy.estado,
                        pharmacy.bandeira, pharmacy.bairro, pharmacy.endereco, pharmacy.regional,
                        pharmacy.cnpj, pharmacy.cod_int
                    ];
                    return normalize(searchableFields.join(' ')).includes(term);
                })
                : pharmacies;

            renderList();
            updateCount();
        }

        function openPharmacy(java) {
            const pharmacy = pharmacies.find(function (item) {
                return String(item.java) === String(java);
            });
            if (!pharmacy || !modalOverlay || !modalContent) return;

            const row = function (label, value, highlighted) {
                const text = displayValue(value);
                if (!text) return '';
                const content = escapeHtml(text);
                return '<div class="ifood-info-row"><span class="ifood-info-label">' +
                    escapeHtml(label) + '</span><span class="ifood-info-value' +
                    (highlighted ? ' ifood-info-value--highlight' : '') + '">' + content + '</span></div>';
            };

            const tags = [];
            if (pharmacy.servicos_20 === 'SIM') tags.push('Serviços 2.0');
            if (pharmacy.eac === 'SIM') tags.push('EAC');
            if (pharmacy.farmacia_popular === 'SIM') tags.push('Farmácia Popular');
            tags.push('Java ' + String(pharmacy.java));

            const contactRows = [
                row('E-mail', pharmacy.email),
                row('Telefone fixo', [pharmacy.ddd, pharmacy.tel_fixo_fmt || pharmacy.tel_fixo].filter(Boolean).join(' ')),
                row('Celular', [pharmacy.ddd, pharmacy.tel_cel_fmt || pharmacy.tel_celular].filter(Boolean).join(' '))
            ].join('');

            modalContent.innerHTML =
                '<div class="ifood-modal-header"><h2 id="modalTitle">' + escapeHtml(pharmacy.farmacia) + '</h2>' +
                '<button type="button" class="ifood-close-btn" aria-label="Fechar">&times;</button></div>' +
                '<div class="ifood-info-section">' +
                row('Java', pharmacy.java) +
                row('Código interno', pharmacy.cod_int) +
                row('Bandeira', pharmacy.bandeira, true) +
                row('Formato', pharmacy.formato) +
                row('Perfil', pharmacy.perfil) +
                row('Regional', pharmacy.regional) +
                row('E-mail regional', pharmacy.email_regional) +
                row('Diretor', pharmacy.diretor) +
                row('Região', pharmacy.regiao) +
                row('Endereço', pharmacy.endereco) +
                row('Bairro', pharmacy.bairro) +
                row('CEP', pharmacy.cep) +
                row('Cidade / UF', [pharmacy.cidade, pharmacy.estado].filter(Boolean).join(' — ')) +
                row('CNPJ', pharmacy.cnpj) +
                row('Inauguração', pharmacy.inauguracao_fmt || pharmacy.inauguracao) +
                row('Centro de distribuição', [pharmacy.nome_cd, pharmacy.cod_cd].filter(Boolean).join(' · ')) +
                '</div>' +
                (contactRows ? '<div class="ifood-divider"></div><div class="ifood-acessos-box"><div class="ifood-acessos-title">Contato da farmácia</div>' + contactRows + '</div>' : '') +
                '<div class="ifood-divider"></div>' +
                '<div class="ifood-horario-section"><div class="ifood-horario-title">Horário de funcionamento</div>' +
                '<div class="ifood-horario-grid">' +
                '<div class="ifood-horario-col"><div class="ifood-dia">Seg–Sex</div><div class="ifood-tempo">' + escapeHtml(pharmacy.seg_sex_simples || '—') + '</div></div>' +
                '<div class="ifood-horario-col"><div class="ifood-dia">Sábado</div><div class="ifood-tempo">' + escapeHtml(pharmacy.sab_simples || '—') + '</div></div>' +
                '<div class="ifood-horario-col"><div class="ifood-dia">Domingo</div><div class="ifood-tempo">' + escapeHtml(pharmacy.dom_simples || '—') + '</div></div>' +
                '</div></div>' +
                '<div class="ifood-divider"></div><div class="ifood-tags-section">' +
                tags.map(function (tag) {
                    return '<span class="ifood-tag-item">' + escapeHtml(tag) + '</span>';
                }).join('') +
                '</div><div class="ifood-modal-footer"><span>RD Saúde — Resumo das Farmácias</span></div>';

            previouslyFocusedElement = document.activeElement;
            previousBodyOverflow = document.body.style.overflow;
            modalOverlay.classList.add('active');
            modalOverlay.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            modalContent.querySelector('.ifood-close-btn').focus();
        }

        function closeModal() {
            if (!modalOverlay) return;
            modalOverlay.classList.remove('active');
            modalOverlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = previousBodyOverflow;
            if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === 'function') {
                previouslyFocusedElement.focus();
            }
        }

        listContainer.addEventListener('click', function (event) {
            if (!(event.target instanceof Element)) return;
            const card = event.target.closest('.ifood-farmacia-card');
            if (card) openPharmacy(card.getAttribute('data-java'));
        });

        modalContent.addEventListener('click', function (event) {
            if (event.target instanceof Element && event.target.closest('.ifood-close-btn')) closeModal();
        });

        modalOverlay.addEventListener('click', function (event) {
            if (event.target === modalOverlay) closeModal();
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && modalOverlay.classList.contains('active')) closeModal();
        });

        searchInput.addEventListener('input', function () {
            clearButton.classList.toggle('visible', searchInput.value.length > 0);
            search();
        });

        clearButton.addEventListener('click', function () {
            searchInput.value = '';
            clearButton.classList.remove('visible');
            search();
            searchInput.focus();
        });

        renderList();
        updateCount();
    });
})();
