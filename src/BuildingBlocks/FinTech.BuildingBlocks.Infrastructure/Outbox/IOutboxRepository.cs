namespace FinTech.BuildingBlocks.Infrastructure.Outbox;

public interface IOutboxRepository
{
    Task<IReadOnlyList<OutboxMessage>> GetUnprocessedAsync(int batchSize, CancellationToken ct = default);
    Task UpdateAsync(OutboxMessage message, CancellationToken ct = default);
    Task AddAsync(OutboxMessage message, CancellationToken ct = default);
    Task AddRangeAsync(IEnumerable<OutboxMessage> messages, CancellationToken ct = default);
}
