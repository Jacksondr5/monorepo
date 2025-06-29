export const getInitials = (firstName?: string, lastName?: string) => {
  const firstInitial = firstName?.[0]?.toUpperCase() || "";
  const lastInitial = lastName?.[0]?.toUpperCase() || "";
  return `${firstInitial}${lastInitial}` || "??";
};
