using System;
using System.Threading.Tasks;
using Volo.Abp.Domain.Services;

namespace Apya.Platform.DynamicAssets;

/// <summary>
/// Resolves which form a public <c>/f/{slug}</c> address points to, and which tenant the
/// response belongs to. Slugs are unique per tenant only, so the lookup order matters:
/// <list type="number">
/// <item>The link names the form's tenant (tenant forms shared outside the app): the form is
/// looked up there and the response is written there. Anonymous visitors have no tenant of
/// their own, so without this a tenant's public link could never be opened.</item>
/// <item>Otherwise the caller's own tenant is searched first (a tenant's own form wins).</item>
/// <item>A signed-in tenant user who does not own the slug falls back to the host's forms; the
/// response is written to the FILLER's tenant, so each firm keeps its own answers.</item>
/// </list>
/// </summary>
public class PublicFormLocator : DomainService
{
    private readonly IAppDocumentRepository _documentRepository;

    public PublicFormLocator(IAppDocumentRepository documentRepository)
    {
        _documentRepository = documentRepository;
    }

    public async Task<PublicFormLocation?> FindAsync(string slug, Guid? formTenantId)
    {
        if (formTenantId.HasValue)
        {
            using (CurrentTenant.Change(formTenantId))
            {
                var tenantForm = await _documentRepository.GetBySlugWithBlocksAsync(slug);
                return tenantForm is null ? null : new PublicFormLocation(tenantForm, formTenantId);
            }
        }

        var ownForm = await _documentRepository.GetBySlugWithBlocksAsync(slug);
        if (ownForm is not null)
        {
            return new PublicFormLocation(ownForm, CurrentTenant.Id);
        }

        var fillerTenantId = CurrentTenant.Id;
        if (fillerTenantId is null)
        {
            return null;
        }

        using (CurrentTenant.Change(null))
        {
            var hostForm = await _documentRepository.GetBySlugWithBlocksAsync(slug);
            return hostForm is null ? null : new PublicFormLocation(hostForm, fillerTenantId);
        }
    }
}

/// <param name="Document">The published form (blocks loaded).</param>
/// <param name="ResponseTenantId">Tenant the response must be written to.</param>
public record PublicFormLocation(AppDocument Document, Guid? ResponseTenantId);
