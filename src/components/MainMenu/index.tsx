import React, { useState } from 'react';
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
  } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { useNavigate,useLocation} from 'react-router-dom';

type MenuItem = Required<MenuProps>['items'][number];

// 登录请求后，根据数据进行匹配
const items: MenuItem[] = [
  {
    label: '栏目1',
    key: '/page1',
    icon: <PieChartOutlined />
  },
  {
    label: '栏目2',
    key: '/page2',
    icon: <DesktopOutlined />
  },
  {
    label: '栏目3',
    key: 'page3',
    icon: <UserOutlined />,
    children: [
      {
        label: '栏目3-1',
        key: '/page3/1',
      },
      {
        label: '栏目3-2',
        key: '/page3/2',
      },
      {
        label: '栏目3-3',
        key: '/page3/3',
      },
    ]
  },
  {
    label: '栏目4',
    key: 'page4',
    icon: <TeamOutlined />,
    children: [
      {
        label: '栏目4-1',
        key: '/page4/1',
      },
      {
        label: '栏目4-2',
        key: '/page4/2',
      },
    ]
  },
  {
    label: '栏目5',
    key: '/page5',
    icon: <FileOutlined />
  },
]

const Comp: React.FC = () => {
  const navigateTo = useNavigate()
  const currentRoute = useLocation();

  let firstOpenKey: string = ""

  function findKey(obj:{key:string}){
    return obj.key === currentRoute.pathname

  }
  for(let i = 0;i<items.length;i++){
    if( items[i]!['children'] && items[i]!['children'].length > 0 && items[i]!['children'].find(findKey) ){ // 找到
      firstOpenKey = items[i]!.key;
      break;
    }
  }

  const [openKeys, setOpenKeys] = useState([firstOpenKey]);
  const handleOpenChange = (keys:string[]) => { // keys是一个数组，记录了当前哪一项是展开的（用key记录）
    // 展开和回收某项菜单时，执行
    // setOpenKeys为设置展开项，只传入keys数组的最后一项，即表示默认只展开最近点击的一项
    setOpenKeys([keys[keys.length-1]])
  }

  const menuClick = (e:{key:string}) => {
    console.log(e.key);
    navigateTo(e.key)
  }



  return (
    <Menu 
        theme="dark" 
        // defaultSelectedKeys 表示当前样式所在的选中的key
        defaultSelectedKeys={[currentRoute.pathname]} 
        mode="inline" 
        // 菜单项的数据
        items={items} 
        onClick={menuClick}  
        onOpenChange={handleOpenChange}
        // 当前菜单展开项的key数组
        openKeys={openKeys}
    />
  )
}

export default Comp