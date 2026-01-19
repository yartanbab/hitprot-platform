using Microsoft.AspNetCore.Builder;
using Apya.Platform;
using Volo.Abp.AspNetCore.TestBase;

var builder = WebApplication.CreateBuilder();

builder.Environment.ContentRootPath = GetWebProjectContentRootPathHelper.Get("Apya.Platform.Web.csproj");
await builder.RunAbpModuleAsync<PlatformWebTestModule>(applicationName: "Apya.Platform.Web" );

public partial class Program
{
}
