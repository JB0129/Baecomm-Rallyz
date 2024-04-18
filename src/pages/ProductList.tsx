import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";

type productType = {
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

const ROOT_URL = `https://dummyjson.com`;

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const [productLists, setProductLists] = useState([]); // 상품 리스트
  const [total, setTotal] = useState<number>(0); // 상품 전체 개수
  const [limit, setLimit] = useState<number>(10); // 상품 출력 개수
  const [skip, setSkip] = useState<number>(0); // 상품 스킵 개수

  // input value 변경 함수
  const [inputValue, setInputValue] = useState<string>(""); // 검색 input value
  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputValue(e.target.value);

  // 쿼리 스트링 값 설정
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get("q");

  // 전체 상품 조회
  const itemId = sessionStorage.getItem("itemId");
  const getProducts = () => {
    const url = !keyword
      ? `${ROOT_URL}/products?limit=${
          Math.ceil(Number(itemId) / 10) * 10 || limit
        }&skip=${skip}`
      : `${ROOT_URL}/products/search?q=${keyword}&limit=${
          Math.ceil(Number(itemId) / 10) * 10 || limit
        }&skip=${skip}`;
    return fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setProductLists(data.products);
        setTotal(data.total);
      })
      .catch((err) => console.log(err));
  };

  // 특정 상품 조회
  const getMoreProducts = () => {
    const url = !keyword
      ? `${ROOT_URL}/products?limit=${limit}&skip=${skip + 10}`
      : `${ROOT_URL}/products/search?q=${keyword}&limit=${limit}&skip=${
          skip + 10
        }`;
    return fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setProductLists((productLists) => productLists.concat(data.products));
        setTotal(data.total);
        setSkip((skip) => skip + 10);
      })
      .catch((err) => console.log(err));
  };

  // 상품 검색
  const setSortParams = () => {
    searchParams.set("q", inputValue);
    setSearchParams(searchParams);
  };

  // 검색 이벤트
  const handleSearch = () => {
    if (!inputValue) return alert("검색할 단어를 입력해주세요.");
    setSortParams();
  };

  // Enter 입력 시, 상품 검색하기
  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // 상품 리스트 가져오기
  useEffect(() => {
    getProducts();
    return () => {
      setInputValue("");
    };
  }, [keyword]);

  // 전에 선택한 상품으로 이동
  useEffect(() => {
    if (itemId && productLists.length) {
      const selectedListElement = document.getElementById(itemId);
      if (selectedListElement) {
        selectedListElement.scrollIntoView({ behavior: "auto" });
        sessionStorage.removeItem("itemId"); // 이동 후 초기화
      }
    }
  }, [productLists]);

  return (
    <ProductContainer>
      <SearchBox>
        <SearchInput
          placeholder="검색어를 입력해주세요."
          value={inputValue}
          onChange={handleChangeInput}
          onKeyDown={handleEnter} // up을 할지 down을 할지?
        />
        <SearchButton onClick={handleSearch}>검색</SearchButton>
      </SearchBox>
      <MsgBox>{keyword && `"${keyword}"로 검색한 결과입니다.`}</MsgBox>
      {productLists.length > 0 ? (
        <ProductItems>
          {productLists.map((item: productType) => (
            <ProductItem
              key={item.id}
              id={String(item.id)}
              onClick={() => navigate(`/product/${item.id}`)}
            >
              <ProductImg src={item.thumbnail} alt="상품 썸네일 이미지" />
              <ProductInfo>
                <ProductBrand className="productInfo">
                  {`[${item.brand}]`}
                </ProductBrand>
                <ProductTitle className="productInfo">
                  {item.title}
                </ProductTitle>
              </ProductInfo>
              <ProductPrice>{`$${item.price.toLocaleString()}`}</ProductPrice>
            </ProductItem>
          ))}
          {productLists.length < total && (
            <MoreButton onClick={getMoreProducts}>더보기</MoreButton>
          )}
        </ProductItems>
      ) : (
        <EmptyLists>
          <span>존재하는 상품이 없습니다.</span>
        </EmptyLists>
      )}
    </ProductContainer>
  );
};

export default ProductList;

export const ProductContainer = styled.article`
  width: 100%;
  padding: 10px 0px;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
`;
export const SearchBox = styled.section`
  margin: 20px 0px;
  display: flex;
  justify-content: start;
  align-items: center;
`;
export const SearchInput = styled.input`
  border: 3px solid rgb(120, 120, 120);
  border-radius: 6px;
  width: 400px;
  height: 50px;
  margin-right: 10px;
  padding-left: 15px;
  font-size: 15px;
`;
export const SearchButton = styled.button`
  background-color: rgb(95, 95, 95);
  width: 80px;
  height: 50px;
  border-radius: 6px;
  color: white;
  font-weight: 600;
  font-size: 15px;
  &:hover {
    background-color: rgb(115, 115, 115);
  }
  &:active {
    background-color: rgb(105, 105, 105);
  }
`;
export const MsgBox = styled.div`
  height: 14px;
  margin: 0px 0px 20px 0px;
  color: rgb(66, 66, 66);
  font-size: 14px;
  font-weight: 600;
`;
export const ProductItems = styled.ul`
  background-color: rgb(255, 255, 255);
  border-radius: 8px;
  padding: 30px 50px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  row-gap: 20px;
  column-gap: 40px;
  place-items: start center;
`;
export const ProductItem = styled.li`
  background-color: rgb(244, 244, 244);
  border-radius: 8px;
  width: 100%;
  max-width: 380px;
  padding: 20px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  &:hover {
    background-color: rgb(238, 238, 238);

    .productInfo {
      color: blue;
    }
  }
`;
export const ProductImg = styled.img`
  border-radius: 8px;
  width: 100%;
  height: 210px;
  margin: 0px 0px 5px 0px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;
export const ProductInfo = styled.div`
  width: 100%;
  margin: 5px 0px;
  padding: 0px 5px;
  display: flex;
  justify-content: start;
  align-items: center;
  color: rgb(82, 82, 82);
  font-weight: 600;
`;
export const ProductBrand = styled.span`
  padding: 5px 0px;
  white-space: nowrap;
  margin-right: 5px;
`;
export const ProductTitle = styled.span`
  padding: 5px 0px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
export const ProductPrice = styled.div`
  width: 100%;
  margin: 5px 0px;
  padding: 0px 10px;
  text-align: end;
  font-weight: 600;
`;
export const MoreButton = styled.button`
  grid-column: 1 / 3;
  background-color: rgb(95, 95, 95);
  width: 200px;
  height: 40px;
  border-radius: 6px;
  color: white;
  font-weight: 600;
  font-size: 15px;
  &:hover {
    background-color: rgb(115, 115, 115);
  }
  &:active {
    background-color: rgb(105, 105, 105);
  }
`;
export const EmptyLists = styled.section`
  background-color: rgb(255, 255, 255);
  border-radius: 8px;
  width: 100%;
  max-width: 900px;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
