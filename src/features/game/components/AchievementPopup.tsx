import { useState, useEffect } from "react";
import { usePrevious } from "../hooks/usePrevious";
import "./AchievementPopup.css";

interface AchievementPopupProps {
  isClear: boolean;
  title: string;
}

export function AchievementPopup({ isClear, title }: AchievementPopupProps) {
  const [showPopup, setShowPopup] = useState(false);
  const prevClear = usePrevious(isClear);

  useEffect(() => {
    if (prevClear === undefined) return;
    if (!prevClear && isClear) {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
    }
  }, [isClear, prevClear]);

  return (
    <div
      className={`achievement-popup ${showPopup ? "achievement-popup-show" : ""}`}
    >
      実績解除！「{title}」
    </div>
  );
}
