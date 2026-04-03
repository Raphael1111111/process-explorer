import { useNavigate } from "react-router-dom";

import LandingHub from "@/components/process/LandingHub";

const Index = () => {
  const navigate = useNavigate();

  return (
    <LandingHub
      onOpenQuestionnaire={() => navigate("/questionnaire")}
      onOpenBuilder={() => navigate("/builder")}
    />
  );
};

export default Index;
