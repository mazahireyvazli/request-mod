export const shouldMinify = ({ mode }: { mode?: string }) => {
  return mode === "production";
};
