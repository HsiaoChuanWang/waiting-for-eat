import { useEffect, useState } from "react";
import { subscribeUserById } from "../../services/repositories/userRepository.js";

function useDinerProfile(userId) {
  const [profile, setProfile] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    return subscribeUserById(userId, (userData) => {
      setProfile(userData);
      setIsLoading(false);
    });
  }, [userId]);

  return { isLoading, profile };
}

export default useDinerProfile;
