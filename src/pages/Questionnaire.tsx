import { useNavigate } from "react-router-dom";

import QuestionnaireIntro from "@/components/process/QuestionnaireIntro";

const Questionnaire = () => {
  const navigate = useNavigate();

  return <QuestionnaireIntro onBack={() => navigate("/")} />;
};

export default Questionnaire;
