using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Apya.Platform.Storage;
using Apya.Platform.Tasks;
using Apya.Platform.Web.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.Domain.Entities;

namespace Apya.Platform.Web.Pages.Paylasim;

/// <summary>
/// Misafir görünümü — süreli link ile açılan, ekip dışına ait sayfa.
///
/// <para>Anonimdir: yetki token'ın kendisindedir. Bu sayfadaki hiçbir kontrol yetki yerine
/// GEÇMEZ; süre, iptal, izin bayrakları ve kapsam <see cref="ITaskShareAppService"/> içinde
/// yeniden doğrulanır. Buradaki iş yalnız sunum ve dosya taşıma.</para>
///
/// <para>Bilinçli olarak React island kullanılmaz — dış alıcıya uygulamanın tüm paketini
/// göndermenin faydası yok, saldırı yüzeyini büyütür. Emsal:
/// <c>Pages/Share/Index.cshtml</c> (belgelerin salt okunur denetçi görünümü).</para>
/// </summary>
[AllowAnonymous]
public class IndexModel : AbpPageModel
{
    /// <summary>
    /// Misafir yüklemesinde boyut tavanı. Ekip tarafındaki
    /// <c>TaskAttachmentController</c> ile aynı: 10MB. Uzantı beyaz listesi
    /// <see cref="IUploadedFileStorage"/> içinde uygulanır — liste burada tekrar edilmez.
    /// </summary>
    private const long MaxUploadBytes = 10 * 1024 * 1024;

    private readonly ITaskShareAppService _shareAppService;
    private readonly IUploadedFileStorage _fileStorage;
    private readonly IUploadedFileRootFolderProvider _rootFolderProvider;

    public IndexModel(
        ITaskShareAppService shareAppService,
        IUploadedFileStorage fileStorage,
        IUploadedFileRootFolderProvider rootFolderProvider)
    {
        _shareAppService = shareAppService;
        _fileStorage = fileStorage;
        _rootFolderProvider = rootFolderProvider;
    }

    public GuestTaskViewDto? View { get; private set; }

    /// <summary>Form ve indirme bağlantılarını kurmak için görünüme taşınan token.</summary>
    public string? Token { get; private set; }

    /// <summary>Link kullanılamıyorsa gösterilecek mesaj.</summary>
    public string? ErrorMessage { get; private set; }

    /// <summary>Son işlemin sonucu (yorum eklendi / dosya yüklendi / hata).</summary>
    public string? StatusMessage { get; private set; }

    public bool StatusIsError { get; private set; }

    public async Task OnGetAsync(string token)
    {
        await LoadAsync(token);
    }

    public async Task<IActionResult> OnPostCommentAsync(string token, Guid taskId, string? text)
    {
        if (string.IsNullOrWhiteSpace(text))
        {
            return RedirectToPage(new { token, durum = "yorum-bos" });
        }

        try
        {
            await _shareAppService.AddGuestCommentAsync(
                token, taskId, text, BuildContext());
        }
        catch (BusinessException)
        {
            return RedirectToPage(new { token, durum = "yorum-hata" });
        }
        catch (EntityNotFoundException)
        {
            return RedirectToPage(new { token, durum = "yorum-hata" });
        }

        // POST-Redirect-GET: yenilemede yorum tekrar gönderilmesin.
        return RedirectToPage(new { token, durum = "yorum-tamam" });
    }

    /// <summary>
    /// Misafir dosya yüklemesi.
    ///
    /// <para>Sıra önemli: izin/kapsam ÖNCE doğrulanır (diske boşuna yazmamak için), dosya
    /// sonra yazılır, kayıt en sonda açılır. Kayıt açılamazsa yazılan dosya SİLİNİR —
    /// aksi halde anonim uç, kimsenin erişemediği dosyalarla diski doldurmanın yolu olurdu.</para>
    /// </summary>
    public async Task<IActionResult> OnPostUploadAsync(string token, Guid taskId, IFormFile? file)
    {
        if (file == null || file.Length == 0)
        {
            return RedirectToPage(new { token, durum = "dosya-bos" });
        }

        if (file.Length > MaxUploadBytes)
        {
            return RedirectToPage(new { token, durum = "dosya-buyuk" });
        }

        try
        {
            await _shareAppService.EnsureGuestUploadAllowedAsync(token, taskId);
        }
        catch (BusinessException ex) when (ex.Code == PlatformDomainErrorCodes.TaskShareUploadLimitExceeded)
        {
            return RedirectToPage(new { token, durum = "dosya-tavan" });
        }
        catch (BusinessException)
        {
            return RedirectToPage(new { token, durum = "dosya-hata" });
        }
        catch (EntityNotFoundException)
        {
            return RedirectToPage(new { token, durum = "dosya-hata" });
        }

        string storedFileName;
        try
        {
            storedFileName = await _fileStorage.StoreAsync(file);
        }
        catch (BusinessException ex) when (ex.Code == PlatformDomainErrorCodes.FileUnsupportedExtension)
        {
            return RedirectToPage(new { token, durum = "dosya-uzanti" });
        }
        catch (BusinessException)
        {
            return RedirectToPage(new { token, durum = "dosya-hata" });
        }

        try
        {
            await _shareAppService.RegisterGuestUploadAsync(
                token, taskId, file.FileName, storedFileName, file.Length, BuildContext());
        }
        catch (Exception)
        {
            DeleteQuietly(storedFileName);
            return RedirectToPage(new { token, durum = "dosya-hata" });
        }

        return RedirectToPage(new { token, durum = "dosya-tamam" });
    }

    /// <summary>
    /// Misafirin bir eki indirmesi. Süre, iptal, indirme izni, ekin kapsama aidiyeti ve
    /// misafire görünürlüğü AppService içinde doğrulanır — buradan geçmek yetki vermez.
    ///
    /// Hata durumunda ayrıntı verilmez: geçersiz token, süresi dolmuş link, kapsam dışı ek
    /// ve dışa açılmamış dosya aynı 404'ü alır.
    /// </summary>
    public async Task<IActionResult> OnGetDownloadAsync(string token, Guid attachmentId)
    {
        if (string.IsNullOrWhiteSpace(token))
        {
            return NotFound();
        }

        GuestDownloadDto download;

        try
        {
            download = await _shareAppService.PrepareGuestDownloadAsync(token, attachmentId, BuildContext());
        }
        catch (BusinessException)
        {
            return NotFound();
        }
        catch (EntityNotFoundException)
        {
            return NotFound();
        }

        var path = _rootFolderProvider.ResolveSafePath(download.StoredFileName);

        if (path == null || !System.IO.File.Exists(path))
        {
            return NotFound();
        }

        return PhysicalFile(path, download.ContentType, download.FileName);
    }

    /* ─────────────────────────── Yardımcılar ─────────────────────────── */

    private async Task LoadAsync(string token)
    {
        SetStatusMessage(Request.Query["durum"].ToString());

        if (string.IsNullOrWhiteSpace(token))
        {
            ErrorMessage = "Bağlantı geçersiz.";
            return;
        }

        try
        {
            View = await _shareAppService.ResolveAsync(token, BuildContext());
            Token = token;
        }
        catch (BusinessException ex) when (ex.Code == PlatformDomainErrorCodes.TaskShareLinkExpired)
        {
            ErrorMessage = "Bu bağlantının süresi dolmuş.";
        }
        catch (BusinessException ex) when (ex.Code == PlatformDomainErrorCodes.TaskShareLinkRevoked)
        {
            ErrorMessage = "Bu bağlantı iptal edilmiş.";
        }
        catch (EntityNotFoundException)
        {
            // Var olmayan token ile süresi dolmuş token aynı mesajı alır — geçerli token
            // tahmin etmeyi kolaylaştıracak bir ipucu vermeyiz.
            ErrorMessage = "Bağlantı geçersiz.";
        }
    }

    private void SetStatusMessage(string? code)
    {
        (StatusMessage, StatusIsError) = code switch
        {
            "yorum-tamam" => ("Yorumunuz eklendi.", false),
            "yorum-bos" => ("Yorum boş olamaz.", true),
            "yorum-hata" => ("Yorum eklenemedi.", true),
            "dosya-tamam" => ("Dosya yüklendi.", false),
            "dosya-bos" => ("Dosya seçilmedi.", true),
            "dosya-buyuk" => ("Dosya 10 MB'dan büyük olamaz.", true),
            "dosya-uzanti" => ("Bu dosya türüne izin verilmiyor.", true),
            "dosya-tavan" => ($"Bu bağlantıyla en fazla {TaskShareConsts.MaxUploadsPerLink} dosya yüklenebilir.", true),
            "dosya-hata" => ("Dosya yüklenemedi.", true),
            _ => (null, false)
        };
    }

    private GuestRequestContextDto BuildContext() => new()
    {
        IpHash = HashClientIp(),
        UserAgent = TruncatedUserAgent()
    };

    /// <summary>
    /// KVKK: ham IP saklanmaz. Tek yönlü özet yalnız aynı ziyaretçiyi tekrar eden
    /// erişimlerde eşleştirmeye yarar; kişi tanımlamaya değil.
    /// </summary>
    private string? HashClientIp()
    {
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();

        if (string.IsNullOrEmpty(ip))
        {
            return null;
        }

        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(ip));
        return Convert.ToHexString(bytes).ToLowerInvariant();
    }

    private string? TruncatedUserAgent()
    {
        var agent = Request.Headers.UserAgent.ToString();
        return string.IsNullOrWhiteSpace(agent)
            ? null
            : agent.Length > 400 ? agent[..400] : agent;
    }

    private void DeleteQuietly(string storedFileName)
    {
        try
        {
            var path = _rootFolderProvider.ResolveSafePath(storedFileName);
            if (path != null && System.IO.File.Exists(path))
            {
                System.IO.File.Delete(path);
            }
        }
        catch (IOException)
        {
            // Öksüz dosya diskte kalır; isteği düşürmekten iyidir.
        }
    }
}
