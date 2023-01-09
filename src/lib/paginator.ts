const offset = (page: number, size: number) => {
  return (page - 1) * size;
};

const pageUrls = (
  page: number,
  size: number,
  count: number,
  endpoint: string,
) => {
  const paging: Record<string, string | number | null> = {};

  console.log(page, size);

  if (size + offset(page, size) >= count) {
    paging.next = null;
    if (page > 1) paging.previous = `${endpoint}?page=${page - 1}&size=${size}`;
    else paging.previous = null;
  } else {
    paging.next = `${endpoint}?page=${page + 1}&size=${size}`;
    if (page > 1) paging.previous = `${endpoint}?page=${page - 1}&size=${size}`;
    else paging.previous = null;
  }

  return paging;
};

const paginator = { offset, pageUrls };

export default paginator;
