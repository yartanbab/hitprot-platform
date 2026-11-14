using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Volo.Abp.DependencyInjection;

namespace Apya.Platform.Web.Transfer;

/// <summary>
/// Katalogdaki her aktarım ucunun önünde durur: istek bir dışa/içe aktarma ucuysa
/// <see cref="TransferAccess"/> kuralını uygular. Uçların kendi sayfa izinleri ayrıca geçerlidir;
/// bu süzgeç yalnız aktarım iznini ekler. Tek yerde durduğu için yeni bir uç kataloğa yazıldığı
/// anda aynı kurala girer.
/// </summary>
public class TransferAccessPageFilter : IAsyncPageFilter, ITransientDependency
{
    private readonly TransferAccess _access;

    public TransferAccessPageFilter(TransferAccess access)
    {
        _access = access;
    }

    public Task OnPageHandlerSelectionAsync(PageHandlerSelectedContext context) => Task.CompletedTask;

    public async Task OnPageHandlerExecutionAsync(PageHandlerExecutingContext context, PageHandlerExecutionDelegate next)
    {
        var endpoint = TransferCatalog.Find(context.ActionDescriptor.ViewEnginePath, context.HandlerMethod?.Name);
        if (endpoint != null && !await _access.CanAsync(endpoint.Direction))
        {
            context.Result = new ForbidResult();
            return;
        }

        await next();
    }
}
