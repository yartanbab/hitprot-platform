using Apya.Platform.Samples;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Domains;

[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class EfCoreSampleDomainTests : SampleDomainTests<PlatformEntityFrameworkCoreTestModule>
{

}
