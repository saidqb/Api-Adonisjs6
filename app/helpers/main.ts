export function round(value: number, precision: number = 0): number {
  const multiplier = Math.pow(10, precision || 0)
  return Math.round(value * multiplier) / multiplier
}

export function tester(value: string): string {
  return value
}

export function pageGenerate(total: number, pagenum: number, limit: number) {
  const totalPage = Math.ceil(total / limit);

  // Prev page
  let prev = pagenum - 1;
  if (prev < 1) {
    prev = 0;
  }

  // Next page
  let next = pagenum + 1;
  if (next > totalPage) {
    next = 0;
  }

  let from = 1;
  let to = totalPage;

  const toPage = pagenum - 2;
  if (toPage > 0) {
    from = toPage;
  }

  if (totalPage >= 5) {
    if (totalPage > 0) {
      to = 5 + toPage;
      if (to > totalPage) {
        to = totalPage;
      }
    } else {
      to = 5;
    }
  }

  // Looping pagination boxes
  let firstPageIsTrue = false;
  let lastPageIsTrue = false;
  let detail = [];
  if (totalPage <= 1) {
    detail = [];
  } else {
    for (let i = from; i <= to; i++) {
      detail.push(i);
    }
    if (from !== 1) {
      firstPageIsTrue = true;
    }
    if (to !== totalPage) {
      lastPageIsTrue = true;
    }
  }

  let totalDisplay = limit;
  if (next === 0) {
    totalDisplay = total % limit;
  }

  return {
    total_data: total,
    total_page: totalPage,
    total_display: totalDisplay,
    first_page: firstPageIsTrue,
    last_page: lastPageIsTrue,
    prev: prev,
    current: pagenum,
    next: next,
    detail: detail
  };
}
