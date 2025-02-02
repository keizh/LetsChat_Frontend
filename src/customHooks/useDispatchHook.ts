import { useDispatch } from "react-redux";
import { AppDispatch } from "../APP/store";
const useDispatchHook = () => useDispatch<AppDispatch>();
export default useDispatchHook;
