import React, { useState } from 'react';
import { Button } from '../../../components/ui';

// Interactive Rich Text Toolbar
function RichTextToolbar({ onAction = () => {} }) {
    return (
        <div className="flex items-center gap-0.5 border-b border-subtle bg-surface-sunken/40 px-2 py-1.5 rounded-t-xl overflow-x-auto custom-scrollbar">
            <button type="button" onClick={() => onAction('bold')} className="h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors" title="Kalın (Ctrl+B)">
                <i className="fa-solid fa-bold text-xs" />
            </button>
            <button type="button" onClick={() => onAction('italic')} className="h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors" title="İtalik (Ctrl+I)">
                <i className="fa-solid fa-italic text-xs" />
            </button>
            <button type="button" onClick={() => onAction('underline')} className="h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors" title="Altı Çizili (Ctrl+U)">
                <i className="fa-solid fa-underline text-xs" />
            </button>
            <button type="button" onClick={() => onAction('strikethrough')} className="h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors" title="Üstü Çizili">
                <i className="fa-solid fa-strikethrough text-xs" />
            </button>

            <div className="h-4 w-px bg-subtle mx-1 shrink-0" />

            <button type="button" onClick={() => onAction('bullet')} className="h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors" title="Madde İşaretli Liste">
                <i className="fa-solid fa-list-ul text-xs" />
            </button>
            <button type="button" onClick={() => onAction('numbered')} className="h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors" title="Numaralı Liste">
                <i className="fa-solid fa-list-ol text-xs" />
            </button>
            <button type="button" onClick={() => onAction('align-left')} className="h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors" title="Sola Hizala">
                <i className="fa-solid fa-align-left text-xs" />
            </button>

            <div className="h-4 w-px bg-subtle mx-1 shrink-0" />

            <button type="button" onClick={() => onAction('link')} className="h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors" title="Bağlantı Ekle">
                <i className="fa-solid fa-link text-xs" />
            </button>
            <button type="button" onClick={() => onAction('image')} className="h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors" title="Görsel Ekle">
                <i className="fa-regular fa-image text-xs" />
            </button>
            <button type="button" onClick={() => onAction('table')} className="h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors" title="Tablo Ekle">
                <i className="fa-solid fa-table-cells text-xs" />
            </button>
            <button type="button" onClick={() => onAction('mention')} className="h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors" title="Kişi Bahset (@)">
                <i className="fa-solid fa-at text-xs" />
            </button>
        </div>
    );
}

export function TaskGeneralTabV3({ task = {}, onFieldChange = () => {} }) {
    // 1. Açıklama State
    const [desc, setDesc] = useState(
        task.description || 'Önce medine sonra mekke 60 kişilik detaylar dosyada belirtilmiş ve otel rezervasyonları yapılmıştır.'
    );

    // 2. Kontrol Listesi State
    const [checklist, setChecklist] = useState([
        { id: 1, text: 'Otel listesi oluşturuldu', done: true },
        { id: 2, text: 'Fiyat teklifleri alındı', done: true },
        { id: 3, text: 'Sözleşme taslağı hazırlandı', done: true },
        { id: 4, text: 'Sözleşme imzalandı', done: true }
    ]);
    const [isChecklistOpen, setIsChecklistOpen] = useState(true);
    const [newChecklistText, setNewChecklistText] = useState('');
    const [isAddingChecklist, setIsAddingChecklist] = useState(false);

    const toggleChecklistItem = (id) => {
        setChecklist(prev => prev.map(item => 
            item.id === id ? { ...item, done: !item.done } : item
        ));
    };

    const handleAddChecklist = (e) => {
        if (e.key === 'Enter' || e.type === 'blur') {
            const trimmed = newChecklistText.trim();
            if (trimmed) {
                setChecklist(prev => [...prev, { id: Date.now(), text: trimmed, done: false }]);
            }
            setNewChecklistText('');
            setIsAddingChecklist(false);
        }
    };

    const removeChecklistItem = (id) => {
        setChecklist(prev => prev.filter(item => item.id !== id));
    };

    const completedCount = checklist.filter(c => c.done).length;

    // 3. Yorumlar State
    const [comments, setComments] = useState([
        {
            id: 1,
            author: 'Elif A.',
            avatar: 'https://ui-avatars.com/api/?name=Elif+A&background=ec4899&color=fff&size=64',
            date: '10.07.2026 09:30',
            text: '@Yakup B. Sözleşme dosyası güncellendi, kontrol eder misiniz?',
            likes: 2,
            hasLiked: false
        }
    ]);
    const [newComment, setNewComment] = useState('');
    const [isCommentsOpen, setIsCommentsOpen] = useState(true);

    const handleSendComment = (e) => {
        e.preventDefault();
        const trimmed = newComment.trim();
        if (!trimmed) return;

        const newEntry = {
            id: Date.now(),
            author: 'Yakup B.',
            avatar: 'https://ui-avatars.com/api/?name=Yakup+B&background=6366f1&color=fff&size=64',
            date: 'Şimdi',
            text: trimmed,
            likes: 0,
            hasLiked: false
        };

        setComments([newEntry, ...comments]);
        setNewComment('');
    };

    const toggleLike = (id) => {
        setComments(prev => prev.map(c => {
            if (c.id === id) {
                const nextLiked = !c.hasLiked;
                return {
                    ...c,
                    hasLiked: nextLiked,
                    likes: nextLiked ? c.likes + 1 : c.likes - 1
                };
            }
            return c;
        }));
    };

    return (
        <div className="flex flex-col gap-6">
            
            {/* 1. Açıklama Kartı */}
            <section className="flex flex-col gap-2.5">
                <h2 className="text-[14px] font-bold text-text-primary">Açıklama</h2>
                <div className="rounded-xl border border-subtle bg-surface-base focus-within:border-primary focus-within:shadow-focus transition-all overflow-hidden shadow-xs">
                    <RichTextToolbar />
                    <textarea 
                        className="w-full min-h-[110px] p-4 text-[14px] leading-relaxed text-text-primary bg-transparent focus:outline-none resize-y"
                        value={desc}
                        onChange={(e) => {
                            setDesc(e.target.value);
                            onFieldChange('description', e.target.value);
                        }}
                        placeholder="Bu görevin detayları nelerdir? (@kişi, #etiket)..."
                    />
                </div>
            </section>

            {/* 2. Kontrol Listesi Kartı */}
            <section className="flex flex-col rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs transition-all">
                <div 
                    onClick={() => setIsChecklistOpen(!isChecklistOpen)}
                    className="flex items-center justify-between cursor-pointer select-none group"
                >
                    <div className="flex items-center gap-3">
                        <h2 className="text-[14px] font-bold text-text-primary group-hover:text-primary transition-colors">
                            Kontrol Listesi
                        </h2>
                        {checklist.length > 0 && (
                            <span className="text-xs font-semibold text-text-tertiary bg-surface-sunken px-2 py-0.5 rounded-full">
                                {completedCount}/{checklist.length}
                            </span>
                        )}
                    </div>
                    <button type="button" className="text-text-tertiary group-hover:text-text-primary transition-colors">
                        <i className={`fa-solid fa-chevron-up transition-transform duration-200 ${isChecklistOpen ? '' : 'rotate-180'}`} />
                    </button>
                </div>
                
                {isChecklistOpen && (
                    <div className="mt-4 flex flex-col gap-2.5 animate-in fade-in-50">
                        {/* Progress Bar */}
                        {checklist.length > 0 && (
                            <div className="w-full h-1.5 bg-surface-sunken rounded-full overflow-hidden mb-1">
                                <div 
                                    className="h-full bg-success transition-all duration-300"
                                    style={{ width: `${(completedCount / checklist.length) * 100}%` }}
                                />
                            </div>
                        )}

                        {/* Checklist items */}
                        {checklist.map(item => (
                            <div 
                                key={item.id} 
                                className="group flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-surface-hover/70 transition-colors"
                            >
                                <label className="flex items-center gap-3 cursor-pointer select-none flex-1 min-w-0">
                                    <input 
                                        type="checkbox"
                                        checked={item.done}
                                        onChange={() => toggleChecklistItem(item.id)}
                                        className="h-4 w-4 rounded border-subtle text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                                    />
                                    <span className={`text-[13px] transition-all truncate ${
                                        item.done 
                                            ? 'line-through text-text-tertiary font-normal' 
                                            : 'text-text-primary font-medium'
                                    }`}>
                                        {item.text}
                                    </span>
                                </label>

                                <button
                                    type="button"
                                    onClick={() => removeChecklistItem(item.id)}
                                    className="opacity-0 group-hover:opacity-100 text-text-tertiary hover:text-negative transition-all p-1"
                                    title="Maddeyi Sil"
                                >
                                    <i className="fa-solid fa-trash-can text-xs" />
                                </button>
                            </div>
                        ))}

                        {/* Add Item Button & Input */}
                        {isAddingChecklist ? (
                            <div className="flex items-center gap-2 mt-1">
                                <input
                                    autoFocus
                                    type="text"
                                    value={newChecklistText}
                                    onChange={(e) => setNewChecklistText(e.target.value)}
                                    onKeyDown={handleAddChecklist}
                                    onBlur={handleAddChecklist}
                                    placeholder="Yeni kontrol maddesi yazıp Enter'a basın..."
                                    className="w-full h-9 px-3 text-[13px] rounded-lg border border-primary bg-surface-base focus:outline-none"
                                />
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setIsAddingChecklist(true)}
                                className="flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary-hover transition-colors mt-1 px-2 py-1 w-max rounded-lg hover:bg-primary-subtle"
                            >
                                <i className="fa-solid fa-plus text-[11px]" />
                                <span>Yeni madde ekle</span>
                            </button>
                        )}
                    </div>
                )}
            </section>

            {/* 3. Yorumlar & Güncellemeler Kartı */}
            <section className="flex flex-col rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs transition-all">
                <div 
                    onClick={() => setIsCommentsOpen(!isCommentsOpen)}
                    className="flex items-center justify-between cursor-pointer select-none group"
                >
                    <div className="flex items-center gap-2.5">
                        <h2 className="text-[14px] font-bold text-text-primary group-hover:text-primary transition-colors">
                            Yorumlar & Güncellemeler
                        </h2>
                        <span className="flex h-5 min-w-[20px] px-1.5 items-center justify-center rounded-full bg-primary-subtle text-primary text-[11px] font-bold">
                            {comments.length}
                        </span>
                    </div>
                    <button type="button" className="text-text-tertiary group-hover:text-text-primary transition-colors">
                        <i className={`fa-solid fa-chevron-up transition-transform duration-200 ${isCommentsOpen ? '' : 'rotate-180'}`} />
                    </button>
                </div>

                {isCommentsOpen && (
                    <div className="mt-4 flex flex-col gap-5 animate-in fade-in-50">
                        {/* New Comment Input Box */}
                        <form onSubmit={handleSendComment} className="flex gap-3 items-start">
                            <img 
                                src="https://ui-avatars.com/api/?name=Yakup+B&background=6366f1&color=fff&size=64" 
                                alt="Yakup" 
                                className="h-8 w-8 rounded-full border border-subtle mt-1 shrink-0" 
                            />
                            <div className="flex-1 flex flex-col rounded-xl border border-subtle bg-surface-sunken/40 focus-within:bg-surface-base focus-within:border-primary focus-within:shadow-focus transition-all overflow-hidden">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Bir yorum yazın... (@bahset, #görev)"
                                    rows={2}
                                    className="w-full p-3 text-[13px] bg-transparent focus:outline-none resize-none text-text-primary"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                                            handleSendComment(e);
                                        }
                                    }}
                                />
                                <div className="flex items-center justify-between px-3 py-2 border-t border-subtle/50 bg-surface-base">
                                    <div className="flex items-center gap-1 text-text-tertiary">
                                        <button type="button" className="h-7 w-7 rounded flex items-center justify-center hover:text-text-primary hover:bg-surface-hover transition-colors" title="Dosya Ekle">
                                            <i className="fa-solid fa-paperclip text-xs" />
                                        </button>
                                        <button type="button" className="h-7 w-7 rounded flex items-center justify-center hover:text-text-primary hover:bg-surface-hover transition-colors" title="Resim Ekle">
                                            <i className="fa-regular fa-image text-xs" />
                                        </button>
                                        <button type="button" className="h-7 w-7 rounded flex items-center justify-center hover:text-text-primary hover:bg-surface-hover transition-colors" title="Emoji">
                                            <i className="fa-regular fa-face-smile text-xs" />
                                        </button>
                                        <button type="button" className="h-7 w-7 rounded flex items-center justify-center hover:text-text-primary hover:bg-surface-hover transition-colors" title="Bahset (@)">
                                            <i className="fa-solid fa-at text-xs" />
                                        </button>
                                    </div>
                                    
                                    <Button
                                        type="submit"
                                        size="sm"
                                        disabled={!newComment.trim()}
                                        className="bg-primary hover:bg-primary-hover text-white text-xs font-semibold px-4 h-8 rounded-lg shadow-sm"
                                        icon="fa-paper-plane"
                                    >
                                        Gönder
                                    </Button>
                                </div>
                            </div>
                        </form>

                        {/* Comment Stream */}
                        <div className="flex flex-col gap-4 divide-y divide-subtle/50">
                            {comments.map(c => (
                                <div key={c.id} className="flex gap-3 pt-3 items-start first:pt-0">
                                    <img src={c.avatar} alt={c.author} className="h-8 w-8 rounded-full border border-subtle shrink-0" />
                                    <div className="flex-1 flex flex-col gap-1">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[13px] font-bold text-text-primary">{c.author}</span>
                                                <span className="text-[11px] text-text-tertiary font-mono">{c.date}</span>
                                            </div>
                                            <button type="button" className="text-text-tertiary hover:text-text-primary text-xs p-1" title="İşlemler">
                                                <i className="fa-solid fa-ellipsis" />
                                            </button>
                                        </div>

                                        <p className="text-[13px] text-text-secondary leading-relaxed whitespace-pre-wrap">
                                            {c.text.split(' ').map((word, i) => (
                                                word.startsWith('@') 
                                                    ? <span key={i} className="font-semibold text-primary bg-primary-subtle px-1 py-0.5 rounded mr-1">{word} </span>
                                                    : word + ' '
                                            ))}
                                        </p>

                                        {/* Actions: Like & Reply */}
                                        <div className="flex items-center gap-4 mt-1">
                                            <button 
                                                type="button" 
                                                onClick={() => toggleLike(c.id)}
                                                className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                                                    c.hasLiked ? 'text-primary' : 'text-text-tertiary hover:text-text-primary'
                                                }`}
                                            >
                                                <i className="fa-regular fa-thumbs-up" />
                                                <span>{c.likes > 0 ? c.likes : 'Beğen'}</span>
                                            </button>

                                            <button 
                                                type="button" 
                                                className="text-xs font-medium text-text-tertiary hover:text-text-primary transition-colors"
                                            >
                                                Yanıtla
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

        </div>
    );
}
