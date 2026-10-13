import { useEffect, useState } from "react";

function useDinerRecordList(userId, subscribeToRecords, enrichRecords) {
  const [isLoading, setIsLoading] = useState(true);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    let isActive = true;
    setIsLoading(true);

    const unsubscribe = subscribeToRecords(userId, async (items) => {
      const enrichedRecords = await enrichRecords(items);

      if (!isActive) return;
      setRecords(enrichedRecords);
      setIsLoading(false);
    });

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, [enrichRecords, subscribeToRecords, userId]);

  return { isLoading, records };
}

export default useDinerRecordList;
