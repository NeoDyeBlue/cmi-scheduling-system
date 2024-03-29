import useSWR from 'swr';
import { useState, useMemo } from 'react';

const pageFetcher = ([url, args]) =>
  fetch(`${url}?${new URLSearchParams(args).toString()}`).then((r) => r.json());

export default function usePaginate({
  url = '',
  limit = 10,
  query = {},
  options = {},
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
  } = useSWR(
    [
      url,
      {
        ...query,
        limit,
        page: pageIndex,
      },
    ],
    pageFetcher,
    options
  );

  const { docs, ...pageData } = result?.data || {};
  const docsSource = useMemo(() => {
    if (result?.data?.docs?.length) {
      return result?.data?.docs;
    } else if (result?.data?.length) {
      return result?.data;
    } else {
      return [];
    }
  }, [result]);

  return {
    docs: docsSource,
    pageData,
    error,
    mutate,
    isValidating,
    isLoading,
    pageIndex,
    setPageIndex,
  };
}
