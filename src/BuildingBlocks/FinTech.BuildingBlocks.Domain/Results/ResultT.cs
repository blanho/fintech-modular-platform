namespace FinTech.BuildingBlocks.Domain.Results;

public class Result<T> : Result
{
    private Result(T value) : base(true, Error.None)
    {
        Value = value;
    }

    private Result(Error error) : base(false, error)
    {
        Value = default;
    }

    public T? Value { get; }

    public static Result<T> Success(T value)
    {
        return new Result<T>(value);
    }

    public new static Result<T> Failure(Error error)
    {
        return new Result<T>(error);
    }

    public static implicit operator Result<T>(T value)
    {
        return Success(value);
    }

    public TResult Match<TResult>(Func<T, TResult> onSuccess, Func<Error, TResult> onFailure)
    {
        return IsSuccess ? onSuccess(Value!) : onFailure(Error);
    }

    public Result<TNew> Map<TNew>(Func<T, TNew> mapper)
    {
        return IsSuccess
            ? Result<TNew>.Success(mapper(Value!))
            : Result<TNew>.Failure(Error);
    }

    public Result<TNew> Bind<TNew>(Func<T, Result<TNew>> binder)
    {
        return IsSuccess ? binder(Value!) : Result<TNew>.Failure(Error);
    }
}