/**
 * Kullanıcının kaydettiği zengin metni (görev açıklaması, proje/görev belgesi) ekrana
 * basmadan önce temizler. Tarayıcının DOMParser'ı ile ayrıştırılır — ayrıştırma sırasında
 * betik ÇALIŞMAZ — ve yalnız izinli etiket/öznitelikler kalır:
 *
 *   - betik taşıyabilen öğeler (script, iframe, svg, form…) içeriğiyle birlikte atılır;
 *   - listede olmayan diğer etiketler açılır (metni korunur, etiket gider);
 *   - on* olay öznitelikleri ve javascript:/vbscript: bağlantıları hiç geçmez;
 *   - style yalnız birkaç biçim özelliğiyle ve url() olmadan kalır.
 *
 * Eskiden editör değer "HTML'e benziyorsa" onu olduğu gibi innerHTML'e basıyordu:
 * açıklamaya yazılan <img src=x onerror=…> görevi açan herkesin oturumunda çalışıyordu.
 */

const DROP_WITH_CONTENT = new Set([
    'SCRIPT', 'STYLE', 'IFRAME', 'FRAME', 'FRAMESET', 'OBJECT', 'EMBED', 'APPLET', 'LINK', 'META',
    'BASE', 'SVG', 'MATH', 'FORM', 'INPUT', 'BUTTON', 'TEXTAREA', 'SELECT', 'OPTION', 'TEMPLATE',
    'NOSCRIPT', 'AUDIO', 'VIDEO', 'SOURCE', 'TRACK', 'CANVAS', 'PORTAL',
]);

const ALLOWED_TAGS = new Set([
    'P', 'BR', 'DIV', 'SPAN', 'B', 'STRONG', 'I', 'EM', 'U', 'S', 'STRIKE', 'DEL', 'INS', 'SUB', 'SUP',
    'MARK', 'SMALL', 'FONT', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'PRE',
    'CODE', 'HR', 'TABLE', 'THEAD', 'TBODY', 'TFOOT', 'TR', 'TH', 'TD', 'CAPTION', 'A', 'IMG',
]);

const ALLOWED_ATTRS = {
    '*': ['class', 'title', 'style'],
    A: ['href', 'target', 'rel'],
    IMG: ['src', 'alt', 'width', 'height'],
    TD: ['colspan', 'rowspan'],
    TH: ['colspan', 'rowspan'],
    FONT: ['color'],
    OL: ['start'],
};

const SAFE_STYLE_PROPS = new Set([
    'color', 'background-color', 'text-align', 'font-weight', 'font-style', 'text-decoration',
]);

const SAFE_LINK = /^(https?:|mailto:|tel:|#|\/(?!\/))/i;
const SAFE_IMG = /^(https?:|data:image\/(png|jpe?g|gif|webp);base64,|\/(?!\/))/i;

function cleanStyle(value) {
    return String(value)
        .split(';')
        .map((decl) => decl.trim())
        .filter(Boolean)
        .filter((decl) => {
            const idx = decl.indexOf(':');
            if (idx < 0) return false;
            const prop = decl.slice(0, idx).trim().toLowerCase();
            const val = decl.slice(idx + 1).toLowerCase();
            return SAFE_STYLE_PROPS.has(prop) && !/url\(|expression|javascript:|@import/.test(val);
        })
        .join('; ');
}

function cleanAttributes(el) {
    const allowed = new Set([...(ALLOWED_ATTRS['*']), ...(ALLOWED_ATTRS[el.tagName] || [])]);
    for (const attr of [...el.attributes]) {
        const name = attr.name.toLowerCase();
        const value = attr.value.trim();
        if (!allowed.has(name) || name.startsWith('on')) {
            el.removeAttribute(attr.name);
            continue;
        }
        if (name === 'href' && !SAFE_LINK.test(value)) { el.removeAttribute(attr.name); continue; }
        if (name === 'src' && !SAFE_IMG.test(value)) { el.removeAttribute(attr.name); continue; }
        if (name === 'style') {
            const style = cleanStyle(value);
            if (style) { el.setAttribute('style', style); } else { el.removeAttribute('style'); }
        }
    }
    if (el.tagName === 'A' && el.getAttribute('target')) {
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener noreferrer');
    }
}

function cleanNode(node) {
    for (const child of [...node.childNodes]) {
        if (child.nodeType === 8) { child.remove(); continue; }           // yorum
        if (child.nodeType !== 1) { continue; }                             // metin
        const tag = child.tagName.toUpperCase();
        if (DROP_WITH_CONTENT.has(tag)) { child.remove(); continue; }
        cleanNode(child);
        if (!ALLOWED_TAGS.has(tag)) {
            child.replaceWith(...child.childNodes);                         // etiketi aç, metni koru
            continue;
        }
        cleanAttributes(child);
    }
}

/** Güvenli HTML döndürür; boş/geçersiz girdide ''. */
export function sanitizeHtml(html) {
    if (!html) return '';
    const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
    cleanNode(doc.body);
    return doc.body.innerHTML;
}
