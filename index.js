/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI } from "@google/genai";

const API_KEY = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : '';

// --- Icon Definitions ---
const ICONS = {
    default: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>`,
    cardio: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M12.707 3.636a1 1 0 00-1.414 0L4.222 10.707a8.5 8.5 0 1011.071 11.071l7.07-7.071a1 1 0 000-1.414l-7.07-7.071zM12 20.5a6.5 6.5 0 100-13 6.5 6.5 0 000 13z" clip-rule="evenodd" /></svg>`,
    neumo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.5 18.75a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" /><path fill-rule="evenodd" d="M8.625.75A3.375 3.375 0 005.25 4.125v15.75a3.375 3.375 0 003.375 3.375h6.75a3.375 3.375 0 003.375-3.375V4.125A3.375 3.375 0 0015.375.75h-6.75zM7.5 4.125C7.5 3.504 8.004 3 8.625 3H9.75v.375c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125-.504 1.125-1.125V3h1.125c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-6.75c-.621 0-1.125-.504-1.125-1.125V4.125z" clip-rule="evenodd" /></svg>`,
    nefro: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /><path fill-rule="evenodd" d="M8.25 3.75a3.75 3.75 0 00-3.75 3.75v.518c0 .193.023.382.068.568L6 11.25v2.25a.75.75 0 00.75.75h1.5a.75.75 0 00.75-.75V11.25l1.432-2.712a.75.75 0 011.088-.286l1.838.919a.75.75 0 00.916-.251l1.691-2.254a.75.75 0 011.214-.043l1.83 2.745a.75.75 0 001.214-.043l.83-1.246a3.75 3.75 0 00-1.214-5.262V3.75a3.75 3.75 0 00-3.75-3.75h-9zM7.5 7.5a2.25 2.25 0 012.25-2.25h9a2.25 2.25 0 012.25 2.25v.135a.75.75 0 00-.01-.02l-.83 1.245a.75.75 0 01-1.214.043l-1.83-2.745a.75.75 0 00-1.214.043L13.69 8.46a.75.75 0 01-.916.251l-1.838-.919a.75.75 0 00-1.088.286L8.432 10.8a.75.75 0 01-.068.14L7.5 9.135V7.5z" clip-rule="evenodd" /></svg>`,
    digestivo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071 1.052A32.095 32.095 0 0113.31 18.27l-5.657-5.657a.75.75 0 00-1.061 1.061l5.657 5.657a32.11 32.11 0 01-4.76.626.75.75 0 00-.75.75v.002a.75.75 0 00.75.75l.17.005a33.6 33.6 0 005.152-.682.75.75 0 00.672-1.033 32.09 32.09 0 00-1.08-11.873.75.75 0 00-1.053-1.07Z" clip-rule="evenodd" /></svg>`,
    metabolismo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1.5a.75.75 0 01.75.75V6h4.5a.75.75 0 010 1.5H6.75a.75.75 0 010-1.5H11.25V2.25a.75.75 0 01.75-.75zM6.06 9.524a.75.75 0 01.442.88l-1.5 4.5a.75.75 0 11-1.408-.468l1.5-4.5a.75.75 0 01.966-.412zm11.88 0a.75.75 0 01.966.412l1.5 4.5a.75.75 0 11-1.408.468l-1.5-4.5a.75.75 0 01.442-.88zM12 18a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V18.75a.75.75 0 01.75-.75z" /><path fill-rule="evenodd" d="M15.28 7.5H8.72a.75.75 0 000 1.5h6.56a.75.75 0 000-1.5zM4.686 16.5a.75.75 0 01.53-.22h13.568a.75.75 0 01.53.22l1.323 1.323a.75.75 0 010 1.06l-1.323 1.323a.75.75 0 01-.53.22H5.216a.75.75 0 01-.53-.22L3.363 18.884a.75.75 0 010-1.06l1.323-1.323z" clip-rule="evenodd" /></svg>`,
    hemato: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M4.5 12a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm15 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clip-rule="evenodd" /><path d="M12 2.25c-5.523 0-10 3.023-10 6.75s4.477 6.75 10 6.75 10-3.023 10-6.75S17.523 2.25 12 2.25zM4.067 9.172a8.513 8.513 0 015.197-2.618 1.5 1.5 0 10-.728-2.887 11.513 11.513 0 00-6.98 3.593.75.75 0 00.255 1.05A.75.75 0 004.067 9.172zM12 14.25a7.5 7.5 0 01-7.443-7.009A.75.75 0 003.75 6.75a.75.75 0 00-.525.223A8.995 8.995 0 002.25 9c0 3.866 4.03 7 9 7s9-3.134 9-7c0-.28-.013-.559-.038-.83a.75.75 0 00-.472-.663A.75.75 0 0019.5 7.5a.75.75 0 00-.568.243A7.5 7.5 0 0112 14.25z" /></svg>`,
    neuro: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M15.75 9.75a4.5 4.5 0 11-8.528-2.227.75.75 0 00-1.428.473A6 6 0 1017.25 9.75a.75.75 0 00-1.5 0z" /><path d="M12 3.75a.75.75 0 00-.75.75V11.25a.75.75 0 001.5 0V4.5a.75.75 0 00-.75-.75z" /><path d="M12.75 12.75a.75.75 0 00-1.5 0v5.69l-1.846-1.615a.75.75 0 00-1.016 1.102l3.25 2.844a.75.75 0 001.016 0l3.25-2.844a.75.75 0 10-1.016-1.102L12.75 18.44v-5.69z" /></svg>`,
    reumato: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clip-rule="evenodd" /></svg>`,
    infecto: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.25 4.533A9.75 9.75 0 001.5 12c0 5.385 4.365 9.75 9.75 9.75s9.75-4.365 9.75-9.75c0-4.88-3.548-8.95-8.25-9.667v1.613a1.5 1.5 0 01-1.5 1.5H9a1.5 1.5 0 01-1.5-1.5V5.25a.75.75 0 00-.75-.75h-.75a.75.75 0 00-.75.75v3a.75.75 0 001.5 0v-1.5h.75a.75.75 0 00.75-.75V6h1.5a.75.75 0 00.75-.75V4.533zM9 10.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm7.5 1.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" /></svg>`,
};

document.addEventListener('DOMContentLoaded', function () {
    // --- DOM Element Cache ---
    const getElem = (id) => document.getElementById(id);
    const tableBody = getElem('table-body');
    const linkModal = getElem('link-modal');
    const notesModal = getElem('notes-modal');
    const notesModalTitle = getElem('notes-modal-title');
    const notesEditor = getElem('notes-editor');
    const editorToolbar = notesModal.querySelector('.editor-toolbar');
    const linkInput = getElem('link-input');
    const saveLinkBtn = getElem('save-link-btn');
    const cancelLinkBtn = getElem('cancel-link-btn');
    const openLinkPreviewBtn = getElem('open-link-preview');
    const saveNoteBtn = getElem('save-note-btn');
    const saveAndCloseNoteBtn = getElem('save-and-close-note-btn');
    const cancelNoteBtn = getElem('cancel-note-btn');
    const unmarkNoteBtn = getElem('unmark-note-btn');
    const copyNoteTextBtn = getElem('copy-note-text-btn');
    const searchBar = getElem('search-bar');
    const progressBar = getElem('progress-bar');
    const askAiBtn = getElem('ask-ai-btn');
    const aiQaModal = getElem('ai-qa-modal');
    const aiResponseArea = getElem('ai-response-area');
    const aiQaLoader = getElem('ai-qa-loader');
    const aiQuestionInput = getElem('ai-question-input');
    const cancelAiQaBtn = getElem('cancel-ai-qa-btn');
    const sendAiQaBtn = getElem('send-ai-qa-btn');
    const exportBtn = getElem('export-btn');
    const importBtn = getElem('import-btn');
    const importFileInput = getElem('import-file-input');
    const settingsBtn = getElem('settings-btn');
    const settingsDropdown = getElem('settings-dropdown');
    const confidenceFiltersContainer = getElem('confidence-filters');
    const iconPickerModal = getElem('icon-picker-modal');
    const iconPickerGrid = getElem('icon-picker-grid');
    const closeIconPickerBtn = getElem('close-icon-picker-btn');

    // --- State Variables ---
    let activeConfidenceFilter = 'all';
    let activeLinkCell = null;
    let activeNoteIcon = null;
    let activeSectionIconContainer = null;
    let selectedImageForResize = null;

    const grandTotalSpans = {
        fuse: getElem('total-fuse'),
        notion: getElem('total-notion'),
        gemini: getElem('total-gemini'),
        lectura: getElem('total-lectura')
    };
    const grandPercentSpans = {
        fuse: getElem('percent-fuse'),
        notion: getElem('percent-notion'),
        gemini: getElem('percent-gemini'),
        lectura: getElem('percent-lectura')
    };
    const progressRings = {
        fuse: document.getElementById('progress-ring-fuse'),
        notion: document.getElementById('progress-ring-notion'),
        gemini: document.getElementById('progress-ring-gemini'),
        lectura: document.getElementById('progress-ring-lectura'),
    };
    
    const sections = {};
    document.querySelectorAll('[data-section-header]').forEach(headerEl => {
        const headerRow = headerEl;
        const sectionName = headerRow.dataset.sectionHeader;
        sections[sectionName] = {
            headerRow,
            totalRow: getElem(`total-row-${sectionName}`)
        };
    });

    // --- Core Logic Functions ---
    
    function createLinkCellContent() {
        const fragment = document.createDocumentFragment();
        const container = document.createElement('div');
        container.className = 'flex items-center justify-center space-x-2 h-full';

        const linkAnchor = document.createElement('a');
        linkAnchor.href = '#';
        linkAnchor.target = '_blank';
        linkAnchor.className = 'link-anchor';
        linkAnchor.style.display = 'none'; // Hidden by default
        linkAnchor.title = "Abrir enlace";
        linkAnchor.innerHTML = `<svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.665l3-3z" /><path d="M8.603 3.799a.75.75 0 00-1.17 1.044A4 4 0 009.25 9.75l.165-.01a.75.75 0 00.722-.843l-.105-.844a2.5 2.5 0 011.99-2.221.75.75 0 00.522-1.03l-1.106-2.212a.75.75 0 00-1.17-1.044z" /></svg>`;
        
        const editIcon = document.createElement('span');
        editIcon.className = 'edit-link-icon opacity-50 hover:opacity-100';
        editIcon.title = "Agregar/editar enlace";
        editIcon.innerHTML = `<svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" /></svg>`;
        
        container.appendChild(linkAnchor);
        container.appendChild(editIcon);
        fragment.appendChild(container);
        return fragment;
    }
    
    function createLecturaCellContent() {
        const fragment = document.createDocumentFragment();
        const container = document.createElement('div');
        container.className = 'flex items-center justify-center space-x-2';
        
        const counterSpan = document.createElement('span');
        counterSpan.className = 'lectura-counter';
        counterSpan.textContent = '0';

        const noteIconSvg = `<svg class="solid-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 15.25z" clip-rule="evenodd" /></svg><svg class="outline-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>`;

        const greyIcon = document.createElement('span');
        greyIcon.className = 'note-icon grey-icon';
        greyIcon.dataset.noteType = 'grey';
        greyIcon.title = 'Esquema';
        greyIcon.innerHTML = noteIconSvg;

        const blueIcon = document.createElement('span');
        blueIcon.className = 'note-icon blue-icon';
        blueIcon.dataset.noteType = 'blue';
        blueIcon.title = 'Desarrollo';
        blueIcon.innerHTML = noteIconSvg;

        container.appendChild(counterSpan);
        container.appendChild(greyIcon);
        container.appendChild(blueIcon);
        fragment.appendChild(container);
        return fragment;
    }
    
    function initializeCells() {
        document.querySelectorAll('td.fillable-cell[data-col]').forEach(cellEl => {
            const cell = cellEl;
            cell.innerHTML = ''; // Clear existing content
            cell.appendChild(createLinkCellContent());
            cell.dataset.status = 'default'; // Initial state
        });

        document.querySelectorAll('td.lectura-cell[data-col="lectura"]').forEach(cellEl => {
            cellEl.innerHTML = '';
            cellEl.appendChild(createLecturaCellContent());
        });

        document.querySelectorAll('tr[data-section] td:nth-child(2)').forEach((td) => {
            const topicTextSpan = document.createElement('span');
            topicTextSpan.className = 'topic-text';
            while (td.firstChild) {
                topicTextSpan.appendChild(td.firstChild);
            }
            td.innerHTML = ''; // Clear td before appending
            td.appendChild(topicTextSpan);
            
            const confidenceContainer = document.createElement('span');
            confidenceContainer.className = 'ml-2 inline-flex items-center align-middle';
            const confidenceDot = document.createElement('span');
            confidenceDot.className = 'confidence-dot';
            confidenceDot.dataset.confidenceLevel = '0';
            confidenceDot.title = "Nivel de confianza";
            confidenceContainer.appendChild(confidenceDot);
            td.appendChild(confidenceContainer);
        });
    }

    // --- Totals and Progress Calculation ---
    function updateAllTotals() {
        const grandTotals = { fuse: 0, notion: 0, gemini: 0, lectura: 0 };
        const grandApplicable = { fuse: 0, notion: 0, gemini: 0, lectura: 0 };
        
        const allRows = document.querySelectorAll('tr[data-section]');
        
        allRows.forEach(row => {
            ['fuse', 'notion', 'gemini'].forEach(col => {
                 const cell = row.querySelector(`td[data-col="${col}"]`);
                 if (!cell) return;
                 const status = cell.dataset.status;
                 if (status === 'filled') {
                     grandTotals[col]++;
                     grandApplicable[col]++;
                 } else if (status === 'not-done') {
                     grandApplicable[col]++;
                 }
            });
            const counter = row.querySelector(`td[data-col="lectura"] .lectura-counter`);
            const count = parseInt(counter?.textContent || '0', 10);
            if(count > 0) {
                grandTotals.lectura++;
            }
            grandApplicable.lectura++; // For lectura, all rows are applicable
        });

        Object.keys(sections).forEach(sectionName => {
            const sectionRows = document.querySelectorAll(`tr[data-section="${sectionName}"]`);
            const totalRowTds = sections[sectionName].totalRow.querySelectorAll('td');
            let colIndex = 1;
            ['fuse', 'notion', 'gemini', 'lectura'].forEach(col => {
                let sectionCompletedCount = 0;
                sectionRows.forEach(row => {
                     if (col === 'lectura') {
                        const counter = row.querySelector(`td[data-col="lectura"] .lectura-counter`);
                        const count = parseInt(counter?.textContent || '0', 10);
                        if (count > 0) {
                           sectionCompletedCount++;
                        }
                    } else {
                        if (row.querySelector(`td[data-col="${col}"]`).dataset.status === 'filled') {
                            sectionCompletedCount++;
                        }
                    }
                });
                totalRowTds[colIndex].textContent = String(sectionCompletedCount);
                colIndex++;
            });
        });
        
        ['fuse', 'notion', 'gemini', 'lectura'].forEach(colKey => {
            const completedCount = grandTotals[colKey];
            const applicableCount = grandApplicable[colKey] || 0;
            
            const percentage = applicableCount > 0 ? Math.round((completedCount / applicableCount) * 100) : 0;
            grandTotalSpans[colKey].textContent = String(completedCount);
            grandPercentSpans[colKey].textContent = `${percentage}%`;
            
            const ring = progressRings[colKey];
            if (ring) {
                const radius = ring.r.baseVal.value;
                const circumference = radius * 2 * Math.PI;
                ring.style.strokeDasharray = `${circumference} ${circumference}`;
                const offset = circumference - (percentage / 100) * circumference;
                ring.style.strokeDashoffset = String(offset);
            }
        });
        
        const overallApplicable = grandApplicable.fuse + grandApplicable.notion + grandApplicable.gemini + grandApplicable.lectura;
        const overallCompleted = grandTotals.fuse + grandTotals.notion + grandTotals.gemini + grandTotals.lectura;
        const overallPercentage = overallApplicable > 0 ? (overallCompleted / overallApplicable) * 100 : 0;
        progressBar.style.width = overallPercentage + '%';
    }

    function updateSectionHeaderCounts() {
        Object.keys(sections).forEach(sectionName => {
            const sectionRows = document.querySelectorAll(`tr[data-section="${sectionName}"]`);
            const count = sectionRows.length;
            const headerRow = sections[sectionName].headerRow;
            if (headerRow) {
                const countElement = headerRow.querySelector('.section-count');
                if (countElement) {
                    countElement.textContent = `(${count})`;
                }
            }
        });
    }

    // --- Modal and State Management ---
    function loadNote(icon, noteData, defaultTitle) {
        // Reset icon state
        icon.classList.remove('has-note');
        icon.title = defaultTitle;
        icon.dataset.note = '';

        if (!noteData) {
            return '';
        }
    
        let noteContent = '';
        let lastModified;
    
        try {
            const parsed = JSON.parse(noteData);
            if (typeof parsed === 'object' && parsed !== null) {
                noteContent = parsed.content || '';
                lastModified = parsed.lastModified;
            } else {
                noteContent = noteData;
            }
        } catch (e) {
            noteContent = noteData;
        }
        
        if (noteContent && noteContent.trim() !== '' && noteContent.trim() !== '<p><br></p>') {
            icon.dataset.note = noteData; // Store the original JSON string
            icon.classList.add('has-note');
        
            if (lastModified) {
                const d = new Date(lastModified);
                const formattedDate = d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
                icon.title = `${defaultTitle} (Modificado: ${formattedDate})`;
            }
        }
    
        return noteContent;
    }
    
    function closeModal(modal) {
        modal.classList.remove('visible');
    }
    
    function openModal(modal) {
        modal.classList.add('visible');
    }
    
    // --- Event Listeners ---
    tableBody.addEventListener('click', function (e) {
        const target = e.target;
        
        // If the click is on an interactive element inside a cell, stop processing.
        if (target.closest('a') || target.closest('.note-icon') || target.closest('.edit-link-icon') || target.closest('.delete-section-links-btn')) {
             // Let other handlers or default behavior take over.
        } else {
            // Handle cell state change for fillable cells
            const fillableCell = target.closest('.fillable-cell');
            if (fillableCell) {
                const currentStatus = fillableCell.dataset.status || 'default';
                let nextStatus = 'default';

                if (currentStatus === 'default') {
                    nextStatus = 'filled'; // default -> green
                } else if (currentStatus === 'filled') {
                    nextStatus = 'not-done'; // green -> red
                } else if (currentStatus === 'not-done') {
                    nextStatus = 'default'; // red -> default
                }
                
                fillableCell.dataset.status = nextStatus;
                fillableCell.classList.remove('filled', 'not-done');
                if (nextStatus !== 'default') {
                    fillableCell.classList.add(nextStatus);
                }
                updateAllTotals();
                saveState();
                return; // Stop further processing
            }

            // Handle counter for lectura cells
            const lecturaCell = target.closest('.lectura-cell');
            if (lecturaCell) {
                 if (target.closest('.note-icon')) return; // Ignore clicks on note icons
            
                const counterSpan = lecturaCell.querySelector('.lectura-counter');
                if (counterSpan) {
                    let count = parseInt(counterSpan.textContent, 10);
                    count = (count + 1) % 6; // Cycle 0-5
                    counterSpan.textContent = String(count);
                    lecturaCell.classList.toggle('lectura-filled', count > 0);
                    updateAllTotals();
                    saveState();
                }
                return; // Stop further processing
            }
        }

        // --- Handle other specific clicks that were not handled above ---

        const sectionHeader = target.closest('.section-header-row');
        if (sectionHeader && !target.closest('.note-icon') && !target.closest('.section-icon-container') && !target.closest('.delete-section-links-btn')) {
            const sectionName = sectionHeader.dataset.sectionHeader;
            toggleSection(sectionName);
            saveState();
            return;
        }

        const confidenceDot = target.closest('.confidence-dot');
        if (confidenceDot) {
            e.stopPropagation();
            let level = parseInt(confidenceDot.dataset.confidenceLevel || '0', 10);
            level = (level + 1) % 4; // Cycles 0 -> 1 -> 2 -> 3 -> 0
            confidenceDot.dataset.confidenceLevel = String(level);
            applyFiltersAndSearch();
            saveState();
            return;
        }

        const noteIcon = target.closest('.note-icon');
        if (noteIcon) {
            e.stopPropagation();
            activeNoteIcon = noteIcon;
            let topicTitle = '';
            let defaultTooltip = '';
            const noteData = activeNoteIcon.dataset.note || '';

            if (activeNoteIcon.classList.contains('section-note-icon')) {
                const sectionHeaderEl = activeNoteIcon.closest('.section-header-row');
                topicTitle = `Notas para: ${sectionHeaderEl?.querySelector('.section-title')?.textContent || 'Sección'}`;
                defaultTooltip = 'Notas de la sección';
            } else {
                const row = activeNoteIcon.closest('tr');
                const topicText = row?.querySelector('.topic-text')?.textContent || 'Tema';
                const noteType = activeNoteIcon.dataset.noteType;
                topicTitle = `${noteType === 'grey' ? 'Esquema' : 'Desarrollo'} para: ${topicText}`;
                defaultTooltip = noteType === 'grey' ? 'Esquema' : 'Desarrollo';
            }
            
            notesModalTitle.textContent = topicTitle;
            const content = loadNote(activeNoteIcon, noteData, defaultTooltip);
            notesEditor.innerHTML = content || ''; // Ensure it's never undefined
            openModal(notesModal);
            notesEditor.focus();
            return;
        }

        const editLinkIcon = target.closest('.edit-link-icon');
        if (editLinkIcon) {
            e.stopPropagation();
            activeLinkCell = editLinkIcon.closest('td');
            if (activeLinkCell) {
                const linkAnchor = activeLinkCell.querySelector('.link-anchor');
                const currentHref = linkAnchor.getAttribute('href');
                linkInput.value = (currentHref && currentHref !== '#') ? currentHref : '';
                openLinkPreviewBtn.href = linkInput.value || '#';
                openModal(linkModal);
                linkInput.focus();
            }
            return;
        }

        const deleteLinksBtn = target.closest('.delete-section-links-btn');
        if (deleteLinksBtn) {
            e.stopPropagation();
            const headerRow = deleteLinksBtn.closest('.section-header-row');
            if (!headerRow) return;

            const sectionName = headerRow.dataset.sectionHeader;
            if (confirm(`¿Estás seguro de que quieres eliminar todos los hipervínculos de esta sección? Esta acción no se puede deshacer.`)) {
                const sectionRows = document.querySelectorAll(`tr[data-section="${sectionName}"]`);
                sectionRows.forEach(row => {
                    row.querySelectorAll('.fillable-cell').forEach(cell => {
                        const linkAnchor = cell.querySelector('a.link-anchor');
                        if (linkAnchor) {
                            linkAnchor.href = '#';
                            linkAnchor.style.display = 'none';
                        }
                    });
                });
                saveState();
            }
            return;
        }
    });

    linkInput.addEventListener('input', () => {
        openLinkPreviewBtn.href = linkInput.value || '#';
    });

    // --- Editor Logic ---
    function setupEditorToolbar() {
        const textColorPaletteHTML = `
            <div class="color-palette" title="Color de Texto">
                <button data-command="foreColor" data-color="#EF4444" class="color-swatch" style="background-color: #EF4444;"></button>
                <button data-command="foreColor" data-color="#3B82F6" class="color-swatch" style="background-color: #3B82F6;"></button>
                <button data-command="foreColor" data-color="#22C55E" class="color-swatch" style="background-color: #22C55E;"></button>
                <div class="custom-color-picker">
                    <input type="color" data-command="foreColor" list="text-custom-colors">
                    <datalist id="text-custom-colors">
                        <option>#ef4444</option><option>#f97316</option><option>#f59e0b</option><option>#eab308</option>
                        <option>#84cc16</option><option>#22c55e</option><option>#10b981</option><option>#14b8a6</option>
                        <option>#06b6d4</option><option>#0ea5e9</option><option>#3b82f6</option><option>#6366f1</option>
                        <option>#8b5cf6</option><option>#a855f7</option><option>#d946ef</option><option>#ec4899</option>
                    </datalist>
                </div>
            </div>
        `;

        const highlightColorPaletteHTML = `
            <div class="color-palette" title="Resaltar Texto">
                <button data-command="hiliteColor" data-color="#FEF08A" class="color-swatch" style="background-color: #FEF08A;"></button>
                <button data-command="hiliteColor" data-color="#BAE6FD" class="color-swatch" style="background-color: #BAE6FD;"></button>
                <button data-command="hiliteColor" data-color="#FECACA" class="color-swatch" style="background-color: #FECACA;"></button>
                <div class="custom-color-picker">
                    <input type="color" data-command="hiliteColor" list="highlight-custom-colors">
                    <datalist id="highlight-custom-colors">
                        <option>#fef08a</option><option>#d9f99d</option><option>#a7f3d0</option><option>#a5f3fc</option>
                        <option>#bae6fd</option><option>#c7d2fe</option><option>#e9d5ff</option><option>#fbcfe8</option>
                        <option>#fecaca</option><option>#fed7aa</option><option>#fde68a</option><option>#bbf7d0</option>
                        <option>#99f6e4</option><option>#a5f3fc</option><option>#bfdbfe</option><option>#ddd6fe</option>
                    </datalist>
                </div>
            </div>
        `;

        editorToolbar.innerHTML = `
            <div class="relative">
                <select id="font-size-selector" class="appearance-none w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-sm rounded-md py-1.5 pl-2 pr-8 focus:outline-none focus:ring-2 focus:ring-sky-400" title="Tamaño de Fuente">
                    <option value="1">Muy Pequeño</option>
                    <option value="2">Pequeño</option>
                    <option value="3" selected>Normal</option>
                    <option value="5">Grande</option>
                    <option value="7">Muy Grande</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                    <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
            <button data-command="bold" title="Negrita" class="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><b>B</b></button>
            <button data-command="italic" title="Cursiva" class="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><i>I</i></button>
            <button data-command="underline" title="Subrayado" class="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><u>U</u></button>
            <div class="h-5 border-l border-gray-300 dark:border-gray-600 mx-1"></div>
            ${textColorPaletteHTML}
            ${highlightColorPaletteHTML}
            <div class="h-5 border-l border-gray-300 dark:border-gray-600 mx-1"></div>
            <button data-command="indent" title="Aumentar Sangría" class="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" /><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 8.25L19.5 12m0 0l-3.75 3.75M19.5 12H3.75" /></svg></button>
            <button data-command="outdent" title="Disminuir Sangría" class="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 8.25L4.5 12m0 0l3.75 3.75M4.5 12h15" /></svg></button>
            <button data-command="insertUnorderedList" class="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700" title="Viñetas"><svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 15.25z" clip-rule="evenodd" /></svg></button>
            <div class="h-5 border-l border-gray-300 dark:border-gray-600 mx-1"></div>
            <button data-command="insertImage" title="Insertar Imagen desde URL" class="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M1 5.25A2.25 2.25 0 013.25 3h13.5A2.25 2.25 0 0119 5.25v9.5A2.25 2.25 0 0116.75 17H3.25A2.25 2.25 0 011 14.75v-9.5zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 00.75-.75v-2.69l-2.22-2.219a.75.75 0 00-1.06 0l-1.91 1.909a.75.75 0 01-1.06 0l-2.22-2.22a.75.75 0 00-1.06 0l-2.22 2.22a.75.75 0 01-1.06 0l-1.53-1.531a.75.75 0 00-1.06 0zM5 7a1 1 0 11-2 0 1 1 0 012 0z" clip-rule="evenodd" /></svg></button>
            <button id="increase-image-btn" title="Aumentar Tamaño de Imagen" class="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed" disabled><svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg></button>
            <button id="decrease-image-btn" title="Disminuir Tamaño de Imagen" class="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed" disabled><svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clip-rule="evenodd" /></svg></button>
            <div class="h-5 border-l border-gray-300 dark:border-gray-600 mx-1"></div>
            <button id="improve-text-btn" class="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700" title="Mejorar texto con IA">✨</button>
            <button id="print-note-btn" class="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700" title="Imprimir/PDF"><svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6 18.25m0 0a2.25 2.25 0 002.25 2.25h5.5A2.25 2.25 0 0016 18.25m-1.75-4.421l-1.44-1.44a1.5 1.5 0 00-2.12 0l-1.44 1.44m11.316 0a48.426 48.426 0 01-11.316 0m11.316 0V7.5A2.25 2.25 0 0018 5.25h-5.5a2.25 2.25 0 00-2.25 2.25v.632m1.38-2.886A2.252 2.252 0 0110.5 3h3a2.252 2.252 0 012.12 1.5Z" /></svg></button>
            `;
        
        editorToolbar.addEventListener('mousedown', e => {
            if (e.target.tagName !== 'SELECT' && e.target.parentElement.tagName !== 'SELECT') {
                 e.preventDefault();
            }
        });

        editorToolbar.querySelector('#font-size-selector').addEventListener('change', (e) => {
            const size = e.target.value;
            notesEditor.focus();
            document.execCommand('fontSize', false, size);
        });

        editorToolbar.addEventListener('click', (e) => {
            const button = e.target.closest('button[data-command]');
            if (button) {
                const command = button.dataset.command;
                const color = button.dataset.color;
                
                if (command === 'insertImage') {
                    const url = prompt('Ingresa la URL de la imagen:');
                    if (url) document.execCommand('insertImage', false, url);
                } else if (command === 'foreColor' || command === 'hiliteColor') {
                    if (color) document.execCommand(command, false, color);
                } else {
                    document.execCommand(command, false, null);
                }
                notesEditor.focus();
            } else {
                const printButton = e.target.closest('#print-note-btn');
                if(printButton) printCurrentNote();
                
                const improveButton = e.target.closest('#improve-text-btn');
                if(improveButton) improveTextWithAI();
            }
        });

        editorToolbar.querySelectorAll('input[type="color"]').forEach(picker => {
            picker.addEventListener('input', (e) => {
                const command = e.target.dataset.command;
                const value = e.target.value;
                document.execCommand(command, false, value);
                notesEditor.focus();
            });
        });
        
        const increaseImageBtn = editorToolbar.querySelector('#increase-image-btn');
        const decreaseImageBtn = editorToolbar.querySelector('#decrease-image-btn');
        const imageSizePresets = ['25%', '50%', '75%', '100%'];
        
        notesEditor.addEventListener('click', (e) => {
            if (selectedImageForResize) {
                selectedImageForResize.classList.remove('selected-for-resize');
            }
        
            if (e.target.tagName === 'IMG') {
                selectedImageForResize = e.target;
                increaseImageBtn.disabled = false;
                decreaseImageBtn.disabled = false;
                selectedImageForResize.classList.add('selected-for-resize');
            } else {
                selectedImageForResize = null;
                increaseImageBtn.disabled = true;
                decreaseImageBtn.disabled = true;
            }
        });
        
        function resizeImage(direction) {
            if (!selectedImageForResize) return;
            const currentWidth = selectedImageForResize.style.width || '100%';
            const currentIndex = imageSizePresets.indexOf(currentWidth);
            let nextIndex = currentIndex;
            
            if (direction === 'increase') {
                nextIndex = (currentIndex < imageSizePresets.length - 1) ? currentIndex + 1 : currentIndex;
            } else { // decrease
                nextIndex = (currentIndex > 0) ? currentIndex - 1 : currentIndex;
            }

            selectedImageForResize.style.width = imageSizePresets[nextIndex];
            selectedImageForResize.style.height = 'auto';
        }

        increaseImageBtn.addEventListener('click', () => resizeImage('increase'));
        decreaseImageBtn.addEventListener('click', () => resizeImage('decrease'));
    }

    async function improveTextWithAI() {
        const selection = window.getSelection();
        const textToImprove = (selection && selection.toString().trim().length > 0) 
            ? selection.toString() 
            : stripHtml(notesEditor.innerHTML);

        if (!textToImprove.trim()) {
            alert('No hay texto para mejorar. Selecciona texto o escribe algo en el editor.');
            return;
        }

        const originalContent = notesEditor.innerHTML;
        notesEditor.innerHTML += '<p class="text-purple-500 animate-pulse mt-2">Mejorando texto con IA...</p>';

        const prompt = `Reformula y mejora el siguiente texto para que sea más claro, conciso y profesional, manteniendo el significado original. Devuelve solo el texto mejorado en formato HTML simple (usa <strong>, <em>, <ul>, <li>). Texto original:\n\n${textToImprove}`;

        try {
            const improvedText = await callGemini(prompt);
            if (improvedText) {
                 if (selection && selection.rangeCount > 0 && selection.toString().trim().length > 0) {
                    const range = selection.getRangeAt(0);
                    range.deleteContents();
                    const newContent = document.createRange().createContextualFragment(improvedText);
                    range.insertNode(newContent);
                 } else {
                    notesEditor.innerHTML = improvedText;
                 }
            } else {
                notesEditor.innerHTML = originalContent;
                alert('La IA no pudo mejorar el texto.');
            }
        } catch (e) {
            notesEditor.innerHTML = originalContent; // Restore original content on error
            alert('Error al contactar la IA para mejorar el texto.');
            console.error(e);
        }
    }
    
    function saveCurrentNote() {
        if (!activeNoteIcon) return;

        const content = notesEditor.innerHTML;
        const noteObject = { content, lastModified: new Date().toISOString() };
        const noteData = JSON.stringify(noteObject);

        let baseTitle = 'Nota';
        if(activeNoteIcon.classList.contains('section-note-icon')) {
            baseTitle = 'Notas de sección';
        } else if(activeNoteIcon.dataset.noteType === 'grey') {
            baseTitle = 'Esquema';
        } else if (activeNoteIcon.dataset.noteType === 'blue') {
            baseTitle = 'Desarrollo';
        }

        activeNoteIcon.dataset.note = noteData;
        const hasContent = content && content.trim() !== '' && content.trim() !== '<p><br></p>';

        if (hasContent) {
            activeNoteIcon.classList.add('has-note');
            const d = new Date(noteObject.lastModified);
            const formattedDate = d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
            activeNoteIcon.title = `${baseTitle} (Modificado: ${formattedDate})`;
        } else {
            activeNoteIcon.classList.remove('has-note');
            activeNoteIcon.title = baseTitle;
            activeNoteIcon.dataset.note = '';
        }
        
        saveState();
        
        const saveConfirmation = document.getElementById('save-confirmation');
        if (saveConfirmation) {
            saveConfirmation.style.opacity = '1';
            setTimeout(() => {
                saveConfirmation.style.opacity = '0';
            }, 2000);
        }
    }
    
    saveNoteBtn.addEventListener('click', saveCurrentNote);

    saveAndCloseNoteBtn.addEventListener('click', () => {
        saveCurrentNote();
        closeModal(notesModal);
    });

    cancelNoteBtn.addEventListener('click', () => {
        closeModal(notesModal);
    });
    
    unmarkNoteBtn.addEventListener('click', () => {
        if (!activeNoteIcon) return;
        if (confirm('¿Estás seguro? Se borrará el contenido de la nota y se desmarcará el ícono.')) {
            notesEditor.innerHTML = '';
            saveCurrentNote();
            closeModal(notesModal);
        }
    });

    copyNoteTextBtn.addEventListener('click', () => {
        const textToCopy = stripHtml(notesEditor.innerHTML);
        navigator.clipboard.writeText(textToCopy).then(() => {
            alert('Texto de la nota copiado al portapapeles.');
        }).catch(err => {
            console.error('Error al copiar texto: ', err);
        });
    });

    // --- Link Modal Handlers ---

    saveLinkBtn.addEventListener('click', () => {
        if (activeLinkCell) {
            const linkAnchor = activeLinkCell.querySelector('a.link-anchor');
            const url = linkInput.value.trim();
            if (url) {
                linkAnchor.href = url;
                linkAnchor.style.display = 'inline-flex';
            } else {
                linkAnchor.href = '#';
                linkAnchor.style.display = 'none';
            }
            saveState();
            closeModal(linkModal);
        }
    });
    
    cancelLinkBtn.addEventListener('click', () => closeModal(linkModal));
    
    // --- State Persistence ---
    function saveState() {
        const state = {
            cells: {},
            lectura: {},
            notes: {},
            sectionNotes: {},
            confidence: {},
            collapsedSections: [],
            theme: document.documentElement.dataset.theme || 'default',
            iconStyle: document.documentElement.dataset.iconStyle || 'solid',
            sectionIcons: {},
            headerTitles: {}
        };
        
        document.querySelectorAll('tr[data-section]').forEach((row, index) => {
            const rowId = `row-${index}`;
            const cellsInRow = row.querySelectorAll('td.fillable-cell');
            cellsInRow.forEach(cell => {
                const col = cell.dataset.col;
                const cellId = `${rowId}-col-${col}`;
                const link = cell.querySelector('a.link-anchor')?.getAttribute('href');
                state.cells[cellId] = {
                    status: cell.dataset.status,
                    link: (link && link !== '#') ? link : null
                };
            });
            
            const lecturaCell = row.querySelector('.lectura-cell');
            if (lecturaCell) {
                const counter = lecturaCell.querySelector('.lectura-counter')?.textContent;
                state.lectura[rowId] = counter || '0';
            }

            const noteIcons = row.querySelectorAll('.note-icon');
            noteIcons.forEach(icon => {
                const noteType = icon.dataset.noteType;
                const noteId = `${rowId}-note-${noteType}`;
                if (icon.dataset.note) {
                    state.notes[noteId] = icon.dataset.note;
                }
            });

            const confidenceDot = row.querySelector('.confidence-dot');
            if (confidenceDot) {
                state.confidence[rowId] = confidenceDot.dataset.confidenceLevel || '0';
            }
        });

        document.querySelectorAll('.section-header-row').forEach(headerRow => {
            const sectionName = headerRow.dataset.sectionHeader;
            const noteIcon = headerRow.querySelector('.section-note-icon');
            if (noteIcon && noteIcon.dataset.note) {
                state.sectionNotes[sectionName] = noteIcon.dataset.note;
            }
            if (headerRow.classList.contains('collapsed')) {
                state.collapsedSections.push(sectionName);
            }
            const iconContainer = headerRow.querySelector('.section-icon-container');
            if (iconContainer && iconContainer.dataset.iconName) {
                state.sectionIcons[sectionName] = iconContainer.dataset.iconName;
            }
        });

        document.querySelectorAll('thead th[contenteditable="true"]').forEach((th, index) => {
            state.headerTitles[`header-${index}`] = th.textContent;
        });

        localStorage.setItem('medicinaInternaProgress', JSON.stringify(state));
    }

    function loadState() {
        const savedStateJSON = localStorage.getItem('medicinaInternaProgress');
        if (!savedStateJSON) {
            updateAllTotals();
            updateSectionHeaderCounts();
            return;
        }
        const state = JSON.parse(savedStateJSON);

        document.querySelectorAll('tr[data-section]').forEach((row, index) => {
            const rowId = `row-${index}`;
            const cellsInRow = row.querySelectorAll('td.fillable-cell');
            cellsInRow.forEach(cell => {
                const col = cell.dataset.col;
                const cellId = `${rowId}-col-${col}`;
                const cellState = state.cells?.[cellId];
                if (cellState) {
                    cell.dataset.status = cellState.status;
                    cell.classList.remove('filled', 'not-done');
                    if (cellState.status !== 'default') {
                         cell.classList.add(cellState.status);
                    }
                    const linkAnchor = cell.querySelector('a.link-anchor');
                    if (linkAnchor && cellState.link) {
                        linkAnchor.href = cellState.link;
                        linkAnchor.style.display = 'inline-flex';
                    } else if (linkAnchor) {
                        linkAnchor.style.display = 'none';
                    }
                }
            });

            if (state.lectura && state.lectura[rowId]) {
                const lecturaCell = row.querySelector('.lectura-cell');
                if(lecturaCell){
                    lecturaCell.querySelector('.lectura-counter').textContent = state.lectura[rowId];
                    lecturaCell.classList.toggle('lectura-filled', parseInt(state.lectura[rowId], 10) > 0);
                }
            }
            
            row.querySelectorAll('.note-icon').forEach(icon => {
                const noteType = icon.dataset.noteType;
                const noteId = `${rowId}-note-${noteType}`;
                const noteData = state.notes?.[noteId];
                if (noteData) {
                    let defaultTitle = noteType === 'grey' ? 'Esquema' : 'Desarrollo';
                    loadNote(icon, noteData, defaultTitle);
                }
            });

            const confidence = state.confidence?.[rowId];
            if (confidence) {
                const dot = row.querySelector('.confidence-dot');
                if (dot) dot.dataset.confidenceLevel = confidence;
            }
        });

        document.querySelectorAll('.section-header-row').forEach(headerRow => {
            const sectionName = headerRow.dataset.sectionHeader;
            const noteData = state.sectionNotes?.[sectionName];
            if (noteData) {
                const noteIcon = headerRow.querySelector('.section-note-icon');
                loadNote(noteIcon, noteData, 'Notas de sección');
            }
            if (state.collapsedSections?.includes(sectionName)) {
                toggleSection(sectionName, true); // force collapse without saving
            }
            const iconName = state.sectionIcons?.[sectionName];
            if (iconName && ICONS[iconName]) {
                 const iconContainer = headerRow.querySelector('.section-icon-container');
                 iconContainer.innerHTML = ICONS[iconName];
                 iconContainer.dataset.iconName = iconName;
            }
        });
        
        if (state.theme) {
            setTheme(state.theme);
        }
        if (state.iconStyle) {
            setIconStyle(state.iconStyle);
        }

        if (state.headerTitles) {
            document.querySelectorAll('thead th[contenteditable="true"]').forEach((th, index) => {
                if (state.headerTitles[`header-${index}`]) {
                    th.textContent = state.headerTitles[`header-${index}`];
                }
            });
        }

        updateAllTotals();
        updateSectionHeaderCounts();
        applyFiltersAndSearch(); // Apply filters on load
    }

    // --- Search and Filter ---
    function applyFiltersAndSearch() {
        const searchTerm = searchBar.value.toLowerCase().trim();
        let visibleCount = 0;

        document.querySelectorAll('tr[data-section]').forEach(row => {
            const topicText = row.querySelector('.topic-text').textContent.toLowerCase();
            const confidenceDot = row.querySelector('.confidence-dot');
            const confidenceLevel = confidenceDot ? confidenceDot.dataset.confidenceLevel : '0';

            const searchMatch = topicText.includes(searchTerm);
            const filterMatch = activeConfidenceFilter === 'all' || confidenceLevel === activeConfidenceFilter;

            if (searchMatch && filterMatch) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });
    }

    searchBar.addEventListener('input', applyFiltersAndSearch);
    
    confidenceFiltersContainer.addEventListener('click', (e) => {
        const filterBtn = e.target.closest('.filter-btn');
        if (!filterBtn) return;
        
        confidenceFiltersContainer.querySelector('.active').classList.remove('active');
        filterBtn.classList.add('active');
        activeConfidenceFilter = filterBtn.dataset.filter;
        applyFiltersAndSearch();
    });

    // --- Import/Export ---
    exportBtn.addEventListener('click', () => {
        const stateJSON = localStorage.getItem('medicinaInternaProgress');
        if (!stateJSON) {
            alert('No hay progreso para exportar.');
            return;
        }
        const blob = new Blob([stateJSON], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const date = new Date().toISOString().slice(0, 10);
        a.download = `progreso_medicina_${date}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    importBtn.addEventListener('click', () => importFileInput.click());
    importFileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedState = JSON.parse(e.target.result);
                // Basic validation
                if (importedState && typeof importedState === 'object' && importedState.cells) {
                    if (confirm('¿Importar datos? Esto sobreescribirá tu progreso actual.')) {
                        localStorage.setItem('medicinaInternaProgress', JSON.stringify(importedState));
                        window.location.reload();
                    }
                } else {
                    alert('Archivo inválido o corrupto.');
                }
            } catch (error) {
                alert('Error al leer el archivo. Asegúrate de que es un archivo de exportación válido.');
                console.error(error);
            } finally {
                importFileInput.value = ''; // Reset input
            }
        };
        reader.readAsText(file);
    });
    
    // --- AI Functionality ---
    async function callGemini(prompt) {
        if (!API_KEY) {
            throw new Error("API key not configured.");
        }
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-04-17',
            contents: prompt,
        });
        return response.text;
    }

    function gatherAllNotes() {
        let allContent = "";
        document.querySelectorAll('tr[data-section]').forEach(row => {
            const topic = row.querySelector('.topic-text')?.textContent.trim();
            if (topic) {
                allContent += `\n\n## Tema: ${topic}\n`;
            }

            row.querySelectorAll('.note-icon').forEach(icon => {
                const noteData = icon.dataset.note;
                if (noteData) {
                    try {
                        const parsedNote = JSON.parse(noteData);
                        const noteContent = stripHtml(parsedNote.content);
                        if (noteContent.trim()) {
                            const type = icon.dataset.noteType === 'grey' ? 'Esquema' : 'Desarrollo';
                            allContent += `### ${type}:\n${noteContent}\n`;
                        }
                    } catch (e) { /* ignore parse error */ }
                }
            });
        });

        document.querySelectorAll('.section-header-row').forEach(header => {
            const sectionName = header.querySelector('.section-title')?.textContent.trim();
            if (sectionName) {
                allContent += `\n\n## Notas de Sección: ${sectionName}\n`;
            }
            const icon = header.querySelector('.section-note-icon');
            if (icon && icon.dataset.note) {
                 try {
                        const parsedNote = JSON.parse(icon.dataset.note);
                        const noteContent = stripHtml(parsedNote.content);
                        if (noteContent.trim()) {
                            allContent += `${noteContent}\n`;
                        }
                    } catch (e) { /* ignore parse error */ }
            }
        });
        return allContent;
    }

    askAiBtn.addEventListener('click', () => {
        aiResponseArea.innerHTML = '<p class="text-muted">Haz una pregunta sobre tus notas y la IA buscará la respuesta en todo el temario.</p>';
        aiQuestionInput.value = '';
        aiQaLoader.classList.add('hidden');
        openModal(aiQaModal);
    });

    cancelAiQaBtn.addEventListener('click', () => closeModal(aiQaModal));
    
    sendAiQaBtn.addEventListener('click', async () => {
        const question = aiQuestionInput.value.trim();
        if (!question) return;

        aiQaLoader.classList.remove('hidden');
        aiResponseArea.innerHTML = '';
        sendAiQaBtn.disabled = true;

        try {
            if (!API_KEY) {
                throw new Error("API_KEY not configured for AI features.");
            }
            const context = gatherAllNotes();
            const prompt = `Basado en el siguiente contenido de estudio de medicina interna, responde a la pregunta del usuario. Proporciona una respuesta clara y concisa en formato HTML simple. Si no encuentras la respuesta, indica que no se encontró información sobre ese tema en las notas.\n\nContexto:\n${context}\n\nPregunta: ${question}`;
            
            const answer = await callGemini(prompt);
            aiResponseArea.innerHTML = answer;

        } catch (error) {
            console.error("AI Error:", error);
            aiResponseArea.innerHTML = `<p class="text-red-500">Error: No se pudo conectar con el servicio de IA. Verifica tu clave de API y la conexión a internet.</p>`;
        } finally {
            aiQaLoader.classList.add('hidden');
            sendAiQaBtn.disabled = false;
        }
    });

    // --- Section Collapse/Expand ---
    function toggleSection(sectionName, forceCollapse = false) {
        const sectionRows = document.querySelectorAll(`tr[data-section="${sectionName}"]`);
        const headerRow = sections[sectionName].headerRow;
        const totalRow = sections[sectionName].totalRow;

        const isCollapsed = headerRow.classList.contains('collapsed');

        if (forceCollapse || !isCollapsed) {
             headerRow.classList.add('collapsed');
             sectionRows.forEach(r => r.style.display = 'none');
             totalRow.style.display = 'none';
        } else {
             headerRow.classList.remove('collapsed');
             // We use applyFiltersAndSearch to restore rows, respecting current search/filter
             applyFiltersAndSearch();
             totalRow.style.display = '';
        }
    }
    
    // --- Utility Functions ---
    function stripHtml(html){
       let doc = new DOMParser().parseFromString(html, 'text/html');
       return doc.body.textContent || "";
    }
    
    function printCurrentNote() {
        const printArea = getElem('print-area');
        const title = notesModalTitle.textContent;
        const content = notesEditor.innerHTML;
        printArea.innerHTML = `<h1 style="font-family: sans-serif; font-size: 24px; margin-bottom: 20px;">${title}</h1><div style="font-family: sans-serif; line-height: 1.6;">${content}</div>`;
        window.print();
        printArea.innerHTML = '';
    }

    // --- Settings, Themes & Styles ---
    function setTheme(themeName) {
        document.documentElement.setAttribute('data-theme', themeName);
        saveState();
    }
    
    function setIconStyle(styleName) {
        document.documentElement.setAttribute('data-icon-style', styleName);
        saveState();
    }

    settingsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        settingsDropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
        if (!settingsBtn.contains(e.target) && !settingsDropdown.contains(e.target)) {
            settingsDropdown.classList.add('hidden');
        }
    });

    settingsDropdown.addEventListener('click', (e) => {
        e.preventDefault();
        const themeOption = e.target.closest('.theme-option');
        if (themeOption) {
            setTheme(themeOption.dataset.theme);
        }
        const iconOption = e.target.closest('.icon-style-option');
        if (iconOption) {
            setIconStyle(iconOption.dataset.style);
        }
    });
    
    document.querySelectorAll('thead th[contenteditable="true"]').forEach(th => {
        th.addEventListener('blur', saveState);
    });

    // --- Section Icon Picker ---
    function populateIconPicker() {
        iconPickerGrid.innerHTML = '';
        Object.keys(ICONS).forEach(iconName => {
            const item = document.createElement('div');
            item.className = 'icon-picker-item';
            item.dataset.iconName = iconName;
            item.innerHTML = ICONS[iconName];
            item.title = iconName;
            iconPickerGrid.appendChild(item);
        });
    }

    tableBody.addEventListener('click', (e) => {
        const iconContainer = e.target.closest('.section-icon-container');
        if (iconContainer) {
            e.stopPropagation();
            activeSectionIconContainer = iconContainer;
            openModal(iconPickerModal);
        }
    });

    iconPickerGrid.addEventListener('click', (e) => {
        const iconItem = e.target.closest('.icon-picker-item');
        if (iconItem && activeSectionIconContainer) {
            const iconName = iconItem.dataset.iconName;
            activeSectionIconContainer.innerHTML = ICONS[iconName];
            activeSectionIconContainer.dataset.iconName = iconName;
            saveState();
            closeModal(iconPickerModal);
        }
    });

    closeIconPickerBtn.addEventListener('click', () => closeModal(iconPickerModal));


    // --- Initialization ---
    function initializeApp() {
        initializeCells();
        populateIconPicker();
        document.querySelectorAll('.section-icon-container').forEach(container => {
            const sectionName = container.closest('.section-header-row').dataset.sectionHeader;
            const iconKey = Object.keys(ICONS).find(k => k === sectionName) || 'default';
            container.innerHTML = ICONS[iconKey];
            container.dataset.iconName = iconKey;
        });
        setupEditorToolbar();
        loadState();
        if (!API_KEY) {
            askAiBtn.disabled = true;
            askAiBtn.title = 'Se necesita una clave API para usar las funciones de IA';
            askAiBtn.classList.add('opacity-50', 'cursor-not-allowed');
            getElem('improve-text-btn').style.display = 'none';
        }
    }
    
    initializeApp();

});
