import React from 'react';
import { Drawer, Typography } from 'antd';
import IpFavorites from './IpFavorites';

interface IpFavoritesDrawerProps {
    open: boolean;
    onClose: () => void;
}

const IpFavoritesDrawer: React.FC<IpFavoritesDrawerProps> = ({ open, onClose }) => {
    return (
        <Drawer
            title={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography.Title level={4} style={{ margin: 0, fontSize: '18px' }}>IP收藏夹</Typography.Title>
                </div>
            }
            placement="right"
            width="clamp(600px, 30%, 100%)"
            onClose={onClose}
            open={open}
        >
            <IpFavorites />
        </Drawer>
    );
};

export default IpFavoritesDrawer; 