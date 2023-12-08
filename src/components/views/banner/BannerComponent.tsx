import React from 'react';
import "./BannerComponent.scss";
import BreadcrumbHeader from '../breadcrumb/Breadcrumb';
type Props = {
    title: string;
    desc:string
}
const BannerLayout = ({title,desc}: Props) => {
    return (
        <div className='bannerShop'>
            <BreadcrumbHeader/>

            <h2 className='title bannerShop__title'>{title}</h2>
            <p className='subTitle bannerShop__subTitle'>{desc}</p>
        </div>
    );
};

export default BannerLayout;