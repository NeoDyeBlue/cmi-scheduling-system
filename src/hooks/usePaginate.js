import useSWR from 'swr';
import { useState } from 'react';

export default function usePaginate({
  url,
  limit,
  query,
  options,
  initialIndex,
}) {
  const [pageIndex, setPageIndex] = useState(initialIndex);

  const getKey = () => {
    if (query && Object.keys(query).length) {
      // console.log(pageIndex, query);
      return `${url}?${new URLSearchParams(
        query
      ).toString()}&page=${pageIndex}&limit=${limit}`;
    } else {
      return `${url}?page=${pageIndex}&limit=${limit}`;
    }
  };

  const { data, error, mutate, isValidating, isLoading } = useSWR(
    getKey,
    options
  );

  return {
    data,
    error,
    mutate,
    isValidating,
    isLoading,
    setPageIndex,
  };
}
