import { store } from "@/store";
import { Provider } from "react-redux";

interface Props {
  children: React.ReactNode;
}

export const Storelayout = ({ children }: Props) => {
  return <Provider store={store}>{children}</Provider>;
};
