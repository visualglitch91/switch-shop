import { QueryClient, useMutation } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: { queries: { cacheTime: Infinity } },
});

export function useGenericMutation<T, R>({
  onResolve,
}: {
  onResolve?: (result: T) => Promise<R>;
} = {}) {
  return useMutation((func: () => Promise<T>) =>
    //@ts-expect-error
    func().then(onResolve || ((f) => f))
  );
}
