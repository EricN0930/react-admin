import React, { useState } from 'react';
import { Breadcrumb, Layout, theme } from 'antd';
import { Outlet } from 'react-router-dom';
import MainMenu from '@/components/MainMenu';

const { Header, Content, Footer, Sider } = Layout;

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

  // const navigateTo = useNavigate()

  return (
    <Layout style={{ minHeight: '100vh' }}>
        {/* 左侧边栏 */}
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <MainMenu/>
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
                <Outlet></Outlet>
            </Content>

            {/* 右边底部 */}
            <Footer style={{ textAlign: 'center',padding: 0,lineHeight: "48px" }}>Ant Design ©2023 Created by Ant UED</Footer>
        </Layout>
    </Layout>
  );
};

export default App;