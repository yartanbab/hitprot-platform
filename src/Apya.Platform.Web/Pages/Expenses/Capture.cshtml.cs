using System;
using System.Threading.Tasks;
using Apya.Platform.Documents;
using Apya.Platform.Expenses;
using Apya.Platform.Web.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Apya.Platform.Web.Pages.Expenses;

[Authorize]
public class CaptureModel : PlatformPageModel
{
    private readonly IExpenseAppService _expenseAppService;
    private readonly IFinanceDocumentAppService _financeDocuments;
    private readonly FinanceDocumentUploads _uploads;

    /// <summary>Fiş fotoğrafı kayda eklenebilir mi (Belgeler paketi + belge yükleme izni). Ada basılır.</summary>
    public bool CanAttachDocuments { get; private set; }

    public CaptureModel(
        IExpenseAppService expenseAppService,
        IFinanceDocumentAppService financeDocuments,
        FinanceDocumentUploads uploads)
    {
        _expenseAppService = expenseAppService;
        _financeDocuments = financeDocuments;
        _uploads = uploads;
    }

    public async Task OnGetAsync()
    {
        CanAttachDocuments = await _financeDocuments.CanAttachAsync();
    }

    /// <summary>
    /// Çekilen fişi, kullanıcının az önce bu ekrandan kaydettiği gidere ekler (Belge Merkezi + bağ).
    /// Gider ayrı istekle oluşur; fiş eklenemezse gider kaybolmaz, ekran uyarır.
    ///
    /// 🔴 Yalnız KENDİ oluşturduğu gidere: bu uç başkasının giderine dosya eklemenin yolu olmamalı.
    /// Başkasının giderine belge, düzenleme izniyle gider penceresinden eklenir.
    /// </summary>
    public async Task<IActionResult> OnPostAttachReceiptAsync(Guid expenseId, IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest();
        }

        // Gider görme izni + kiracı süzgeci servisten geçer; yoksa 403/404.
        var expense = await _expenseAppService.GetAsync(expenseId);
        if (expense.CreatorId != CurrentUser.Id)
        {
            // Forbid() çerez şemasında erişim sayfasına YÖNLENDİRİR; istemci düz 403 bekler.
            return StatusCode(StatusCodes.Status403Forbidden);
        }

        var uploads = await _uploads.StoreAsync(new[] { file });
        try
        {
            var upload = uploads[0];
            await _financeDocuments.AttachToExpenseAsync(
                expenseId, upload.FileName, upload.StoredFileName, upload.ContentType, upload.FileSize);
        }
        catch
        {
            _uploads.Discard(uploads);
            throw;
        }

        return NoContent();
    }
}
