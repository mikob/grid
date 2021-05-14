import * as React from 'react';
import Editor from '@monaco-editor/react';
import { Popover } from 'react-tiny-popover';
import { EditorProps } from '@supabase/react-data-grid';
import { useTrackedState } from '../../store';
import { BlockKeys, NullValue } from '../common';

export function JsonEditor<TRow, TSummaryRow = unknown>({
  row,
  column,
  onRowChange,
}: EditorProps<TRow, TSummaryRow>) {
  const state = useTrackedState();
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const gridColumn = state.gridColumns.find(x => x.name == column.key);
  const initialValue = row[column.key as keyof TRow] as unknown;
  const jsonString = initialValue ? JSON.stringify(initialValue) : '';
  const prettyJsonValue = prettifyJSON(jsonString);
  const [value, setValue] = React.useState<string | null>(prettyJsonValue);

  const onEscape = React.useCallback((newValue: string | null) => {
    commitChange(newValue);
    setIsPopoverOpen(false);
  }, []);

  function handleEditorDidMount(editor: any) {
    setTimeout(() => {
      editor?.focus();
    }, 0);
  }

  function onChange(_value: string | undefined) {
    if (!_value || _value == '') setValue(null);
    else setValue(_value);
  }

  function onBlur() {
    commitChange(value);
    setIsPopoverOpen(false);
  }

  function commitChange(newValue: string | null) {
    if (!newValue) {
      onRowChange({ ...row, [column.key]: null }, true);
    } else if (verifyJSON(newValue)) {
      const jsonValue = JSON.parse(newValue);
      onRowChange({ ...row, [column.key]: jsonValue }, true);
    }
  }

  return (
    <Popover
      isOpen={isPopoverOpen}
      onClickOutside={onBlur}
      padding={-35}
      containerClassName=""
      positions={['bottom', 'top', 'left']}
      align="start"
      content={
        <BlockKeys value={value} onEscape={onEscape}>
          <Editor
            width={`${gridColumn?.width || column.width}px`}
            height="200px"
            theme="vs-dark"
            defaultLanguage="json"
            defaultValue={value || ''}
            onChange={onChange}
            onMount={handleEditorDidMount}
            options={{
              tabSize: 2,
              fontSize: 11,
              minimap: {
                enabled: false,
              },
              glyphMargin: false,
              folding: false,
              lineNumbers: 'off',
              lineDecorationsWidth: 0,
              lineNumbersMinChars: 0,
            }}
          />
        </BlockKeys>
      }
    >
      <div
        className={`${
          !!value && jsonString.trim().length == 0 ? 'fillContainer' : ''
        } px-2 text-sm`}
        onClick={() => setIsPopoverOpen(!isPopoverOpen)}
      >
        {value ? jsonString : <NullValue />}
      </div>
    </Popover>
  );
}

export const prettifyJSON = (value: string) => {
  if (value.length > 0) {
    try {
      return JSON.stringify(JSON.parse(value), undefined, 2);
    } catch (err) {
      // dont need to throw error, just return text value
      // Users have to fix format if they want to save
      return value;
    }
  } else {
    return value;
  }
};

export const minifyJSON = (value: string) => {
  try {
    return JSON.stringify(JSON.parse(value));
  } catch (err) {
    throw err;
  }
};

export const verifyJSON = (value: string) => {
  try {
    JSON.parse(value);
    return true;
  } catch (err) {
    return false;
  }
};