using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Localization;
using Scriban;
using Scriban.Runtime;
using Scriban.Syntax;
using Volo.Abp;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Localization;
using Volo.Abp.TextTemplating;

namespace Apya.Platform.TextTemplating;

/// <summary>
/// ABP 10.0.2'nin "Scriban" şablon motorunun Scriban 7'ye derlenmiş karşılığı.
///
/// <para><b>Neden var:</b> <c>Volo.Abp.TextTemplating.Scriban</c> 10.0.2, Scriban 6.x'e derlenmiştir.
/// Scriban 7'de <c>ParserOptions</c> başka türden bir tip olduğundan ABP'nin motoru
/// <c>Template.Parse</c> çağrısı JIT'lendiği anda <c>TypeLoadException</c> (value type mismatch)
/// fırlatır ve ABP'nin HER metin şablonu — şifre sıfırlama e-postası, e-posta doğrulama — render
/// edilemez. Derleme ve birim testleri bunu yakalamaz. Scriban 6.6.0 ise 12 güvenlik açığı
/// taşıyordu (biri kritik); bu motor Scriban 7.2.5'e çıkmayı mümkün kılar.</para>
///
/// <para><b>Nasıl devreye girer:</b> <see cref="PlatformDomainModule"/>,
/// <c>AbpTextTemplatingOptions.RenderingEngines["Scriban"]</c> kaydını bu sınıfa yönlendirir.
/// <c>AbpTemplateRenderer</c> motoru bu sözlükteki tiple çözdüğü için ABP'nin kendi motoru hiç
/// örneklenmez, JIT'lenmez. Davranış ABP'ninkiyle aynıdır: <c>model</c>, <c>L</c> yerelleştirici,
/// <c>globalContext</c> ve <c>content</c> ile layout sarmalama.</para>
///
/// <para>ABP >= 10.2'ye (Scriban 7'ye derlenmiş ilk sürüm) çıkılınca bu sınıf ve modüldeki kayıt
/// silinir. Bkz. Directory.Build.props.</para>
/// </summary>
public class ApyaScribanTemplateRenderingEngine : TemplateRenderingEngineBase, ITransientDependency
{
    /// <summary>ABP şablon tanımları (<c>WithScribanEngine()</c>) motoru bu adla seçer.</summary>
    public const string EngineName = "Scriban";

    public override string Name => EngineName;

    public ApyaScribanTemplateRenderingEngine(
        ITemplateDefinitionManager templateDefinitionManager,
        ITemplateContentProvider templateContentProvider,
        IStringLocalizerFactory stringLocalizerFactory)
        : base(templateDefinitionManager, templateContentProvider, stringLocalizerFactory)
    {
    }

    public override async Task<string> RenderAsync(
        string templateName,
        object? model = null,
        string? cultureName = null,
        Dictionary<string, object>? globalContext = null)
    {
        Check.NotNullOrWhiteSpace(templateName, nameof(templateName));
        globalContext ??= new Dictionary<string, object>();

        if (cultureName == null)
        {
            return await RenderInternalAsync(templateName, globalContext, model);
        }

        using (CultureHelper.Use(cultureName))
        {
            return await RenderInternalAsync(templateName, globalContext, model);
        }
    }

    private async Task<string> RenderInternalAsync(
        string templateName,
        Dictionary<string, object> globalContext,
        object? model = null)
    {
        var templateDefinition = await TemplateDefinitionManager.GetAsync(templateName);
        var content = await GetContentOrNullAsync(templateDefinition)
            ?? throw new AbpException("Şablon içeriği bulunamadı: " + templateName);

        var rendered = await RenderContentAsync(templateDefinition, content, globalContext, model);

        if (templateDefinition.Layout != null)
        {
            globalContext["content"] = rendered;
            rendered = await RenderInternalAsync(templateDefinition.Layout, globalContext);
        }

        return rendered;
    }

    private async Task<string> RenderContentAsync(
        TemplateDefinition templateDefinition,
        string templateContent,
        Dictionary<string, object> globalContext,
        object? model)
    {
        var scriptObject = new ScriptObject();
        scriptObject.Import(globalContext);

        if (model != null)
        {
            scriptObject["model"] = model;
        }

        var localizer = GetLocalizerOrNull(templateDefinition);
        if (localizer != null)
        {
            scriptObject.SetValue("L", new LocalizerFunction(localizer), true);
        }

        var context = new TemplateContext();
        context.PushGlobal(scriptObject);
        context.PushCulture(CultureInfo.CurrentCulture);

        return await Template.Parse(templateContent).RenderAsync(context);
    }

    /// <summary>Şablondaki <c>{{ L "Anahtar" arg1 arg2 }}</c> çağrısı.</summary>
    private sealed class LocalizerFunction : IScriptCustomFunction
    {
        private readonly IStringLocalizer _localizer;

        public LocalizerFunction(IStringLocalizer localizer)
        {
            _localizer = localizer;
        }

        public object? Invoke(
            TemplateContext context, ScriptNode? callerContext, ScriptArray arguments, ScriptBlockStatement? blockStatement)
        {
            return GetString(arguments);
        }

        public ValueTask<object?> InvokeAsync(
            TemplateContext context, ScriptNode? callerContext, ScriptArray arguments, ScriptBlockStatement? blockStatement)
        {
            return new ValueTask<object?>(GetString(arguments));
        }

        private string GetString(ScriptArray arguments)
        {
            var name = arguments.Count > 0 ? arguments[0]?.ToString() : null;
            if (string.IsNullOrWhiteSpace(name))
            {
                return string.Empty;
            }

            var args = arguments.Skip(1)
                .Where(x => x != null && !string.IsNullOrWhiteSpace(x.ToString()))
                .Select(x => x!)
                .ToArray();
            return args.Length > 0 ? _localizer[name, args] : _localizer[name];
        }

        public int RequiredParameterCount => 1;

        public int ParameterCount => ScriptFunctionCall.MaximumParameterCount - 1;

        public ScriptVarParamKind VarParamKind => ScriptVarParamKind.Direct;

        public Type ReturnType => typeof(object);

        public ScriptParameterInfo GetParameterInfo(int index)
        {
            return index == 0
                ? new ScriptParameterInfo(typeof(string), "template_name")
                : new ScriptParameterInfo(typeof(object), "value");
        }
    }
}
