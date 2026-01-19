using Apya.Platform.Samples;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Applications;

[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class EfCoreSampleAppServiceTests : SampleAppServiceTests<PlatformEntityFrameworkCoreTestModule>
{

}
