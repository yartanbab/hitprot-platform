using System;
using Apya.Platform.Documents;
using Shouldly;
using Xunit;

namespace Apya.Platform.Tests.Domain.Documents;

/// <summary>
/// DOC-09: belgeyi "Kesin"e kimin, ne zaman aldığı kaydedilir. Eskiden bu bilgi yalnız erişim
/// izinde serbest metindi ve teslim önizlemesi gösteremiyordu.
/// </summary>
public class DocumentFile_Finalization_Tests
{
    private static readonly Guid User = Guid.NewGuid();
    private static readonly DateTime At = new(2026, 10, 12, 9, 30, 0);

    private static DocumentFile NewFile() => new(Guid.NewGuid(), null, Guid.NewGuid(), "sozlesme.pdf");

    [Fact]
    public void Kesine_alinca_kim_ve_ne_zaman_kaydedilir()
    {
        var file = NewFile();

        file.ChangeStatus(DocumentFileStatus.Final, User, At);

        file.Status.ShouldBe(DocumentFileStatus.Final);
        file.FinalizedByUserId.ShouldBe(User);
        file.FinalizedAt.ShouldBe(At);
    }

    /// <summary>Eşleşme ve eşleşmenin kalkması kesinleştirme değildir: ilk iz korunur.</summary>
    [Fact]
    public void Eslesme_ve_eslesmenin_kalkmasi_izi_degistirmez()
    {
        var file = NewFile();
        file.ChangeStatus(DocumentFileStatus.Final, User, At);

        var other = Guid.NewGuid();
        file.ChangeStatus(DocumentFileStatus.Matched, other, At.AddDays(1));
        file.ChangeStatus(DocumentFileStatus.Final, other, At.AddDays(2));

        file.FinalizedByUserId.ShouldBe(User);
        file.FinalizedAt.ShouldBe(At);
    }

    [Fact]
    public void Taslaga_donunce_iz_silinir_yeniden_kesinlestiren_yazilir()
    {
        var file = NewFile();
        file.ChangeStatus(DocumentFileStatus.Final, User, At);

        file.ChangeStatus(DocumentFileStatus.Draft, User, At.AddDays(1));
        file.FinalizedByUserId.ShouldBeNull();
        file.FinalizedAt.ShouldBeNull();

        var second = Guid.NewGuid();
        file.ChangeStatus(DocumentFileStatus.Final, second, At.AddDays(2));
        file.FinalizedByUserId.ShouldBe(second);
        file.FinalizedAt.ShouldBe(At.AddDays(2));
    }

    /// <summary>Taslaktan doğrudan eşleşen belge "Kesin"e alınmamıştır.</summary>
    [Fact]
    public void Taslaktan_dogrudan_eslesen_belgede_iz_yoktur()
    {
        var file = NewFile();

        file.ChangeStatus(DocumentFileStatus.Matched, User, At);

        file.FinalizedByUserId.ShouldBeNull();
        file.FinalizedAt.ShouldBeNull();
    }
}
