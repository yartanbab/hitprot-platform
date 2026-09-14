using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Apya.Platform.Grants;
using Apya.Platform.Permissions;
using Apya.Platform.Storage;
using Apya.Platform.Web.Pages;
using Apya.Platform.Web.Services;

namespace Apya.Platform.Web.Pages.Grants;

/// <summary>
/// 1b · Hibe Parametre Formu. Grants.Edit izni tanım gereği host-only
/// (PlatformPermissionDefinitionProvider), sayfa da yalnız host'ta açılır.
///
/// <para>12b afiş: dosya baytları BURADA işlenir (<see cref="IUploadedFileStorage"/> Web
/// katmanında); AppService yalnız saklanan adı tutar. Proje kapağıyla aynı düzen — dosya
/// App_Data/uploads'a yazılır, /file/get ile oturumlu kullanıcıya servis edilir.</para>
/// </summary>
[Authorize(PlatformPermissions.Grants.Edit)]
public class ParametersModel : PlatformPageModel
{
    /// <summary>Tasarım 12b: JPG/PNG. Kart afişi için 5 MB fazlasıyla yeter.</summary>
    internal const long MaxPosterBytes = 5 * 1024 * 1024;

    private readonly IGrantParameterAppService _parameters;
    private readonly IUploadedFileStorage _fileStorage;
    private readonly IUploadedFileRootFolderProvider _rootFolderProvider;

    public ParametersModel(
        IGrantParameterAppService parameters,
        IUploadedFileStorage fileStorage,
        IUploadedFileRootFolderProvider rootFolderProvider)
    {
        _parameters = parameters;
        _fileStorage = fileStorage;
        _rootFolderProvider = rootFolderProvider;
    }

    [BindProperty(SupportsGet = true)]
    public Guid Id { get; set; }

    public IActionResult OnGet()
    {
        return Id == Guid.Empty ? RedirectToPage("./Index") : Page();
    }

    /// <summary>12b · Afişi yükler; eski afiş dosyası diskten silinir.</summary>
    public async Task<IActionResult> OnPostUploadPosterAsync(IFormFile? file)
    {
        if (Id == Guid.Empty || file == null || file.Length == 0)
        {
            return BadRequest(L["Grants:Parameters:Poster:NoFile"].Value);
        }

        if (file.Length > MaxPosterBytes)
        {
            return BadRequest(L["Grants:Parameters:Poster:TooLarge"].Value);
        }

        var head = new byte[8];
        int read;
        await using (var stream = file.OpenReadStream())
        {
            read = await stream.ReadAtLeastAsync(head, head.Length, throwOnEndOfStream: false);
        }

        if (!IsSupportedPoster(Path.GetExtension(file.FileName), head.AsSpan(0, read)))
        {
            return BadRequest(L["Grants:Parameters:Poster:Unsupported"].Value);
        }

        var storedFileName = await _fileStorage.StoreAsync(file);
        var replaced = await _parameters.SetPosterAsync(Id, storedFileName);
        DeletePhysicalFile(replaced);

        return new JsonResult(new { posterFileName = storedFileName });
    }

    /// <summary>12b · Afişi kaldırır; kart kuruma özel zemine döner.</summary>
    public async Task<IActionResult> OnPostRemovePosterAsync()
    {
        var removed = await _parameters.RemovePosterAsync(Id);
        DeletePhysicalFile(removed);

        return new JsonResult(new { ok = true });
    }

    /// <summary>
    /// Uzantı ile dosyanın ilk baytları EŞLEŞMELİ. Yalnız uzantıya bakılsaydı ".png" adıyla
    /// gelen başka bir içerik /file/get üzerinden görsel türüyle herkese servis edilirdi.
    /// </summary>
    internal static bool IsSupportedPoster(string? extension, ReadOnlySpan<byte> head)
    {
        var isPng = head.Length >= 8
            && head[0] == 0x89 && head[1] == 0x50 && head[2] == 0x4E && head[3] == 0x47
            && head[4] == 0x0D && head[5] == 0x0A && head[6] == 0x1A && head[7] == 0x0A;
        var isJpeg = head.Length >= 3 && head[0] == 0xFF && head[1] == 0xD8 && head[2] == 0xFF;

        return (extension ?? string.Empty).ToLowerInvariant() switch
        {
            ".png" => isPng,
            ".jpg" or ".jpeg" => isJpeg,
            _ => false
        };
    }

    private void DeletePhysicalFile(string? storedFileName)
    {
        if (string.IsNullOrWhiteSpace(storedFileName))
        {
            return;
        }

        var path = _rootFolderProvider.ResolveSafePath(storedFileName);
        if (path != null && System.IO.File.Exists(path))
        {
            System.IO.File.Delete(path);
        }
    }
}
