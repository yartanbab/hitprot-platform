import React from 'react';
import { featureInfo } from '../featureCatalogV3';

/**
 * İçeriği henüz yazılmamış sekmenin boş durumu. Boş pano göstermek yerine ne
 * olduğunu söyler ve iki çıkış yolu sunar: özelliği kaldır ya da başka özellik ekle.
 */
export function TaskUnbuiltTabV3({ code, onRemoveFeature, onOpenPicker, canRemove = true }) {
    const info = featureInfo(code) ?? { title: code, desc: '', icon: 'fa-cube', bg: 'bg-neutral-subtle', fg: 'text-text-secondary' };

    return (
        <div className="flex flex-col items-center gap-3 py-14 px-6 rounded-2xl border border-dashed border-strong bg-surface-base text-center">
            <span className={`flex items-center justify-center h-14 w-14 rounded-2xl ${info.bg} ${info.fg}`}>
                <i className={`fa-solid ${info.icon} text-[22px]`} />
            </span>

            <div className="flex flex-col gap-1.5 max-w-[420px]">
                <span className="text-[15px] font-extrabold tracking-[-.02em] text-text-primary">{info.title}</span>
                {info.desc && <span className="text-[12.5px] leading-[1.6] text-text-secondary">{info.desc}</span>}
                <span className="flex items-center justify-center gap-[7px] mt-1.5 text-[11.5px] font-semibold text-text-tertiary">
                    <i className="fa-solid fa-person-digging text-[11px]" />
                    Bu sekme yapım aşamasında.
                </span>
            </div>

            <div className="flex items-center gap-2.5 mt-1.5">
                {canRemove && (
                    <button
                        type="button"
                        onClick={() => onRemoveFeature?.(code)}
                        className="flex items-center gap-2 h-[34px] px-3.5 rounded-[10px] border border-default bg-surface-base text-text-secondary text-[12.5px] font-semibold cursor-pointer hover:bg-negative-subtle hover:border-negative hover:text-negative"
                    >
                        <i className="fa-solid fa-xmark text-[10px]" />
                        Bu özelliği kaldır
                    </button>
                )}
                <button
                    type="button"
                    onClick={onOpenPicker}
                    className="flex items-center gap-2 h-[34px] px-3.5 rounded-[10px] bg-primary text-white text-[12.5px] font-bold cursor-pointer hover:bg-primary-hover"
                >
                    <i className="fa-solid fa-shapes text-[10px]" />
                    Başka özellik ekle
                </button>
            </div>
        </div>
    );
}
