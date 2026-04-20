namespace Apya.Platform.DynamicAssets;

/// <summary>
/// Defines the available block types for an AppDocument.
/// Each block type represents a distinct form element or content area.
/// </summary>
public enum BlockType
{
    Input = 0,
    TextArea = 1,
    Select = 2,
    MultiSelect = 3,
    DatePicker = 4,
    FilePicker = 5,
    TableGrid = 6,
    RichText = 7
}
