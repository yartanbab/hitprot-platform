import React from 'react';

/**
 * Boş durumun eylem satırı: tek birincil düğme + isteğe bağlı metin bağlantısı.
 *
 * Bağlantı ikinci bir yol sunar ("veya boş klasörle başla"); düğme görünümü
 * almaz ki birincil düğmeyle yarışmasın. `href` varsa bağlantı, `onClick`
 * varsa metin görünümlü düğme basılır.
 *
 * @param {object} props
 * @param {React.ReactNode} props.primary
 * @param {{ label: string, href?: string, onClick?: () => void }} [props.link]
 */
export function EmptyActions({ primary, link }) {
  return (
    <div className="apya-docs-empty-actions">
      {primary}
      {link && (link.href ? (
        <a className="apya-doc-linkbtn" href={link.href}>{link.label}</a>
      ) : (
        <button type="button" className="apya-doc-linkbtn" onClick={link.onClick}>{link.label}</button>
      ))}
    </div>
  );
}
