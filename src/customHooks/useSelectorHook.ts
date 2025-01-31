import { useSelector } from "react-redux";
import store from "../APP/store";

type RootState = ReturnType<typeof store.getState>;
type ValidKeys = keyof RootState;

const useSelectorHook = <T extends ValidKeys>(key: T): RootState[T] => {
  return useSelector((store: RootState) => store[key]);
};

export default useSelectorHook;
