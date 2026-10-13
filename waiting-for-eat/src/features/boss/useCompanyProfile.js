import { useEffect, useState } from "react";
import { subscribeCompanyById } from "../../services/repositories/companyRepository.js";

function useCompanyProfile(companyId) {
  const [company, setCompany] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    return subscribeCompanyById(companyId, (companyData) => {
      setCompany(companyData);
      setIsLoading(false);
    });
  }, [companyId]);

  return { company, isLoading };
}

export default useCompanyProfile;
