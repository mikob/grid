import { IRowService } from '.';
import { Filter, ServiceError, Sort, SupaRow, SupaTable } from '../../types';
import Query from '../../query';
import { SupabaseGridQueue } from '../../constants';

export class SqlRowService implements IRowService {
  protected query = new Query();

  constructor(
    protected table: SupaTable,
    protected onSqlQuery: (
      query: string
    ) => Promise<{ data?: any; error?: any }>,
    protected onError: (error: any) => void
  ) {}

  async count(filters: Filter[]) {
    let queryChains = this.query
      .from(this.table.name, this.table.schema ?? undefined)
      .count();
    filters
      .filter((x) => x.value && x.value != '')
      .forEach((x) => {
        queryChains = queryChains.filter(x.column, x.operator, x.value);
      });
    const query = queryChains.toSql();
    console.log('count query: ', query);
    const { data, error } = await this.onSqlQuery(query);
    if (error) {
      return { error };
    } else {
      if (data?.length == 1) {
        return { data: data[0].count };
      } else {
        return { error: { message: 'fetch rows count failed' } };
      }
    }
  }

  async create(row: SupaRow) {
    console.log('create: ', row);
    return { error: { message: 'not implemented' } };
  }

  delete(rows: SupaRow[]) {
    const { primaryKeys, error } = this._getPrimaryKeys();
    if (error) return { error };

    let queryChains = this.query
      .from(this.table.name, this.table.schema ?? undefined)
      .delete();
    primaryKeys!.forEach((key) => {
      const primaryKeyValues = rows.map((x) => x[key]).join(',');
      queryChains = queryChains.filter(key, 'in', primaryKeyValues);
    });
    const query = queryChains.toSql();
    console.log('delete query: ', query);

    SupabaseGridQueue.add(async () => {
      const { error } = await this.onSqlQuery(query);
      if (error) throw error;
    }).catch((error) => {
      this.onError(error);
    });

    return {};
  }

  async fetchPage(
    page: number,
    rowsPerPage: number,
    filters: Filter[],
    sorts: Sort[]
  ) {
    const pageFromZero = page > 0 ? page - 1 : page;
    const from = pageFromZero * rowsPerPage;
    const to = (pageFromZero + 1) * rowsPerPage - 1;
    let queryChains = this.query
      .from(this.table.name, this.table.schema ?? undefined)
      .select();
    filters
      .filter((x) => x.value && x.value != '')
      .forEach((x) => {
        queryChains = queryChains.filter(x.column, x.operator, x.value);
      });
    sorts.forEach((x) => {
      queryChains = queryChains.order(x.column, x.ascending, x.nullsFirst);
    });
    const query = queryChains.range(from, to).toSql();
    console.log('select query: ', query);
    const { data, error } = await this.onSqlQuery(query);
    if (error) {
      this.onError(error);
      return { data: { rows: [] } };
    } else {
      const rows = data?.map((x: any, index: number) => {
        return { idx: index, ...x } as SupaRow;
      });
      return { data: { rows } };
    }
  }

  update(row: SupaRow) {
    const { primaryKeys, error } = this._getPrimaryKeys();
    if (error) {
      return { error };
    }

    const { idx, ...value } = row;
    const matchValues: any = {};
    primaryKeys!.forEach((key) => {
      matchValues[key] = row[key];
    });
    const query = this.query
      .from(this.table.name, this.table.schema ?? undefined)
      .update(value)
      .match(matchValues)
      .toSql();
    console.log('update query: ', query);

    SupabaseGridQueue.add(async () => {
      const { error } = await this.onSqlQuery(query);
      if (error) throw error;
    }).catch((error) => {
      this.onError(error);
    });

    return {};
  }

  _getPrimaryKeys(): { primaryKeys?: string[]; error?: ServiceError } {
    const pkColumns = this.table.columns.filter((x) => x.isPrimaryKey);
    if (!pkColumns || pkColumns.length == 0) {
      return { error: { message: "Can't find primary key" } };
    }
    return { primaryKeys: pkColumns.map((x) => x.name) };
  }
}