import React from 'react';
import { render, screen } from '@testing-library/react';
import { AddPanelWidgetUnconnected as AddPanelWidget, Props } from './AddPanelWidget';
import { DashboardModel, PanelModel } from '../../state';

const getTestContext = (propOverrides?: object) => {
  const props: Props = {
    dashboard: {} as DashboardModel,
    panel: {} as PanelModel,
    addPanel: jest.fn() as any,
  };
  Object.assign(props, propOverrides);
  return render(<AddPanelWidget {...props} />);
};

describe('AddPanelWidget', () => {
  it('should render component without error', () => {
    expect(() => {
      getTestContext();
    });
  });

  it('should render the add panel actions', () => {
    getTestContext();
    expect(screen.getByText(/新添加一个面板/i)).toBeInTheDocument();
    expect(screen.getByText(/新添加一列/i)).toBeInTheDocument();
    expect(screen.getByText(/从面板库中新添加一个面板/i)).toBeInTheDocument();
  });
});
