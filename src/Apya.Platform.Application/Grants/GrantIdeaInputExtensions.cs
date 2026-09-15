using Apya.Platform.Grants.Dtos;

namespace Apya.Platform.Grants;

/// <summary>
/// Proje fikri formunun 2-9. cevaplarını kayda yazar. Çağrıya ilgi, havuza fikir ve danışmanın firma adına
/// girişi aynı formu doldurur; sekiz argümanlık çağrı üç yerde tekrarlanmasın diye tek yer.
/// </summary>
internal static class GrantIdeaInputExtensions
{
    public static void SetIdeaDetails(this GrantInterest interest, GrantIdeaInput input)
        => interest.SetIdeaDetails(
            input.ProblemStatement,
            input.TargetAudience,
            input.PlannedActivities,
            input.DurationAndPartners,
            input.SupportNeeds,
            input.PriorExperience,
            input.TeamStructure,
            input.Stakeholders);
}
