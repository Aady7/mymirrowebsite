import { supabase } from "../supabase";

interface PaginatedResponse<T> {
  data: T[];
  count: number;
}

export async function fetchPaginatedData<T = any>(
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedResponse<T>> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from('tagged_products')
    .select('*', { count: 'exact' })
    .range(from, to);

  if (error || !data || count === null) {
    throw new Error(error?.message || 'Unknown error fetching paginated data');
  }

  return { data, count };
}
