export function endsWith(haystack: string, needle: string): boolean {
  // search forward starting from end minus needle length characters
  var temp: number;
  return needle === "" || ((temp = haystack.length - needle.length) >= 0 && haystack.indexOf(needle, temp) !== -1);
}

export function startsWith(haystack: string, needle: string): boolean {
  // search backwards starting from haystack length characters from the end
  return needle === "" || haystack.lastIndexOf(needle, 0) !== -1;
}


export function generatePagination(total: number, pagenum: number, limit: number) {
  const totalPage = Math.ceil(total / limit);

  let prev = pagenum - 1;
  if (prev < 1) {
    prev = 0;
  }

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

function filterParams(params: Record<string, any>, fieldAllowed: Record<string, string>): string {
  delete params.sort;
  delete params.page;
  delete params.limit;
  delete params.search;
  delete params.filter;

  let queryFilter = '';

  for (const [field, value] of Object.entries(params)) {
    if (fieldAllowed[field]) {
      const allowedField = fieldAllowed[field];
      if (typeof value === 'object') {
        for (const [comparison, val] of Object.entries(value)) {
          if (val !== '') {
            switch (comparison) {
              case 'eq':
                queryFilter += ` AND ${allowedField} = '${val}' `;
                break;
              case 'neq':
                queryFilter += ` AND ${allowedField} != '${val}' `;
                break;
              case 'lt':
                queryFilter += ` AND ${allowedField} < '${val}' `;
                break;
              case 'gt':
                queryFilter += ` AND ${allowedField} > '${val}' `;
                break;
              case 'lte':
                queryFilter += ` AND ${allowedField} <= '${val}' `;
                break;
              case 'gte':
                queryFilter += ` AND ${allowedField} >= '${val}' `;
                break;
              case 'le':
                queryFilter += ` AND ${allowedField} LIKE '${val}%' `;
                break;
              case 'ls':
                queryFilter += ` AND ${allowedField} LIKE '%${val}' `;
                break;
              case 'lse':
                queryFilter += ` AND ${allowedField} LIKE '%${val}%' `;
                break;
              case 'in':
                const fi = (val as string).split(',').map(v => `'${v}'`);
                queryFilter += ` AND ${allowedField} IN (${fi.join(',')}) `;
                break;
              case 'nin':
                const fiNin = (val as string).split(',').map(v => `'${v}'`);
                queryFilter += ` AND ${allowedField} NOT IN (${fiNin.join(',')}) `;
                break;
              default:
                queryFilter += ` AND ${allowedField} = '${val}' `;
                break;
            }
          }
        }
      } else {
        if (value !== '') {
          queryFilter += ` AND ${allowedField} = '${value}' `;
        }
      }
    }
  }
  return queryFilter;
}

function searchQuery(search: string, field: string | string[]): string {
  let query = '';

  if (Array.isArray(field)) {
    for (const row of field) {
      if (search && !row.endsWith('datetime') && !row.endsWith('date')) {
        query += `${row} LIKE '%${search}%' OR `;
      }
    }
  }
  return query ? ` AND (${query.slice(0, -4)}) ` : '';
}

function generateFieldQuery(arr: Record<string, string>): { sql: string[], field: Record<string, string> } {

  const result: { sql: string[], field: Record<string, string> } = { sql: [], field: {} };

  for (const [key, val] of Object.entries(arr)) {
    if (isNaN(Number(key))) {
      result.sql.push(`${key} as '${val}'`);
      result.field[val] = key;
    } else {
      result.sql.push(val);
      result.field[val] = val;
    }
  }
  return result;
}


export async function generate(params: Record<string, any>, query: Record<string, any>, db: any): Promise<Record<string, any>> {
  const fromTableAndJoin = query.table_and_join;
  const fieldShow = generateFieldQuery(query.field_show);
  const whereDetail = query.where_detail || '';
  const groupBy = query.group_by ? `GROUP BY ${query.group_by}` : '';
  const having = query.having ? ` HAVING ${query.having}` : '';
  const fieldSearch = query.field_search || [];

  let limit = query.limit !== undefined ? (query.limit === '' ? 10 : query.limit) : 10;
  if (params.limit) {
    limit = parseInt(params.limit) <= 0 ? limit : parseInt(params.limit);
  }

  let page = params.page ? (parseInt(params.page) <= 0 ? 1 : parseInt(params.page)) : 1;

  const sort = params.sort || '';
  const search = params.search || '';

  const start = (page - 1) * limit;

  let queryFilter = 'WHERE 1 ';

  const resultData: Record<string, any> = {};

  queryFilter += filterParams(params, fieldShow.field);
  queryFilter += searchQuery(search, fieldSearch);

  if (whereDetail.trim()) {
    queryFilter += ` AND ${whereDetail} `;
  }

  let arrSort = sort ? sort.split(',') : [];
  let byPass = false;

  if (query.order) {
    arrSort = query.order.split(',');
    byPass = true;
  }

  let queryOrder = '';
  for (let value of arrSort) {
    let dir = 'ASC';

    if (value.startsWith('-')) {
      dir = 'DESC';
      value = value.slice(1);
    }

    if (!byPass) {
      if (fieldShow.field[value]) {
        queryOrder += `${value} ${dir},`;
      }
    } else {
      queryOrder += `${value} ${dir},`;
    }
  }

  queryOrder = queryOrder.slice(0, -1);
  const orderBy = queryOrder ? `ORDER BY ${queryOrder}` : '';

  const strFieldSearch = fieldShow.sql.join(',');

  let pagination = true;

  if (params.pagination_bool) {
    pagination = params.pagination_bool === '1';
    if (!pagination) {
      query.no_limit = true;
    }
  }

  if (query.pagination !== undefined) {
    pagination = query.pagination;
  }

  const queryLimit = query.no_limit ? '' : `LIMIT ${start}, ${limit}`;
  let sqlGet: any = `
        SELECT
        ${strFieldSearch}
        ${fromTableAndJoin}
        ${queryFilter}
        ${groupBy}
        ${having}
        ${orderBy}
        ${queryLimit}
    `;

  const result = await db.rawQuery(sqlGet);

  resultData.items = result[0];

  let sqlCount: any = ''
  if (pagination) {
    sqlCount = `
      SELECT count(*) as total
      ${fromTableAndJoin}
      ${queryFilter}
        `;
    if (groupBy) {
      sqlCount = `
        SELECT count(*) as total
        FROM
        ( SELECT ${query.group_by}
            ${fromTableAndJoin}
            ${queryFilter}
            ${groupBy}
            ${having}
        ) result
    `;
    }

    const totalResult: any = await db.rawQuery(sqlCount);
    const total = totalResult[0][0]['total'];
    resultData.pagination = generatePagination(total, page, limit);
  }

  return resultData;
}
