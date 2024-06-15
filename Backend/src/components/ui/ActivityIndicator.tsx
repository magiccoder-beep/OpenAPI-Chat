"use client";

type Props = {
  color: "white" | "black" | "primary" | "secondary";
  size: "small" | "medium" | "large";
};

const ActivityIndicator: React.FC<Props> = ({ color, size }: Props) => {
  let classes: string =
    size === "large"
      ? "w-[3rem] h-[3rem] "
      : size === "medium"
      ? "w-[2rem] h-[2rem] "
      : "w-[1rem] h-[1rem] ";
  classes +=
    color === "black"
      ? "text-black"
      : color === "primary"
      ? "text-primary"
      : color === "secondary"
      ? "text-secondary"
      : "text-white";

  return (
    <div
      className={`inline-block ${classes} animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite]`}
    ></div>
  );
};

export default ActivityIndicator;
