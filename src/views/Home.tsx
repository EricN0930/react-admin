import React, { useState } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Option 1', '/page1', <PieChartOutlined />),
  getItem('Option 2', '/page2', <DesktopOutlined />),
  getItem('User', '/sub1', <UserOutlined />, [
    getItem('Tom', '/3'),
    getItem('Bill', '4'),
    getItem('Alex', '5'),
  ]),
  getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
  getItem('Files', '9', <FileOutlined />),
];

const breadcrumbItems = [
    {
        title: 'Home',
    },
    {
        title: <a href=''>Application</a>
    }
]

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigateTo = useNavigate()

  const menuClick = (e:{key:string}) => {
    console.log(e.key);
    navigateTo(e.key)
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
        {/* 左侧边栏 */}
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} onClick={menuClick}/>
        </Sider>

        {/* 右边内容 */}
        <Layout>
            {/* 右边头部 */}
            <Header style={{ padding: 0, background: colorBgContainer }} >
                {/* 面包屑 */}
                <Breadcrumb style={{ lineHeight: '64px', marginLeft: '16px'}} items={breadcrumbItems}/>
            </Header>

            {/* 右边内容 */}
            <Content style={{ margin: '16px 16px 0', padding: 24, minHeight: 360, background: colorBgContainer }}>
                {/* 窗口部分 */}

            </Content>

            {/* 右边底部 */}
            <Footer style={{ textAlign: 'center',padding: 0,lineHeight: "48px" }}>Ant Design ©2023 Created by Ant UED</Footer>
        </Layout>
    </Layout>
  );
};

export default App;