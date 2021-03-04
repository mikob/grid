import { SupaColumn, SupaTable } from '../dist';

const colId: SupaColumn = {
  tableId: 16523,
  schema: 'public',
  id: '16523.1',
  position: 1,
  name: 'id',
  defaultValue: null,
  dataType: 'bigint',
  format: 'int8',
  isIdentity: true,
  isGeneratable: true,
  isNullable: false,
  isUpdatable: true,
  enums: [],
  comment: null,
};
const colName: SupaColumn = {
  tableId: 16523,
  schema: 'public',
  id: '16523.2',
  position: 2,
  name: 'name',
  defaultValue: null,
  dataType: 'text',
  format: 'text',
  isIdentity: false,
  isGeneratable: false,
  isNullable: true,
  isUpdatable: true,
  enums: [],
  comment: 'Full country name.',
};
const colIso2: SupaColumn = {
  tableId: 16523,
  schema: 'public',
  id: '16523.3',
  position: 3,
  name: 'iso2',
  defaultValue: null,
  dataType: 'text',
  format: 'text',
  isIdentity: false,
  isGeneratable: false,
  isNullable: false,
  isUpdatable: true,
  enums: [],
  comment: 'ISO 3166-1 alpha-2 code.',
};
const colIso3: SupaColumn = {
  tableId: 16523,
  schema: 'public',
  id: '16523.4',
  position: 4,
  name: 'iso3',
  defaultValue: null,
  dataType: 'text',
  format: 'text',
  isIdentity: false,
  isGeneratable: false,
  isNullable: true,
  isUpdatable: true,
  enums: [],
  comment: 'ISO 3166-1 alpha-3 code.',
};
const colLocalName: SupaColumn = {
  tableId: 16523,
  schema: 'public',
  id: '16523.5',
  position: 5,
  name: 'local_name',
  defaultValue: null,
  dataType: 'text',
  format: 'text',
  isIdentity: false,
  isGeneratable: false,
  isNullable: true,
  isUpdatable: true,
  enums: [],
  comment: 'Local variation of the name.',
};
const colContinent: SupaColumn = {
  tableId: 16523,
  schema: 'public',
  id: '16523.6',
  position: 6,
  name: 'continent',
  defaultValue: null,
  dataType: 'USER-DEFINED',
  format: 'continents',
  isIdentity: false,
  isGeneratable: false,
  isNullable: true,
  isUpdatable: true,
  enums: [
    'Africa',
    'Antarctica',
    'Asia',
    'Europe',
    'Oceania',
    'North America',
    'South America',
  ],
  comment: null,
};
const countries: SupaTable = {
  id: 16523,
  name: 'countries',
  comment: 'Full list of countries.',
  schema: 'public',
  totalRows: 249,
  columns: [colId, colName, colIso2, colIso3, colLocalName, colContinent],
  relationships: [],
};
export default countries;