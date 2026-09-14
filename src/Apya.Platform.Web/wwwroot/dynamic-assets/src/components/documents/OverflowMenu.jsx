import React, { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Button } from '../ui/Button';

const cx = (...classes) => classes.filter(Boolean).join(' ');

/**
 * ⋯ menüsü — ekranın ikincil eylemleri.
 *
 * Buton kuralı: ekranda TEK birincil düğme durur, geri kalan eylemler buraya
 * iner. Öğe `href` taşıyorsa bağlantı, `onSelect` taşıyorsa düğme olarak
 * basılır. Kapalı (`disabled`) öğe gizlenmez, nedenini `hint` satırı söyler —
 * düğme kapalıyken title ipucu görünmüyor (pointer-events kapalı).
 *
 * @param {object} props
 * @param {Array<{ key: string, label: string, icon?: string, href?: string,
 *   onSelect?: () => void, disabled?: boolean, hint?: string, className?: string }|false|null>} props.items
 *   Yanlış değerli öğeler atlanır; izin koşulunu satır içinde yazmak için.
 * @param {'md'|'sm'} [props.size] Yanındaki birincil düğmenin boyuna uyar.
 */
export function OverflowMenu({ items, size = 'md', label = 'Diğer eylemler' }) {
  const [open, setOpen] = useState(false);
  const visible = (items ?? []).filter(Boolean);

  if (visible.length === 0) return null;

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button
          variant="secondary"
          size={size === 'sm' ? 'sm' : 'icon'}
          className={size === 'sm' ? 'w-8 px-0' : undefined}
          aria-label={label}
          title={label}
        >
          <i className="fa fa-ellipsis" aria-hidden="true" />
        </Button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content align="end" sideOffset={6} collisionPadding={12} className="apya-docs-menu">
          {visible.map((item) => {
            const body = (
              <>
                {item.icon && <i className={cx('fa', item.icon, 'apya-console-menu-icon')} aria-hidden="true" />}
                <span className="apya-docs-menu-text">
                  <span>{item.label}</span>
                  {item.hint && <span className="apya-docs-menu-hint">{item.hint}</span>}
                </span>
              </>
            );

            if (item.href && !item.disabled) {
              return (
                <a
                  key={item.key}
                  href={item.href}
                  className={cx('apya-console-menu-item', item.className)}
                  onClick={() => setOpen(false)}
                >
                  {body}
                </a>
              );
            }

            return (
              <button
                key={item.key}
                type="button"
                className={cx('apya-console-menu-item', item.className)}
                disabled={item.disabled}
                onClick={() => { setOpen(false); item.onSelect?.(); }}
              >
                {body}
              </button>
            );
          })}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
