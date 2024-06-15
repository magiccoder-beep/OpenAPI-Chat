"use client";

import "katex/dist/katex.min.css";
import Latex from "react-latex-next";

type Props = {
  latex: string;
  handleClick: () => void;
};

const MathJax: React.FC<Props> = ({ latex, handleClick }: Props) => {
  const replaceOnClick = (text: string) => {
    return text.replace(
      /onclick="window\.ReactNativeWebView\.postMessage\(JSON\.stringify\({/g,
      `onclick="sessionStorage.setItem('imageData',JSON.stringify({`
    );
  };

  const text: string = replaceOnClick(latex);

  return (
    <div className="text-white">
      <div onClick={handleClick}>
        <Latex>{text}</Latex>
      </div>
    </div>
  );
};

export default MathJax;
