import { useEffect, useState } from "react";

function useDinerRecordList(userId, subscribeToRecords, enrichRecords) {
  const [isLoading, setIsLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isActive = true;
    setIsLoading(true);
    setError(null);

    const unsubscribe = subscribeToRecords(userId, async (items) => {
      try {
        const enrichedRecords = await enrichRecords(items);

        if (!isActive) return;
        setRecords(enrichedRecords);
      } catch {
        if (isActive) setError("資料載入失敗，請稍後再試。");
      } finally {
        if (isActive) setIsLoading(false);
      }
    });

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, [enrichRecords, subscribeToRecords, userId]);

  return { error, isLoading, records };
}

export default useDinerRecordList;
