namespace Apya.Platform.Tenants;

/// <summary>Reddin açıklaması: sebep + (varsa) iznin ve modülün görünen adları.</summary>
public sealed record AccessDenialExplanation(
    AccessDenialReason Reason,
    string? PermissionName = null,
    string? PermissionDisplayName = null,
    string? ModuleDisplayName = null)
{
    public static AccessDenialExplanation Unknown { get; } = new(AccessDenialReason.Unknown);
}
