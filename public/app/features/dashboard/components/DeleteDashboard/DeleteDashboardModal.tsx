import React from 'react';
import { css } from '@emotion/css';
import { sumBy } from 'lodash';
import { Modal, ConfirmModal, Button } from '@grafana/ui';
import { DashboardModel, PanelModel } from '../../state';
import { useDashboardDelete } from './useDashboardDelete';
import useAsyncFn from 'react-use/lib/useAsyncFn';

type DeleteDashboardModalProps = {
  hideModal(): void;
  dashboard: DashboardModel;
};

export const DeleteDashboardModal: React.FC<DeleteDashboardModalProps> = ({ hideModal, dashboard }) => {
  const isProvisioned = dashboard.meta.provisioned;
  const { onDeleteDashboard } = useDashboardDelete(dashboard.uid);

  const [, onConfirm] = useAsyncFn(async () => {
    await onDeleteDashboard();
    hideModal();
  }, [hideModal]);

  const modalBody = getModalBody(dashboard.panels, dashboard.title);

  if (isProvisioned) {
    return <ProvisionedDeleteModal hideModal={hideModal} provisionedId={dashboard.meta.provisionedExternalId!} />;
  }

  return (
    <ConfirmModal
      isOpen={true}
      body={modalBody}
      onConfirm={onConfirm}
      onDismiss={hideModal}
      title="Delete"
      icon="trash-alt"
      confirmText="Delete"
    />
  );
};

const getModalBody = (panels: PanelModel[], title: string) => {
  const totalAlerts = sumBy(panels, (panel) => (panel.alert ? 1 : 0));
  return totalAlerts > 0 ? (
    <>
      <p>你想要删除这个仪表盘吗</p>
      <p>
        该仪表盘包括 {totalAlerts} 个警告{totalAlerts > 1 ? 's' : ''}. 删除这个仪表盘将会删除警告。
      </p>
    </>
  ) : (
    <>
      <p>你想要删除这个仪表盘吗?</p>
      <p>{title}</p>
    </>
  );
};

const ProvisionedDeleteModal = ({ hideModal, provisionedId }: { hideModal(): void; provisionedId: string }) => (
  <Modal
    isOpen={true}
    title="不能删除先决仪表盘"
    icon="trash-alt"
    onDismiss={hideModal}
    className={css`
      width: 500px;
    `}
  >
    <p>
      This dashboard is managed by Grafana provisioning and cannot be deleted. Remove the dashboard from the config file
      to delete it.该仪表盘为Grafana所提供，管理，所以不能被删除。除非在 config 文件里删除它。
    </p>
    <p>
      <i>
        See{' '}
        <a
          className="external-link"
          href="https://grafana.com/docs/grafana/latest/administration/provisioning/#dashboards"
          target="_blank"
          rel="noreferrer"
        >
          文档
        </a>{' '}
        关于先决（provisioning）的更多信息.
      </i>
      <br />
      File path: {provisionedId}
    </p>
    <Modal.ButtonRow>
      <Button variant="primary" onClick={hideModal}>
        OK
      </Button>
    </Modal.ButtonRow>
  </Modal>
);
