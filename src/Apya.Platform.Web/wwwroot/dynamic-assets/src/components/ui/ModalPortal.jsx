import { createPortal } from 'react-dom';

/**
 * Modal/overlay içeriğini `document.body`ye taşır.
 *
 * NEDEN GEREKLİ: React adalarının kök sarmalayıcısı `.apya-fade-in` taşıyor ve
 * bu sınıfın animasyonu `transform`u hedefliyor (`fill-mode: both` ile kalıcı
 * olarak yürürlükte). Transform'u animasyonlanan bir eleman, içindeki
 * `position: fixed` düğümler için KAPSAYICI BLOK olur — overlay görünen alana
 * değil, uzun ada sarmalayıcısına hizalanır ve modal ekranın altına taşar.
 * Son kareyi `transform: none` yapmak YETMEZ: animasyon "yürürlükte" olduğu
 * sürece kimlik matrisi de kapsayıcı blok yaratır.
 *
 * Portal, düğümü ağacın dışına çıkarararak sorunu kökünden keser — React olay
 * kabarcıklanması yine bileşen ağacından akar.
 */
export function ModalPortal({ children }) {
  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(children, document.body);
}
