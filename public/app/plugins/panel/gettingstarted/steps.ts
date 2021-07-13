import { getDatasourceSrv } from 'app/features/plugins/datasource_srv';
import { getBackendSrv } from 'app/core/services/backend_srv';
import store from 'app/core/store';
import { SetupStep } from './types';

const step1TutorialTitle = 'Grafana 基础';
const step2TutorialTitle = '创建用户和团队';
const keyPrefix = 'getting.started.';
const step1Key = `${keyPrefix}${step1TutorialTitle.replace(' ', '-').trim().toLowerCase()}`;
const step2Key = `${keyPrefix}${step2TutorialTitle.replace(' ', '-').trim().toLowerCase()}`;

export const getSteps = (): SetupStep[] => [
  {
    heading: '欢迎使用 Grafana',
    subheading: '遵循以下步骤来快速完成您的Grafana安装',
    title: '基础',
    info: '遵循以下步骤来快速完成您的Grafana安装',
    done: false,
    cards: [
      {
        type: 'tutorial',
        heading: '数据源和仪表盘',
        title: step1TutorialTitle,
        info:
          '如果您不熟悉Grafana的话，本教学会帮助您构建并理解Grafana。 教学涵盖 “数据源” 和 “仪表盘” （右滑以获取更多步骤）',
        href: 'https://grafana.com/tutorials/grafana-fundamentals',
        icon: 'grafana',
        check: () => Promise.resolve(store.get(step1Key)),
        key: step1Key,
        done: false,
      },
      {
        type: 'docs',
        title: '添加您的第一个数据源',
        heading: '数据源',
        icon: 'database',
        learnHref: 'https://grafana.com/docs/grafana/latest/features/datasources/add-a-data-source',
        href: 'datasources/new',
        check: () => {
          return new Promise((resolve) => {
            resolve(
              getDatasourceSrv()
                .getMetricSources()
                .filter((item) => {
                  return item.meta.builtIn !== true;
                }).length > 0
            );
          });
        },
        done: false,
      },
      {
        type: 'docs',
        heading: '仪表盘',
        title: '创建您的第一个仪表盘',
        icon: 'apps',
        href: 'dashboard/new',
        learnHref: 'https://grafana.com/docs/grafana/latest/guides/getting_started/#create-a-dashboard',
        check: async () => {
          const result = await getBackendSrv().search({ limit: 1 });
          return result.length > 0;
        },
        done: false,
      },
    ],
  },
  {
    heading: '设置完成!',
    subheading:
      '已完成所有使用 Grafana 的必要步骤. 现在看看进阶步骤或者 试着用用首页仪表盘（一个完全可自定义的仪表盘）然后删除改面板。',
    title: '进阶',
    info: ' 管理您的用户、团队、插件。以下步骤为非必需步骤。',
    done: false,
    cards: [
      {
        type: 'tutorial',
        heading: '用户',
        title: '创建用户和团队',
        info: '学会管理您队伍中的用户、资源分配、角色权限。',
        href: 'https://grafana.com/tutorials/create-users-and-teams',
        icon: 'users-alt',
        key: step2Key,
        check: () => Promise.resolve(store.get(step2Key)),
        done: false,
      },
      {
        type: 'docs',
        heading: '插件',
        title: '寻找并安装插件',
        learnHref: 'https://grafana.com/docs/grafana/latest/plugins/installation',
        href: 'plugins',
        icon: 'plug',
        check: async () => {
          const plugins = await getBackendSrv().get('/api/plugins', { embedded: 0, core: 0 });
          return Promise.resolve(plugins.length > 0);
        },
        done: false,
      },
    ],
  },
];
