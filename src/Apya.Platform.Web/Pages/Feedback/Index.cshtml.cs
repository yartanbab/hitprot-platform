using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Feedbacks;
using Apya.Platform.Web.Feedbacks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.Domain.Entities;

namespace Apya.Platform.Web.Pages.Feedback;

/// <summary>
/// "Geri Bildirimlerim" — kullanıcının kendi gönderdiği geri bildirimleri ve durumlarını
/// izlediği sayfa. İzin gerektirmez, yalnızca oturum (bkz. PlatformPermissions.Feedbacks yorumu).
/// Dosya handler'ları da burada — apya-feedback.js widget'ı hangi sayfada olursa olsun
/// bu handler'lara istek atabilir (Razor Pages handler'ları sayfa yoluyla adreslenir).
/// Dosyalar wwwroot DIŞINDA tutulur (FeedbackFileStorage); indirme yalnızca sahiplik
/// kontrolü yapan GET handler'larından mümkündür.
/// </summary>
[Authorize]
public class IndexModel : AbpPageModel
{
    private readonly FeedbackFileStorage _fileStorage;
    private readonly IFeedbackAppService _feedbackAppService;
    private readonly IFeedbackSettingsAppService _settingsAppService;

    public IndexModel(
        FeedbackFileStorage fileStorage,
        IFeedbackAppService feedbackAppService,
        IFeedbackSettingsAppService settingsAppService)
    {
        _fileStorage = fileStorage;
        _feedbackAppService = feedbackAppService;
        _settingsAppService = settingsAppService;
    }

    public void OnGet()
    {
    }

    public async Task<IActionResult> OnPostUploadScreenshotAsync(IFormFile file)
    {
        var rejection = await ValidateAgainstSettingsAsync(file);
        if (rejection is not null)
        {
            return BadRequest(rejection);
        }

        var storedFileName = await _fileStorage.StoreAsync(file);
        return new JsonResult(new { storedFileName });
    }

    /// <summary>Ek dosya yükleme — gönderimden önce çağrılır, dönen ad DTO'da beyan edilir.</summary>
    public async Task<IActionResult> OnPostUploadAttachmentAsync(IFormFile file)
    {
        var rejection = await ValidateAgainstSettingsAsync(file);
        if (rejection is not null)
        {
            return BadRequest(rejection);
        }

        var storedFileName = await _fileStorage.StoreAsync(file);
        return new JsonResult(new
        {
            storedFileName,
            fileName = file.FileName,
            contentType = file.ContentType,
            sizeBytes = file.Length
        });
    }

    /// <summary>
    /// Yöneticinin ayarladığı boyut/uzantı politikasını uygular. FeedbackFileStorage'daki
    /// sabit sınır güvenlik tabanıdır (her koşulda geçerli); ayar ondan daha DAR olabilir
    /// ve daha önce hiçbir yerde uygulanmıyordu — arayüz "en fazla 5 MB" derken sunucu
    /// 10 MB'ı kabul ediyordu. Reddetme sebebi metin olarak döner; istemci bunu kullanıcıya
    /// gösterir (bkz. apya-feedback.js/extractFailureReason).
    /// </summary>
    private async Task<string?> ValidateAgainstSettingsAsync(IFormFile? file)
    {
        if (file == null || file.Length == 0)
        {
            return "Geçersiz veya boş dosya.";
        }

        var settings = await _settingsAppService.GetAsync();

        var maxBytes = (long)settings.MaxFileSizeMb * 1024 * 1024;
        if (settings.MaxFileSizeMb > 0 && file.Length > maxBytes)
        {
            return $"Dosya çok büyük ({file.Length / 1024d / 1024d:0.#} MB). " +
                   $"En fazla {settings.MaxFileSizeMb} MB yükleyebilirsiniz.";
        }

        // Ayar zaten ".png,.jpg" biçiminde normalize edilmiş kaydedilir
        // (FeedbackSettingsAppService.NormalizeExtensions).
        var allowed = settings.AllowedFileExtensions
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (allowed.Length > 0 && !allowed.Contains(extension, StringComparer.OrdinalIgnoreCase))
        {
            return $"\"{extension}\" uzantısı kabul edilmiyor. " +
                   $"İzin verilen türler: {settings.AllowedFileExtensions}";
        }

        return null;
    }

    /// <summary>Kendi kaydının ekran görüntüsü — sahiplik AppService'te doğrulanır.</summary>
    public async Task<IActionResult> OnGetScreenshotAsync(Guid feedbackId)
    {
        return await ServeAsync(() => _feedbackAppService.GetMyScreenshotFileAsync(feedbackId));
    }

    /// <summary>Kendi kaydının eki — sahiplik AppService'te doğrulanır.</summary>
    public async Task<IActionResult> OnGetAttachmentAsync(Guid attachmentId)
    {
        return await ServeAsync(() => _feedbackAppService.GetMyAttachmentFileAsync(attachmentId));
    }

    private async Task<IActionResult> ServeAsync(Func<Task<Apya.Platform.Feedbacks.Dtos.FeedbackAttachmentFileDto>> resolver)
    {
        Apya.Platform.Feedbacks.Dtos.FeedbackAttachmentFileDto file;
        try
        {
            file = await resolver();
        }
        catch (EntityNotFoundException)
        {
            return NotFound();
        }

        var stream = _fileStorage.OpenRead(file.StoredFileName);
        if (stream is null)
        {
            return NotFound();
        }

        var contentType = file.ContentType ?? FeedbackFileStorage.GetContentType(file.StoredFileName);
        return File(stream, contentType, file.FileName);
    }
}
