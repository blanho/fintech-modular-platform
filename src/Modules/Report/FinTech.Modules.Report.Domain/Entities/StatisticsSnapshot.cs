using FinTech.BuildingBlocks.Domain;
using FinTech.Modules.Report.Domain.Enums;

namespace FinTech.Modules.Report.Domain.Entities;

public sealed class StatisticsSnapshot : Entity<Guid>
{
    private StatisticsSnapshot() { }

    public MetricType MetricType { get; private set; }
    public decimal Value { get; private set; }
    public DateTime RecordedAt { get; private set; }
    public string Granularity { get; private set; } = default!;
    public string? Dimension { get; private set; }
    public string? Metadata { get; private set; }

    public static StatisticsSnapshot Create(
        MetricType metricType,
        decimal value,
        DateTime recordedAt,
        string granularity,
        string? dimension = null,
        string? metadata = null)
    {
        return new StatisticsSnapshot
        {
            Id = Guid.NewGuid(),
            MetricType = metricType,
            Value = value,
            RecordedAt = recordedAt,
            Granularity = granularity,
            Dimension = dimension,
            Metadata = metadata
        };
    }
}
