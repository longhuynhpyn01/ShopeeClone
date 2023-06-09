import { createContext, useState } from "react";

import { ExtendedPurchase } from "src/types/purchase.type";
import { User } from "src/types/user.type";
import { getAccessTokenFromLS, getProfileFromLS } from "src/utils/auth";

interface AppContextInterface {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  profile: User | null;
  setProfile: React.Dispatch<React.SetStateAction<User | null>>;
  extendedPurchases: ExtendedPurchase[];
  setExtendedPurchases: React.Dispatch<React.SetStateAction<ExtendedPurchase[]>>;
  reset: () => void;
}

const initialAppContext: AppContextInterface = {
  isAuthenticated: Boolean(getAccessTokenFromLS()), // lấy access token từ localStorage
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null,
  extendedPurchases: [],
  setExtendedPurchases: () => null,
  reset: () => null
};

// initialAppContext là giá trị khởi tạo của Context nếu Provider không truyền vào props value
export const AppContext = createContext<AppContextInterface>(initialAppContext);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAppContext.isAuthenticated);
  // Lưu trạng thái mở rộng của những sp trong cart (thêm thuộc tính disabled và checked)
  // Lưu biến này ở trong context để state không bị biến mất (giá trị checked trong Cart page) khi chuyển trang (ngoại trừ việc reload page)
  const [extendedPurchases, setExtendedPurchases] = useState<ExtendedPurchase[]>(initialAppContext.extendedPurchases);
  const [profile, setProfile] = useState<User | null>(initialAppContext.profile);

  // Reset khi clear localstorage
  const reset = () => {
    setIsAuthenticated(false);
    setExtendedPurchases([]);
    setProfile(null);
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile,
        extendedPurchases,
        setExtendedPurchases,
        reset
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
