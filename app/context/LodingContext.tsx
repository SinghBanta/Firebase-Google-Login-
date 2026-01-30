// "use client";

// import { createContext, useContext, useState } from "react";

// type LoadingContextType = {
//   loading: boolean;
//   setLoading: (val: boolean) => void;
// };

// const LoadingContext = createContext<LoadingContextType | null>(null);

// export const LoadingProviderNav = ({
//   children,
// }: {
//   children: React.ReactNode;
// }) => {
//   const [loading, setLoading] = useState(false);

//   return (
//     <LoadingContext.Provider value={{ loading, setLoading }}>
//       {children}
//     </LoadingContext.Provider>
//   );
// };

// export const useLoading = () => {
//   const ctx = useContext(LoadingContext);
//   if (!ctx) throw new Error("useLoading must be used inside LoadingProvider");
//   return ctx;
// };
