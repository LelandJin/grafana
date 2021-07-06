import React from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import {
  StoryboardContext,
  StoryboardDatasourceQuery,
  StoryboardDocumentElement,
  StoryboardVariable,
} from '../../types';
import { css } from '@emotion/css';
import { PanelData, LoadingState, getDefaultTimeRange } from '@grafana/data';
import { PanelRenderer } from '@grafana/runtime';
import { PanelChrome, Alert } from '@grafana/ui';

export function ShowStoryboardDocumentElementResult({
  element,
  context,
  result,
}: {
  element: StoryboardDocumentElement;
  context: StoryboardContext;
  result?: StoryboardVariable;
}): JSX.Element | null {
  if (result == null) {
    return null;
  }
  switch (element.type) {
    case 'markdown': {
      // Let the Editor manage its result, as stateful.
      return null;
    }
    // Maybe use the Table component here?
    case 'csv': {
      if (!result.value) {
        return <></>;
      }
      const panelData = {
        series: result.value,
        timeRange: getDefaultTimeRange(),
        state: LoadingState.Done,
      };
      return <PanelRenderer title="CSV" pluginId="table" data={panelData} width={100} height={300} />;
    }
    case 'plaintext': {
      return null;
    }
    case 'python': {
      return (
        <div>
          {result.stdout ? (
            <>
              <span
                className={css`
                  font-size: 10px;
                  margin-top: 20px;
                  opacity: 0.5;
                `}
              >
                CONSOLE OUTPUT:
              </span>
              <p
                className={css`
                  font-family: monospace;
                  white-space: pre;
                `}
              >
                {result.stdout}
              </p>
            </>
          ) : null}

          {result.error ? (
            <Alert title="Python Error">
              <pre>{result.error}</pre>
            </Alert>
          ) : (
            <>
              <div
                className={css`
                  font-size: 10px;
                  margin-top: 20px;
                  opacity: 0.5;
                `}
              >
                RESULT:
              </div>
              <pre>{JSON.stringify(result.value || '')}</pre>
            </>
          )}
        </div>
      );
    }
    case 'query': {
      // TODO: Result of query as table
      return null;
      // return <Table data={(result.value as PanelData).series[0]} height={300} width={400} />;
    }
    case 'timeseries-plot': {
      const target = context[element.from];
      if (target == null) {
        return null;
      }
      return (
        <div style={{ width: '100%', height: '400px' }}>
          <AutoSizer>
            {({ width, height }) => {
              if (width < 3 || height < 3) {
                return null;
              }

              return (
                <PanelChrome width={width} height={height}>
                  {(innerWidth, innerHeight) => {
                    return (
                      <PanelRenderer
                        title={(target.element as StoryboardDatasourceQuery)?.query.expr}
                        pluginId="timeseries"
                        width={innerWidth}
                        height={innerHeight}
                        data={target.value as PanelData}
                      />
                    );
                  }}
                </PanelChrome>
              );
            }}
          </AutoSizer>
        </div>
      );
    }
  }
}