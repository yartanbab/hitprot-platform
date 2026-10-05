using System;
using Apya.Platform.Projects.Dtos;

namespace Apya.Platform.Projects;

/// <summary>
/// 🔴 PRJ-02 · Proje güncellemesinde formda GÖSTERİLMEYEN alanların korunması.
///
/// <para>Bu kural eskiden yalnız Razor sayfasındaydı (<c>Projects/Edit</c> kaydetmeden
/// önce mevcut değerleri geri yazıyordu). Uç ise otomatik API'de de yayında
/// (<c>PUT /api/app/project/{id}</c>) ve gelen her değeri KOŞULSUZ yazıyordu:</para>
/// <list type="bullet">
/// <item>Hibe ya da cari alanını göndermeyen istemci bağı SESSİZCE koparıyordu.</item>
/// <item>Bütçe yetkisi olmayan kullanıcı bütçeyi değiştirebiliyordu. Daha kötüsü: okuma
/// yolu o kullanıcıya bütçeyi 0 olarak maskeler; "oku → adı değiştir → geri yaz" yapan
/// dürüst bir istemci projenin bütçesini SIFIRLARDI.</item>
/// </list>
///
/// <para>Karar saf bir fonksiyon: entegrasyon testleri <c>AddAlwaysAllowAuthorization</c>
/// altında koştuğu için "yetki yok" dalı orada ölçülemez; burada birim testle kilitlenir.</para>
///
/// <para>🔴 <c>null</c> = "dokunma", "bağı kaldır" DEĞİL. Hibe bağı zaten yalnız
/// dönüşümle kuruluyor ve hiçbir ekran onu kaldırmıyor; bağı kaldırma ihtiyacı doğarsa
/// açık bir uç ister, bu uca "null gönder" diye gömülmez.</para>
/// </summary>
public static class ProjectUpdateGuard
{
    /// <summary>Güncellemede gerçekten yazılacak değerler.</summary>
    public readonly record struct Effective(
        Guid? GrantId,
        Guid? CustomerId,
        decimal TotalBudget,
        decimal HourlyRate,
        string Currency);

    public static Effective Resolve(Project current, CreateProjectDto input, bool canEditBudget)
    {
        return new Effective(
            input.GrantId ?? current.GrantId,
            input.CustomerId ?? current.CustomerId,
            canEditBudget ? input.TotalBudget : current.TotalBudget,
            canEditBudget ? input.HourlyRate : current.HourlyRate,
            canEditBudget ? input.Currency : current.Currency);
    }
}
