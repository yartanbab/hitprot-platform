using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.Incomes;
using Apya.Platform.Permissions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Finance;

/// <summary>
/// DOC-08 · Gelire (tahsilata) belge bağlar: dekont, onay yazısı vb. Belge, gelirin projesindeki
/// dosyalardan seçilir. Bağ zorunlu değildir; belgesi olmayan tahsilat tabloda uyarı olarak görünür.
/// </summary>
[Authorize(PlatformPermissions.Incomes.Edit)]
public class IncomeDocumentModalModel : AbpPageModel
{
    private readonly IIncomeEntryAppService _incomeAppService;

    [BindProperty(SupportsGet = true)]
    public Guid Id { get; set; }

    /// <summary>Bağlanacak belge; boş gönderilirse yalnız pencere kapanır.</summary>
    [BindProperty]
    public Guid? DocumentFileId { get; set; }

    public List<IncomeDocumentOptionDto> Options { get; private set; } = new();
    public List<IncomeDocumentOptionDto> Linked { get; private set; } = new();

    public IncomeDocumentModalModel(IIncomeEntryAppService incomeAppService)
    {
        _incomeAppService = incomeAppService;
    }

    public virtual async Task<IActionResult> OnGetAsync()
    {
        Linked = await _incomeAppService.GetLinkedDocumentsAsync(Id);
        Options = await _incomeAppService.GetDocumentOptionsAsync(Id);
        return Page();
    }

    public virtual async Task<IActionResult> OnPostAsync()
    {
        if (DocumentFileId.HasValue)
        {
            await _incomeAppService.LinkDocumentAsync(Id, DocumentFileId.Value);
        }
        return NoContent();
    }

    public virtual async Task<IActionResult> OnPostUnlinkAsync(Guid documentFileId)
    {
        await _incomeAppService.UnlinkDocumentAsync(Id, documentFileId);
        return NoContent();
    }
}
