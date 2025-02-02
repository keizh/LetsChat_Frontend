import { Button } from "@material-tailwind/react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function RedirectPage() {
  const [query, setQuery] = useSearchParams();
  const JWT = query.get("jwt");
  const navigate = useNavigate();
  useEffect(() => {
    if (JWT) {
      localStorage.setItem("LetsChat", JWT);
      setQuery({});
      console.log(JWT);
      //   navigate to main chatting page from here
      navigate("/user/auth/chat");
    }
  }, []);
  return (
    <div className="h-screen w-screen flex  items-center justify-center">
      <Button className="rounded-full" loading={true}>
        Loading
      </Button>
    </div>
  );
}
