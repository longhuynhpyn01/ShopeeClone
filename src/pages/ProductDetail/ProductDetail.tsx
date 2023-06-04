import { useEffect, useMemo, useRef, useState } from "react";
// import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DOMPurify from "dompurify";
// import { convert } from "html-to-text";
import productApi from "src/apis/product.api";
import purchaseApi from "src/apis/purchase.api";
import ProductRating from "src/components/ProductRating";
import QuantityController from "src/components/QuantityController";
import path from "src/constants/path";
import { purchasesStatus } from "src/constants/purchase";
import { ProductListConfig, Product as ProductType } from "src/types/product.type";
import { formatCurrency, formatNumberToSocialStyle, getIdFromNameId, rateSale } from "src/utils/utils";

import Product from "../ProductList/components/Product";

export default function ProductDetail() {
  // const { t } = useTranslation(["product"]);
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const { nameId } = useParams();
  const id = getIdFromNameId(nameId as string);
  const { data: productDetailData } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productApi.getProductDetail(id as string)
  });
  const product = productDetailData?.data.data;

  const [buyCount, setBuyCount] = useState(1); // lưu số lượng chọn mua
  const [currentIndexImages, setCurrentIndexImages] = useState([0, 5]); // lưu khoảng index 5 image liên tiếp cần hiển thị cho slice
  const [activeImage, setActiveImage] = useState(""); // lưu ảnh đang được active
  const imageRef = useRef<HTMLImageElement>(null); // lưu ref để handle việc zoom ảnh

  const currentImages = useMemo(
    () => (product ? product.images.slice(...currentIndexImages) : []),
    [product, currentIndexImages]
  ); // list danh sách ảnh sản phẩm cần hiển thị

  // query config để tìm những product cùng category
  const queryConfig: ProductListConfig = { limit: "20", page: "1", category: product?.category._id };

  const { data: productsData } = useQuery({
    queryKey: ["products", queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig);
    },
    // thời gian data đã cũ là 3 phút để không gọi lại khi đã gọi lần trước (nên thêm field này ở ProductList)
    staleTime: 3 * 60 * 1000,
    // chỉ gọi khi product có data
    enabled: Boolean(product)
  });

  const addToCartMutation = useMutation(purchaseApi.addToCart);

  useEffect(() => {
    // nếu product tồn tại thì lấy ảnh đầu tiên làm ảnh active
    if (product && product.images.length > 0) {
      setActiveImage(product.images[0]);
    }
  }, [product]);

  const next = () => {
    if (currentIndexImages[1] < (product as ProductType).images.length) {
      setCurrentIndexImages((prev) => [prev[0] + 1, prev[1] + 1]);
    }
  };

  const prev = () => {
    if (currentIndexImages[0] > 0) {
      setCurrentIndexImages((prev) => [prev[0] - 1, prev[1] - 1]);
    }
  };

  const chooseActive = (img: string) => {
    setActiveImage(img);
  };

  const handleZoom = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect(); // lấy ra width, height của thẻ div
    const image = imageRef.current as HTMLImageElement;
    const { naturalHeight, naturalWidth } = image; // lấy ra width và height nguyên bản của ảnh

    // offsetX: vị trí x của con trỏ chuột trong element
    // offsetY: vị trí y của con trỏ chuột trong element
    // event.pageX: tọa độ x con trỏ chuột theo trang web (không thể âm)
    // event.pageY: toạ độ y con trỏ chuột theo trang web (không thể âm)
    // window.scrollX: tọa độ page scroll theo chiều x
    // window.scrollY: tọa độ page scroll theo chiều y

    // Cách 1: Lấy offsetX, offsetY đơn giản khi chúng ta đã xử lý được bubble event
    // Thêm class pointer-events-none cho thẻ img để không nhấn vào img được
    // const { offsetX, offsetY } = event.nativeEvent

    // Cách 2: Lấy offsetX, offsetY khi chúng ta không xử lý được bubble event
    const offsetX = event.pageX - (rect.x + window.scrollX);
    const offsetY = event.pageY - (rect.y + window.scrollY);

    // Theo nguyên lí thì khi hover ảnh xuống dưới thì top sẽ là giá trị âm để zoom lên trên
    // left sẽ là giá trị âm để zoom sang trái
    const top = offsetY * (1 - naturalHeight / rect.height); // công thức đặt position cho top
    const left = offsetX * (1 - naturalWidth / rect.width); // công thức đặt position cho left

    image.style.width = naturalWidth + "px"; // set lại width thành value nguyên bản, nhớ css thẻ div cha img là overflow-hidden
    image.style.height = naturalHeight + "px";
    image.style.maxWidth = "unset"; // để ngăn chặn viện maxWidth là 100% theo style
    image.style.top = top + "px";
    image.style.left = left + "px";
  };

  const handleRemoveZoom = () => {
    imageRef.current?.removeAttribute("style");
  };

  const handleBuyCount = (value: number) => {
    setBuyCount(value);
  };

  const addToCart = () => {
    addToCartMutation.mutate(
      { buy_count: buyCount, product_id: product?._id as string },
      {
        onSuccess: (data) => {
          console.log("data:", data);
          toast.success(data.data.message, { autoClose: 1000 });
          // khi add to cart thành công thì sẽ thông báo addToCartMutation đã cũ rồi => cần cập nhật lại => queryFn chạy lại
          // biến exact giúp xác định chính xác queryKey bao gồm cả dependencies là { status }
          queryClient.invalidateQueries({ queryKey: ["purchases", { status: purchasesStatus.inCart }] });
        }
      }
    );
  };

  const buyNow = async () => {
    // const res = await addToCartMutation.mutateAsync({ buy_count: buyCount, product_id: product?._id as string });
    // const purchase = res.data.data;
    // navigate(path.cart, {
    //   state: {
    //     purchaseId: purchase._id
    //   }
    // });
  };

  if (!product) return null;

  return (
    <div className="py-6 bg-gray-200">
      <div className="container">
        <div className="p-4 bg-white shadow">
          <div className="grid grid-cols-12 gap-9">
            <div className="col-span-5">
              <div
                className="relative w-full cursor-zoom-in overflow-hidden pt-[100%] shadow"
                onMouseMove={handleZoom}
                onMouseLeave={handleRemoveZoom}
              >
                <img
                  src={activeImage}
                  alt={product.name}
                  className="absolute top-0 left-0 object-cover w-full h-full bg-white"
                  ref={imageRef}
                />
              </div>
              <div className="relative grid grid-cols-5 gap-1 mt-4">
                <button
                  className="absolute left-0 z-10 w-5 text-white -translate-y-1/2 top-1/2 h-9 bg-black/20"
                  onClick={prev}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>

                {currentImages.map((img) => {
                  const isActive = img === activeImage;

                  return (
                    <div className="relative w-full pt-[100%]" key={img} onMouseEnter={() => chooseActive(img)}>
                      <img
                        src={img}
                        alt={product.name}
                        className="absolute top-0 left-0 object-cover w-full h-full bg-white cursor-pointer"
                      />
                      {isActive && <div className="absolute inset-0 border-2 border-orange" />}
                    </div>
                  );
                })}

                <button
                  className="absolute right-0 z-10 w-5 text-white -translate-y-1/2 top-1/2 h-9 bg-black/20"
                  onClick={next}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="col-span-7">
              <h1 className="text-xl font-medium uppercase">{product.name}</h1>
              <div className="flex items-center mt-8">
                <div className="flex items-center">
                  <span className="mr-1 border-b border-b-orange text-orange">{product.rating}</span>
                  <ProductRating
                    rating={product.rating}
                    activeClassname="fill-orange text-orange h-4 w-4"
                    nonActiveClassname="fill-gray-300 text-gray-300 h-4 w-4"
                  />
                </div>
                <div className="mx-4 h-4 w-[1px] bg-gray-300"></div>
                <div>
                  <span>{formatNumberToSocialStyle(product.sold)}</span>
                  <span className="ml-1 text-gray-500">Đã bán</span>
                </div>
              </div>
              <div className="flex items-center px-5 py-4 mt-8 bg-gray-50">
                <div className="text-gray-500 line-through">₫{formatCurrency(product.price_before_discount)}</div>
                <div className="ml-3 text-3xl font-medium text-orange">₫{formatCurrency(product.price)}</div>
                <div className="ml-4 rounded-sm bg-orange px-1 py-[2px] text-xs font-semibold uppercase text-white">
                  {rateSale(product.price_before_discount, product.price)} giảm
                </div>
              </div>
              <div className="flex items-center mt-8">
                <div className="text-gray-500 capitalize">Số lượng</div>
                <QuantityController
                  onDecrease={handleBuyCount}
                  onIncrease={handleBuyCount}
                  onType={handleBuyCount}
                  value={buyCount}
                  max={product.quantity}
                />
                <div className="ml-6 text-sm text-gray-500">
                  {/* {product.quantity} {t("product:available")} */}
                  {product.quantity} {"Available products"}
                </div>
              </div>
              <div className="flex items-center mt-8">
                <button
                  onClick={addToCart}
                  className="flex items-center justify-center h-12 px-5 capitalize border rounded-sm shadow-sm border-orange bg-orange/10 text-orange hover:bg-orange/5"
                >
                  <svg
                    enableBackground="new 0 0 15 15"
                    viewBox="0 0 15 15"
                    x={0}
                    y={0}
                    className="mr-[10px] h-5 w-5 fill-current stroke-orange text-orange"
                  >
                    <g>
                      <g>
                        <polyline
                          fill="none"
                          points=".5 .5 2.7 .5 5.2 11 12.4 11 14.5 3.5 3.7 3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeMiterlimit={10}
                        />
                        <circle cx={6} cy="13.5" r={1} stroke="none" />
                        <circle cx="11.5" cy="13.5" r={1} stroke="none" />
                      </g>
                      <line fill="none" strokeLinecap="round" strokeMiterlimit={10} x1="7.5" x2="10.5" y1={7} y2={7} />
                      <line fill="none" strokeLinecap="round" strokeMiterlimit={10} x1={9} x2={9} y1="8.5" y2="5.5" />
                    </g>
                  </svg>
                  Thêm vào giỏ hàng
                </button>
                <button
                  onClick={buyNow}
                  className="fkex ml-4 h-12 min-w-[5rem] items-center justify-center rounded-sm bg-orange px-5 capitalize text-white shadow-sm outline-none hover:bg-orange/90"
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <div className="container">
          <div className="p-4 bg-white shadow ">
            <div className="p-4 text-lg capitalize rounded bg-gray-50 text-slate-700">Mô tả sản phẩm</div>
            <div className="mx-4 mt-12 mb-4 text-sm leading-loose">
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(product.description)
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="container">
          <div className="text-gray-400 uppercase">CÓ THỂ BẠN CŨNG THÍCH</div>
          {productsData && (
            <div className="grid grid-cols-2 gap-3 mt-6 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {productsData.data.data.products.map((product) => (
                <div className="col-span-1" key={product._id}>
                  <Product product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
