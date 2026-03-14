namespace FinTech.SharedKernel.Results;

public class Result<T> : Result
{
    public T? Value { get; }

    private Result(T value) : base(true, Error.None)
    {
        Value = value;
    }

    private Result(Error error) : base(false, error)
    {
        Value = default;
    }

public static Result<T> Success(T value) => new(value);

public new static Result<T> Failure(Error error) => new(error);

public static implicit operator Result<T>(T value) => Success(value);

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