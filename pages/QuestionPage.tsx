import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressBar } from "../components/ProgressBar";
import { QuestionCard, type Option } from "../components/QuestionCard";
import type { Answers, Avoid, Budget, Hunger, Priority } from "../types/recommendation";
import type { MealForm, TasteTag, TextureTag } from "../types/menu";
import { defaultAnswers, recommendMenus } from "../utils/recommendation";
import { saveHistory } from "../utils/storage";

const hungerOptions: Option<Hunger>[] = [
  { label: "조금 출출해요", value: "light" },
  { label: "적당히 배고파요", value: "normal" },
  { label: "많이 배고파요", value: "hungry" },
  { label: "아주 든든하게 먹고 싶어요", value: "veryHungry" },
];
const formOptions: Option<MealForm | "any">[] = [
  { label: "밥", value: "rice" }, { label: "면", value: "noodle" }, { label: "빵", value: "bread" }, { label: "고기", value: "meat" },
  { label: "국물", value: "soup" }, { label: "가벼운 음식", value: "lightMeal" }, { label: "간식 같은 식사", value: "snackMeal" }, { label: "아무거나", value: "any" },
];
const tasteOptions: Option<TasteTag | "any">[] = [
  { label: "매콤한 맛", value: "spicy" }, { label: "담백한 맛", value: "mild" }, { label: "짭짤한 맛", value: "salty" }, { label: "달콤한 맛", value: "sweet" },
  { label: "새콤한 맛", value: "sour" }, { label: "고소한 맛", value: "savory" }, { label: "느끼한 맛", value: "rich" }, { label: "자극적인 맛", value: "strong" },
  { label: "깔끔한 맛", value: "clean" }, { label: "상관없음", value: "any" },
];
const textureOptions: Option<TextureTag | "any">[] = [
  { label: "바삭한 음식", value: "crispy" }, { label: "부드러운 음식", value: "soft" }, { label: "쫄깃한 음식", value: "chewy" },
  { label: "촉촉한 음식", value: "moist" }, { label: "아삭한 음식", value: "crunchy" }, { label: "상관없음", value: "any" },
];
const budgetOptions: Option<Budget>[] = [
  { label: "6,000원 이하", value: "under6000" }, { label: "6,000원~9,000원", value: "6000to9000" }, { label: "9,000원~13,000원", value: "9000to13000" },
  { label: "13,000원~20,000원", value: "13000to20000" }, { label: "20,000원 이상", value: "over20000" }, { label: "상관없음", value: "any" },
];
const priorityOptions: Option<Priority>[] = [
  { label: "빨리 먹을 수 있는 음식", value: "fast" }, { label: "아주 든든한 음식", value: "filling" }, { label: "건강한 음식", value: "healthy" },
  { label: "속이 편한 음식", value: "easyToDigest" }, { label: "실패할 가능성이 적은 음식", value: "safeChoice" }, { label: "혼자 먹기 편한 음식", value: "soloFriendly" },
  { label: "여럿이 함께 먹기 좋은 음식", value: "groupFriendly" }, { label: "색다른 음식", value: "unique" }, { label: "배달하기 좋은 음식", value: "deliveryFriendly" }, { label: "상관없음", value: "any" },
];
const avoidOptions: Option<Avoid>[] = [
  { label: "튀긴 음식", value: "fried" }, { label: "매운 음식", value: "spicy" }, { label: "밀가루 음식", value: "flour" }, { label: "국물 음식", value: "soup" },
  { label: "날것", value: "raw" }, { label: "고기", value: "meat" }, { label: "유제품이 많은 음식", value: "dairy" }, { label: "채소 위주 음식", value: "vegetableHeavy" }, { label: "특별히 없음", value: "none" },
];

function toggleLimited<T extends string>(current: T[], value: T, neutral: T, max: number) {
  if (value === neutral) return [neutral];
  const withoutNeutral = current.filter((item) => item !== neutral);
  if (withoutNeutral.includes(value)) {
    const next = withoutNeutral.filter((item) => item !== value);
    return next.length ? next : [neutral];
  }
  return [...withoutNeutral, value].slice(-max);
}

export function QuestionPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Answers>(defaultAnswers);

  const submit = () => {
    const { results } = recommendMenus(answers);
    const saved = saveHistory(answers, results);
    if (saved) navigate(`/history/${saved.id}`);
  };

  return (
    <main className="page narrow">
      <ProgressBar current={step} total={7} />
      {step === 1 && <QuestionCard title="지금 얼마나 배고픈가요?" options={hungerOptions} selected={[answers.hunger]} onSelect={(hunger) => setAnswers({ ...answers, hunger })} />}
      {step === 2 && <QuestionCard title="어떤 형태의 음식이 당기나요?" options={formOptions} selected={[answers.mealForm]} onSelect={(mealForm) => setAnswers({ ...answers, mealForm })} />}
      {step === 3 && <QuestionCard title="어떤 맛이 당기나요?" helper="최대 3개까지 선택할 수 있어요." multiple options={tasteOptions} selected={answers.tastes} onSelect={(taste) => setAnswers({ ...answers, tastes: toggleLimited(answers.tastes, taste, "any", 3) })} />}
      {step === 4 && <QuestionCard title="어떤 식감이 당기나요?" helper="최대 2개까지 선택할 수 있어요." multiple options={textureOptions} selected={answers.textures} onSelect={(texture) => setAnswers({ ...answers, textures: toggleLimited(answers.textures, texture, "any", 2) })} />}
      {step === 5 && <QuestionCard title="식사 예산은 얼마인가요?" options={budgetOptions} selected={[answers.budget]} onSelect={(budget) => setAnswers({ ...answers, budget })} />}
      {step === 6 && <QuestionCard title="지금 가장 중요한 기준은 무엇인가요?" helper="최대 2개까지 선택할 수 있어요." multiple options={priorityOptions} selected={answers.priorities} onSelect={(priority) => setAnswers({ ...answers, priorities: toggleLimited(answers.priorities, priority, "any", 2) })} />}
      {step === 7 && <QuestionCard title="피하고 싶은 음식이 있나요?" helper="제외하지 않고 감점으로 반영해요." multiple options={avoidOptions} selected={answers.avoids} onSelect={(avoid) => setAnswers({ ...answers, avoids: toggleLimited(answers.avoids, avoid, "none", 8) })} />}
      <div className="nav-actions">
        <button className="ghost icon-text" type="button" onClick={() => (step === 1 ? navigate("/") : setStep(step - 1))}><ArrowLeft size={18} />이전</button>
        {step < 7 ? (
          <button className="primary icon-text" type="button" onClick={() => setStep(step + 1)}>다음<ArrowRight size={18} /></button>
        ) : (
          <button className="primary icon-text" type="button" onClick={submit}><Sparkles size={18} />추천 보기</button>
        )}
      </div>
    </main>
  );
}
