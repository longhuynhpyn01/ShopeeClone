import React, { useContext, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import { useMutation, useQuery } from "@tanstack/react-query";
import { produce } from "immer";
import keyBy from "lodash/keyBy";
import purchaseApi from "src/apis/purchase.api";
import noproduct from "src/assets/images/no-product.png";
import Button from "src/components/Button";
import QuantityController from "src/components/QuantityController";
import path from "src/constants/path";
import { purchasesStatus } from "src/constants/purchase";
import { AppContext } from "src/contexts/app.context";
import { Purchase } from "src/types/purchase.type";
import { formatCurrency, generateNameId } from "src/utils/utils";

export default function Cart() {
  // kiểu mở rộng của perchases (thêm checked và disabled)
  const { extendedPurchases, setExtendedPurchases } = useContext(AppContext);
  const { data: purchasesInCartData, refetch } = useQuery({
    queryKey: ["purchases", { status: purchasesStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchasesStatus.inCart })
  });
  const updatePurchaseMutation = useMutation({
    mutationFn: purchaseApi.updatePurchase,
    onSuccess: () => {
      // Khi update thành công thì gọi refetch để reset "purchases" lại
      refetch();
    }
  });
  const buyProductsMutation = useMutation({
    mutationFn: purchaseApi.buyProducts,
    onSuccess: (data) => {
      refetch();
      toast.success(data.data.message, {
        position: "top-center",
        autoClose: 1000
      });
    }
  });
  const deletePurchasesMutation = useMutation({
    mutationFn: purchaseApi.deletePurchase,
    onSuccess: () => {
      refetch();
    }
  });

  const location = useLocation();
  const choosenPurchaseIdFromLocation = (location.state as { purchaseId: string } | null)?.purchaseId;
  console.log("location:", location);
  console.log("location.state:", location.state);
  console.log("choosenPurchaseIdFromLocation:", choosenPurchaseIdFromLocation);
  // Data purchase in cart
  const purchasesInCart = purchasesInCartData?.data.data;
  // Lưu trạng thái có check all hay không
  const isAllChecked = useMemo(() => extendedPurchases.every((purchase) => purchase.checked), [extendedPurchases]);
  // Lưu những sản phẩm đang được check
  const checkedPurchases = useMemo(() => extendedPurchases.filter((purchase) => purchase.checked), [extendedPurchases]);
  // Lưu số lượng sản phẩm đang được check để hiển thị tổng sản phẩm cần thanh toán
  const checkedPurchasesCount = checkedPurchases.length;
  // Lưu tổng số tiền được checked
  const totalCheckedPurchasePrice = useMemo(
    () =>
      checkedPurchases.reduce((result, current) => {
        return result + current.product.price * current.buy_count;
      }, 0),
    [checkedPurchases]
  );
  // Lưu tổng số tiền được tiết kiệm được
  const totalCheckedPurchaseSavingPrice = useMemo(
    () =>
      checkedPurchases.reduce((result, current) => {
        return result + (current.product.price_before_discount - current.product.price) * current.buy_count;
      }, 0),
    [checkedPurchases]
  );

  useEffect(() => {
    setExtendedPurchases((prev) => {
      // Dùng keyBy của lodash để tạo Object từ Array với key là những giá trị của _id, còn value là dữ liệu tương ứng id đó
      const extendedPurchasesObject = keyBy(prev, "_id");
      // console.log("extendedPurchasesObject:", extendedPurchasesObject);
      // console.log("choosenPurchaseIdFromLocation:", choosenPurchaseIdFromLocation);

      return (
        purchasesInCart?.map((purchase) => {
          const isChoosenPurchaseFromLocation = choosenPurchaseIdFromLocation === purchase._id;

          return {
            ...purchase,
            disabled: false,
            // để khi refetch thì giữ giá trị của checked
            checked: isChoosenPurchaseFromLocation || Boolean(extendedPurchasesObject[purchase._id]?.checked)
          };
        }) || []
      );
    });
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [purchasesInCart, choosenPurchaseIdFromLocation]);

  useEffect(() => {
    return () => {
      history.replaceState(null, "");
    };
  }, []);

  // Xử lí khi click check vào từng sản phẩm
  const handleCheck = (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    // cách nhanh nhất để change extendedPurchases mà không cần tìm hàm map để tìm index thì dùng produce của immer
    setExtendedPurchases(
      // như đang mutate extendPurchases
      produce((draft) => {
        // draft là giá trị cũ của extendPurchases
        draft[purchaseIndex].checked = event.target.checked;
      })
    );
  };

  // Xử lí khi nhấn check all
  const handleCheckAll = () => {
    setExtendedPurchases((prev) =>
      prev.map((purchase) => ({
        ...purchase,
        checked: !isAllChecked
      }))
    );
  };

  // Xử lí khi nhập vào QuantityInpu
  const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].buy_count = value;
      })
    );
  };

  // Xử lí khi nhấn increase / decrease QuantityInput
  const handleQuantity = (purchaseIndex: number, value: number, enable: boolean) => {
    console.log(purchaseIndex, value, enable);
    if (enable) {
      const purchase = extendedPurchases[purchaseIndex];
      setExtendedPurchases(
        // Khi user click gọi api change thì disable input để user không gọi api khác được nữa
        produce((draft) => {
          draft[purchaseIndex].disabled = true;
        })
      );
      updatePurchaseMutation.mutate({ product_id: purchase.product._id, buy_count: value });
    }
  };

  // Xử lí khi xóa 1 sản phẩm đang checked
  const handleDelete = (purchaseIndex: number) => () => {
    const purchaseId = extendedPurchases[purchaseIndex]._id;
    deletePurchasesMutation.mutate([purchaseId]);
  };

  // Xử lí khi xóa nhiều sản phẩm đang checked
  const handleDeleteManyPurchases = () => {
    const purchasesIds = checkedPurchases.map((purchase) => purchase._id);
    deletePurchasesMutation.mutate(purchasesIds);
  };

  // Xử lí việc mua hàng
  const handleBuyPurchases = () => {
    if (checkedPurchases.length > 0) {
      const body = checkedPurchases.map((purchase) => ({
        product_id: purchase.product._id,
        buy_count: purchase.buy_count
      }));
      buyProductsMutation.mutate(body);
    }
  };

  return (
    <div className="py-16 bg-neutral-100">
      <div className="container">
        {extendedPurchases.length > 0 ? (
          <>
            <div className="overflow-auto">
              <div className="min-w-[1000px]">
                <div className="grid grid-cols-12 py-5 text-sm text-gray-500 capitalize bg-white rounded-sm shadow px-9">
                  <div className="col-span-6">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center flex-shrink-0 pr-3">
                        <input
                          type="checkbox"
                          className="w-5 h-5 accent-orange"
                          checked={isAllChecked}
                          onChange={handleCheckAll}
                        />
                      </div>
                      <div className="flex-grow text-black">Sản phẩm</div>
                    </div>
                  </div>
                  <div className="col-span-6">
                    <div className="grid grid-cols-5 text-center">
                      <div className="col-span-2">Đơn giá</div>
                      <div className="col-span-1">Số lượng</div>
                      <div className="col-span-1">Số tiền</div>
                      <div className="col-span-1">Thao tác</div>
                    </div>
                  </div>
                </div>
                {extendedPurchases.length > 0 && (
                  <div className="p-5 my-3 bg-white rounded-sm shadow">
                    {extendedPurchases.map((purchase, index) => (
                      <div
                        key={purchase._id}
                        className="grid items-center grid-cols-12 px-4 py-5 mb-5 text-sm text-center text-gray-500 bg-white border border-gray-200 rounded-sm first:mt-0"
                      >
                        <div className="col-span-6">
                          <div className="flex">
                            <div className="flex items-center justify-center flex-shrink-0 pr-3">
                              <input
                                type="checkbox"
                                className="w-5 h-5 accent-orange"
                                checked={purchase.checked}
                                onChange={handleCheck(index)}
                              />
                            </div>
                            <div className="flex-grow">
                              <div className="flex">
                                <Link
                                  className="flex-shrink-0 w-20 h-20"
                                  to={`${path.home}${generateNameId({
                                    name: purchase.product.name,
                                    id: purchase.product._id
                                  })}`}
                                >
                                  <img alt={purchase.product.name} src={purchase.product.image} />
                                </Link>
                                <div className="flex-grow px-2 pt-1 pb-2">
                                  <Link
                                    to={`${path.home}${generateNameId({
                                      name: purchase.product.name,
                                      id: purchase.product._id
                                    })}`}
                                    className="text-left line-clamp-2"
                                  >
                                    {purchase.product.name}
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-6">
                          <div className="grid items-center grid-cols-5">
                            <div className="col-span-2">
                              <div className="flex items-center justify-center">
                                <span className="text-gray-300 line-through">
                                  ₫{formatCurrency(purchase.product.price_before_discount)}
                                </span>
                                <span className="ml-3">₫{formatCurrency(purchase.product.price)}</span>
                              </div>
                            </div>
                            <div className="col-span-1">
                              <QuantityController
                                max={purchase.product.quantity}
                                value={purchase.buy_count}
                                classNameWrapper="flex items-center"
                                onIncrease={(value) => handleQuantity(index, value, value <= purchase.product.quantity)}
                                onDecrease={(value) => handleQuantity(index, value, value >= 1)}
                                onType={handleTypeQuantity(index)}
                                onFocusOut={(value) =>
                                  handleQuantity(
                                    index,
                                    value,
                                    value >= 1 &&
                                      value <= purchase.product.quantity &&
                                      value !== (purchasesInCart as Purchase[])[index].buy_count
                                  )
                                }
                                disabled={purchase.disabled}
                              />
                            </div>
                            <div className="col-span-1">
                              <span className="text-orange">
                                ₫{formatCurrency(purchase.product.price * purchase.buy_count)}
                              </span>
                            </div>
                            <div className="col-span-1">
                              <button
                                onClick={handleDelete(index)}
                                className="text-black transition-colors bg-none hover:text-orange"
                              >
                                Xóa
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="sticky bottom-0 z-10 flex flex-col p-5 mt-8 bg-white border border-gray-100 rounded-sm shadow sm:flex-row sm:items-center">
              <div className="flex items-center">
                <div className="flex items-center justify-center flex-shrink-0 pr-3">
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-orange"
                    checked={isAllChecked}
                    onChange={handleCheckAll}
                  />
                </div>
                <button className="mx-3 border-none bg-none" onClick={handleCheckAll}>
                  Chọn tất cả ({extendedPurchases.length})
                </button>
                <button className="mx-3 border-none bg-none" onClick={handleDeleteManyPurchases}>
                  Xóa
                </button>
              </div>

              <div className="flex flex-col mt-5 sm:ml-auto sm:mt-0 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center sm:justify-end">
                    <div>Tổng thanh toán ({checkedPurchasesCount} sản phẩm):</div>
                    <div className="ml-2 text-2xl text-orange">₫{formatCurrency(totalCheckedPurchasePrice)}</div>
                  </div>
                  <div className="flex items-center text-sm sm:justify-end">
                    <div className="text-gray-500">Tiết kiệm</div>
                    <div className="ml-6 text-orange">₫{formatCurrency(totalCheckedPurchaseSavingPrice)}</div>
                  </div>
                </div>
                <Button
                  className="flex items-center justify-center h-10 mt-5 text-sm text-white uppercase bg-red-500 w-52 hover:bg-red-600 sm:ml-4 sm:mt-0"
                  onClick={handleBuyPurchases}
                  disabled={buyProductsMutation.isLoading}
                >
                  Mua hàng
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center">
            <img src={noproduct} alt="no purchase" className="w-24 h-24 mx-auto" />
            <div className="mt-5 font-bold text-gray-400">Giỏ hàng của bạn còn trống</div>
            <div className="mt-5 text-center">
              <Link
                to={path.home}
                className="px-10 py-2 text-white uppercase transition-all rounded-sm bg-orange hover:bg-orange/80"
              >
                Mua ngay
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
