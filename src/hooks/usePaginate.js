import useSWR from 'swr';
import { useState, useMemo } from 'react';

export default function usePaginate({
  url,
  limit,
  query,
  options,
  initialIndex = 1,
}) {
  const [pageIndex, setPageIndex] = useState(initialIndex);

  const getKey = useMemo(() => {
    if (query && Object.keys(query).length) {
      // console.log(pageIndex, query);
      return `${url}?${new URLSearchParams(
        query
      ).toString()}&page=${pageIndex}&limit=${limit}`;
    } else {
      return `${url}?page=${pageIndex}&limit=${limit}`;
    }
  }, [limit, pageIndex, url, query]);

  const {
    data: result,
    error,
    mutate,
    isValidating,
    isLoading,
  } = useSWR(getKey, options);

  const { docs, ...pageData } = result?.data || {};

  return {
    docs: result?.data?.docs || [],
    pageData,
    error,
    mutate,
    isValidating,
    isLoading,
    pageIndex,
    setPageIndex,
  };
}
