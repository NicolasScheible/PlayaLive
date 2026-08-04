// Gemeinsamer Mock-Baustein für Tests der Services/Repositories in diesem Ordner (kein Test-Suite
// selbst, daher kein `.test.ts`-Suffix). Bildet die verkettbare Supabase-Postgrest-Query-API
// (`.select().eq()...`) nach, inkl. `single()`/`maybeSingle()` sowie direktem `await` auf die Query
// selbst (Postgrest-Query-Builder sind „thenable").
type QueryResult<T = unknown> = { data: T; error: unknown };

export function createQueryBuilderMock<T = unknown>(result: QueryResult<T>) {
  const chainMethods = [
    'select',
    'insert',
    'update',
    'delete',
    'eq',
    'is',
    'in',
    'gte',
    'lte',
    'order',
  ] as const;

  const builder: Record<string, unknown> = {};

  chainMethods.forEach((method) => {
    builder[method] = jest.fn(() => builder);
  });

  builder.single = jest.fn().mockResolvedValue(result);
  builder.maybeSingle = jest.fn().mockResolvedValue(result);
  builder.then = (resolve: (value: QueryResult<T>) => unknown) =>
    Promise.resolve(result).then(resolve);

  return builder;
}
