import { useEffect, useRef } from "react";
import { APP_NAME } from "@/config/constants";

export default function useDocumentTitle(title) {
  const prevTitle = useRef(document.title);

  useEffect(() => {
    const saved = prevTitle.current;
    document.title = title ? `${title} | ${APP_NAME}` : APP_NAME;

    return () => {
      document.title = saved;
    };
  }, [title]);
}
