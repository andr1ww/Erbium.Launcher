import React, { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import GetStarted from "@/components/OnBoarding/GetStarted";
import UserName from "@/components/OnBoarding/Username";
import ConfirmName from "@/components/OnBoarding/ConfirmName";
import Terms from "@/components/OnBoarding/Terms";
import Finishing from "@/components/OnBoarding/Finishing";
import { useNavigate } from "react-router-dom";
import { useOnBoardingStore } from "@/zustand/OnBoardingStore";
import { useUserStore } from "@/zustand/UserStore";

const Login: React.FC = () => {
  const { OBstep, setOBstep } = useOnBoardingStore();
  const UserStore = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (UserStore.DisplayName != "") {
      navigate("/home");
    } else {
      setOBstep("GetStarted");
    }
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <AnimatePresence mode="wait">
        {OBstep === "GetStarted" && <GetStarted key={"GetStarted"} />}

        {OBstep === "UserName" && <UserName key={"UserName"} />}

        {OBstep === "ConfirmName" && <ConfirmName key={"ConfirmName"} />}

        {OBstep === "Terms" && <Terms key={"Terms"} />}

        {OBstep === "Finishing" && <Finishing key={"Finishing"} />}
      </AnimatePresence>
    </div>
  );
};

export default Login;

// OB === OnBoarding
