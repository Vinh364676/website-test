import { Checkbox, Col, Collapse, Empty, InputNumber, Row, Slider, notification } from "antd";
import CollapsePanel from "antd/lib/collapse/CollapsePanel";
import React, { useEffect, useState } from "react";
import "./Product.scss";
import jwt from 'jsonwebtoken';
import { FilterOutlined } from '@ant-design/icons';
import CardComponent from "../../card-component/CardComponent";
import { dispatch, useSelector } from "../../../../redux/store";
import { getCategory } from "../../../../redux/slices/category";
import { getBrand } from "../../../../redux/slices/brand";
import { getProduct } from "../../../../redux/slices/product";
import { ROUTE_PATHS } from "../../../../constants/url-config";
import LocalUtils from "../../../../utils/local";
import { LOCAL_STORAGE_KEYS } from "../../../../constants/local";
import { initLoginReq } from "../../../../@types/sign-in";

const danhMucOptions = ["Option 1", "Option 2", "Option 3"];
const ProductShop = () => {
  const [disabled, setDisabled] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([1, 20]);
  const {categoryList} = useSelector(state => state.category)
  const {productList} = useSelector(state => state.product)
  const {brandList} = useSelector(state => state.brand)
  useEffect(() => {
    dispatch(getCategory({ pageIndex: 1, pageSize: 100 }));
    dispatch(getBrand({ pageIndex: 1, pageSize: 100 }));
    dispatch(getProduct({ pageIndex: 1, pageSize: 6 }));
  }, []);
  
  const onPriceChange = (value: [number, number]) => {
    setPriceRange(value);
  };
  const danhMucOptions = productList.map(productt => ({
    label: productt.status,
    value: productt.status,
  }));
  const onInputNumberChange = (value: number | null, index: number) => {
    if (value !== null && value !== undefined) {
      setPriceRange((prevRange) => {
        const updatedPriceRange = [...prevRange]; // Create a copy of the array
        updatedPriceRange[index] = value; // Update the specified index
        return updatedPriceRange as [number, number]; // Return the updated array with the correct type
      });
    }
  };
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<number[]>([]);
  const handleCategoryChange = (checkedValues:any) => {
    setSelectedCategories(checkedValues);
  };
  const handleBrandChange = (checkedValues:any) => {
    setSelectedBrands(checkedValues);
  };
  const handleStatusChange = (checkedValues:any) => {
    setSelectedStatus(checkedValues);
  };
  const filterProducts = () => {
    return productList.filter(product => {
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.categoryId);
      const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.brandId);
      const statusMatch = selectedStatus.length === 0 || selectedStatus.includes(parseInt(product.status as string, 10));

      return categoryMatch && brandMatch &&statusMatch;
    });
  };
  const filteredProducts = filterProducts();
  const showNotification = () => {
    notification.success({
      className: "notification__item",
      message: "Thêm vào giỏ hàng thành công",
      //   description: 'Sản phẩm đã được xóa thành công!',
      duration: 3,
    });
  };
  const handleItem = ( productId: string) => {
   
  };

  // const handleItem = (userId: string, productId: string) => {
  //   try {
  //     showNotification();
  //     const productSessionStorageKey = `productList_${userId}`;
  //     let productList: { id: string; quantity: number }[] = [];
  
  //     // Get the product list from sessionStorage
  //     const productSessionStorage = sessionStorage.getItem(productSessionStorageKey);
  
  //     // If there is data in sessionStorage, retrieve and convert it to an array of objects
  //     if (productSessionStorage) {
  //       productList = JSON.parse(productSessionStorage);
  //     }
  
  //     // Check if productId already exists in the list
  //     const existingIndex = productList.findIndex((item) => item.id === productId);
  
  //     if (existingIndex !== -1) {
  //       // If it exists, increment the quantity
  //       console.log(`Product with ID ${productId} already exists. Incrementing quantity.`);
  //       // Example: incrementing quantity by 1
  //       productList[existingIndex].quantity += 1;
  //     } else {
  //       // If it doesn't exist, add it to the list with a quantity of 1
  //       productList.push({ id: productId, quantity: 1 });
  //     }
  
  //     // Save the product list to sessionStorage after converting it to a JSON string
  //     sessionStorage.setItem(productSessionStorageKey, JSON.stringify(productList));
  
  //     console.log("Clicked on product with ID:", productId);
  
  //     // Return the new array containing the id and quantity of the added product
  //     return [{ id: productId, quantity: productList.find((item) => item.id === productId)?.quantity || 1 }];
  //   } catch (error) {
  //     console.error('Error handling product:', error);
  //     return []; // Return an empty array if there's an error
  //   }
  // };
  const accessToken = LocalUtils.get(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);

  // Decode the access token and explicitly assert the type
  const decodedToken = accessToken ? jwt.decode(accessToken) as jwt.JwtPayload : null;
  
  // Check if decodedToken is not null and has the expected property
  const username = decodedToken && typeof decodedToken === 'object'
    ? decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']
    : null;
  return (
    <div className="containerCustom product sectionCustom">
      <Row gutter={[24, 0]}>
        <Col xl={6}>
          <p className="subTitle">Bộ lọc <FilterOutlined /></p>
          <Collapse defaultActiveKey={["1"]} className="product__collapse">
            <CollapsePanel header="Danh mục" key="1">
              <Checkbox.Group
                options={categoryList.map(category => ({
                  label: category.name,
                  value: category.id
                }))}
                onChange={handleCategoryChange}
                className="product__checkbox"
              />
            </CollapsePanel>
            <CollapsePanel header="Thương hiệu" key="2">
              <Checkbox.Group
                options={brandList.map(brand => ({
                  label: brand.name,
                  value: brand.idBrand
                }))}
                onChange={handleBrandChange}
                className="product__checkbox"
              />
            </CollapsePanel>
            <CollapsePanel header="Giá" key="3">
              <Row>
                <Col xl={24} className="product__price">
                  <Col span={12}>
                    <InputNumber
                      min={1}
                      max={20}
                      style={{ margin: "0 16px" }}
                      value={priceRange[0]}
                      onChange={(value) => onInputNumberChange(value, 0)}
                    />
                  </Col>
                  <Col span={12}>
                    <InputNumber
                      min={1}
                      max={20}
                      style={{ margin: "0 16px" }}
                      value={priceRange[1]}
                      onChange={(value) => onInputNumberChange(value, 1)}
                    />
                  </Col>
                </Col>
                <Col xl={24}>
                  <Slider
                    range
                    min={1}
                    max={20}
                    onChange={onPriceChange}
                    value={priceRange}
                  />
                </Col>
              </Row>
            </CollapsePanel>
            <CollapsePanel header="Tình trạng" key="4">
            <Checkbox.Group
                options={danhMucOptions}
                onChange={handleStatusChange}
                className="product__checkbox"
              />
            </CollapsePanel>
          </Collapse>
        </Col>
        <Col xl={18}>
          
        <Row gutter={[24, 24]}>
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product, index) => {
          const brand = brandList.find(brand => brand.idBrand === product.brandId);
          return (
            <Col key={index} xl={8}>
             <CardComponent
  href={ROUTE_PATHS.ProductDetail.replace(":id", product.productId.toString())}
  image={product.thumnail}
  name={product.productName}
  brand={brand ? brand.name : 'Unknown Brand'}
  price={product.price}
  productId={product.productId.toString()}
  onClickItem={(productId) => handleItem(productId)}
/>

            </Col>
          );
        })
      ) : (
        // Hiển thị Empty component nếu không có dữ liệu
        <Col span={24}>
          <Empty description="Không có sản phẩm" className="emptyCustom"/>
        </Col>
      )}
    </Row>
        </Col>
      </Row>
    </div>
  );
};

export default ProductShop;
