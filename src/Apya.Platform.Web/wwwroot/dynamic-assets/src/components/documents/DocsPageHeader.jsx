import React from 'react';
import { OverflowMenu } from './OverflowMenu';

/**
 * Doküman ekranlarının başlık satırı.
 *
 * Buton kuralını yapıya gömer: sağda en fazla BİR birincil düğme (`primary`)
 * ve ikincil eylemler için ⋯ menüsü. Seçici gibi eylem olmayan denetimler
 * `aside` ile birincil düğmenin soluna konur.
 *
 * @param {object} props
 * @param {React.ReactNode} props.title
 * @param {React.ReactNode} [props.description]
 * @param {React.ReactNode} [props.primary] Tek birincil düğme; yoksa boş bırakılır.
 * @param {Array} [props.menuItems] OverflowMenu öğeleri.
 * @param {React.ReactNode} [props.aside]
 */
export function DocsPageHeader({ title, description, primary, menuItems, aside }) {
  return (
    <div className="apya-docs-pagehead">
      <div className="apya-docs-pagehead-text">
        <h1 className="apya-docs-pagehead-title">{title}</h1>
        {description && <p className="apya-docs-pagehead-desc">{description}</p>}
      </div>

      <div className="apya-docs-pagehead-actions">
        {aside}
        {primary}
        <OverflowMenu items={menuItems} />
      </div>
    </div>
  );
}
