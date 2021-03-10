import { Dictionary } from '../../types';
import { getDefaultSorts } from '../../utils';
import { INIT_ACTIONTYPE } from './base';

export interface RowInitialState {
  rows: Dictionary<any>[];
  page: number;
  rowsPerPage: number;
  totalRows: number;
}

export const rowInitialState: RowInitialState = {
  rows: [],
  page: 1,
  rowsPerPage: 100,
  totalRows: 0,
};

type ROW_ACTIONTYPE =
  | INIT_ACTIONTYPE
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_ROWS_PER_PAGE'; payload: number }
  | {
      type: 'SET_ROWS';
      payload: { rows: Dictionary<any>[]; totalRows: number };
    }
  | { type: 'ADD_ROWS'; payload: Dictionary<any>[] }
  | { type: 'ADD_NEW_ROW'; payload: Dictionary<any> }
  | { type: 'REMOVE_ROWS'; payload: string[] | number[] };

const RowReducer = (state: RowInitialState, action: ROW_ACTIONTYPE) => {
  switch (action.type) {
    case 'INIT_TABLE': {
      return {
        ...state,
        sorts: getDefaultSorts(action.payload.table),
      };
    }
    case 'SET_PAGE': {
      return {
        ...state,
        page: action.payload,
        refreshPageFlag: -1,
      };
    }
    case 'SET_ROWS_PER_PAGE': {
      return {
        ...state,
        rowsPerPage: action.payload,
        refreshPageFlag: -1,
      };
    }
    case 'SET_ROWS':
      return {
        ...state,
        rows: action.payload.rows,
        totalRows: action.payload.totalRows,
        refreshPageFlag: 0,
      };
    case 'ADD_ROWS': {
      const totalRows = state.totalRows + action.payload.length;
      return {
        ...state,
        rows: state.rows.concat(action.payload),
        totalRows: totalRows,
      };
    }
    case 'ADD_NEW_ROW': {
      const totalRows = state.totalRows + 1;
      return {
        ...state,
        rows: state.rows.concat(action.payload),
        totalRows: totalRows,
      };
    }
    case 'REMOVE_ROWS': {
      const totalRows = state.totalRows - action.payload.length;
      return {
        ...state,
        rows: state.rows.filter(x => !action.payload.includes(x.id as never)),
        totalRows: totalRows,
      };
    }
    default:
      return state;
  }
};

export default RowReducer;