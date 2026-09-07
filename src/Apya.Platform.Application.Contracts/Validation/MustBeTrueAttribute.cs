using System;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Validation;

/// <summary>
/// Onay kutusu işaretlenmeden geçilemez.
///
/// <para>🔴 Bu iş için yaygın olarak kullanılan <c>[Range(typeof(bool), "true", "true")]</c>
/// deyimi SUNUCUDA doğru çalışır ama İSTEMCİDE tersine döner: adaptör markup'a
/// <c>data-val-range-min="True"</c> basar, jQuery ise kural değeri olarak onay kutusunun
/// <c>value</c>'sunu ("true") okur ve iki dizeyi büyük/küçük harfe DUYARLI karşılaştırır —
/// <c>"true" &lt;= "True"</c> yanlıştır. Kutu işaretliyken alan geçersiz sayılır ve form hiç
/// gönderilemez; işaretli değilken jQuery <c>optional()</c> devreye girip geçerli sayar.
/// Kural tam ters çalışır.</para>
///
/// <para>Bu öznitelik istemci adaptörü üretmez; denetim sunucuda yapılır ve hata
/// <c>asp-validation-for</c> alanında aynı şekilde basılır.</para>
/// </summary>
[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field, AllowMultiple = false)]
public sealed class MustBeTrueAttribute : ValidationAttribute
{
    public override bool IsValid(object? value) => value is bool accepted && accepted;
}
