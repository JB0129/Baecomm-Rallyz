import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { ReactComponent as LeftArrow } from "../assets/images/LeftArrow.svg";
import { ReactComponent as RightArrow } from "../assets/images/RightArrow.svg";

type ProductInfo = {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
};

const ProductDetail: React.FC = () => {
  const navigate = useNavigate();
  const { productId } = useParams(); // 제품 ID
  const imagesRef = useRef<HTMLUListElement>(null); // images DOM
  const [media, setMedia] = useState<number>(0); // images 개수
  const [productInfo, setProductInfo] = useState<ProductInfo>(); // 상품 정보

  // 상품 정보 API
  const getProductInfo = () => {
    return fetch(`https://dummyjson.com/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        setProductInfo(data);
      })
      .catch((err) => console.log(err));
  };

  // 상품 정보 가져오기
  useEffect(() => {
    getProductInfo();
  }, []);

  // 이미지 왼쪽 스크롤
  const handleLeftScroll = () => {
    if (media > 0 && imagesRef.current) {
      imagesRef.current.style.transform = `translateX(${-260 * (media - 1)}px)`;
      setMedia((media) => media - 1);
    }
  };

  // 이미지 오른쪽 스크롤
  const handleRightScroll = () => {
    if (
      productInfo &&
      media < productInfo.images.length - 1 &&
      imagesRef.current
    ) {
      imagesRef.current.style.transform = `translateX(${-260 * (media + 1)}px)`;
      setMedia((media) => media + 1);
    }
  };

  return (
    <DetailContainer>
      <BackButton
        onClick={() => {
          navigate(`/`);
          sessionStorage.setItem("itemId", String(productId));
        }}
      >
        목록으로 돌아가기
      </BackButton>
      {productInfo ? (
        <DetailBox>
          <DetailThumbnail
            src={productInfo.thumbnail}
            alt="상품 썸네일 이미지"
          />
          <DetailMedia>
            <LeftScroll onClick={handleLeftScroll} />
            <DetailImgs>
              <DetailImgBox ref={imagesRef}>
                {productInfo.images.map((image, idx) => (
                  <DetailImg key={idx}>
                    <OtherImg src={image} alt={`${idx}번 상품 이미지`} />
                  </DetailImg>
                ))}
              </DetailImgBox>
            </DetailImgs>
            <RightScroll onClick={handleRightScroll} />
          </DetailMedia>
          <DetailPrice>{`$${productInfo.price.toLocaleString()}`}</DetailPrice>
          <DetailInfo>
            <DetailBrand>{`[${productInfo.brand}]`}</DetailBrand>
            <DetailTitle>{productInfo.title}</DetailTitle>
          </DetailInfo>
          <DetailDesc>{productInfo.description}</DetailDesc>
        </DetailBox>
      ) : (
        <EmtpyBox>해당 제품 정보가 없습니다.</EmtpyBox>
      )}
    </DetailContainer>
  );
};

export default ProductDetail;

export const DetailContainer = styled.article`
  position: relative;
  background-color: white;
  border-radius: 12px;
  width: 100%;
  max-width: 1170px;
  min-height: 100vh;
  margin: 25px 0px;
  padding: 50px 20px;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
`;

export const BackButton = styled.button`
  position: absolute;
  top: 10px;
  left: 0;
  width: 200px;
  height: 40px;
  font-weight: 600;
  font-size: 15px;
  &:hover {
    color: rgb(253, 196, 149);
  }
  &:active {
    color: rgb(255, 208, 169);
  }
`;
export const DetailBox = styled.div`
  width: 100%;
  padding: 10px 10px;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
`;
export const DetailThumbnail = styled.img`
  border-radius: 12px;
  width: 100%;
  max-width: 700px;
  height: 400px;
`;
export const DetailMedia = styled.section`
  position: relative;
  width: 100%;
  max-width: 800px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const DetailImgs = styled.div`
  width: 100%;
  max-width: 700px;
  overflow: hidden;
`;
export const DetailImgBox = styled.ul`
  width: 100%;
  max-width: 700px;
  padding: 10px 0px;
  transition: 300ms;
  display: flex;
  justify-content: start;
  align-items: center;
`;
export const DetailImg = styled.li`
  margin-right: 10px;
`;
export const OtherImg = styled.img`
  width: 250px;
  height: 150px;
  border-radius: 12px;
`;
export const LeftScroll = styled(LeftArrow)`
  position: absolute;
  top: 70px;
  left: 10px;
  width: 25px;
  height: 25px;
  cursor: pointer;
  path {
    fill: rgb(95, 95, 95);
    &:hover {
      fill: rgb(115, 115, 115);
    }
    &:active {
      fill: rgb(105, 105, 105);
    }
  }
`;
export const RightScroll = styled(RightArrow)`
  position: absolute;
  top: 70px;
  right: 10px;
  width: 25px;
  height: 25px;
  cursor: pointer;
  path {
    fill: rgb(95, 95, 95);
    &:hover {
      fill: rgb(115, 115, 115);
    }
    &:active {
      fill: rgb(105, 105, 105);
    }
  }
`;
export const DetailInfo = styled.div`
  width: 100%;
  max-width: 700px;
  margin: 5px 0px;
  margin: 15px 0px 30px 0px;
  padding: 0px 10px;
  color: rgb(82, 82, 82);
  font-size: 25px;
  font-weight: 600;
  white-space: nowrap;
  display: flex;
  justify-content: start;
  align-items: center;
`;
export const DetailBrand = styled.span`
  margin-right: 5px;
`;
export const DetailTitle = styled.span``;
export const DetailPrice = styled.div`
  width: 100%;
  max-width: 700px;
  margin: 10px 0px;
  padding: 0px 20px;
  text-align: end;
  font-size: 25px;
  font-weight: 600;
`;
export const DetailDesc = styled.div`
  width: 100%;
  max-width: 700px;
  height: 150px;
  color: rgb(82, 82, 82);
  font-weight: 600;
`;
export const EmtpyBox = styled.section``;
