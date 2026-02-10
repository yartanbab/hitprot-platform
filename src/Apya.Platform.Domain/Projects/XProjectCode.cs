////using System;
////using Volo.Abp.Domain.Values;
////using System.Collections.Generic;

////namespace Apya.Platform.Domain.Projects;

////public class ProjectCode : ValueObject
////{
////    public string Value { get; private set; }

////    private ProjectCode() { } // EF için

////    private ProjectCode(string value)
////    {
////        Value = value;
////    }

////    public static ProjectCode Create(string value)
////    {
////        if (string.IsNullOrWhiteSpace(value))
////            throw new ArgumentException("Project code cannot be empty", nameof(value));

////        return new ProjectCode(value);
////    }

////    protected override IEnumerable<object> GetAtomicValues()
////    {
////        yield return Value;
////    }
////}


//using System;
//using Volo.Abp.Domain.Values;
//using System.Collections.Generic;

//namespace Apya.Platform.Domain.Projects;

//internal class ProjectCode : ValueObject
//{
//    public string Value { get; private set; }

//    private ProjectCode() { }

//    private ProjectCode(string value)
//    {
//        Value = value;
//    }

//    public static ProjectCode Create(string value)
//    {
//        if (string.IsNullOrWhiteSpace(value))
//            throw new ArgumentException("Project code cannot be empty", nameof(value));

//        return new ProjectCode(value);
//    }

//    protected override IEnumerable<object> GetAtomicValues()
//    {
//        yield return Value;
//    }
//}
