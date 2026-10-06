import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ShareLinkDialog } from './ShareLinkDialog';

/**
 * Paylaşım bağlantısı penceresi.
 *
 * Üç ardışık tarayıcı kutusunun (süre → indirme onayı → filigran) ve bağlantının gösterildiği
 * dördüncü kutunun yerine geçti. Burada ölçülen, o zincirin kusurları: ilk adımdan sonra
 * vazgeçilememesi, "İptal"in "yalnız görüntüleme" anlamına gelmesi, sunucunun reddedeceği
 * sürenin gönderilmesi ve yalnız bir kez dönen bağlantının tarayıcı kutusunda gösterilmesi.
 */
const LINK = 'https://apya.test/Shared/Package?token=abc';

function setup(props = {}) {
  const onSubmit = vi.fn();
  const onClose = vi.fn();
  const user = userEvent.setup();
  const view = render(
    <ShareLinkDialog open busy={false} link={null} onClose={onClose} onSubmit={onSubmit} {...props} />,
  );
  return { onSubmit, onClose, user, ...view };
}

describe('ShareLinkDialog · seçenekler', () => {
  it('üç seçeneği birlikte sorar ve tek seferde gönderir', async () => {
    const { onSubmit, user } = setup();

    const days = screen.getByLabelText('Geçerlilik süresi (gün)');
    expect(days).toHaveValue(14);

    await user.clear(days);
    await user.type(days, '30');
    await user.click(screen.getByLabelText('İndirmeye izin ver'));
    await user.type(screen.getByLabelText('Filigran metni (boş bırakılabilir)'), '  Denetçi kopyası  ');
    await user.click(screen.getByRole('button', { name: 'Bağlantı oluştur' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({ lifetimeDays: 30, allowDownload: true, watermark: 'Denetçi kopyası' });
  });

  it('dokunulmazsa yalnız görüntüleme ve filigransız gider', async () => {
    const { onSubmit, user } = setup();

    await user.click(screen.getByRole('button', { name: 'Bağlantı oluştur' }));

    expect(onSubmit).toHaveBeenCalledWith({ lifetimeDays: 14, allowDownload: false, watermark: null });
  });

  it('vazgeçmek hiçbir şey göndermez', async () => {
    const { onSubmit, onClose, user } = setup();

    await user.click(screen.getByLabelText('İndirmeye izin ver'));
    await user.click(screen.getByRole('button', { name: 'Vazgeç' }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  // Sunucu sınırı: CreateShareLinkDto.LifetimeDays [Range(1, 365)], tam sayı.
  it.each(['0', '366', '1.5', ''])('sunucunun reddedeceği süre (%s) gönderilmez', async (value) => {
    const { onSubmit, user } = setup();

    const days = screen.getByLabelText('Geçerlilik süresi (gün)');
    await user.clear(days);
    if (value) await user.type(days, value);

    expect(screen.getByRole('button', { name: 'Bağlantı oluştur' })).toBeDisabled();
    expect(screen.getByText('1 ile 365 gün arasında bir tam sayı girin.')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('filigran sunucudaki sınırla aynı uzunlukta', () => {
    setup();

    expect(screen.getByLabelText('Filigran metni (boş bırakılabilir)')).toHaveAttribute('maxlength', '120');
  });

  it('kapalıyken hiçbir şey basmaz', () => {
    setup({ open: false });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

describe('ShareLinkDialog · oluşan bağlantı', () => {
  it('bağlantıyı pencerede gösterir; seçenek formu kalkar', () => {
    setup({ link: LINK });

    expect(screen.getByLabelText('Paylaşım bağlantısı')).toHaveValue(LINK);
    expect(screen.getByLabelText('Paylaşım bağlantısı')).toHaveAttribute('readonly');
    expect(screen.getByText(/yeniden görüntülenemez/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Bağlantı oluştur' })).not.toBeInTheDocument();
  });

  it('kopyala düğmesi bağlantıyı panoya yazar', async () => {
    const { user } = setup({ link: LINK });

    await user.click(screen.getByRole('button', { name: 'Kopyala' }));

    expect(await navigator.clipboard.readText()).toBe(LINK);
    expect(await screen.findByText('Kopyalandı.')).toBeInTheDocument();
  });

  it('pano reddederse bağlantı seçili kalır ve elle kopyalama söylenir', async () => {
    const { user } = setup({ link: LINK });
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValueOnce(new Error('izin yok'));

    await user.click(screen.getByRole('button', { name: 'Kopyala' }));

    expect(await screen.findByText(/elle kopyalayın/)).toBeInTheDocument();
    expect(screen.getByLabelText('Paylaşım bağlantısı')).toHaveValue(LINK);
  });

  // Bağlantı bir daha gösterilemez: yanlışlıkla arka plana tıklamak onu kaybettirmemeli.
  it('arka plana tıklamak bağlantıyı kapatmaz; Kapat kapatır', async () => {
    const { onClose, user, baseElement } = setup({ link: LINK });

    await user.click(baseElement.querySelector('.apya-doc-overlay'));
    expect(onClose).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Kapat' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
