using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Apya.Platform.Web.Services;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Feedback;

/// <summary>
/// "Geri Bildirimlerim" — kullanıcının kendi gönderdiği geri bildirimleri ve durumlarını
/// izlediği sayfa. İzin gerektirmez, yalnızca oturum (bkz. PlatformPermissions.Feedbacks yorumu).
/// Ekran görüntüsü yükleme handler'ı da burada — apya-feedback.js widget'ı hangi sayfada
/// olursa olsun bu handler'a POST atabilir (Razor Pages handler'ları sayfa yoluyla adreslenir).
/// </summary>
[Authorize]
public class IndexModel : AbpPageModel
{
    private readonly IUploadedFileStorage _fileStorage;

    public IndexModel(IUploadedFileStorage fileStorage)
    {
        _fileStorage = fileStorage;
    }

    public void OnGet()
    {
    }

    public async Task<IActionResult> OnPostUploadScreenshotAsync(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("Geçersiz veya boş dosya.");
        }

        var storedFileName = await _fileStorage.StoreAsync(file);
        return new JsonResult(new { storedFileName });
    }
}
