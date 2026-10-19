using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp.Identity;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tasks;

/// <summary>QA-26 · Görev ekranlarının kişi listesi e-posta ve telefon taşımaz; aktiflik gerçek değerdir.</summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class TaskUsersLookupPrivacy_Tests : PlatformEntityFrameworkCoreTestBase
{
    [Fact]
    public async Task Kisi_listesi_iletisim_bilgisi_tasimaz()
    {
        var id = Guid.NewGuid();
        var suffix = id.ToString("N")[..8];
        await WithUnitOfWorkAsync(async () =>
        {
            var user = new IdentityUser(id, "gizli-" + suffix, $"gizli-{suffix}@apya.test") { Name = "Gizem", Surname = "Er" };
            user.SetPhoneNumber("05551234567", false);
            user.SetIsActive(false);
            await GetRequiredService<IIdentityUserRepository>().InsertAsync(user, autoSave: true);
        });

        var row = (await GetRequiredService<ITaskAppService>().GetUsersLookupAsync()).Items.Single(u => u.Id == id);

        row.Name.ShouldBe("Gizem");
        row.Email.ShouldBeNullOrEmpty();
        row.PhoneNumber.ShouldBeNullOrEmpty();
        row.IsActive.ShouldBeFalse();
    }
}
