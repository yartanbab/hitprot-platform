using System;
using System.Collections.Generic;

namespace Apya.Platform.Tasks;

/// <summary>QA-23 · Görevin değişiklik geçmişindeki bir kayıt (kim, ne zaman, hangi alanlar).</summary>
public class TaskHistoryEntryDto
{
    public DateTime ChangeTime { get; set; }

    /// <summary>Değişikliği yapan (ad soyad, yoksa kullanıcı adı); sistem değişikliğinde boş.</summary>
    public string? ChangedBy { get; set; }

    /// <summary>"Oluşturuldu", "Güncellendi" ya da "Silindi".</summary>
    public string Kind { get; set; } = "";

    public List<TaskHistoryChangeDto> Changes { get; set; } = new();
}

/// <summary>Tek alan değişikliği; değerler okunur biçimde (durum adı, tarih, kişi adı).</summary>
public class TaskHistoryChangeDto
{
    public string Field { get; set; } = "";
    public string? OldValue { get; set; }
    public string? NewValue { get; set; }
}
